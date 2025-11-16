import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectToDatabase, closeDatabaseConnection } from './database/connection';
import jogosRoutes from './routes/jogosRoutes';
import votosRoutes from './routes/votosRoutes';
import episodiosRoutes from './routes/episodiosRoutes';
import votosEpisodiosRoutes from './routes/votosEpisodiosRoutes';
import authRoutes from './routes/authRoutes';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API de Votação de Jogos 2025',
    documentation: '/api-docs'
  });
});

app.use('/api', jogosRoutes);
app.use('/api', votosRoutes);
app.use('/api', episodiosRoutes);
app.use('/api', votosEpisodiosRoutes);
app.use('/api/auth', authRoutes);

// Inicializar servidor
const startServer = async () => {
  try {
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nEncerrando servidor...');
  await closeDatabaseConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nEncerrando servidor...');
  await closeDatabaseConnection();
  process.exit(0);
});

startServer();
