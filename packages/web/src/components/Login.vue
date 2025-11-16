<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login - Sistema de Votação</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Digite seu usuário"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { login } from '../services/api';

export default {
  name: 'Login',
  emits: ['login-success'],
  setup(props, { emit }) {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      errorMessage.value = '';
      loading.value = true;

      try {
        const response = await login(username.value, password.value);
        
        // Armazenar token no localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('username', response.user.username);
        
        emit('login-success');
      } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Erro ao fazer login';
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      loading,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
