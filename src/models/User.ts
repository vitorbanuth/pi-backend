import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email?: string;
  username?: string;
  password?: string;
  patientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true, sparse: true },
  username: { type: String },
  password: { type: String },
  patientId: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
