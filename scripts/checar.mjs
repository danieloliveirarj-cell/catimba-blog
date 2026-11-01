#!/usr/bin/env node
// Checagem do blog (a mesma do site): todo artigos/*.md, rascunho também, com o frontmatter completo, a capa 1200×675 ao
// lado e sem as palavras proibidas. Este arquivo e validacao/ são cópia exata dos do site: o ORIGEM.json tem o sha256 de
// cada um e não pode mudar à mão. O site roda a mesma conta ao carregar e deixa de fora o artigo que fura.
//   node scripts/checar.mjs
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { arquivosDoBlog, lerArtigo } from "../validacao/validar.mjs";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTIGOS = path.join(RAIZ, "artigos");
let erros = 0;

const origem = JSON.parse(fs.readFileSync(path.join(RAIZ, "validacao/ORIGEM.json"), "utf8"));
for (const [f, sha] of Object.entries(origem)) {
  const atual = fs.existsSync(path.join(RAIZ, f)) ? createHash("sha256").update(fs.readFileSync(path.join(RAIZ, f))).digest("hex") : null;
  if (atual !== sha) {
    console.error(`✗ ${f} foi mexido: a checagem e a validação só mudam pela cópia do site (validacao/ORIGEM.json)`);
    erros++;
  }
}

let ok = 0;
for (const f of arquivosDoBlog(ARTIGOS)) {
  const r = lerArtigo(f, ARTIGOS);
  for (const e of r.erros ?? []) {
    console.error(`✗ artigos/${f}: ${e}`);
    erros++;
  }
  for (const a of r.avisos ?? []) console.log(`⚠ artigos/${f}: ${a}`);
  if (r.artigo) ok++;
}
for (const f of fs.readdirSync(ARTIGOS)) {
  if (!/^[a-z0-9][a-z0-9._-]*\.(?:md|jpe?g|png|webp|avif)$/.test(f) && f !== "README.md") {
    console.error(`✗ artigos/${f}: nome fora do padrão (só a-z, 0-9, hífen; .md, .jpg, .png, .webp ou .avif) — o site não carrega`);
    erros++;
  }
}
if (erros) {
  console.error(`\n${erros} problema(s) — formato e regras no README.md`);
  process.exit(1);
}
console.log(`✓ ${ok} artigo(s) dentro do formato e das regras de marca`);
