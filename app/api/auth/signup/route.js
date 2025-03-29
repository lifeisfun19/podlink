import { connectDB } from "../../../lib/mongodb"; // Ensure correct import
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // ✅ Connect to MongoDB FIRST
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Read and log incoming request data
    const body = await req.json();
    console.log("📥 Received Data:", body);

    const { name, email, password, interests, location } = body;

    // Check for missing fields
    if (!name || !email || !password || !interests || !location) {
      console.log("❌ Missing required fields");
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.email);
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔒 Hashed Password:", hashedPassword);

    // Create new user with matching fields
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      interests, // ⬅️ Added for matching
      location  // ⬅️ Added for location-based matching
    });

    await newUser.save();

    console.log("✅ New user created:", newUser);
    return new Response(
      JSON.stringify({ message: "User signup successful!", data: { name, email, interests, location } }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return new Response(
      JSON.stringify({ message: "Signup failed", error: error.message }),
      { status: 500 }
    );
  }
}
