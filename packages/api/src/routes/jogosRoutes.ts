import { Router } from 'express';
import { getJogos } from '../controllers/jogosController';

const router = Router();

/**
 * @swagger
 * /api/jogos:
 *   get:
 *     summary: Retorna a lista de todos os jogos
 *     description: Obtém todos os jogos disponíveis da collection jogos_2025
 *     tags:
 *       - Jogos
 *     responses:
 *       200:
 *         description: Lista de jogos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Número de jogos retornados
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Jogo'
 *       500:
 *         description: Erro ao buscar jogos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/jogos', getJogos);

export default router;
