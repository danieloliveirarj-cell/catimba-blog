---
titulo: "Reserva de luxo no Cartola FC: como funciona, o banco de reservas e o que mudou nos scouts"
titulo_seo: "Reserva de luxo no Cartola FC: como funciona em 2026"
descricao: "Entenda o reserva de luxo do Cartola FC, as regras do banco de reservas e o que mudou em desarmes e defesas desde 2025. Conferido em novembro de 2026."
slug: reserva-de-luxo-no-cartola-fc
data: 2026-11-09
atualizado: 2026-11-09
autor: Equipe Catimba
capa: reserva-de-luxo-no-cartola-fc.jpg
rascunho: false
---

O **reserva de luxo** chegou ao Cartola FC em 2025 e virou assunto de toda rodada: afinal, quando o jogador do banco entra no lugar de um titular? Junto com ele vieram valores novos para **desarmes** e **defesas**, que mudaram a forma de escolher laterais, volantes e goleiros. Este guia explica o que continua valendo em 2026, o que conseguimos confirmar com fonte e o que preferimos não afirmar. O Catimba é um jogo independente e não tem qualquer ligação com a Globo; o Cartola FC é marca dos respectivos donos.

## O que é o reserva de luxo

No banco de reservas comum, o suplente só entra se o titular da posição não jogar. O reserva de luxo funciona diferente: você escolhe **um** jogador do banco para ser o seu reserva de luxo, e ele pode substituir o titular que fizer a **menor pontuação**, desde que ele próprio pontue mais. Ou seja, vira um seguro contra o titular que foi mal, e não só contra o que ficou de fora.

Em 2026 o recurso continua no jogo. O guia de rodada do Oficina da Net para a temporada diz que você escolhe um suplente que substitui automaticamente o titular da equipe que fez menos pontos, e que o sistema de scouts e pontuação segue igual ao da temporada passada. Além disso, o código do site oficial do Cartola traz uma tela "como funciona o reserva de luxo" e o campo do time que guarda o reserva escolhido, o que mostra que a ferramenta está no jogo hoje.

## Como o banco de reservas funciona

O banco tem cinco reservas, um para cada posição: goleiro, lateral, zagueiro, meia e atacante. Os exemplos de reservas baratos que os guias de 2026 listam seguem esse formato. Na regra normal, o reserva entra no lugar de um titular da mesma posição que não entrou em campo.

O reserva de luxo é uma escolha **a mais** dentro desse banco: você marca um dos cinco como reserva de luxo. Pense nele como o seu reserva de confiança, aquele que você acredita que pode pontuar mais que algum titular.

### Regras de ativação divulgadas

Quando o recurso estreou, em março de 2025, o ge (Globo Esporte) publicou as regras de funcionamento, e a matéria foi republicada por outros sites. Os pontos principais:

1. **Só um reserva de luxo**, e ele substitui apenas titular da **mesma posição** dele.
2. Ele entra no lugar do titular da posição com a **menor pontuação**, e só se pontuar mais que esse titular.
3. A troca só é ativada se **todos os titulares daquela posição entrarem em campo** na rodada, sem exigência de tempo mínimo. Se um titular não jogar, vale a regra normal do banco.
4. Se dois titulares empatarem na menor pontuação, abaixo da do reserva de luxo, o **capitão** tem prioridade para sair, e nesse caso conta a pontuação normal, sem o multiplicador do capitão.
5. O reserva de luxo pode ser acionado mesmo com pontuação **negativa**, desde que seja maior que a de algum titular da posição.

**Importante:** essas regras vêm do tutorial oficial do ge de 12/03/2025. A matéria oficial de 13/01/2026 sobre o Cartola 2026 lista o reserva de luxo como recurso vigente, mas não repete as regras ponto a ponto. Fontes de terceiros divergem em detalhes (o ge diz que o reserva de luxo é **um só** no banco inteiro, e que ele substitui o titular da mesma posição de menor pontuação). Por isso, antes de montar o time, confira a explicação dentro do app, na tela do reserva de luxo.

## O reserva de luxo e o capitão

Em 2025, vários sites contaram que, se o capitão fosse o pior pontuador da posição, o reserva de luxo assumiria a braçadeira e teria os pontos multiplicados por 1,5. **Não conseguimos confirmar isso para 2026** com fonte oficial, então tratamos como informação não verificada. O que a matéria do ge de 2025 traz é o desempate: se houver empate na menor pontuação, o capitão sai primeiro e sem multiplicador.

Na prática, muita gente prefere escolher o capitão entre os jogadores mais seguros e deixar o reserva de luxo numa posição em que algum titular barato tem risco de zerar. É estratégia, não regra, e depende do seu time.

## O que mudou em desarmes e defesas

Em 2025 houve mudança de valores: o **desarme** passou de 1,2 para 1,5 ponto, e a **defesa** do goleiro passou de 1,0 para 1,3 ponto. Foi isso que deixou volantes, laterais e zagueiros com muitos desarmes mais valiosos, e goleiros com muitas defesas menos dependentes do jogo sem sofrer gol.

