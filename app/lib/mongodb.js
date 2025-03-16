import mongoose from "mongoose";

let isConnected = false; // Avoid multiple connections

export async function connectDB() {
  if (isConnected) {
    console.log("⚡ Using existing database connection");
    return;
  }

  try {
    const uri = process.env.MONGO_URI; // Make sure MONGO_URI is correctly set
    if (!uri) throw new Error("MONGO_URI is missing in environment variables");

    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = connection.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error(error.message);
  }
}
