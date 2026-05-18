import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);

      logger.info(`✅ Novo usuário registrado: ${result.user.email}`);

      res.status(201).json(result);
    } catch (error: any) {
      logger.error('Erro ao registrar usuário:', error.message);

      res.status(400).json({
        error: error.issues ?? error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      logger.info(`🔑 Login realizado: ${result.user.username}`);

      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Erro ao fazer login:', error.message);

      // Retorna 401 para credenciais inválidas, 400 para erros de validação
      const statusCode = error.message === 'Credenciais inválidas.' ? 401 : 400;

      res.status(statusCode).json({
        error: error.issues ?? error.message,
      });
    }
  }
}
