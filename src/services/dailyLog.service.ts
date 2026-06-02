import DailyLog from "../models/DailyLog";
import { Patient } from "../models/Patient";

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

    const log = await DailyLog.findOneAndUpdate(
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
        returnDocument: 'after',
      },
    );

    // 👉 ATUALIZA latestLog
    await Patient.findByIdAndUpdate(validated.patient, {
      latestLog: {
        nutrition: validated.nutrition,
        hydration: validated.hydration,
      },
    });

    return log;
  }

  async getLatestForPatient(patientId: string) {
    return DailyLog.findOne({ patient: patientId }).sort({ date: -1 });
  }

  async getAllForPatient(patientId: string) {
    return DailyLog.find({ patient: patientId }).sort({ date: -1 });
  }
}
