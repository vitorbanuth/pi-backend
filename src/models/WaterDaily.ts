import mongoose, { Schema, Document } from 'mongoose';

export interface IWaterDaily extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;           // '2026-04-23' — chave do dia
  cupsConsumed: number;
  cupsGoal: number;
  litersConsumed: number;
  litersGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

const WaterDailySchema: Schema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date:          { type: String, required: true },   // '2026-04-23'
  cupsConsumed:  { type: Number, required: true },
  cupsGoal:      { type: Number, required: true },
  litersConsumed:{ type: Number, required: true },
  litersGoal:    { type: Number, required: true },
}, { timestamps: true });

// Garante que um usuário tem só um registro por dia
WaterDailySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IWaterDaily>('WaterDaily', WaterDailySchema);