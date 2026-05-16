import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';



export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

    
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não informado',
      });
    }

    const [, token] = authHeader.split(' ');

    const decoded = jwt.verify(token, JWT_SECRET);


    (req as any).user = decoded;
    // req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: 'Token inválido',
    });
  }
}