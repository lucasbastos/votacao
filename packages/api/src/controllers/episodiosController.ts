import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';

export const getEpisodios = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDatabase();
    const episodiosCollection = db.collection('episodios_2025');
    
    const episodios = await episodiosCollection.find({}).toArray();
    
    res.status(200).json({
      success: true,
      count: episodios.length,
      data: episodios
    });
  } catch (error) {
    console.error('Erro ao buscar episódios:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar episódios',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
