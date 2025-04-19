// lib/mongodb.js
import mongoose from 'mongoose';

// Global cache to prevent multiple connections in development
let cached = global.mongoose || { conn: null, promise: null };

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("❌ Please define the MONGODB_URI environment variable in your .env file");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
            socketTimeoutMS: 30000,          // 30 seconds socket timeout
        })
            .then((mongooseInstance) => {
                console.log("✅ Connected to MongoDB Atlas Cluster");
                return mongooseInstance;
            })
            .catch((err) => {
                console.error("🔥 MongoDB connection error:", err);
                throw new Error('MongoDB connection failed: ' + err.message);
            });
    }

    cached.conn = await cached.promise;
    global.mongoose = cached;
    return cached.conn;
};

export default connectDB;
