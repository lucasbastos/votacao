<template>
  <div class="votacao-episodios">
    <h2>🎙️ Votação - Episódio Favorito do Podcast 99Vidas</h2>
    
    <div v-if="loading" class="loading">
      <p>Carregando episódios...</p>
    </div>
    
    <div v-else-if="jaVotou" class="ja-votou">
      <h3>✅ Você já votou!</h3>
      <p>Obrigado pela sua participação.</p>
      <div v-if="votoDetalhes" class="detalhes-voto">
        <p><strong>Seu voto:</strong></p>
        <p class="episodio-votado">{{ getEpisodioTitulo(votoDetalhes.escolha) }}</p>
        <p class="data-voto">Votado em: {{ formatarData(votoDetalhes.dataVoto) }}</p>
      </div>
    </div>
    
    <div v-else>
      <p class="instrucoes">Selecione <strong>1 episódio favorito</strong> do podcast 99Vidas:</p>
      
      <div class="filtro">
        <input 
          v-model="filtro" 
          type="text" 
          placeholder="🔍 Buscar episódio..."
          class="input-filtro"
        />
      </div>
      
      <div class="lista-episodios">
        <div 
          v-for="episodio in episodiosFiltrados" 
          :key="episodio._id" 
          class="episodio-item"
          :class="{ selecionado: escolha === episodio._id }"
        >
          <label>
            <input 
              type="radio" 
              :value="episodio._id" 
              v-model="escolha"
            />
            <div class="episodio-info">
              <span class="episodio-titulo">{{ episodio.title }}</span>
              <span class="episodio-data">{{ formatarData(episodio.pubDate) }}</span>
            </div>
          </label>
        </div>
      </div>
      
      <div v-if="episodiosFiltrados.length === 0" class="sem-resultados">
        Nenhum episódio encontrado com o termo "{{ filtro }}"
      </div>
      
      <div class="acoes">
        <button 
          @click="enviarVoto" 
          :disabled="!escolha || enviando"
          class="btn-votar"
        >
          {{ enviando ? 'Enviando...' : 'Confirmar Voto' }}
        </button>
        <button 
          @click="limparEscolha" 
          :disabled="!escolha"
          class="btn-limpar"
        >
          Limpar Seleção
        </button>
      </div>
      
      <div v-if="erro" class="mensagem-erro">
        {{ erro }}
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../services/api';

export default {
  name: 'VotacaoEpisodios',
  
  props: {
    voterId: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      episodios: [],
      escolha: null,
      filtro: '',
      jaVotou: false,
      votoDetalhes: null,
      loading: true,
      enviando: false,
      erro: null
    };
  },
  
  computed: {
    episodiosFiltrados() {
      if (!this.filtro) {
        return this.episodios;
      }
      
      const termoLower = this.filtro.toLowerCase();
      return this.episodios.filter(ep => 
        ep.title.toLowerCase().includes(termoLower)
      );
    }
  },
  
  async mounted() {
    await this.carregarEpisodios();
    await this.verificarVoto();
  },
  
  methods: {
    async carregarEpisodios() {
      this.loading = true;
      this.erro = null;
      
      const result = await api.getEpisodios();
      
      if (result.success) {
        this.episodios = result.data;
      } else {
        this.erro = 'Erro ao carregar episódios. Tente novamente.';
      }
      
      this.loading = false;
    },
    
    async verificarVoto() {
      const result = await api.verificarVotoEpisodio(this.voterId);
      
      if (result.success) {
        this.jaVotou = result.jaVotou;
        if (result.jaVotou && result.data) {
          this.votoDetalhes = result.data;
        }
      }
    },
    
    async enviarVoto() {
      if (!this.escolha) {
        this.erro = 'Selecione um episódio';
        return;
      }
      
      this.enviando = true;
      this.erro = null;
      
      const result = await api.votarEpisodio(this.voterId, this.escolha);
      
      if (result.status === 409) {
        this.erro = 'Você já votou! Não é permitido votar mais de uma vez.';
        this.jaVotou = true;
      } else if (result.success) {
        alert('✅ Voto registrado com sucesso!');
        this.jaVotou = true;
        this.votoDetalhes = result.data;
      } else {
        this.erro = result.message || 'Erro ao registrar voto. Tente novamente.';
      }
      
      this.enviando = false;
    },
    
    limparEscolha() {
      this.escolha = null;
      this.erro = null;
    },
    
    getEpisodioTitulo(episodioId) {
      const episodio = this.episodios.find(ep => ep._id === episodioId);
      return episodio ? episodio.title : 'Episódio não encontrado';
    },
    
    formatarData(dataString) {
      if (!dataString) return '';
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    }
  }
};
</script>

<style scoped>
.votacao-episodios {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.ja-votou {
  text-align: center;
  padding: 40px;
  background: #e8f5e9;
  border-radius: 8px;
  border: 2px solid #4caf50;
}

.ja-votou h3 {
  color: #2e7d32;
  margin-bottom: 10px;
}

.detalhes-voto {
  margin-top: 20px;
}

.episodio-votado {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  font-weight: 600;
  color: #2c3e50;
}

.data-voto {
  margin-top: 15px;
  font-size: 0.9em;
  color: #666;
}

.instrucoes {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
  margin-bottom: 20px;
}

.filtro {
  margin-bottom: 20px;
}

.input-filtro {
  width: 100%;
  padding: 12px;
  font-size: 1em;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-filtro:focus {
  outline: none;
  border-color: #2196f3;
}

.lista-episodios {
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
}

.episodio-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: all 0.3s ease;
}

.episodio-item:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.episodio-item.selecionado {
  background: #e3f2fd;
  border-color: #2196f3;
}

.episodio-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.episodio-item input[type="radio"] {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.episodio-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.episodio-titulo {
  font-weight: 600;
  font-size: 1em;
  color: #2c3e50;
  margin-bottom: 5px;
}

.episodio-data {
  color: #666;
  font-size: 0.85em;
}

.sem-resultados {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

.acoes {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.btn-votar,
.btn-limpar {
  padding: 12px 30px;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-votar {
  background: #4caf50;
  color: white;
}

.btn-votar:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-votar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-limpar {
  background: #f44336;
  color: white;
}

.btn-limpar:hover:not(:disabled) {
  background: #da190b;
}

.btn-limpar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.mensagem-erro {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #f44336;
  margin-top: 20px;
  text-align: center;
}
</style>
