import { Router } from 'express';
import { getEpisodios } from '../controllers/episodiosController';

const router = Router();

/**
 * @swagger
 * /api/episodios:
 *   get:
 *     summary: Retorna a lista de todos os episódios
 *     description: Obtém todos os episódios do podcast 99Vidas da collection episodios_2025
 *     tags:
 *       - Episódios
 *     responses:
 *       200:
 *         description: Lista de episódios retornada com sucesso
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
 *                   description: Número de episódios retornados
 *                   example: 43
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID do episódio no MongoDB
 *                       title:
 *                         type: string
 *                         description: Título do episódio
 *                         example: 99Vidas 694 - Nintendo Switch
 *                       pubDate:
 *                         type: string
 *                         description: Data de publicação do episódio
 *                         example: Sat, 08 Nov 2025 20:30:08 GMT
 *       500:
 *         description: Erro ao buscar episódios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/episodios', getEpisodios);

export default router;
