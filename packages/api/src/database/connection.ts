import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'votacao';

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Conectado ao MongoDB com sucesso!');
    
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('Conexão com MongoDB fechada');
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database não inicializado. Chame connectToDatabase() primeiro.');
  }
  return db;
}
