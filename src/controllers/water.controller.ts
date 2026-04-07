import { Request, Response } from 'express';
import { WaterService } from '../services/water.service';
import { logger } from '../utils/logger';
import { waterLogRequestSchema } from '../config/swagger';

const waterService = new WaterService();

export class WaterController {
  async logWater(req: Request, res: Response) {
    try {
      // 1. Valida o payload de entrada usando o schema do Zod
      const validatedData = waterLogRequestSchema.parse(req.body);

      // 2. Mapeia os dados (amount, date) para o formato que o Service/Banco esperam (amountMl, loggedAt)
      const payload = {
        userId: validatedData.userId,
        amountMl: validatedData.amount,
        loggedAt: new Date(validatedData.date).toISOString()
      };

      const waterLog = await waterService.logWater(payload);
      logger.info(`💦 Água registrada: ${waterLog.amountMl}ml para o usuário ${waterLog.userId}`);
      res.status(201).json({ amount: waterLog.amountMl });
    } catch (error: any) {
      logger.error('Erro ao registrar água:', error.message);
      res.status(400).json({ error: error.issues || error.message || 'Falha ao registrar água' });
    }
  }
}
