import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { VoteRequest, Vote } from '../types/vote';

export const registrarVoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { voterId, escolhas }: VoteRequest = req.body;

    // Validação dos dados recebidos
    if (!voterId || !escolhas) {
      res.status(400).json({
        success: false,
        message: 'voterId e escolhas são obrigatórios'
      });
      return;
    }

    if (!Array.isArray(escolhas) || escolhas.length !== 3) {
      res.status(400).json({
        success: false,
        message: 'escolhas deve ser um array com exatamente 3 jogos'
      });
      return;
    }

    // Verificar se todas as escolhas são válidas (não vazias)
    if (escolhas.some(escolha => !escolha || typeof escolha !== 'string')) {
      res.status(400).json({
        success: false,
        message: 'Todas as escolhas devem ser IDs válidos'
      });
      return;
    }

    const db = getDatabase();
    const votosCollection = db.collection('votos');

    // Verificar se o votante já votou
    const votoExistente = await votosCollection.findOne({ voterId });

    if (votoExistente) {
      res.status(409).json({
        success: false,
        message: 'Este votante já registrou seu voto. Não é permitido votar mais de uma vez.'
      });
      return;
    }

    // Criar o documento do voto
    const voto: Vote = {
      voterId,
      escolhas,
      dataVoto: new Date()
    };

    // Salvar o voto no banco
    const resultado = await votosCollection.insertOne(voto);

    res.status(201).json({
      success: true,
      message: 'Voto registrado com sucesso!',
      data: {
        id: resultado.insertedId,
        voterId: voto.voterId,
        escolhas: voto.escolhas,
        dataVoto: voto.dataVoto
      }
    });
  } catch (error) {
    console.error('Erro ao registrar voto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar voto',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const verificarVoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { voterId } = req.params;

    if (!voterId) {
      res.status(400).json({
        success: false,
        message: 'voterId é obrigatório'
      });
      return;
    }

    const db = getDatabase();
    const votosCollection = db.collection('votos');

    const voto = await votosCollection.findOne({ voterId });

    res.status(200).json({
      success: true,
      jaVotou: !!voto,
      data: voto ? {
        escolhas: voto.escolhas,
        dataVoto: voto.dataVoto
      } : null
    });
  } catch (error) {
    console.error('Erro ao verificar voto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar voto',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
