import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyLog extends Document {
  patient: mongoose.Types.ObjectId;
  date: Date;

  nutrition: {
    kcal: number;
    carbs: number;
    protein: number;
    fat: number;
  };

  hydration: {
    mlConsumed: number;
    mlGoal: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },

  date: { type: Date, required: true },

  nutrition: {
    kcal: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },

  hydration: {
    mlConsumed: { type: Number, default: 0 },
    mlGoal: { type: Number, default: 3250 },
  },

}, { timestamps: true });

DailyLogSchema.index({ patient: 1, date: 1 }, { unique: true });

export default mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);