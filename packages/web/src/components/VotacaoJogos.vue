<template>
  <div class="votacao-jogos">
    <h2>🎮 Votação - Melhores Jogos</h2>
    
    <div v-if="loading" class="loading">
      <p>Carregando jogos...</p>
    </div>
    
    <div v-else-if="jaVotou" class="ja-votou">
      <h3>✅ Você já votou!</h3>
      <p>Obrigado pela sua participação.</p>
      <div v-if="votoDetalhes" class="detalhes-voto">
        <p><strong>Seus votos:</strong></p>
        <ol>
          <li v-for="(escolhaId, index) in votoDetalhes.escolhas" :key="index">
            {{ getJogoTitulo(escolhaId) }}
          </li>
        </ol>
        <p class="data-voto">Votado em: {{ formatarData(votoDetalhes.dataVoto) }}</p>
      </div>
    </div>
    
    <div v-else>
      <p class="instrucoes">Selecione exatamente <strong>3 jogos</strong> em ordem de preferência (1º, 2º e 3º lugar):</p>
      
      <div class="contador-escolhas">
        <span :class="{ completo: escolhas.length === 3 }">
          {{ escolhas.length }}/3 jogos selecionados
        </span>
      </div>
      
      <div v-if="jogos.length === 0 && !loading" class="sem-jogos">
        <p>Nenhum jogo disponível para votação.</p>
        <button @click="carregarJogos" class="btn-recarregar">Tentar novamente</button>
      </div>
      
      <div v-else class="lista-jogos">
        <div 
          v-for="jogo in jogos" 
          :key="jogo._id" 
          class="jogo-item"
          :class="{ 
            selecionado: escolhas.includes(jogo._id),
            desabilitado: escolhas.length >= 3 && !escolhas.includes(jogo._id)
          }"
        >
          <label>
            <input 
              type="checkbox" 
              :value="jogo._id" 
              v-model="escolhas"
              :disabled="escolhas.length >= 3 && !escolhas.includes(jogo._id)"
            />
            <div class="jogo-info">
              <span class="jogo-titulo">{{ jogo.titulo || jogo.title || 'Sem título' }}</span>
              <span v-if="escolhas.includes(jogo._id)" class="posicao-badge">
                {{ escolhas.indexOf(jogo._id) + 1 }}º lugar
              </span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="acoes">
        <button 
          @click="enviarVoto" 
          :disabled="escolhas.length !== 3 || enviando"
          class="btn-votar"
        >
          {{ enviando ? 'Enviando...' : 'Confirmar Voto' }}
        </button>
        <button 
          @click="limparEscolhas" 
          :disabled="escolhas.length === 0"
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
  name: 'VotacaoJogos',
  
  props: {
    voterId: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      jogos: [],
      escolhas: [],
      jaVotou: false,
      votoDetalhes: null,
      loading: true,
      enviando: false,
      erro: null
    };
  },
  
  async mounted() {
    await this.carregarJogos();
    await this.verificarVoto();
  },
  
  methods: {
    async carregarJogos() {
      this.loading = true;
      this.erro = null;
      
      const result = await api.getJogos();
      
      console.log('Resposta da API:', result);
      
      if (result.success) {
        this.jogos = result.data;
        console.log('Jogos carregados:', this.jogos);
        if (this.jogos.length === 0) {
          this.erro = 'Nenhum jogo disponível para votação no momento.';
        }
      } else {
        this.erro = 'Erro ao carregar jogos. Tente novamente.';
      }
      
      this.loading = false;
    },
    
    async verificarVoto() {
      const result = await api.verificarVotoJogos(this.voterId);
      
      if (result.success) {
        this.jaVotou = result.jaVotou;
        if (result.jaVotou && result.data) {
          this.votoDetalhes = result.data;
        }
      }
    },
    
    async enviarVoto() {
      if (this.escolhas.length !== 3) {
        this.erro = 'Selecione exatamente 3 jogos';
        return;
      }
      
      this.enviando = true;
      this.erro = null;
      
      const result = await api.votarJogos(this.voterId, this.escolhas);
      
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
    
    limparEscolhas() {
      this.escolhas = [];
      this.erro = null;
    },
    
    getJogoTitulo(jogoId) {
      const jogo = this.jogos.find(j => j._id === jogoId);
      return jogo ? (jogo.titulo || jogo.title || 'Jogo não encontrado') : 'Jogo não encontrado';
    },
    
    formatarData(dataString) {
      if (!dataString) return '';
      const data = new Date(dataString);
      return data.toLocaleString('pt-BR');
    }
  }
};
</script>

<style scoped>
.votacao-jogos {
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
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.detalhes-voto ol {
  background: white;
  padding: 20px 20px 20px 40px;
  border-radius: 4px;
}

.detalhes-voto li {
  margin: 10px 0;
  font-weight: 500;
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

.contador-escolhas {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2em;
  font-weight: bold;
}

.contador-escolhas .completo {
  color: #4caf50;
}

.lista-jogos {
  margin-bottom: 20px;
}

.jogo-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: all 0.3s ease;
}

.jogo-item:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.jogo-item.selecionado {
  background: #e3f2fd;
  border-color: #2196f3;
}

.jogo-item.desabilitado {
  opacity: 0.5;
  cursor: not-allowed;
}

.jogo-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.jogo-item input[type="checkbox"] {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.jogo-item input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.jogo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.jogo-titulo {
  font-weight: 600;
  font-size: 1.1em;
  color: #2c3e50;
  margin-bottom: 5px;
}

.jogo-plataforma {
  color: #666;
  font-size: 0.9em;
}

.posicao-badge {
  display: inline-block;
  background: #2196f3;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: bold;
  margin-top: 8px;
  width: fit-content;
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

.sem-jogos {
  text-align: center;
  padding: 40px;
  background: #fff3cd;
  border-radius: 8px;
  border: 2px solid #ffc107;
}

.sem-jogos p {
  color: #856404;
  margin-bottom: 20px;
  font-size: 1.1em;
}

.btn-recarregar {
  padding: 12px 30px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-recarregar:hover {
  background: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>
