import DailyLog from "../models/DailyLog";

import { z } from "zod";

export const dailyLogSchema = z.object({
  patient: z.string(),

  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),

  nutrition: z.object({
    kcal: z.number().min(0),
    carbs: z.number().min(0),
    protein: z.number().min(0),
    fat: z.number().min(0),
  }),

  hydration: z.object({
    mlConsumed: z.number().min(0),
    mlGoal: z.number().min(0),
  }),
});

function normalizeDate(date: Date) {
  return new Date(date.setHours(0, 0, 0, 0));
}

export class DailyLogService {
  async syncDay(data: unknown) {
    const validated = dailyLogSchema.parse(data);

    const date = normalizeDate(new Date(validated.date));

    return DailyLog.findOneAndUpdate(
      {
        patient: validated.patient,
        date: date,
      },
      {
        $set: {
          nutrition: validated.nutrition,
          hydration: validated.hydration,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }
}