E em 2026? Conferimos pelos dados abertos da própria API do Cartola. Usamos as pontuações de todos os jogadores das rodadas 33 e 34 de 2026 (614 registros) e calculamos quanto vale cada scout. O resultado bate com a tabela de 2025:

| Scout | Valor conferido em 2026 | Observação |
|---|---|---|
| Desarme | +1,5 | Era 1,2 até 2024 |
| Defesa do goleiro | +1,3 | Era 1,0 até 2024 |
| Jogo sem sofrer gol (SG) | +5,0 | Sem mudança |
| Gol | +8,0 | Sem mudança |
| Assistência | +5,0 | Sem mudança |

Um exemplo dos dados: goleiro com 4 defesas e jogo sem sofrer gol fez 10,2 pontos (4 × 1,3 + 5). Para os demais scouts, siga a tabela dentro do app.

### Quem ganha valor com isso

- **Laterais e volantes** que desarmam muito têm uma base de pontos que não depende do time marcar.
- **Zagueiros** de times pressionados ganham pontos por desarme mesmo quando a defesa leva gol.
- **Goleiros** de times muito atacados somam por defesa, e o jogo sem sofrer gol continua sendo o maior valor (5 pontos).

Para ver na prática como o desarme pesa nas rodadas, leia a entrevista do [Espião do Cartola sobre scouts](/blog/scouts-cartola-espiao-do-cartola).

## Como conferimos

- **Data da conferência:** 09/11/2026.
- **Dados oficiais do jogo:** consultamos a API aberta do Cartola (api.cartola.globo.com). Ela confirma que a temporada 2026 está em andamento (rodada 35 de 38) e fornece as pontuações por jogador das rodadas 33 e 34, com as quais calculamos os valores de desarme, defesa, gol, assistência e jogo sem sofrer gol.
- **Site oficial:** o código do site cartola.globo.com traz a tela "como funciona o reserva de luxo" e o campo do reserva de luxo no time.
- **Guia de 2026:** o guia de rodada da Oficina da Net (oficinadanet.com.br) para a temporada 2026 afirma que scouts e pontuação seguem iguais aos de 2025 e descreve o reserva de luxo como o suplente que troca com o titular de menor pontuação.
- **Regras de ativação:** vêm do tutorial oficial do ge "O que é e como funciona o reserva de luxo no Cartola", de 12/03/2025. A matéria oficial de 13/01/2026 sobre o Cartola 2026 mantém o recurso e diz que o banco de reservas segue na mesma dinâmica dos últimos anos. A central de ajuda da Globo não abriu para nós.
- **Tabela de scouts:** a matéria oficial do ge de 17/03/2025 traz desarme em 1,5 e defesa em 1,3, e a de 13/01/2026 diz que não houve alteração nos critérios de scouts e pontuações.
- **Não confirmado:** o multiplicador de 1,5 no reserva que assume a braçadeira em 2026 e se a posição do reserva de luxo é livre.

## Perguntas frequentes

### O reserva de luxo ainda existe no Cartola FC em 2026?

Sim. O recurso estreou em 2025 e aparece no jogo em 2026: o guia de rodada da temporada descreve o suplente que substitui o titular de menor pontuação, e o site oficial traz a tela de explicação do reserva de luxo.

### O reserva de luxo sempre entra no time?

Não. Ele só entra se pontuar mais que o titular de menor pontuação da posição. Pelas regras divulgadas em 2025, a troca também depende de todos os titulares da posição terem entrado em campo.

### Quanto valem o desarme e a defesa no Cartola FC?

Em 2026, conferimos nos dados do jogo: desarme vale 1,5 ponto e defesa de goleiro vale 1,3 ponto. Em 2025 esses valores subiram, de 1,2 e 1,0.

### O reserva de luxo vira capitão?

Algumas fontes de 2025 diziam que ele assumia a braçadeira com pontos multiplicados por 1,5 se o capitão fosse o pior da posição. Não conseguimos confirmar isso para 2026, então não afirmamos.

### Como escolher o reserva de luxo?

Escolha um jogador do banco com boa chance de pontuar, numa posição em que algum titular possa ir mal. Veja também como [escalar bem no Cartola FC](/blog/como-escalar-bem-no-cartola-fc) e como funciona a [valorização](/blog/valorizacao-no-cartola-fc) para escolher o banco barato.

### Onde aprendo o básico do Cartola?

Em [como jogar o Cartola FC](/blog/como-jogar-cartola-fc), e, para entender os formatos de liga, em [tipos de ligas do Cartola FC](/blog/tipos-de-ligas-do-cartola-fc). Se quer um fantasy com a mesma lógica de scouts, veja [como jogar fantasy de futebol](/blog/como-jogar-fantasy-de-futebol).

O Catimba Fantasy é para maiores de 18 anos e é um jogo independente, sem vínculo com a Globo. Antes de começar, leia os [Termos](/termos) e a página de [Jogo responsável](/jogo-responsavel).

[Monte seu time no Catimba Fantasy](/fantasy/)
