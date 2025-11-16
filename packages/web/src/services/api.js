// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Função auxiliar para obter headers com token
function getHeaders() {
  const token = localStorage.getItem('auth_token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Função de login
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw { response: { data: error } };
  }

  return await response.json();
}

// Função de logout
export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('username');
}

// Verificar se está autenticado
export function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

export const api = {
  // Jogos
  async getJogos() {
    try {
      const response = await fetch(`${API_BASE_URL}/jogos`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      return { success: false, message: 'Erro ao carregar jogos' };
    }
  },

  // Votos de Jogos
  async votarJogos(voterId, escolhas) {
    try {
      const response = await fetch(`${API_BASE_URL}/votos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ voterId, escolhas })
      });
      const result = await response.json();
      return { ...result, status: response.status };
    } catch (error) {
      console.error('Erro ao votar em jogos:', error);
      return { success: false, message: 'Erro ao registrar voto' };
    }
  },

  async verificarVotoJogos(voterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/votos/${voterId}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar voto de jogos:', error);
      return { success: false, jaVotou: false };
    }
  },

  // Episódios
  async getEpisodios() {
    try {
      const response = await fetch(`${API_BASE_URL}/episodios`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar episódios:', error);
      return { success: false, message: 'Erro ao carregar episódios' };
    }
  },

  // Votos de Episódios
  async votarEpisodio(voterId, escolha) {
    try {
      const response = await fetch(`${API_BASE_URL}/votos-episodios`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ voterId, escolha })
      });
      const result = await response.json();
      return { ...result, status: response.status };
    } catch (error) {
      console.error('Erro ao votar em episódio:', error);
      return { success: false, message: 'Erro ao registrar voto' };
    }
  },

  async verificarVotoEpisodio(voterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/votos-episodios/${voterId}`);
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar voto de episódio:', error);
      return { success: false, jaVotou: false };
    }
  }
};
