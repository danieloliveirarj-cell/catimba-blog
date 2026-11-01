/**
 * Regra de marca do blog (pedido do Marketing aprovado pelo Daniel em 29/10): o Catimba é fantasy game de futebol — nada de
 * aposta, odds, bet, bônus, prêmio, saque, depósito nem valor em R$. Mesma lista da página /sobre. Vale no CI e no servidor
 * (validar.mjs: artigo que fura não sobe, mesmo se o CI não rodou).
 */
const PROIBIDAS = [
  [/\bapost\w*/, "aposta/apostar"],
  [/\bodds?\b/, "odds"],
  // bet de casa de aposta (bet365, Betano, superbet, sportingbet); palavras comuns com "bet" passam (beta, beterraba, alfabeto)
  [/\bbet(?!a\b|as\b|erraba|oneira|ume)|bet\b|bet\d/, "bet"],
  [/\bbonus\w*/, "bônus"],
  [/\bpremi\w*/, "prêmio"],
  [/\bsaques?\b/, "saque"],
  [/\bdeposit\w*/, "depósito"],
  [/r\s*\$/, "valor em R$"],
  [/\d\s*(?:reais|real)\b/, "valor em reais"],
];

// NFKC (ｂｅｔ, ℝ$ viram o normal) e sem caractere invisível (zero-width, hífen suave) antes de tirar o acento
const INVISIVEL = /\u034f|[\u00ad\u061c\u115f\u1160\u17b4\u17b5\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;
const semAcento = (s) => s.normalize("NFKC").replace(INVISIVEL, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Texto que a página mostra, sem tag nem entidade: palavra quebrada por marcação (ap*os*ta) volta inteira. */
export const textoDoHtml = (html) =>
  html.replace(/<[^<>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#xE000;/g, "").replace(/&amp;/g, "&");

/** [{ linha, trecho, regra }] de cada palavra proibida no texto (vazio = passou). */
export function furosDaMarca(texto) {
  const furos = [];
  String(texto).split("\n").forEach((l, i) => {
    const s = semAcento(l);
    for (const [re, regra] of PROIBIDAS) {
      const m = re.exec(s);
      if (m) furos.push({ linha: i + 1, trecho: m[0], regra });
    }
  });
  return furos;
}
