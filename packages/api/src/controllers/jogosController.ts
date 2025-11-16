import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';

export const getJogos = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDatabase();
    const jogosCollection = db.collection('jogos_2025');
    
    const jogos = await jogosCollection.find({}).toArray();
    
    res.status(200).json({
      success: true,
      count: jogos.length,
      data: jogos
    });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar jogos',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
