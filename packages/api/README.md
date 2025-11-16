# API de Votação de Jogos 2025

API REST desenvolvida com Node.js, Express e TypeScript para gerenciar votação de jogos.

## 🚀 Tecnologias

- Node.js
- Express
- TypeScript
- MongoDB
- CORS

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB rodando localmente ou URI de conexão

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017
DB_NAME=votacao
PORT=3000
```

## 🎮 Como usar

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Produção
```bash
npm start
```

## 📍 Endpoints

### GET /api/jogos
Retorna a lista de todos os jogos da collection `jogos_2025`.

**Resposta de sucesso:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

## 🌐 Acessar API

Após iniciar o servidor, a API estará disponível em:
```
http://localhost:5000
```

Endpoint de jogos:
```
http://localhost:5000/api/jogos
```
