import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Token não fornecido' });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      res.status(401).json({ error: 'Formato de token inválido' });
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({ error: 'Token mal formatado' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Token inválido' });
        return;
      }

      req.userId = (decoded as any).id;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Falha na autenticação' });
  }
}
