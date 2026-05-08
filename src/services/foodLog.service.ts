import { z } from 'zod';
import FoodLog from '../models/FoodLog';

// ─── Schema de validação ──────────────────────────────────────────────────────

const foodEntrySchema = z.object({
  name: z.string().min(1, 'Nome do alimento é obrigatório'),
  calories: z.number().min(0),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  imageUrl: z.string().url().optional(),
  consumedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de consumo inválida',
  }),
});

export const foodLogSyncSchema = z.object({
  userId: z.string().min(1, 'userId é obrigatório'),
  entries: z.array(foodEntrySchema).min(1, 'Envie ao menos um alimento'),
});

// ─── Service ─────────────────────────────────────────────────────────────────

export class FoodLogService {
  async syncEntries(data: unknown) {
    const validated = foodLogSyncSchema.parse(data);

    // Upsert por entrada: chave = userId + name + consumedAt
    // Mesmo comportamento do daily-log/sync — o app manda o estado atual e a gente atualiza
    const results = await Promise.all(
      validated.entries.map((entry) => {
        const consumedAt = new Date(entry.consumedAt);

        return FoodLog.findOneAndUpdate(
          {
            userId: validated.userId,
            name: entry.name,
            consumedAt,
          },
          {
            $set: {
              calories: entry.calories,
              protein: entry.protein,
              carbs: entry.carbs,
              fat: entry.fat,
              imageUrl: entry.imageUrl,
            },
          },
          { upsert: true, returnDocument: 'after' },
        );
      }),
    );

    return results;
  }

  async getEntriesForUser(userId: string, date?: string) {
    const query: any = { userId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.consumedAt = { $gte: start, $lte: end };
    }

    return FoodLog.find(query).sort({ consumedAt: -1 });
  }
}
