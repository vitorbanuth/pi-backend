import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  age?: number;
  weight?: number;
  goal?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  goal: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
