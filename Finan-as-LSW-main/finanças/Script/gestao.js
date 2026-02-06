/* ============================================================
   PROJETO FINANÇAS+
   Conceitos aplicados: Vetores, Objetos, DOM, Eventos, 
   LocalStorage, Map, Filter, Reduce.
============================================================ */

// 1. SELEÇÃO DE ELEMENTOS DO DOM
const form = document.getElementById('form-transacao');
const inputTitulo = document.getElementById('form-titulo');
const inputValor = document.getElementById('form-valor');
const inputData = document.getElementById('form-data');
const inputCategoria = document.getElementById('form-categoria');
const inputTipo = document.getElementById('form-tipo');

const listaTransacoes = document.getElementById('lista-transacoes');
const filtroBusca = document.getElementById('filtro-busca');
const filtroTipo = document.getElementById('filtro-tipo');

const displayReceitas = document.getElementById('total-receitas');
const displayDespesas = document.getElementById('total-despesas');
const displaySaldo = document.getElementById('saldo-total');

// 2. ESTRUTURA DE DADOS E INICIALIZAÇÃO
// Inicializa vetor de transações (será carregado da API)
let transacoes = [];
// 3. FUNÇÕES UTILITÁRIAS
function gerarID() {
    return Math.floor(Math.random() * 10000);
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvarLocalStorage() {
    // localStorage não é mais usado; este placeholder foi mantido para compatibilidade
}

// 4. FUNÇÕES DE RENDERIZAÇÃO (DOM)

function atualizarInterface() {
    listaTransacoes.innerHTML = ''; // Limpa a lista atual
    
    // Obtém valores dos filtros
    const termoBusca = filtroBusca.value.toLowerCase();
    const tipoFiltro = filtroTipo.value;

    // CONCEITO: FILTER (Filtragem de dados)
    const transacoesFiltradas = transacoes.filter(transacao => {
        const correspondeBusca = transacao.titulo.toLowerCase().includes(termoBusca);
        const correspondeTipo = tipoFiltro === 'todos' ? true : transacao.tipo === tipoFiltro;
        return correspondeBusca && correspondeTipo;
    });

    // CONCEITO: FOREACH (Iteração para criar elementos)
    transacoesFiltradas.forEach(criarElementoTransacao);

    atualizarBalanco();
}

function criarElementoTransacao(transacao) {
    // 1. Criar elemento LI em vez de DIV para aproveitar o CSS existente
    const li = document.createElement('li');
    // 2. Adicionar classes para estilização via CSS
    // Adiciona a classe base e a classe do tipo (receita/despesa)
    li.classList.add('transacao-item'); 
    li.classList.add(transacao.tipo); 

    const operador = transacao.tipo === 'receita' ? '+' : '-';

    // 3. Montar o HTML interno
    li.innerHTML = `
        <div class="info">
            <h4>${transacao.titulo}</h4>
            <small>${transacao.categoria.toUpperCase()} | ${new Date(transacao.data).toLocaleDateString('pt-BR')}</small>
        </div>
        <div class="valores">
            <span>
                ${operador} ${formatarMoeda(transacao.valor)}
            </span>
            <div class="acoes">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        </div>
    `;

    // 4. Adicionar à lista
    listaTransacoes.appendChild(li);
    // adicionar listeners
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    if (editBtn) editBtn.addEventListener('click', () => iniciarEdicao(transacao));
    if (deleteBtn) deleteBtn.addEventListener('click', () => window.removerTransacao(transacao.id));
}

function atualizarBalanco() {
    // CONCEITO: MAP e REDUCE (Cálculos agregados)
    
    // Calcula total de receitas
    const totalReceitas = transacoes
        .filter(t => t.tipo === 'receita')
        .reduce((acumulador, transacao) => acumulador + transacao.valor, 0);

    // Calcula total de despesas
    const totalDespesas = transacoes
        .filter(t => t.tipo === 'despesa')
        .reduce((acumulador, transacao) => acumulador + transacao.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    // Atualiza DOM
    displayReceitas.innerText = formatarMoeda(totalReceitas);
    displayDespesas.innerText = formatarMoeda(totalDespesas);
    displaySaldo.innerText = formatarMoeda(saldo);

    // Muda cor do saldo se for negativo
    displaySaldo.style.color = saldo < 0 ? 'red' : 'green';
}

// 5. MANIPULAÇÃO DE DADOS (Adicionar/Remover) usando a API

async function adicionarTransacao(evento) {
    evento.preventDefault();

    const novaTransacao = {
        titulo: inputTitulo.value,
        valor: parseFloat(inputValor.value),
        data: inputData.value,
        categoria: inputCategoria.value,
        tipo: inputTipo.value
    };

    try {
        // Envia para a API e recarrega a lista
        await api.addTransacao(novaTransacao);
        form.reset();
        alert('Transação adicionada com sucesso!');
        await carregarTransacoes();
    } catch (err) {
        console.error(err);
        alert('Erro ao adicionar transação.');
    }
}

// Função global para ser acessada pelo botão onclick no HTML
window.removerTransacao = async function(id) {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;
    try {
        await api.deleteTransacao(id);
        await carregarTransacoes();
    } catch (err) {
        console.error(err);
        alert('Erro ao excluir transação.');
    }
}

// 6. EVENT LISTENERS (Ouvintes de Eventos)

form.addEventListener('submit', adicionarTransacao);

// Eventos de Input para filtro em tempo real
filtroBusca.addEventListener('input', atualizarInterface);
filtroTipo.addEventListener('change', atualizarInterface);

// Função para carregar transações da API
async function carregarTransacoes() {
    try {
        transacoes = await api.getTransacoes();
        atualizarInterface();
    } catch (err) {
        console.error(err);
        listaTransacoes.innerHTML = '<p>Erro ao carregar transações.</p>';
        alert('Não foi possível carregar os dados. Verifique se o json-server está rodando em http://localhost:3001');
    }
}

// Inicialização: carrega dados do backend
carregarTransacoes();

// --- Edição / Loading ---
let modoEdicao = false;
let idEdicao = null;

function iniciarEdicao(transacao) {
    modoEdicao = true;
    idEdicao = transacao.id;
    inputTitulo.value = transacao.titulo;
    inputValor.value = transacao.valor;
    inputData.value = transacao.data;
    inputCategoria.value = transacao.categoria;
    inputTipo.value = transacao.tipo;
    form.querySelector('button[type="submit"]').innerText = 'Salvar Alterações';
}

async function aplicarEdicao(evento) {
    evento.preventDefault();
    if (!modoEdicao) return adicionarTransacao(evento);

    const dadosAtualizados = {
        titulo: inputTitulo.value,
        valor: parseFloat(inputValor.value),
        data: inputData.value,
        categoria: inputCategoria.value,
        tipo: inputTipo.value
    };

    try {
        await api.updateTransacao(idEdicao, dadosAtualizados);
        modoEdicao = false;
        idEdicao = null;
        form.reset();
        form.querySelector('button[type="submit"]').innerText = 'Adicionar';
        await carregarTransacoes();
        alert('Transação atualizada.');
    } catch (err) {
        console.error(err);
        alert('Erro ao atualizar transação.');
    }
}

// substituir listener por handler que suporta editar
form.removeEventListener('submit', adicionarTransacao);
form.addEventListener('submit', aplicarEdicao);

const loadingIndicator = document.getElementById('loading-indicator');
function setLoading(on) {
    if (!loadingIndicator) return;
    loadingIndicator.style.display = on ? 'block' : 'none';
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = on;
}