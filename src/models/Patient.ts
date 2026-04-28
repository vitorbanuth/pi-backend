import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age?: number;
  weight?: number;
  goal?: string;
  status?: string;
  lastVisit?: Date;
  compliance?: number;
  waterGoal?: number;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  latestLog?: {
    hydration?: {
      mlConsumed: number;
      mlGoal: number;
    };
    nutrition?: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },

    age: Number,
    weight: Number,
    goal: String,

    status: { type: String, default: 'Ativo' },
    lastVisit: Date,
    compliance: { type: Number, default: 0 },

    waterGoal: { type: Number, default: 2000 },

    macroTargets: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },

    latestLog: {
      hydration: {
        mlConsumed: { type: Number, default: 0 },
        mlGoal: { type: Number, default: 2000 },
      },
      nutrition: {
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);