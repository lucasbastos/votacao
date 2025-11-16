import { Router } from 'express';
import { registrarVoto, verificarVoto } from '../controllers/votosController';

const router = Router();

/**
 * @swagger
 * /api/votos:
 *   post:
 *     summary: Registra um novo voto
 *     description: Permite que um votante registre suas 3 escolhas ordenadas. Verifica se o votante já votou para impedir votos duplicados.
 *     tags:
 *       - Votos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VotoRequest'
 *     responses:
 *       201:
 *         description: Voto registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VotoResponse'
 *       400:
 *         description: Dados inválidos (falta voterId, escolhas não é array, ou não tem 3 elementos)
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
 *                   example: Este votante já registrou seu voto. Não é permitido votar mais de uma vez.
 *       500:
 *         description: Erro ao registrar voto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/votos', registrarVoto);

/**
 * @swagger
 * /api/votos/{voterId}:
 *   get:
 *     summary: Verifica se um votante já votou
 *     description: Consulta se um determinado votante já registrou seu voto
 *     tags:
 *       - Votos
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
 *                     escolhas:
 *                       type: array
 *                       items:
 *                         type: string
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
router.get('/votos/:voterId', verificarVoto);

export default router;
