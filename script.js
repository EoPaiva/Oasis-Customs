const valores = {
  'full-blindagem': 85000,
  'full-sem': 68000,
  'chk-turbo': 10000,
  'chk-whells': 2500,
  'chk-customw': 1000,
  'chk-smoke': 700,
  'chk-tint': 700,
  'chk-neoncol': 700,
  'chk-head': 700,
  'chk-xenon': 700,
  'chk-livery': 300,
  'chk-plate': 850,
  'chk-externo': 700,
  'chk-kitdrift': 15000,
  'chk-rastreador': 15000
};

const custos = {
  'full-blindagem': 49600,
  'full-sem': 35600,
  'sel-motor': 8150,
  'sel-freio': 7150,
  'sel-transmissao': 7150,
  'sel-suspensao': 8150,
  'sel-blindagem': 14000,
  'chk-turbo': 5000,
  'chk-tint': 350,
  'chk-head': 350,
  'chk-xenon': 350,
  'chk-neoncol': 350,
  'chk-smoke': 700,
  'chk-whells': 1750,
  'chk-plate': 563,
  'chk-kitdrift': 10000,
  'chk-rastreador': 10000,
  'rng-respray': 700,
  'rng-neon': 350,
  'rng-cosmetic': 1050
};

let counters = {
  reparo: 0, pneu: 0, nitro: 0, kit: 0, pneuVend: 0, chave: 0
};

let acumuladoRepasse = 0;

function updateItem(item, value) {
  counters[item] += value;
  if (counters[item] < 0) counters[item] = 0;
  document.getElementById(`cnt-${item}`).textContent = counters[item];
  updateAll();
}

function updateAll() {
  let total = 0;

  // Checkboxes fixos
  for (const id in valores) {
    const checkbox = document.getElementById(id);
    if (checkbox && checkbox.checked) total += valores[id];
  }

  const parceria = document.getElementById("chk-parceria").checked;

  total += parseInt(document.getElementById("sel-motor").value);
  total += parseInt(document.getElementById("sel-freio").value);
  total += parseInt(document.getElementById("sel-transmissao").value);
  total += parseInt(document.getElementById("sel-suspensao").value);
  total += parseInt(document.getElementById("sel-blindagem").value);

  total += document.getElementById("rng-cosmetic").value * 1200;
  document.getElementById("val-cosmetic").textContent = document.getElementById("rng-cosmetic").value;
  total += document.getElementById("rng-respray").value * 1000;
  document.getElementById("val-respray").textContent = document.getElementById("rng-respray").value;
  total += document.getElementById("rng-neon").value * 700;
  document.getElementById("val-neon").textContent = document.getElementById("rng-neon").value;

  total += counters.reparo * 550;
  total += counters.pneu * 450;

  total += counters.nitro * 8000;
  total += counters.kit * (parceria ? 455 : 650);
  total += counters.pneuVend * (parceria ? 332.5 : 475);
  total += counters.chave * 500;

  document.getElementById("totalDisplay").textContent =
    `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // REPASSE (somente sobre vendas)
  const repasseCheckbox = document.getElementById("chk-repasse");
  const repasseDiv = document.getElementById("repasseDisplay");

  if (repasseCheckbox.checked) {
    const valorKit = counters.kit * (parceria ? 455 : 650);
    const valorPneu = counters.pneuVend * (parceria ? 332.5 : 475);
    const valorNitro = counters.nitro * 8000;
    const somaRepassavel = valorKit + valorPneu + valorNitro;
    const valorRepasse = somaRepassavel * 0.10;

    repasseDiv.style.display = "block";
    repasseDiv.textContent = `Repassar (10% sobre vendas): R$ ${valorRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  } else {
    repasseDiv.style.display = "none";
  }
}

function resetAll() {
  // Desmarca todos os checkboxes
  for (const id in valores) {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  }

  // Reseta selects
  ['sel-motor', 'sel-freio', 'sel-transmissao', 'sel-suspensao', 'sel-blindagem']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "0";
    });

  // Reseta sliders
  ['rng-cosmetic', 'rng-respray', 'rng-neon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
    document.getElementById(`val-${id.split('-')[1]}`).textContent = "0";
  });

  // Reseta counters
  for (const key in counters) {
    counters[key] = 0;
    const el = document.getElementById(`cnt-${key}`);
    if (el) el.textContent = "0";
  }

  // Desmarca opções especiais
  document.getElementById("chk-parceria").checked = false;
  document.getElementById("chk-repasse").checked = false;

  // Zera valores exibidos
  document.getElementById("totalDisplay").textContent = "R$ 0,00";
  document.getElementById("repasseDisplay").style.display = "none";
  document.getElementById("repasseDisplay").textContent = "Repassar: R$ 0,00";
  
}

function acumularRepasse() {
  const parceria = document.getElementById("chk-parceria").checked;

  const valorKit = counters.kit * (parceria ? 455 : 650);
  const valorPneu = counters.pneuVend * (parceria ? 332.5 : 475);
  const valorNitro = counters.nitro * 8000;

  const somaRepassavel = valorKit + valorPneu + valorNitro;
  const valorRepasse = somaRepassavel * 0.10;

  acumuladoRepasse += valorRepasse;

  document.getElementById("repasseAcumuladoDisplay").textContent =
    `Acumulado de repasse: R$ ${acumuladoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  updateAll();
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateAll);
  });
  document.getElementById("chk-repasse").addEventListener("change", updateAll);
});