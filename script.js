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
  'chk-externo': 700,
  'chk-kitdrift': 12500,
  'chk-rastreador': 12500
};

const custos = {
  'full-blindagem': 93000,
  'full-sem': 68800,
  'sel-motor': 7000,
  'sel-freio': 9200,
  'sel-transmissao': 9200,
  'sel-suspensao': 7000,
  'sel-blindagem': 9200,
  'chk-turbo': 5700,
  'chk-tint': 1400,
  'chk-head': 950,
  'chk-xenon': 950,
  'chk-neoncol': 950,
  'chk-smoke': 950,
  'chk-whells': 3200,
  'chk-plate': 2200,
  'chk-kitdrift': 12500,
  'chk-rastreador': 12500,
  'rng-respray': 1400,
  'rng-neon': 950,
  'rng-cosmetic': 1200
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
  total += document.getElementById("rng-respray").value * 1400;
  document.getElementById("val-respray").textContent = document.getElementById("rng-respray").value;
  total += document.getElementById("rng-neon").value * 950;
  document.getElementById("val-neon").textContent = document.getElementById("rng-neon").value;

  total += counters.reparo * 300;
  total += counters.pneu * 125;

  total += counters.nitro * 7500;
  total += counters.kit * (parceria ? 455 : 320);
  total += counters.pneuVend * (parceria ? 332.5 : 125);
  total += counters.chave * 600;

  document.getElementById("totalDisplay").textContent =
    `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // REPASSE (somente sobre vendas)
  const repasseCheckbox = document.getElementById("chk-repasse");
  const repasseDiv = document.getElementById("repasseDisplay");

  if (repasseCheckbox.checked) {
    const valorKit = counters.kit * (parceria ? 455 : 320);
    const valorPneu = counters.pneuVend * (parceria ? 332.5 : 125);
    const valorNitro = counters.nitro * 7500;
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

  const valorKit = counters.kit * (parceria ? 455 : 320);
  const valorPneu = counters.pneuVend * (parceria ? 332.5 : 125);
  const valorNitro = counters.nitro * 7500;

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