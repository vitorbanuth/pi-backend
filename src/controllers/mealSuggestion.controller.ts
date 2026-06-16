import { Request, Response } from 'express';
import { MealSuggestionService } from '../services/mealSuggestion.service';

const service = new MealSuggestionService();

export class MealSuggestionController {
  async getAllForPatient(req: Request, res: Response) {
    try {
      const suggestions = await service.getAllForPatient(req.params.patientId as string);
      res.status(200).json(suggestions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async upsert(req: Request, res: Response) {
    try {
      const result = await service.upsert(
        req.params.patientId as string,
        req.params.mealType as string,
        req.body
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.issues ?? error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(
        req.params.patientId as string,
        req.params.mealType as string
      );
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
