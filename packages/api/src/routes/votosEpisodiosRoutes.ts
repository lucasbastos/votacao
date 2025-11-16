import { Router } from 'express';
import { registrarVotoEpisodio, verificarVotoEpisodio } from '../controllers/votosEpisodiosController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/votos-episodios:
 *   post:
 *     summary: Registra um voto para episódio
 *     description: Permite que um votante registre seu episódio favorito. Verifica se o votante já votou para impedir votos duplicados.
 *     tags:
 *       - Votos de Episódios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voterId
 *               - escolha
 *             properties:
 *               voterId:
 *                 type: string
 *                 description: ID único do votante
 *                 example: votante123
 *               escolha:
 *                 type: string
 *                 description: ID do episódio escolhido
 *                 example: episodio1
 *     responses:
 *       201:
 *         description: Voto registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Voto de episódio registrado com sucesso!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     voterId:
 *                       type: string
 *                     escolha:
 *                       type: string
 *                     dataVoto:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos (falta voterId ou escolha)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Votante já registrou seu voto anteriormente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Este votante já registrou seu voto para episódio. Não é permitido votar mais de uma vez.
 *       500:
 *         description: Erro ao registrar voto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/votos-episodios', authMiddleware, registrarVotoEpisodio);

/**
 * @swagger
 * /api/votos-episodios/{voterId}:
 *   get:
 *     summary: Verifica se um votante já votou em episódio
 *     description: Consulta se um determinado votante já registrou seu voto para episódio
 *     tags:
 *       - Votos de Episódios
 *     parameters:
 *       - in: path
 *         name: voterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do votante
 *         example: votante123
 *     responses:
 *       200:
 *         description: Informação sobre o voto do votante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jaVotou:
 *                   type: boolean
 *                   description: Indica se o votante já votou
 *                   example: true
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     escolha:
 *                       type: string
 *                     dataVoto:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: voterId não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao verificar voto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/votos-episodios/:voterId', verificarVotoEpisodio);

export default router;
