let metas = [];

const nomeMeta = document.getElementById("nomeMeta");
const objetivo = document.getElementById("objetivo");
const listaMetas = document.getElementById("listaMetas");
const ativas = document.getElementById("ativa");
const concluidas = document.getElementById("concluidas");

async function carregarMetas() {
  try {
    metas = await api.getMetas();
    mostrarNaTela();
  } catch (err) {
    console.error(err);
    listaMetas.innerHTML = '<p>Erro ao carregar metas.</p>';
  }
}

async function criarMeta() {
  const nome = nomeMeta.value.trim();
  const valor = Number(objetivo.value);

  if (nome === "" || valor <= 0 || isNaN(valor)) {
    alert("Preencha todos os campos corretamente");
    return;
  }

  const nova = { nome, valor, atual: 0 };
  try {
    listaMetas.innerHTML = '<p>Salvando...</p>';
    await api.addMeta(nova);
    nomeMeta.value = "";
    objetivo.value = "";
    await carregarMetas();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar meta.');
  }
}

function calcularProgresso(meta) {
  const porcentagem = Math.floor((meta.atual / meta.valor) * 100);
  return porcentagem > 100 ? 100 : porcentagem;
}

window.addValor = addValor;

async function addValor(id) {
  console.log('id recebido:', id, 'metas:', metas.map(m => m.id));
  const meta = metas.find(m => String(m.id) === String(id));
  if (!meta) throw new Error('Meta não encontrada');
  let valorStr = prompt('Quanto deseja adicionar à meta?');
  if (valorStr === null) return; // usuário cancelou
  let valor = Number(valorStr);
  if (isNaN(valor) || valor <= 0) {
    alert('Digite um valor válido!');
    return;
  }
  meta.atual += valor;
  if (meta.atual >= meta.valor) meta.atual = meta.valor;
  await api.updateMeta(meta.id, meta);
  await carregarMetas();
}

function mostrarNaTela() {
  listaMetas.innerHTML = "";

  let totalAtivas = 0;
  let totalConcluidas = 0;

  metas.forEach((meta) => {
    const progresso = calcularProgresso(meta);
    const concluida = progresso >= 100;

    if (concluida) totalConcluidas++; else totalAtivas++;

    const statusTexto = concluida ? '🎉 <strong>Meta concluída</strong>' : 'Em andamento';
    const botaoDisabled = concluida ? 'disabled' : '';

    listaMetas.innerHTML += `
      <div class="meta">
        <h3>${meta.nome}</h3>
        <p>R$ ${meta.atual} / R$ ${meta.valor}</p>
        <p>Progresso: ${progresso}%</p>
        <p>${statusTexto}</p>
        <button onclick="window.addValor('${meta.id}')" ${botaoDisabled}>
          Adicionar valor
        </button>
      </div>
      <hr>
    `;
  });

  ativas.innerText = totalAtivas;
  concluidas.innerText = totalConcluidas;
}

carregarMetas();