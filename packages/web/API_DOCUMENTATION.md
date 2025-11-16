# API de Votação - Documentação para Frontend

## 📌 Informações Gerais

**Base URL:** `http://localhost:3000`

**Documentação Interativa (Swagger):** `http://localhost:3000/api-docs`

Todos os endpoints retornam JSON e utilizam o prefixo `/api`.

---

## 🎮 Endpoints - Jogos

### GET `/api/jogos`
Lista todos os jogos disponíveis para votação.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "673a1234567890abcdef1234",
      "titulo": "The Legend of Zelda",
      "plataforma": "Nintendo Switch",
      // ... outros campos
    }
  ]
}
```

**Exemplo Vue.js:**
```javascript
async function carregarJogos() {
  const response = await fetch('http://localhost:3000/api/jogos');
  const result = await response.json();
  if (result.success) {
    this.jogos = result.data;
  }
}
```

---

## 🗳️ Endpoints - Votação de Jogos

### POST `/api/votos`
Registra o voto de um usuário (3 jogos ordenados por preferência).

**Body da Requisição:**
```json
{
  "voterId": "user123",
  "escolhas": ["jogo_id_1", "jogo_id_2", "jogo_id_3"]
}
```

**Validações:**
- `voterId`: obrigatório, string única
- `escolhas`: array obrigatório com exatamente 3 IDs de jogos
- Cada votante pode votar apenas uma vez

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Voto registrado com sucesso!",
  "data": {
    "id": "673b9876543210fedcba9876",
    "voterId": "user123",
    "escolhas": ["jogo_id_1", "jogo_id_2", "jogo_id_3"],
    "dataVoto": "2025-11-15T10:30:00.000Z"
  }
}
```

**Resposta de Erro - Voto Duplicado (409):**
```json
{
  "success": false,
  "message": "Este votante já registrou seu voto. Não é permitido votar mais de uma vez."
}
```

**Resposta de Erro - Validação (400):**
```json
{
  "success": false,
  "message": "escolhas deve ser um array com exatamente 3 jogos"
}
```

**Exemplo Vue.js:**
```javascript
async function enviarVoto(voterId, jogosSelecionados) {
  try {
    const response = await fetch('http://localhost:3000/api/votos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        voterId: voterId,
        escolhas: jogosSelecionados // array com 3 IDs
      })
    });
    
    const result = await response.json();
    
    if (response.status === 409) {
      alert('Você já votou!');
    } else if (result.success) {
      alert('Voto registrado com sucesso!');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Erro ao votar:', error);
  }
}
```

### GET `/api/votos/:voterId`
Verifica se um votante já registrou seu voto.

**Parâmetros:**
- `voterId`: ID único do votante (na URL)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "jaVotou": true,
  "data": {
    "escolhas": ["jogo_id_1", "jogo_id_2", "jogo_id_3"],
    "dataVoto": "2025-11-15T10:30:00.000Z"
  }
}
```

Quando não votou:
```json
{
  "success": true,
  "jaVotou": false,
  "data": null
}
```

**Exemplo Vue.js:**
```javascript
async function verificarSeJaVotou(voterId) {
  const response = await fetch(`http://localhost:3000/api/votos/${voterId}`);
  const result = await response.json();
  return result.jaVotou;
}
```

---

## 🎙️ Endpoints - Episódios

### GET `/api/episodios`
Lista todos os episódios do podcast 99Vidas.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "count": 43,
  "data": [
    {
      "_id": "673c1234567890abcdef5678",
      "title": "99Vidas 694 - Nintendo Switch",
      "pubDate": "Sat, 08 Nov 2025 20:30:08 GMT"
    }
  ]
}
```

**Exemplo Vue.js:**
```javascript
async function carregarEpisodios() {
  const response = await fetch('http://localhost:3000/api/episodios');
  const result = await response.json();
  if (result.success) {
    this.episodios = result.data;
  }
}
```

---

## 🗳️ Endpoints - Votação de Episódios

### POST `/api/votos-episodios`
Registra o voto de um usuário para episódio favorito (apenas 1 escolha).

**Body da Requisição:**
```json
{
  "voterId": "user123",
  "escolha": "episodio_id"
}
```

**Validações:**
- `voterId`: obrigatório, string única
- `escolha`: string obrigatória com ID do episódio
- Cada votante pode votar apenas uma vez

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Voto de episódio registrado com sucesso!",
  "data": {
    "id": "673d1234567890abcdef9012",
    "voterId": "user123",
    "escolha": "episodio_id",
    "dataVoto": "2025-11-15T10:35:00.000Z"
  }
}
```

**Resposta de Erro - Voto Duplicado (409):**
```json
{
  "success": false,
  "message": "Este votante já registrou seu voto para episódio. Não é permitido votar mais de uma vez."
}
```

**Exemplo Vue.js:**
```javascript
async function votarEpisodio(voterId, episodioId) {
  try {
    const response = await fetch('http://localhost:3000/api/votos-episodios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        voterId: voterId,
        escolha: episodioId
      })
    });
    
    const result = await response.json();
    
    if (response.status === 409) {
      alert('Você já votou neste episódio!');
    } else if (result.success) {
      alert('Voto registrado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao votar:', error);
  }
}
```

### GET `/api/votos-episodios/:voterId`
Verifica se um votante já registrou seu voto para episódio.

**Parâmetros:**
- `voterId`: ID único do votante (na URL)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "jaVotou": true,
  "data": {
    "escolha": "episodio_id",
    "dataVoto": "2025-11-15T10:35:00.000Z"
  }
}
```

