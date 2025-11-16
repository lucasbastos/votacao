// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api';

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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
