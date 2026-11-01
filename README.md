# Blog do Catimba — conteúdo

Os artigos de **catimbascores.com.br/blog**. Cada artigo é um `.md` em [`artigos/`](artigos/) com a capa ao lado.
Merge na `main` = no ar em até 5 minutos, sem publicar o site: o site lê esta pasta sozinho.

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
5. Verde → **Merge**. Em até 5 min o artigo está no site (a lista, o artigo e o sitemap).

Conferir no computador: `npm run checar` e `npm test` (Node 22, sem instalar nada); capas: `npm run capas` (Python + Pillow).

A pasta `validacao/` e o `scripts/checar.mjs` são cópia exata dos do site (o `validacao/ORIGEM.json` confere): não edite aqui.