**Exemplo Vue.js:**
```javascript
async function verificarVotoEpisodio(voterId) {
  const response = await fetch(`http://localhost:3000/api/votos-episodios/${voterId}`);
  const result = await response.json();
  return result.jaVotou;
}
```

---

## 🔧 Configuração no Frontend Vue.js

### 1. Criar um serviço API

```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Jogos
  async getJogos() {
    const response = await fetch(`${API_BASE_URL}/jogos`);
    return response.json();
  },

  // Votos de Jogos
  async votarJogos(voterId, escolhas) {
    const response = await fetch(`${API_BASE_URL}/votos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId, escolhas })
    });
    return response.json();
  },

  async verificarVotoJogos(voterId) {
    const response = await fetch(`${API_BASE_URL}/votos/${voterId}`);
    return response.json();
  },

  // Episódios
  async getEpisodios() {
    const response = await fetch(`${API_BASE_URL}/episodios`);
    return response.json();
  },

  // Votos de Episódios
  async votarEpisodio(voterId, escolha) {
    const response = await fetch(`${API_BASE_URL}/votos-episodios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId, escolha })
    });
    return response.json();
  },

  async verificarVotoEpisodio(voterId) {
    const response = await fetch(`${API_BASE_URL}/votos-episodios/${voterId}`);
    return response.json();
  }
};
```

### 2. Exemplo de Componente Vue

```vue
<template>
  <div>
    <h2>Votação de Jogos</h2>
    
    <div v-if="jaVotou">
      <p>Você já votou! Obrigado pela participação.</p>
    </div>
    
    <div v-else>
      <div v-for="jogo in jogos" :key="jogo._id">
        <label>
          <input 
            type="checkbox" 
            :value="jogo._id" 
            v-model="escolhas"
            :disabled="escolhas.length >= 3 && !escolhas.includes(jogo._id)"
          />
          {{ jogo.titulo }}
        </label>
      </div>
      
      <button @click="enviarVoto" :disabled="escolhas.length !== 3">
        Votar ({{ escolhas.length }}/3)
      </button>
    </div>
  </div>
</template>

<script>
import { api } from '@/services/api';

export default {
  data() {
    return {
      jogos: [],
      escolhas: [],
      jaVotou: false,
      voterId: 'user123' // Você deve gerar ou obter isso de forma única
    };
  },
  
  async mounted() {
    await this.carregarJogos();
    await this.verificarVoto();
  },
  
  methods: {
    async carregarJogos() {
      const result = await api.getJogos();
      if (result.success) {
        this.jogos = result.data;
      }
    },
    
    async verificarVoto() {
      const result = await api.verificarVotoJogos(this.voterId);
      this.jaVotou = result.jaVotou;
    },
    
    async enviarVoto() {
      if (this.escolhas.length !== 3) {
        alert('Selecione exatamente 3 jogos');
        return;
      }
      
      const result = await api.votarJogos(this.voterId, this.escolhas);
      
      if (result.success) {
        alert('Voto registrado com sucesso!');
        this.jaVotou = true;
      } else {
        alert(result.message);
      }
    }
  }
};
</script>
```

---

## 🚨 Tratamento de Erros

Todos os endpoints podem retornar os seguintes erros:

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Descrição do erro de validação"
}
```

**409 - Conflict:**
```json
{
  "success": false,
  "message": "Votante já registrou seu voto"
}
```

**500 - Internal Server Error:**
```json
{
  "success": false,
  "message": "Erro ao processar requisição",
  "error": "Detalhes técnicos do erro"
}
```

---

## 💡 Dicas para o Frontend

1. **Geração de VoterID:** Use uma combinação de localStorage + UUID ou autenticação de usuário
2. **CORS:** A API já está configurada com CORS habilitado
3. **Ordenação:** Para votos de jogos, a ordem do array `escolhas` representa a preferência (1º, 2º, 3º)
4. **Validação:** Valide no frontend antes de enviar para melhor UX
5. **Loading States:** Mostre feedback visual durante as requisições
6. **Cache:** Considere cachear a lista de jogos/episódios para evitar requisições repetidas

---

## 🔗 Links Úteis

- **Swagger UI:** http://localhost:3000/api-docs (documentação interativa completa)
- **Endpoint raiz:** http://localhost:3000/ (informações básicas da API)
