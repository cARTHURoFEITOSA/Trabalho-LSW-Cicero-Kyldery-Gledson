
const displayReceitas = document.getElementById('total-receitas');
const displayDespesas = document.getElementById('total-despesas');
const displaySaldo = document.getElementById('saldo-total');


function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function atualizarResumo() {
    try {
        displayReceitas.innerText = 'Carregando...';
        displayDespesas.innerText = 'Carregando...';
        displaySaldo.innerText = 'Carregando...';
        const transacoes = await api.getTransacoes();
        const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((ac, t) => ac + t.valor, 0);
        const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((ac, t) => ac + t.valor, 0);
        const saldo = totalReceitas - totalDespesas;

        displayReceitas.innerText = formatarMoeda(totalReceitas);
        displayDespesas.innerText = formatarMoeda(totalDespesas);
        displaySaldo.innerText = formatarMoeda(saldo);

        displaySaldo.style.color = saldo < 0 ? 'red' : 'green';
    } catch (err) {
        displayReceitas.innerText = 'Erro';
        displayDespesas.innerText = 'Erro';
        displaySaldo.innerText = 'Erro';
        console.error(err);
    }
}

atualizarResumo();