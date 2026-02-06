// Teste de chamadas usando Fetch (async/await e then/catch) e Axios
// Execute este arquivo no console do navegador ou como script de teste

const API_BASE_TEST = 'http://localhost:3001';

// --- FETCH ---
// GET
fetch(`${API_BASE_TEST}/metas`)
  .then(res => res.json())
  .then(data => console.log('Fetch GET metas:', data))
  .catch(err => console.error('Fetch GET erro:', err));

// POST
fetch(`${API_BASE_TEST}/metas`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Teste Fetch', valor: 123, atual: 0 })
})
  .then(res => res.json())
  .then(data => console.log('Fetch POST meta:', data))
  .catch(err => console.error('Fetch POST erro:', err));

// PUT
fetch(`${API_BASE_TEST}/metas/1`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Alterado Fetch', valor: 999, atual: 10 })
})
  .then(res => res.json())
  .then(data => console.log('Fetch PUT meta:', data))
  .catch(err => console.error('Fetch PUT erro:', err));

// DELETE
fetch(`${API_BASE_TEST}/metas/1`, { method: 'DELETE' })
  .then(res => console.log('Fetch DELETE meta:', res.ok))
  .catch(err => console.error('Fetch DELETE erro:', err));

// --- AXIOS ---
// Adicione o script do axios no HTML ou rode no Node.js
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

axios.get(`${API_BASE_TEST}/metas`)
  .then(res => console.log('Axios GET metas:', res.data))
  .catch(err => console.error('Axios GET erro:', err));

axios.post(`${API_BASE_TEST}/metas`, { nome: 'Teste Axios', valor: 456, atual: 0 })
  .then(res => console.log('Axios POST meta:', res.data))
  .catch(err => console.error('Axios POST erro:', err));

axios.put(`${API_BASE_TEST}/metas/2`, { nome: 'Alterado Axios', valor: 888, atual: 20 })
  .then(res => console.log('Axios PUT meta:', res.data))
  .catch(err => console.error('Axios PUT erro:', err));

axios.delete(`${API_BASE_TEST}/metas/2`)
  .then(res => console.log('Axios DELETE meta:', res.status === 200))
  .catch(err => console.error('Axios DELETE erro:', err));
