import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const data = process.env;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(data.DB_URL);
        console.log("Database Connected");
    }
    catch (error) {
        console.log("Database Connection Failed:", error.message);
    }
}

export default connectDB;