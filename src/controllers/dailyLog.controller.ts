import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { DailyLogService } from '../services/dailyLog.service';

const dailyLogService = new DailyLogService();

export class DailyLogController {
  async syncDay(req: Request, res: Response) {
    try {
      const result = await dailyLogService.syncDay(req.body);

      logger.info(
        `📊 Log ${result.date.toISOString()} sincronizado (kcal: ${result.nutrition.kcal})`
      );

      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Erro ao sincronizar daily log:', error.message);

      res.status(400).json({
        error: error.issues ?? error.message,
      });
    }
  }
}