import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USER_LOGIN = process.env.USER_LOGIN || 'admin';
const USER_PASSWORD_HASH = process.env.USER_PASSWORD_HASH || '';
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
      return;
    }

    if (username !== USER_LOGIN) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, USER_PASSWORD_HASH);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: username, username: USER_LOGIN },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username: USER_LOGIN
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}
