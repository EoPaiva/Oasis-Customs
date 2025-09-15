// Contadores de itens para o resumo (não resetam)
let resumoServicosTotal = 0;
let resumoVendasTotal = 0;

// Variáveis para o repasse e gráfico (não resetam)
let acumuladoRepasse = 0;
let acumuladoServicosValor = 0;
let acumuladoVendasValor = 0;
let myIncomeChart; // Variável para guardar a instância do gráfico

// preços fixos
const valores = {
  'full-blindagem': 93000, 'full-sem': 68800, 'chk-turbo': 5700,
  'chk-whells': 3200, 'chk-customw': 1400, 'chk-smoke': 950,
  'chk-tint': 950, 'chk-neoncol': 950, 'chk-head': 950,
  'chk-xenon': 950, 'chk-livery': 300, 'chk-plate': 2200,
  'chk-externoSul': 700, 'chk-externoNorte': 1200, 'chk-kitdrift': 12500,
  'chk-rastreador': 12500
};

// preços unitários
const PRECO = {
  reparo: 300, pneu: 125, nitro: 7500, chave: 600,
  reparoVend: 320, pneuVend: 125, cosmeticUnit: 1200,
  resprayUnit: 1400, neonUnit: 950
};

// contadores da sessão atual (resetam)
let counters = {
  reparo: 0, pneu: 0, nitro: 0,
  chave: 0, reparoVend: 0, pneuVend: 0
};

// atualiza itens +-
function updateItem(item, delta) {
  if (!(item in counters)) return;
  counters[item] += delta;
  if (counters[item] < 0) counters[item] = 0;
  document.getElementById(`cnt-${item}`).textContent = counters[item];

  // Atualiza o contador de histórico (não o valor monetário)
  const isService = item === "reparo" || item === "pneu";
  const isSale = ["nitro", "chave", "reparoVend", "pneuVend"].includes(item);

  if (isService) {
    resumoServicosTotal += delta;
    if (resumoServicosTotal < 0) resumoServicosTotal = 0;
  } else if (isSale) {
    resumoVendasTotal += delta;
    if (resumoVendasTotal < 0) resumoVendasTotal = 0;
  }

  document.getElementById("resumoServicos").textContent = resumoServicosTotal;
  document.getElementById("resumoVendas").textContent = resumoVendasTotal;
  updateAll();
}

