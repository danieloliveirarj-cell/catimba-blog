/**
 * Markdown do blog → HTML, sem dependência: TODO o texto é escapado antes de virar tag, então HTML cru no .md sai como
 * texto (nunca <script>, <iframe>, onerror…). Só o que o README do blog promete: ## e ### (o # vira ##: o H1 é o
 * título do artigo), parágrafo, lista com - ou 1., citação com >, linha com ---, **negrito**, *itálico*, `código` e
 * [link](endereço). Link só http(s), caminho do site (/…) ou #âncora; link pra fora abre em aba nova com rel="noopener".
 * Duas convenções de página (pedido da revisão, 29/10): a seção "## Perguntas frequentes" vira cards (cada ### + resposta)
 * e sai também como FAQPage; o último parágrafo que é só um link vira o botão de chamada (.blog-botao).
 */
// U+E000 é o marcador interno de código e link (inline): no texto, vira entidade
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\uE000/g, "&#xE000;");
const HOST_DO_SITE = /^https?:\/\/(?:www\.)?catimbascores\.com\.br(?:[/?#]|$)/i;
// sem retrocesso (01/11): texto do link sem [ ] e endereço sem ( ) nem espaço — cada tentativa para no próximo colchete ou
// parêntese, então 150 mil "[" custam linear e não quadrático (a validação roda síncrona na carga do servidor)
const LINK = /\[([^[\]]+)\]\(([^()\s]+)\)/g;
const FAQ = /^perguntas frequentes$/i;

function link(texto, url, classe = "") {
  const u = url.replace(/&amp;/g, "&");
  const c = classe ? ` class="${classe}"` : "";
  if (/^https?:\/\//i.test(u)) {
    return HOST_DO_SITE.test(u) ? `<a${c} href="${esc(u)}">${texto}</a>` : `<a${c} href="${esc(u)}" target="_blank" rel="nofollow ugc noopener">${texto}</a>`;
  }
  // caminho do site: "/" seguido de algo que não é "/" nem "\" (o navegador lê "//x" e "/\x" como outro domínio)
  if (/^\/(?![/\\])|^#/.test(u)) return `<a${c} href="${esc(u)}">${texto}</a>`;
  return texto;
}

// negrito e itálico sem * dentro: a busca para no próximo *, nunca volta (linear)
const enfase = (s) => s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*(?!\s)([^*]+)\*(?!\w)/g, "$1<em>$2</em>");

// recebe o texto JÁ escapado; código e link viram marcador antes do negrito/itálico (que nunca entra num href)
function inline(t) {
  const guardados = [];
  const guardar = (html) => `\uE000${guardados.push(html) - 1}\uE000`;
  let s = t.replace(/`([^`]+)`/g, (_m, c) => guardar(`<code>${c}</code>`));
  s = s.replace(LINK, (_m, txt, url) => guardar(link(enfase(txt), url)));
  return enfase(s).replace(/\uE000(\d+)\uE000/g, (_m, i) => guardados[i]);
}

// texto puro (FAQPage): sem marcação de markdown e sem as entidades do escape
const textoPuro = (t) =>
  t.replace(LINK, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/`([^`]+)`/g, "$1")
    .replace(/&#xE000;/g, "\uE000").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

// "## Título ##" sem regex com .+? (o "\s*#*$" voltava a cada letra): corta os # e espaços do fim à mão
function titulo(l) {
  const m = /^(#{1,3})[ \t]+(\S.*)$/.exec(l);
  if (!m) return null;
  let fim = m[2].length;
  while (fim > 0 && m[2][fim - 1] === "#") fim--;
  while (fim > 0 && (m[2][fim - 1] === " " || m[2][fim - 1] === "\t")) fim--;
  const texto = fim ? m[2].slice(0, fim) : m[2].trimEnd();
  return [l, m[1], texto];
}

const LISTA = { ul: /^\s*[-*]\s+(.*)$/, ol: /^\s*\d+[.)]\s+(.*)$/ };

// blocos: { tipo: "h"|"p"|"ul"|"ol"|"cit"|"hr", nivel?, fonte (texto escapado), html }
function blocos(md) {
  const linhas = esc(md.replace(/\r\n?/g, "\n")).split("\n");
  const out = [];
  let par = [];
  const fecharPar = () => {
    if (par.length) out.push({ tipo: "p", fonte: par.join(" "), html: `<p>${inline(par.join(" "))}</p>` });
    par = [];
  };
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i];
    const tit = titulo(l);
    if (!l.trim()) fecharPar();
    else if (tit) {
      fecharPar();
      const n = Math.max(2, tit[1].length);
      out.push({ tipo: "h", nivel: n, fonte: tit[2], html: `<h${n}>${inline(tit[2])}</h${n}>` });
    } else if (/^\s*(?:-{3,}|\*{3,})\s*$/.test(l)) {
      fecharPar();
      out.push({ tipo: "hr", fonte: "", html: "<hr>" });
    } else if (/^&gt;\s?/.test(l)) {
      fecharPar();
      const cit = [];
      while (i < linhas.length && /^&gt;\s?/.test(linhas[i])) cit.push(linhas[i++].replace(/^&gt;\s?/, ""));
      i--;
      out.push({ tipo: "cit", fonte: cit.join(" "), html: `<blockquote><p>${inline(cit.join(" "))}</p></blockquote>` });
    } else if (LISTA.ul.test(l) || LISTA.ol.test(l)) {
      fecharPar();
      const tipo = LISTA.ul.test(l) ? "ul" : "ol";
      const itens = [];
      while (i < linhas.length && LISTA[tipo].test(linhas[i])) itens.push(LISTA[tipo].exec(linhas[i++])[1]);
      i--;
      out.push({ tipo, fonte: itens.join(" "), html: `<${tipo}>${itens.map((x) => `<li>${inline(x)}</li>`).join("")}</${tipo}>` });
    } else par.push(l.trim());
  }
  fecharPar();
  return out;
}

// "## Perguntas frequentes": cada ### abre um card; o que vem até o próximo ### (ou ##) é a resposta
function secaoFaq(bs, i, faq) {
  const titulo = bs[i];
  const cards = [];
  let j = i + 1;
  for (; j < bs.length && !(bs[j].tipo === "h" && bs[j].nivel === 2); j++) {
    if (bs[j].tipo === "h") cards.push({ pergunta: bs[j], resposta: [] });
    else cards.at(-1)?.resposta.push(bs[j]);
  }
  for (const c of cards) faq.push({ pergunta: textoPuro(c.pergunta.fonte), resposta: c.resposta.map((b) => textoPuro(b.fonte)).join(" ") });
  const html =
    `<section class="blog-faq" aria-labelledby="perguntas-frequentes"><h2 id="perguntas-frequentes">${inline(titulo.fonte)}</h2>` +
    `<div class="blog-faq-cards" tabindex="0">${cards.map((c) => `<div class="blog-faq-card"><h3>${inline(c.pergunta.fonte)}</h3>${c.resposta.map((b) => b.html).join("")}</div>`).join("")}</div></section>`;
  return { html, fim: j };
}

/** { html, faq: [{ pergunta, resposta }] } do corpo do artigo. */
export function artigoParaHtml(md) {
  const bs = blocos(md);
  const ultimo = bs.at(-1);
  const soLink = ultimo?.tipo === "p" && /^\[([^[\]]+)\]\(([^()\s]+)\)$/.exec(ultimo.fonte);
  if (soLink) {
    const a = link(inline(soLink[1]), soLink[2], "blog-botao");
    if (a.startsWith("<a")) ultimo.html = `<p class="blog-cta">${a}</p>`;
  }
  const faq = [];
  const html = [];
  for (let i = 0; i < bs.length; i++) {
    if (bs[i].tipo === "h" && bs[i].nivel === 2 && FAQ.test(textoPuro(bs[i].fonte).trim())) {
      const s = secaoFaq(bs, i, faq);
      html.push(s.html);
      i = s.fim - 1;
    } else html.push(bs[i].html);
  }
  return { html: html.join("\n"), faq };
}

export const markdownParaHtml = (md) => artigoParaHtml(md).html;
