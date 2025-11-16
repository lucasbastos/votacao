FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar build do estágio anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivos necessários
COPY --from=builder /app/*.json ./
COPY --from=builder /app/seed.js ./

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
