let resumoServicosTotal = 0;
let resumoVendasTotal = 0;

// preços fixos
const valores = {
  'full-blindagem': 93000,
  'full-sem': 68800,
  'chk-turbo': 5700,
  'chk-whells': 3200,
  'chk-customw': 1400,
  'chk-smoke': 950,
  'chk-tint': 950,
  'chk-neoncol': 950,
  'chk-head': 950,
  'chk-xenon': 950,
  'chk-livery': 300,
  'chk-plate': 2200,
  'chk-externoSul': 700,
  'chk-externoNorte': 1200,
  'chk-kitdrift': 12500,
  'chk-rastreador': 12500
};

// preços unitários
const PRECO = {
  reparo: 300,
  pneu: 125,
  nitro: 7500,
  chave: 600,
  cosmeticUnit: 1200,
  resprayUnit: 1400,
  neonUnit: 950
};

// contadores
let counters = {
  reparo: 0,
  pneu: 0,
  nitro: 0,
  chave: 0,
  reparoVend: 0,
  pneuVend: 0
};

let acumuladoRepasse = 0;

// atualiza itens +-
function updateItem(item, delta) {
  if (!(item in counters)) return;

  // aplica mudança local (sessão atual)
  counters[item] += delta;
  if (counters[item] < 0) counters[item] = 0;
  document.getElementById(`cnt-${item}`).textContent = counters[item];

  // atualiza histórico acumulado (não reseta)
  if (item === "reparo" || item === "pneu") {
    resumoServicosTotal += delta;
    if (resumoServicosTotal < 0) resumoServicosTotal = 0;
  } else {
    resumoVendasTotal += delta;
    if (resumoVendasTotal < 0) resumoVendasTotal = 0;
  }

  document.getElementById("resumoServicos").textContent = resumoServicosTotal;
  document.getElementById("resumoVendas").textContent = resumoVendasTotal;

  updateAll();
}



// calcula total
function updateAll() {
  let total = 0;

  // checkboxes fixos
  for (const id in valores) {
    const el = document.getElementById(id);
    if (el && el.checked) total += valores[id];
  }

  const parceria = document.getElementById("chk-parceria")?.checked ?? false;
  const partnershipMultiplier = parceria ? 0.7 : 1;

  // selects
  total += parseInt(document.getElementById("sel-motor")?.value || 0, 10);
  total += parseInt(document.getElementById("sel-freio")?.value || 0, 10);
  total += parseInt(document.getElementById("sel-transmissao")?.value || 0, 10);
  total += parseInt(document.getElementById("sel-suspensao")?.value || 0, 10);
  total += parseInt(document.getElementById("sel-blindagem")?.value || 0, 10);

  // sliders
  const cosmetic = Number(document.getElementById("rng-cosmetic")?.value || 0);
  document.getElementById("val-cosmetic").textContent = cosmetic;
  total += cosmetic * PRECO.cosmeticUnit;

  const respray = Number(document.getElementById("rng-respray")?.value || 0);
  document.getElementById("val-respray").textContent = respray;
  total += respray * PRECO.resprayUnit;

  const neon = Number(document.getElementById("rng-neon")?.value || 0);
  document.getElementById("val-neon").textContent = neon;
  total += neon * PRECO.neonUnit;

  // serviços internos (sem desconto)
  total += counters.reparo * PRECO.reparo;
  total += counters.pneu * PRECO.pneu;

  // vendas (com desconto de parceria)
  const vendasNitro  = counters.nitro * PRECO.nitro * partnershipMultiplier;
  const vendasChave  = counters.chave * PRECO.chave * partnershipMultiplier;
  const vendasReparo = counters.reparoVend * PRECO.reparo * partnershipMultiplier;
  const vendasPneu   = counters.pneuVend * PRECO.pneu * partnershipMultiplier;

  total += vendasNitro + vendasChave + vendasReparo + vendasPneu;

  // exibe total
  document.getElementById("totalDisplay").textContent =
    `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // repasse (10% sobre vendas)
  const repasseCheckbox = document.getElementById("chk-repasse");
  const repasseDiv = document.getElementById("repasseDisplay");
  if (repasseCheckbox && repasseCheckbox.checked) {
    const somaRepassavel = vendasNitro + vendasChave + vendasReparo + vendasPneu;
    const valorRepasse = somaRepassavel * 0.10;
    repasseDiv.style.display = "block";
    repasseDiv.textContent =
      `Repassar (10% sobre vendas): R$ ${valorRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  } else {
    repasseDiv.style.display = "none";
  }

  // painel resumo (NÃO mostra o repasse acumulado aqui para não resetar)
  const descontoTxt = parceria ? "30%" : "0%";

  document.getElementById("resumoDesconto").textContent = descontoTxt;
}

// resetar calculadora (não mexe no resumo nem no repasse acumulado)
function resetAll() {
  // limpa calculadora mas mantém histórico do resumo
  for (const id in valores) {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  }

  ['sel-motor','sel-freio','sel-transmissao','sel-suspensao','sel-blindagem'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "0";
  });

  ['rng-cosmetic','rng-respray','rng-neon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
  document.getElementById("val-cosmetic").textContent = "0";
  document.getElementById("val-respray").textContent = "0";
  document.getElementById("val-neon").textContent = "0";

  for (const key in counters) {
    counters[key] = 0;
    const span = document.getElementById(`cnt-${key}`);
    if (span) span.textContent = "0";
  }

  const partnershipEl = document.getElementById("chk-parceria");
  if (partnershipEl) partnershipEl.checked = false;
  const repasseEl = document.getElementById("chk-repasse");
  if (repasseEl) repasseEl.checked = false;

  document.getElementById("totalDisplay").textContent = "R$ 0,00";
  const repasseDiv = document.getElementById("repasseDisplay");
  repasseDiv.style.display = "none";
  repasseDiv.textContent = "Repassar: R$ 0,00";

  updateAll();
}

// acumular repasse
function acumularRepasse() {
  const parceria = document.getElementById("chk-parceria")?.checked ?? false;
  const partnershipMultiplier = parceria ? 0.7 : 1;

  const somaRepassavel = (
    counters.nitro * PRECO.nitro +
    counters.chave * PRECO.chave +
    counters.reparoVend * PRECO.reparo +
    counters.pneuVend * PRECO.pneu
  ) * partnershipMultiplier;

  const valorRepasse = somaRepassavel * 0.10;
  acumuladoRepasse += valorRepasse;

  // atualiza acumulado
  document.getElementById("repasseAcumuladoDisplay").textContent =
    `Acumulado de repasse: R$ ${acumuladoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  document.getElementById("resumoRepasse").textContent =
    `R$ ${acumuladoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// inicialização
document.addEventListener("DOMContentLoaded", () => {
  updateAll();
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateAll);
    el.addEventListener("change", updateAll);
  });
});