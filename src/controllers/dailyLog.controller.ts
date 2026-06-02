import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { DailyLogService } from "../services/dailyLog.service";

const dailyLogService = new DailyLogService();

export class DailyLogController {
  async syncDay(req: Request, res: Response) {
    try {
      const patientId = (req as any).user?.patientId;

      if (!patientId) {
        return res.status(400).json({
          error: 'Usuário não está vinculado a um paciente. Vincule-o pelo painel web.',
        });
      }

      const result = await dailyLogService.syncDay({
        ...req.body,
        patient: patientId,
      });

      logger.info(
        `📊 Log ${result.date.toISOString()} sincronizado (kcal: ${result.nutrition.kcal})`,
      );

      res.status(200).json(result);
    } catch (error: any) {
      logger.error("Erro ao sincronizar daily log:", error.message);

      res.status(400).json({
        error: error.issues ?? error.message,
      });
    }
  }

  async getLatestForPatient(req: Request, res: Response) {
    try {
      const log = await dailyLogService.getLatestForPatient(
        req.params.id as string,
      );
      if (!log) {
        return res
          .status(404)
          .json({ error: "Nenhum registro encontrado para este paciente." });
      }
      res.status(200).json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getLogsForPatient(req: Request, res: Response) {
    try {
      const logs = await dailyLogService.getAllForPatient(req.params.patientId as string);
      res.status(200).json(logs);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
