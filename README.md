# 🚀 Oasis Customs - Calculadora de Serviços

Uma calculadora interativa e estilizada para auxiliar no cálculo de serviços de tuning automotivo no estilo RP (Roleplay). Desenvolvida para uso por mecânicos, players e organizações no cenário do servidor Oasis RP.

---

## 🎯 Funcionalidades

- Cálculo automático de valores para:
  - Full tuning (com ou sem blindagem)
  - Peças e melhorias de motor, freio, transmissão, suspensão, blindagem
  - Modificações visuais (rodas, tintas, neon, etc.)
  - Serviços internos (reparo, pneus, atendimento externo)
  - Vendas (kit, pneu, nitro, chave)
- ✔️ Desconto automático de parceria (30%) em kits e pneus
- 💰 Cálculo do **repasse de 10%** (somente sobre itens de venda)
- ➕ Acumulador de repasses (permite somar múltiplos valores)
- 🔄 Botão de "Zerar Calculadora" (não afeta o acumulado de repasse)
- Interface visual futurista com fonte Orbitron e animações CSS
- Totalização formatada em `pt-BR` com `R$`

---

## 🖼️ Preview

![Preview](https://imgur.com/hbC6dVh.png)

---

## 🛠️ Tecnologias

- HTML5
- CSS3 (custom styles + animations)
- JavaScript (DOM API + lógica de cálculo)
- Google Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron)

---

📜 Changelog
[1.2.0] - 2025-09-14
Added

📊 Painel Resumo fixo no canto inferior direito:

Mostra serviços internos acumulados.

Mostra vendas acumuladas.

Exibe desconto aplicado (0% ou 30%).

Exibe repasse acumulado.

Histórico acumulado:

Criadas variáveis globais resumoServicosTotal e resumoVendasTotal.

Valores do resumo agora são acumulados via updateItem().

Reset da calculadora não afeta mais o resumo.

Changed

resetAll() agora não altera mais:

Repasse acumulado.

Histórico do painel resumo.

Separação clara entre valores temporários da sessão e histórico acumulado.

Fixed

Desconto de parceria (30%) agora aplicado corretamente apenas em Vendas (Nitro, Chave, Reparo (Venda), Pneu (Venda)).

Atendimento externo passou a ser contabilizado corretamente.

Valores corrigidos:

Reparo = R$300

Pneu = R$125

Repasse acumulado não é mais sobrescrito ao atualizar a tela.

[1.1.0] - 2025-09-13
Added

Implementado cálculo de repasse (10% sobre vendas).

Botão ➕ Adicionar ao repasse acumula valores em acumuladoRepasse.

Changed

IDs inconsistentes corrigidos (chk-externoSul, chk-externoNorte).

[1.0.0] - 2025-09-12
Added

Estrutura inicial em HTML + CSS + JS para calculadora de tunagem e serviços.

Seções: Tunagem, Modificações, Serviços Internos, Vendas, Total.

Função updateAll() para cálculo dos valores.

Botões + e - para manipulação de contadores.
