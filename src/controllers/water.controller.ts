import { Request, Response } from 'express';
import { WaterService } from '../services/water.service';
import { logger } from '../utils/logger';

const waterService = new WaterService();

export class WaterController {
  async syncDay(req: Request, res: Response) {
    try {
      const result = await waterService.syncDay(req.body);

      logger.info(`💦 Dia ${result.date} sincronizado: ${result.cupsConsumed} copos`);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Erro ao sincronizar água:', error.message);
      res.status(400).json({ error: error.issues ?? error.message });
    }
  }
}