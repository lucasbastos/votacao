<template>
  <div id="app">
    <header class="app-header">
      <h1>🗳️ Sistema de Votação 99Vidas</h1>
      <p class="subtitulo">Vote nos seus jogos favoritos e no melhor episódio do podcast!</p>
    </header>
    
    <div class="voter-id-section" v-if="!voterIdConfirmado">
      <div class="voter-id-card">
        <h3>Identificação do Votante</h3>
        <p>Para votar, você precisa fornecer um identificador único:</p>
        <input 
          v-model="voterIdInput" 
          type="text" 
          placeholder="Digite seu e-mail ou ID único"
          class="voter-id-input"
          @keyup.enter="confirmarVoterId"
        />
        <button @click="confirmarVoterId" :disabled="!voterIdInput.trim()" class="btn-confirmar">
          Continuar
        </button>
        <p class="info-texto">
          💡 Este ID será usado para garantir que você vote apenas uma vez em cada categoria.
        </p>
      </div>
    </div>
    
    <div v-else class="conteudo-principal">
      <div class="usuario-info">
        <span>👤 Votante: <strong>{{ voterId }}</strong></span>
        <button @click="alterarVoterId" class="btn-alterar">Alterar ID</button>
      </div>
      
      <nav class="navegacao">
        <button 
          @click="secaoAtiva = 'jogos'" 
          :class="{ ativo: secaoAtiva === 'jogos' }"
          class="btn-nav"
        >
          🎮 Jogos
        </button>
        <button 
          @click="secaoAtiva = 'episodios'" 
          :class="{ ativo: secaoAtiva === 'episodios' }"
          class="btn-nav"
        >
          🎙️ Episódios
        </button>
      </nav>
      
      <main class="conteudo">
        <VotacaoJogos v-if="secaoAtiva === 'jogos'" :voterId="voterId" />
        <VotacaoEpisodios v-if="secaoAtiva === 'episodios'" :voterId="voterId" />
      </main>
    </div>
    
    <footer class="app-footer">
      <p>Sistema de Votação 99Vidas - {{ anoAtual }}</p>
      <p class="info-api">API: <a href="http://localhost:3000/api-docs" target="_blank">http://localhost:3000/api-docs</a></p>
    </footer>
  </div>
</template>

<script>
import VotacaoJogos from './components/VotacaoJogos.vue';
import VotacaoEpisodios from './components/VotacaoEpisodios.vue';

export default {
  name: 'App',
  
  components: {
    VotacaoJogos,
    VotacaoEpisodios
  },
  
  data() {
    return {
      voterId: '',
      voterIdInput: '',
      voterIdConfirmado: false,
      secaoAtiva: 'jogos'
    };
  },
  
  computed: {
    anoAtual() {
      return new Date().getFullYear();
    }
  },
  
  mounted() {
    // Tenta recuperar o voterId do localStorage
    const savedVoterId = localStorage.getItem('voterId');
    if (savedVoterId) {
      this.voterId = savedVoterId;
      this.voterIdConfirmado = true;
    }
  },
  
  methods: {
    confirmarVoterId() {
      const id = this.voterIdInput.trim();
      if (id) {
        this.voterId = id;
        this.voterIdConfirmado = true;
        localStorage.setItem('voterId', id);
      }
    },
    
    alterarVoterId() {
      if (confirm('Deseja alterar seu ID de votante? Isso pode afetar seus votos registrados.')) {
        this.voterIdConfirmado = false;
        this.voterIdInput = '';
        localStorage.removeItem('voterId');
      }
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.subtitulo {
  color: #666;
  font-size: 1.1em;
}

.voter-id-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.voter-id-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.voter-id-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.8em;
}

.voter-id-card p {
  color: #666;
  margin-bottom: 20px;
}

.voter-id-input {
  width: 100%;
  padding: 15px;
  font-size: 1em;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.voter-id-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-confirmar {
  width: 100%;
  padding: 15px;
  font-size: 1.1em;
  font-weight: bold;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-confirmar:hover:not(:disabled) {
  background: #5568d3;
}

.btn-confirmar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.info-texto {
  margin-top: 20px;
  font-size: 0.9em;
  color: #999;
  font-style: italic;
}

.conteudo-principal {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.usuario-info {
  background: rgba(255,255,255,0.95);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.usuario-info span {
  color: #2c3e50;
}

.btn-alterar {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-alterar:hover {
  background: #da190b;
}

.navegacao {
  background: rgba(255,255,255,0.95);
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn-nav {
  padding: 15px 40px;
  font-size: 1.1em;
  font-weight: bold;
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-nav:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.btn-nav.ativo {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.conteudo {
  flex: 1;
  background: rgba(255,255,255,0.95);
  padding: 20px;
  overflow-y: auto;
}

.app-footer {
  background: rgba(0,0,0,0.8);
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.app-footer p {
  margin: 5px 0;
}

.info-api a {
  color: #81d4fa;
  text-decoration: none;
}

.info-api a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.8em;
  }
  
  .navegacao {
    flex-direction: column;
  }
  
  .btn-nav {
    width: 100%;
  }
  
  .usuario-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
