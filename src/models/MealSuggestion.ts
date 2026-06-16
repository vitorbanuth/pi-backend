import mongoose, { Schema, Document } from 'mongoose';

export const MEAL_TYPES = [
  'breakfast',
  'morningSnack',
  'lunch',
  'afternoonSnack',
  'dinner',
  'supper',
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast:     'Café da manhã',
  morningSnack:  'Lanche da manhã',
  lunch:         'Almoço',
  afternoonSnack:'Lanche da tarde',
  dinner:        'Jantar',
  supper:        'Ceia',
};

export interface ISuggestionFood {
  name: string;
  quantityG: number; // gramas da porção sugerida
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface IMealSuggestion extends Document {
  patient: mongoose.Types.ObjectId;
  mealType: MealType;
  foods: ISuggestionFood[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionFoodSchema = new Schema<ISuggestionFood>(
  {
    name:      { type: String, required: true },
    quantityG: { type: Number, required: true, min: 1 },
    kcal:      { type: Number, default: 0 },
    carbs:     { type: Number, default: 0 },
    protein:   { type: Number, default: 0 },
    fat:       { type: Number, default: 0 },
  },
  { _id: false }
);

const MealSuggestionSchema = new Schema<IMealSuggestion>(
  {
    patient:  { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    mealType: { type: String, enum: MEAL_TYPES, required: true },
    foods:    { type: [SuggestionFoodSchema], default: [] },
    notes:    { type: String, default: '' },
  },
  { timestamps: true }
);

// Um registro por paciente por tipo de refeição
MealSuggestionSchema.index({ patient: 1, mealType: 1 }, { unique: true });

export default mongoose.model<IMealSuggestion>('MealSuggestion', MealSuggestionSchema);
