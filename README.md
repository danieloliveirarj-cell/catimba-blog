# Blog do Catimba — conteúdo

Os artigos de **catimbascores.com.br/blog**. Cada artigo é um `.md` em [`artigos/`](artigos/) com a capa ao lado.
Merge na `main` guarda o artigo aqui. **Na AWS (catimbascores.com.br) o artigo não vai ao ar sozinho**: veja [Publicar no site (AWS)](#publicar-no-site-aws).

## Escrever

Arquivo `artigos/<slug>.md` (o slug é o endereço: `/blog/<slug>`; só minúsculas sem acento, números e hífen). Começa assim:

```
---
titulo: Catimba Fantasy: como funciona o fantasy game dos jogos do dia
descricao: Entre 50 e 160 caracteres. Vira a descrição do Google e da prévia no WhatsApp.
slug: catimba-fantasy
data: 2026-10-29
atualizado: 2026-10-29
autor: Equipe Catimba
capa: catimba-fantasy.jpg
rascunho: false
---
```

| Campo | Regra |
|---|---|
| `titulo` | até 110 caracteres (é o H1). Passou de 65: ponha também `titulo_seo` (até 65), o título do Google |
| `descricao` | 50 a 160 caracteres |
| `slug` | igual ao nome do arquivo. Não muda depois de publicado (quebra o link de quem compartilhou) |
| `data` · `atualizado` | `AAAA-MM-DD`; `atualizado` nunca antes da `data` |
| `autor` | "Equipe Catimba" assina como a empresa |
| `capa` | `.jpg`, `.png` ou `.webp` de **1200×675** exatos, na pasta `artigos/` |
| `rascunho` | `true` = só no endereço de teste. Atenção: este repositório é **público**, o rascunho aqui qualquer um lê |

Texto: `## Subtítulo`, `### Nível abaixo`, `- item`, `1. item`, `**negrito**`, `*itálico*`, `[texto](/fantasy/)`,
`> citação`, `---`. HTML não funciona (sai como texto). Duas convenções: a seção `## Perguntas frequentes` (cada
`### Pergunta?` + resposta vira um card e vai pro Google como FAQ) e o último parágrafo que é só um link vira o botão verde.

**Regras de marca (o CI barra):** o Catimba é fantasy game de futebol. Não pode aposta/apostar, odd/odds, "bet" (nem dentro
de palavra: nome de casa de aposta também barra), bônus, prêmio, saque, depósito nem valor com R$ ou "reais". Nada de
número de usuários; lembre do +18 quando falar em jogar.

## Publicar (PR)

1. **Add file → Upload files** em `artigos/`: a capa (1200×675).
2. **Add file → Create new file**: `artigos/<slug>.md` com o frontmatter e o texto.
3. **Commit changes → Create a new branch** (`blog/<slug>`) → **Propose changes** → **Create pull request**
   (título: `blog: <título do artigo>`).
4. O CI gera as versões leves da capa (AVIF/WebP) e sobe no próprio PR (commit "capas: versões leves"). Aí aparece
   **"Approve workflows to run"** no PR: clique pra rodar a checagem no commit novo. Vermelho = abra o log: diz o arquivo,
   a linha e o que corrigir.
5. Verde → **Merge**. Isso só guarda o artigo neste repositório. Para ele entrar no site, siga [Publicar no site (AWS)](#publicar-no-site-aws).

Conferir no computador: `npm run checar` e `npm test` (Node 22, sem instalar nada); capas: `npm run capas` (Python + Pillow).

A pasta `validacao/` e o `scripts/checar.mjs` são cópia exata dos do site (o `validacao/ORIGEM.json` confere): não edite aqui.

## Publicar no site (AWS)

**Não existe "no ar em 5 minutos" na AWS.** O site lê a pasta de conteúdo do monorepo `front-bff` (não este repositório), e a borda só serve o endereço que está na lista do KVS (sem isso dá 404). O "5 min" valia só para a VPS antiga (`BLOG_FONTE=github`).

1. **Merge aqui** (os passos acima).
2. No `front-bff`, na raiz: `node scripts/sincronizar-blog.mjs --conferir` mostra o que falta; `node scripts/sincronizar-blog.mjs --copiar` copia o `.md`, a capa e as versões AVIF/WebP (nunca rascunho) e imprime o roteiro seguinte (build, `sondar`, `gerar-tabelas`, `kvs.json`).
3. Commit e MR no `front-bff` e no `api-bff` (o BFF gera o sitemap a partir da própria cópia da pasta) e **merge**: o pipeline aplica o KVS na borda, sobe o `dist` e roda a fumaça.
4. Conferir no ar: `/blog/<slug>` dá 200 sem `noindex`, `/blog/<slug>/` dá 301, o card aparece em `/blog`, o slug está em `/inicio/sitemap.xml` (cache de 1 h) e o `versao.json` tem o sha novo.
