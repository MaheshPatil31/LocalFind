import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, { dbName: env.mongoDbName, serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
  }
}
