import WaterDaily from '../models/WaterDaily';
import { z } from 'zod';

const waterDailySchema = z.object({
  userId:         z.string(),
  date:           z.string(),           // '2026-04-23'
  cupsConsumed:   z.number().int().min(0),
  cupsGoal:       z.number().int().min(1),
  litersConsumed: z.number().min(0),
  litersGoal:     z.number().min(0),
});

export class WaterService {
  async syncDay(data: unknown) {
    const validated = waterDailySchema.parse(data);

    // upsert — se já existe registro do dia, atualiza; senão cria
    return WaterDaily.findOneAndUpdate(
      { userId: validated.userId, date: validated.date },
      { $set: validated },
      { upsert: true, new: true }
    );
  }
}