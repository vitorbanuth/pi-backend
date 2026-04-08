# PI Backend - Diet & Water Tracking App

Backend do aplicativo de dieta e contagem de água, construído com Node.js, Express, MongoDB, Mongoose e Zod.

## 🚀 Como rodar o projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18+)
- [Docker](https://www.docker.com/) e Docker Compose instalados

### Passo a passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie a aplicação (Recomendado):**
   O comando abaixo irá subir os containers do Docker (MongoDB e Mongo Express) e iniciar o servidor de desenvolvimento.
   ```bash
   npm run dev:all
   ```

3. **Acesse a API e a Documentação:**
   - **Servidor rodando em:** `http://localhost:3000`
   - **Documentação Swagger:** `http://localhost:3000/api-docs`

---

*Nota: Se os containers do Docker já estiverem rodando, você pode iniciar apenas o servidor executando:*
```bash
npm run dev
```