import { z } from 'zod';
import mongoose from 'mongoose';
import MealSuggestion, { MEAL_TYPES } from '../models/MealSuggestion';

const foodSchema = z.object({
  name:      z.string().min(1),
  quantityG: z.number().positive(),
  kcal:      z.number().min(0),
  carbs:     z.number().min(0),
  protein:   z.number().min(0),
  fat:       z.number().min(0),
});

const upsertSchema = z.object({
  foods: z.array(foodSchema),
  notes: z.string().optional(),
});

function validatePatientId(patientId: string) {
  if (!mongoose.isValidObjectId(patientId)) {
    throw new Error('patientId inválido.');
  }
}

function validateMealType(mealType: string) {
  if (!(MEAL_TYPES as readonly string[]).includes(mealType)) {
    throw new Error(`mealType inválido. Use: ${MEAL_TYPES.join(', ')}`);
  }
}

export class MealSuggestionService {
  /** Retorna todas as sugestões de um paciente (até 6, uma por tipo) */
  async getAllForPatient(patientId: string) {
    validatePatientId(patientId);
    return MealSuggestion.find({ patient: patientId }).sort({ mealType: 1 });
  }

  /** Cria ou substitui a sugestão de um tipo de refeição para um paciente */
  async upsert(patientId: string, mealType: string, data: unknown) {
    validatePatientId(patientId);
    validateMealType(mealType);
    const validated = upsertSchema.parse(data);

    return MealSuggestion.findOneAndUpdate(
      { patient: patientId, mealType },
      { $set: { foods: validated.foods, notes: validated.notes ?? '' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  /** Remove a sugestão de um tipo de refeição */
  async delete(patientId: string, mealType: string) {
    validatePatientId(patientId);
    validateMealType(mealType);
    await MealSuggestion.deleteOne({ patient: patientId, mealType });
  }
}
