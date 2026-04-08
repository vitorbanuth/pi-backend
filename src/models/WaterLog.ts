import mongoose, { Schema, Document } from 'mongoose';

export interface IWaterLog extends Document {
  userId: mongoose.Types.ObjectId;
  amountMl: number;
  loggedAt: Date;
  createdAt: Date;
}

const WaterLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amountMl: { type: Number, required: true },
  loggedAt: { type: Date, default: Date.now }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IWaterLog>('WaterLog', WaterLogSchema);
