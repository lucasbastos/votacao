# Sistema de Votação 99Vidas - Frontend

Aplicação Vue.js para votação de jogos e episódios do podcast 99Vidas.

## 🚀 Tecnologias

- Vue 3
- Vite
- Fetch API

## 📋 Pré-requisitos

- Node.js 16+ instalado
- API backend rodando em `http://localhost:3000`

## 🔧 Instalação

```bash
# Instalar dependências
npm install
```

## ▶️ Executar o projeto

```bash
# Modo desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🏗️ Build para produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
votacao-front/
├── src/
│   ├── components/
│   │   ├── VotacaoJogos.vue      # Componente de votação de jogos
│   │   └── VotacaoEpisodios.vue  # Componente de votação de episódios
│   ├── services/
│   │   └── api.js                # Serviço de comunicação com a API
│   ├── App.vue                   # Componente principal
│   └── main.js                   # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🎮 Funcionalidades

### Votação de Jogos
- Listagem de todos os jogos disponíveis
- Seleção de exatamente 3 jogos em ordem de preferência
- Validação de voto único por votante
- Exibição de votos já registrados

### Votação de Episódios
- Listagem de episódios do podcast 99Vidas
- Busca/filtro de episódios
- Seleção de 1 episódio favorito
- Validação de voto único por votante
- Exibição de voto já registrado

## 🔗 API

A aplicação se comunica com a API backend em `http://localhost:3000/api`

Endpoints utilizados:
- `GET /api/jogos` - Lista jogos
- `POST /api/votos` - Registra voto de jogos
- `GET /api/votos/:voterId` - Verifica voto de jogos
- `GET /api/episodios` - Lista episódios
- `POST /api/votos-episodios` - Registra voto de episódio
- `GET /api/votos-episodios/:voterId` - Verifica voto de episódio

## 👤 Sistema de Identificação

O sistema utiliza um `voterId` único armazenado no localStorage para identificar cada votante e garantir que cada pessoa vote apenas uma vez em cada categoria.

## 📱 Responsividade

A interface é totalmente responsiva e adaptada para dispositivos móveis.

## 🎨 Características da Interface

- Design moderno e intuitivo
- Feedback visual para ações do usuário
- Validações em tempo real
- Mensagens de erro e sucesso claras
- Animações suaves
- Tema com gradiente roxo

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
