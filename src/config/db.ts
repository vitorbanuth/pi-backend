import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL as string);
    logger.success(`📦 Connected to MongoDB via Mongoose: ${conn.connection.host}`);
  } catch (error) {
    logger.error('❌ Failed to connect to the database', error);
    process.exit(1);
  }
};
