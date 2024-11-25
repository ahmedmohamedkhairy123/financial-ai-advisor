import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'financial-advisor';

if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 3;

export const connectDB = async (): Promise<void> => {
    if (isConnected) {
        console.log('✅ Using existing database connection');
        return;
    }

    try {
        console.log('🔗 Connecting to MongoDB Atlas...');

        const options = {
            dbName: DB_NAME,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(MONGODB_URI, options);

        isConnected = true;
        connectionAttempts = 0;

        console.log(`✅ MongoDB Atlas connected successfully to database: ${DB_NAME}`);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to DB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err.message);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from DB');
            isConnected = false;
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('⚠️ MongoDB connection closed due to app termination');
            process.exit(0);
        });

    } catch (error: any) {
        connectionAttempts++;
        console.error(`❌ MongoDB connection failed (attempt ${connectionAttempts}):`, error.message);

        if (connectionAttempts < MAX_RETRIES) {
            console.log(`🔄 Retrying connection in 3 seconds...`);
            setTimeout(connectDB, 3000);
        } else {
            console.error('❌ Max connection attempts reached. Exiting...');
            process.exit(1);
        }
    }
};

export const disconnectDB = async (): Promise<void> => {
    if (!isConnected) return;

    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB disconnected');
};

export const getConnectionStatus = (): boolean => isConnected;