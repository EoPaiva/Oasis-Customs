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

![Preview](https://imgur.com/gOLrcPj.png)

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

<<<<<<< HEAD
```bash
📁 / (root)
├── index.html         # Interface principal
├── style.css          # Estilos visuais
├── script.js          # Lógica de cálculo e interações
└── README.md          # Este arquivo

14/09/2025
# 📜 Changelog – Calculadora de Tunagem e Serviços
```diff

### 🟢 Versão inicial
+ Estrutura HTML com seções de Tunagem, Modificações, Serviços Internos, Vendas e Total.
+ Script JS com updateAll() para calcular preços, aplicar desconto e mostrar repasse.
+ Sistema básico de botões `+` e `-` para contadores.

### 🟡 Atualizações principais
- IDs inconsistentes corrigidos (`chk-externoSul`, `chk-externoNorte`).
- Valores de Reparo e Pneu ajustados para R$300 e R$125.
- Atendimento externo passou a ser contabilizado corretamente.

+ Implementado desconto de parceria (30%) aplicado apenas em Vendas:
  + Nitro, Chave, Reparo (Venda), Pneu (Venda).
  - Serviços internos não têm desconto.

+ Repasse:
  + Calculado como 10% sobre vendas.
  + Botão ➕ Adicionar ao repasse acumula valores em `acumuladoRepasse`.
  + Reset não zera mais o acumulado de repasse.

### 🔵 Funcionalidades novas
+ Painel Resumo (📊) fixo no canto inferior direito:
  + Serviços internos acumulados.
  + Vendas acumuladas.
  + Status do desconto.
  + Repasse acumulado.

+ Histórico acumulado:
  + Criadas variáveis globais `resumoServicosTotal` e `resumoVendasTotal`.
  + Resumo atualizado em `updateItem()` e não mais sobrescrito em `updateAll()`.
  - Reset não afeta mais os valores acumulados do resumo.

### 🔴 Problemas resolvidos
- Resumo não reseta mais ao zerar a calculadora.
- Repasse acumulado não é mais sobrescrito ao atualizar a tela.
- Desconto de parceria agora é aplicado corretamente.

### 🚀 Próximos upgrades sugeridos
+ Botão "Zerar histórico" no painel resumo.
+ Histórico detalhado com timestamp.
+ Exportar resumo em `.txt` ou `.pdf`.
+ Alternar tema dark/light.
```
@everyone
=======
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
>>>>>>> b390d34a1905c2bf37b87777e7ff92ec7c3dd3d8
