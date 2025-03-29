import { connectDB } from "../../../lib/mongodb"; // Ensure correct import
import User from "../../../models/User";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Received Data:", body);

    const { email, password } = body;

    // Check if email or password is missing
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ✅ Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for:", email);
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging

    // Generate JWT Token with user details (including interests and location)
    const token = jwt.sign(
      { userId: user._id, email: user.email, interests: user.interests, location: user.location },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );
    
    console.log("✅ Login Successful:", email);

    return new Response(
      JSON.stringify({ 
        message: "Login successful!", 
        token, 
        user: { name: user.name, email: user.email, interests: user.interests, location: user.location }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Login failed", error: error.message }),
      { status: 500 }
    );
  }
}
