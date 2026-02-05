# Projeto Finanças+ — Miniprojeto 2

## Passos para rodar o projeto

1. Instale as dependências:
```bash
npm install
```

2. Inicie o json-server (API fake):
```bash
npm run json-server
# Acesse http://localhost:3001/transacoes e http://localhost:3001/metas
```

3. Sirva os arquivos estáticos:
```bash
npm run serve
# Acesse http://localhost:8080/Finan-as-LSW-main/finanças/Paginas/gestao.html
```

## Observações
- O arquivo `db.json` contém as coleções `transacoes` e `metas` usadas pelo json-server.
- O helper `finanças/Script/api.js` fornece funções para GET, POST, PUT, DELETE de transações e metas.
- Todos os scripts JS usam a porta 3001 para a API.
- O frontend foi refatorado para consumir a API usando `fetch` e `async/await`, com tratamento de loading e erros.
- Validação de dados antes de enviar para API.

## Testes
- Teste os fluxos de cadastro, edição, remoção e consulta de transações/metas pela interface.
- Se necessário, teste os endpoints manualmente com ferramentas como Postman ou curl.