// calcula total da transação atual
function updateAll() {
  let total = 0;
  const parceria = document.getElementById("chk-parceria")?.checked ?? false;
  const partnershipMultiplier = parceria ? 0.7 : 1;

  // checkboxes e selects (sem desconto)
  for (const id in valores) {
    if (document.getElementById(id) && document.getElementById(id).checked) total += valores[id];
  }
  ['sel-motor', 'sel-freio', 'sel-transmissao', 'sel-suspensao', 'sel-blindagem'].forEach(id => {
    total += parseInt(document.getElementById(id)?.value || 0, 10);
  });

  // sliders (sem desconto)
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
  const vendasNitro  = counters.nitro * PRECO.nitro;
  const vendasChave  = counters.chave * PRECO.chave;
  const vendasReparo = counters.reparoVend * PRECO.reparoVend;
  const vendasPneu   = counters.pneuVend * PRECO.pneuVend;
  const totalVendas = (vendasNitro + vendasChave + vendasReparo + vendasPneu) * partnershipMultiplier;
  total += totalVendas;

  document.getElementById("totalDisplay").textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // repasse (10% sobre vendas com desconto)
  const repasseCheckbox = document.getElementById("chk-repasse");
  const repasseDiv = document.getElementById("repasseDisplay");
  if (repasseCheckbox && repasseCheckbox.checked) {
    const valorRepasse = totalVendas * 0.10;
    repasseDiv.style.display = "block";
    repasseDiv.textContent = `Repassar (10%): R$ ${valorRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  } else {
    repasseDiv.style.display = "none";
  }

  document.getElementById("resumoDesconto").textContent = parceria ? "30%" : "0%";
}

// MODIFICADO: acumula valores para repasse e gráfico
function acumularRepasse() {
  const parceria = document.getElementById("chk-parceria")?.checked ?? false;
  const partnershipMultiplier = parceria ? 0.7 : 1;

  // 1. Calcula o valor dos SERVIÇOS nesta transação
  let valorServicosDaTransacao = 0;
  valorServicosDaTransacao += counters.reparo * PRECO.reparo;
  valorServicosDaTransacao += counters.pneu * PRECO.pneu;
  if (document.getElementById('chk-externoSul').checked) valorServicosDaTransacao += valores['chk-externoSul'];
  if (document.getElementById('chk-externoNorte').checked) valorServicosDaTransacao += valores['chk-externoNorte'];

  // 2. Calcula o valor de VENDAS/TUNAGEM nesta transação
  let valorVendasDaTransacao = 0;
  const vendasItens = (counters.nitro * PRECO.nitro) + (counters.chave * PRECO.chave) + (counters.reparoVend * PRECO.reparoVend) + (counters.pneuVend * PRECO.pneuVend);
  valorVendasDaTransacao += vendasItens * partnershipMultiplier;

  // Soma o resto (tunagem, modificações, etc. que não são serviços)
  for (const id in valores) {
    if (id !== 'chk-externoSul' && id !== 'chk-externoNorte') { // Exclui serviços já contados
      if (document.getElementById(id) && document.getElementById(id).checked) valorVendasDaTransacao += valores[id];
    }
  }
  ['sel-motor', 'sel-freio', 'sel-transmissao', 'sel-suspensao', 'sel-blindagem'].forEach(id => {
    valorVendasDaTransacao += parseInt(document.getElementById(id)?.value || 0, 10);
  });
  valorVendasDaTransacao += Number(document.getElementById("rng-cosmetic")?.value || 0) * PRECO.cosmeticUnit;
  valorVendasDaTransacao += Number(document.getElementById("rng-respray")?.value || 0) * PRECO.resprayUnit;
  valorVendasDaTransacao += Number(document.getElementById("rng-neon")?.value || 0) * PRECO.neonUnit;

  // 3. Acumula os valores totais para o gráfico
  acumuladoServicosValor += valorServicosDaTransacao;
  acumuladoVendasValor += valorVendasDaTransacao;

  // 4. Calcula e acumula o repasse (10% sobre vendas de itens)
  const repasseDaTransacao = (vendasItens * partnershipMultiplier) * 0.10;
  acumuladoRepasse += repasseDaTransacao;

  // 5. Atualiza os visores e o gráfico
  document.getElementById("repasseAcumuladoDisplay").textContent = `Acumulado de repasse: R$ ${acumuladoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  document.getElementById("resumoRepasse").textContent = `R$ ${acumuladoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  updateChart();
  
  // Opcional: Avisar o usuário que o valor foi adicionado
}

// NOVO: Função para atualizar o gráfico
function updateChart() {
    if(myIncomeChart){
        myIncomeChart.data.datasets[0].data[0] = acumuladoServicosValor;
        myIncomeChart.data.datasets[0].data[1] = acumuladoVendasValor;
        myIncomeChart.update();
    }
}


function resetAll() {
  document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
  document.querySelectorAll('select').forEach(el => el.value = "0");
  document.querySelectorAll('input[type=range]').forEach(el => el.value = 0);

  document.getElementById("val-cosmetic").textContent = "0";
  document.getElementById("val-respray").textContent = "0";
  document.getElementById("val-neon").textContent = "0";

  for (const key in counters) {
    counters[key] = 0;
    const span = document.getElementById(`cnt-${key}`);
    if (span) span.textContent = "0";
  }

  document.getElementById("repasseDisplay").style.display = "none";
  updateAll();
}


document.addEventListener("DOMContentLoaded", () => {
  updateAll();
  document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateAll);
    el.addEventListener("change", updateAll);
  });

  // --- NOVO: Inicialização do Gráfico ---
  const ctx = document.getElementById('incomeChart').getContext('2d');
  myIncomeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ['Serviços', 'Vendas/Tunagem'],
          datasets: [{
              label: 'Receita Total R$',
              data: [acumuladoServicosValor, acumuladoVendasValor],
              backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: { position: 'top', labels: { color: 'white' } },
              tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
                            }
                            return label;
                        }
                    }
              }
          }
      }
  });
});