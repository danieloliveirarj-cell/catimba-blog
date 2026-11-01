/**
 * Validação de um artigo do blog: frontmatter, capa 1200×675 (e as versões leves AVIF/WebP) e a regra de marca (guarda.mjs),
 * no texto cru e no texto que a página mostra. Sem estado e sem caminho fixo: quem chama passa a pasta. Este arquivo,
 * guarda.mjs e markdown.mjs vão copiados, sem mudar um byte, pro repositório público do conteúdo (o CI de lá roda a
 * mesma conta); só dependem um do outro e do Node.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { furosDaMarca, textoDoHtml } from "./guarda.mjs";
import { artigoParaHtml } from "./markdown.mjs";

const CAMPOS = ["titulo", "descricao", "slug", "data", "atualizado", "autor", "capa"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIA = /^\d{4}-\d{2}-\d{2}$/;
const RESERVADOS = new Set(["capa", "sitemap", "health"]);
const CAPA = { largura: 1200, altura: 675 };
// teto do .md antes de qualquer conta: a validação é síncrona (roda na carga do servidor)
export const MAX_ARTIGO = 200 * 1024;
// versões leves da capa (blog-capas.py): <capa>-<hash da capa>-<largura>.<formato>; faltou uma, o artigo fica no JPEG
export const LARGURAS_CAPA = [600, 900, 1200];
export const FORMATOS_CAPA = ["avif", "webp"];
function versoesDaCapa(capa, bytes, dir) {
  const h = createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const base = capa.replace(/\.[a-z]+$/, "");
  const nomes = Object.fromEntries(FORMATOS_CAPA.map((f) => [f, LARGURAS_CAPA.map((l) => `${base}-${h}-${l}.${f}`)]));
  return Object.values(nomes).flat().every((n) => existsSync(path.join(dir, n))) ? nomes : null;
}

export function lerFrontmatter(texto) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(texto.replace(/\r\n?/g, "\n"));
  if (!m) return null;
  const meta = {};
  for (const l of m[1].split("\n")) {
    const kv = /^([a-z_]+):(.*)$/.exec(l);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^(["'])(.*)\1$/, "$2");
  }
  return { meta, corpo: m[2] };
}

// largura × altura do PNG, JPEG ou WebP pelo cabeçalho (sem lib de imagem)
export function tamanhoImagem(b) {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { largura: b.readUInt32BE(16), altura: b.readUInt32BE(20) };
  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const tipo = b.toString("ascii", 12, 16);
    if (tipo === "VP8X") return { largura: 1 + b.readUIntLE(24, 3), altura: 1 + b.readUIntLE(27, 3) };
    if (tipo === "VP8L") { const v = b.readUInt32LE(21); return { largura: 1 + (v & 0x3fff), altura: 1 + ((v >> 14) & 0x3fff) }; }
    if (tipo === "VP8 ") return { largura: b.readUInt16LE(26) & 0x3fff, altura: b.readUInt16LE(28) & 0x3fff };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length; ) {
      if (b[i] !== 0xff) return null;
      const marca = b[i + 1];
      if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) return { largura: b.readUInt16BE(i + 7), altura: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** Lê e valida um artigo. { artigo } ou { erros: [texto] }. */
