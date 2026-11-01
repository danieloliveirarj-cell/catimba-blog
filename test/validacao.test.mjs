// node --test test/  — a validação copiada do site barra o que o site barra (artigo que fura não chega na main)
import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { furosDaMarca } from "../validacao/guarda.mjs";
import { lerArtigo, lerPasta } from "../validacao/validar.mjs";

const ARTIGOS = new URL("../artigos/", import.meta.url).pathname;
const DIR = fs.mkdtempSync(path.join(os.tmpdir(), "blog-"));
after(() => fs.rmSync(DIR, { recursive: true, force: true }));
const base = fs.readFileSync(path.join(ARTIGOS, "catimba-fantasy.md"), "utf8");
fs.copyFileSync(path.join(ARTIGOS, "catimba-fantasy.jpg"), path.join(DIR, "catimba-fantasy.jpg"));
const escrever = (slug, texto) => fs.writeFileSync(path.join(DIR, `${slug}.md`), texto.replace("slug: catimba-fantasy", `slug: ${slug}`));

test("palavras proibidas, inclusive bet dentro da palavra", () => {
  for (const t of ["aposta", "odds", "bet365", "Betin", "superbet", "bônus", "prêmio", "saque", "depósito", "R$ 10", "50 reais"]) assert.ok(furosDaMarca(t).length, t);
  for (const t of ["alfabeto", "beterraba", "versão beta", "fantasy game"]) assert.deepEqual(furosDaMarca(t), [], t);
});

test("artigo bom passa; com palavra proibida, sem campo ou com nome errado, não", () => {
  escrever("bom", base);
  escrever("furado", `${base}\nFaça sua ap*os*ta.\n`);
  escrever("sem-capa", base.replace(/^capa:.*$/m, "capa: nao-existe.jpg"));
  fs.writeFileSync(path.join(DIR, "nome-errado.md"), base);
  assert.equal(lerArtigo("bom.md", DIR).erros, undefined);
  assert.ok(lerArtigo("furado.md", DIR).erros.some((e) => /aposta/.test(e)));
  assert.ok(lerArtigo("sem-capa.md", DIR).erros.some((e) => /capa/.test(e)));
  assert.ok(lerArtigo("nome-errado.md", DIR).erros.some((e) => /catimba-fantasy\.md/.test(e)));
  assert.deepEqual(lerPasta(DIR).lista.map((a) => a.slug), ["bom"]);
});
