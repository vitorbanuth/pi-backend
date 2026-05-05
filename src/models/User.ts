import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  name?: string;
  password?: string;
  age?: number;
  weight?: number;
  goal?: string;
  status: 'Ativo' | 'Inativo';
  lastVisit?: string;
  compliance: number;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  waterGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true, sparse: true },
  name: { type: String },
  password: { type: String },
  age: { type: Number },
  weight: { type: Number },
  goal: { type: String },
  status: { type: String, enum: ['Ativo', 'Inativo'], default: 'Ativo' },
  lastVisit: { type: String },
  compliance: { type: Number, default: 0 },
  macroTargets: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  waterGoal: { type: Number, default: 2000 },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