export function lerArtigo(arquivo, dir) {
  const tam = statSync(path.join(dir, arquivo)).size;
  if (tam > MAX_ARTIGO) return { erros: [`o arquivo tem ${Math.ceil(tam / 1024)} KB (máx. ${MAX_ARTIGO / 1024} KB)`] };
  const texto = readFileSync(path.join(dir, arquivo), "utf8");
  const fm = lerFrontmatter(texto);
  if (!fm) return { erros: ["falta o frontmatter (bloco entre --- no começo do arquivo)"] };
  const { meta, corpo } = fm;
  const erros = CAMPOS.filter((c) => !meta[c]).map((c) => `falta o campo "${c}"`);
  if (meta.slug && (!SLUG.test(meta.slug) || RESERVADOS.has(meta.slug))) erros.push(`slug "${meta.slug}" inválido: só a-z, 0-9 e hífen`);
  if (meta.slug && `${meta.slug}.md` !== arquivo) erros.push(`o arquivo tem que se chamar ${meta.slug}.md`);
  for (const c of ["data", "atualizado"]) if (meta[c] && (!DIA.test(meta[c]) || Number.isNaN(Date.parse(meta[c])))) erros.push(`"${c}" no formato AAAA-MM-DD`);
  if (meta.data && meta.atualizado && meta.atualizado < meta.data) erros.push(`"atualizado" antes da "data"`);
  // o <title> tem no máximo 65: título maior que isso é cortado no ": " — `titulo_seo` dá o curto
  if (meta.titulo && meta.titulo.length > 110) erros.push(`título com ${meta.titulo.length} caracteres (máx. 110)`);
  if (meta.titulo_seo && meta.titulo_seo.length > 65) erros.push(`titulo_seo com ${meta.titulo_seo.length} caracteres (máx. 65)`);
  if (meta.descricao && (meta.descricao.length < 50 || meta.descricao.length > 160)) erros.push(`descrição com ${meta.descricao.length} caracteres (50 a 160)`);
  if (meta.rascunho && !["true", "false"].includes(meta.rascunho)) erros.push(`"rascunho" é true ou false`);
  let capas = null;
  if (meta.capa) {
    let tam = null;
    try {
      const bytes = /^[\w-]+\.(?:jpe?g|png|webp)$/.test(meta.capa) ? readFileSync(path.join(dir, meta.capa)) : null;
      tam = bytes && tamanhoImagem(bytes);
      if (tam) capas = versoesDaCapa(meta.capa, bytes, dir);
    } catch {
      erros.push(`capa "${meta.capa}" não está na pasta do artigo`);
    }
    if (tam && (tam.largura !== CAPA.largura || tam.altura !== CAPA.altura)) erros.push(`capa com ${tam.largura}×${tam.altura} (tem que ser 1200×675)`);
    else if (!tam && !erros.some((e) => e.startsWith("capa"))) erros.push(`capa "${meta.capa}" tem que ser .jpg, .png ou .webp de 1200×675`);
  }
  if (!corpo.trim()) erros.push("o artigo está sem texto");
  const furos = furosDaMarca(texto);
  for (const f of furos) erros.push(`linha ${f.linha}: "${f.trecho}" (${f.regra}) não pode no blog`);
  // de novo no texto que a página mostra, sem tag e sem * _ ` ~ soltos: palavra quebrada pela marcação (ap*os*ta, **bô**nus) volta inteira
  const pagina = artigoParaHtml(corpo);
  const vistos = new Set(furos.map((f) => f.trecho));
  for (const f of furosDaMarca(textoDoHtml(pagina.html).replace(/[*_`~]/g, ""))) {
    if (vistos.has(f.trecho)) continue;
    vistos.add(f.trecho);
    erros.push(`no texto da página: "${f.trecho}" (${f.regra}) não pode no blog`);
  }
  if (erros.length) return { erros };
  const avisos = meta.titulo.length > 65 && !meta.titulo_seo ? [`título com ${meta.titulo.length} caracteres: o <title> sai cortado; use titulo_seo (até 65)`] : [];
  if (!capas) avisos.push(`capa sem as versões leves (AVIF/WebP) desta capa: o celular baixa o JPEG inteiro; rode o blog-capas.py`);
  return { artigo: { ...meta, rascunho: meta.rascunho === "true", ...pagina, capas }, avisos };
}

export const arquivosDoBlog = (dir) => readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md").sort();

/** Lê e valida a pasta inteira: { lista (válidos, do mais novo pro mais velho), rejeitados: [{ arquivo, erros }] }. */
export function lerPasta(dir) {
  const lista = [];
  const rejeitados = [];
  for (const arquivo of arquivosDoBlog(dir)) {
    const r = lerArtigo(arquivo, dir);
    if (r.erros) rejeitados.push({ arquivo, erros: r.erros });
    else lista.push(r.artigo);
  }
  lista.sort((a, b) => b.data.localeCompare(a.data) || a.titulo.localeCompare(b.titulo));
  return { lista, rejeitados };
}
