
const API_BASE = 'http://localhost:3001';

const api = {
    // Transações
    getTransacoes: async () => {
        const res = await fetch(`${API_BASE}/transacoes`);
        if (!res.ok) throw new Error('Falha ao obter transações');
        return await res.json();
    },
    addTransacao: async (data) => {
        const res = await fetch(`${API_BASE}/transacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Falha ao adicionar transação');
        return await res.json();
    },
    updateTransacao: async (id, data) => {
        const res = await fetch(`${API_BASE}/transacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Falha ao atualizar transação');
        return await res.json();
    },
    deleteTransacao: async (id) => {
        const res = await fetch(`${API_BASE}/transacoes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Falha ao deletar transação');
        return true;
    },
    // Metas
    getMetas: async () => {
        const res = await fetch(`${API_BASE}/metas`);
        if (!res.ok) throw new Error('Falha ao obter metas');
        return await res.json();
    },
    addMeta: async (data) => {
        const res = await fetch(`${API_BASE}/metas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Falha ao adicionar meta');
        return await res.json();
    },
    updateMeta: async (id, data) => {
        const res = await fetch(`${API_BASE}/metas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Falha ao atualizar meta');
        return await res.json();
    },
    deleteMeta: async (id) => {
        const res = await fetch(`${API_BASE}/metas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Falha ao deletar meta');
        return true;
    }
};

