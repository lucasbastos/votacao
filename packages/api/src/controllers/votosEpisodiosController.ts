import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { EpisodeVoteRequest, EpisodeVote } from '../types/episodeVote';

export const registrarVotoEpisodio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { voterId, escolha }: EpisodeVoteRequest = req.body;

    // Validação dos dados recebidos
    if (!voterId || !escolha) {
      res.status(400).json({
        success: false,
        message: 'voterId e escolha são obrigatórios'
      });
      return;
    }

    if (typeof escolha !== 'string' || !escolha.trim()) {
      res.status(400).json({
        success: false,
        message: 'escolha deve ser um ID válido do episódio'
      });
      return;
    }

    const db = getDatabase();
    const votosEpisodiosCollection = db.collection('votos_episodios');

    // Verificar se o votante já votou
    const votoExistente = await votosEpisodiosCollection.findOne({ voterId });

    if (votoExistente) {
      res.status(409).json({
        success: false,
        message: 'Este votante já registrou seu voto para episódio. Não é permitido votar mais de uma vez.'
      });
      return;
    }

    // Criar o documento do voto
    const voto: EpisodeVote = {
      voterId,
      escolha: escolha.trim(),
      dataVoto: new Date()
    };

    // Salvar o voto no banco
    const resultado = await votosEpisodiosCollection.insertOne(voto);

    res.status(201).json({
      success: true,
      message: 'Voto de episódio registrado com sucesso!',
      data: {
        id: resultado.insertedId,
        voterId: voto.voterId,
        escolha: voto.escolha,
        dataVoto: voto.dataVoto
      }
    });
  } catch (error) {
    console.error('Erro ao registrar voto de episódio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar voto de episódio',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};

export const verificarVotoEpisodio = async (req: Request, res: Response): Promise<void> => {
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
    const votosEpisodiosCollection = db.collection('votos_episodios');

    const voto = await votosEpisodiosCollection.findOne({ voterId });

    res.status(200).json({
      success: true,
      jaVotou: !!voto,
      data: voto ? {
        escolha: voto.escolha,
        dataVoto: voto.dataVoto
      } : null
    });
  } catch (error) {
    console.error('Erro ao verificar voto de episódio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar voto de episódio',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
