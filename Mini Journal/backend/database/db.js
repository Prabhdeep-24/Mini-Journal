// database/db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error('❌ DB_URL environment variable is not set');
    process.exit(1);
  }
  console.log('Attempting to connect to:', dbUrl);
  try {
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
    });
    console.log(`✅ Connected to: ${conn.connection.name}`);
    // Monitor runtime connection status
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error during runtime:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB connection disconnected');
    });
    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;