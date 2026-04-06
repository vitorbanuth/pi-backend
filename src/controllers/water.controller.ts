import { Request, Response } from 'express';
import { WaterService } from '../services/water.service';
import { logger } from '../utils/logger';

const waterService = new WaterService();

export class WaterController {
  async logWater(req: Request, res: Response) {
    try {
      const waterLog = await waterService.logWater(req.body);
      logger.info(`💦 Água registrada: ${waterLog.amountMl}ml para o usuário ${waterLog.userId}`);
      res.status(201).json(waterLog);
    } catch (error: any) {
      logger.error('Erro ao registrar água:', error.message);
      res.status(400).json({ error: error.issues || error.message || 'Falha ao registrar água' });
    }
  }
}
