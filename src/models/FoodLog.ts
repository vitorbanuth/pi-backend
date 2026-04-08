import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl?: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  consumedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FoodLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
  consumedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IFoodLog>('FoodLog', FoodLogSchema);
