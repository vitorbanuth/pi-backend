import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { FoodLogService } from '../services/foodLog.service';

const foodLogService = new FoodLogService();

export class FoodLogController {
  async syncEntries(req: Request, res: Response) {
    try {
      const inserted = await foodLogService.syncEntries(req.body);

      logger.info(`🍽️  ${inserted.length} alimento(s) sincronizado(s) para userId: ${req.body.userId}`);

      res.status(201).json(inserted);
    } catch (error: any) {
      logger.error('Erro ao sincronizar alimentações:', error.message);

      res.status(400).json({
        error: error.issues ?? error.message,
      });
    }
  }

  async getEntries(req: Request, res: Response) {
    try {
      const { userId, date } = req.query as { userId: string; date?: string };

      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' });
      }

      const entries = await foodLogService.getEntriesForUser(userId, date);
      res.status(200).json(entries);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
