import connectDB from "@/lib/mongodb.js";
import User from "@/models/user.js";
import bcrypt from "bcryptjs";
import { verifyFirebaseIdToken } from "@/lib/firebase-admin.js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, interests = [], firebaseUid: bodyUid } = body;

    if (!name || !email || (!password && !bodyUid)) {
      return new Response(
          JSON.stringify({ message: "Name, email, and either a password or Firebase UID are required." }),
          { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), { status: 409 });
    }

    let firebaseUid = bodyUid;
    if (!firebaseUid) {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split("Bearer ")[1];
      if (token) {
        try {
          const decoded = await verifyFirebaseIdToken(token);
          firebaseUid = decoded.uid;
        } catch (err) {
          console.warn("Firebase token verification failed:", err.message);
        }
      }
    }

    if (!firebaseUid) {
      firebaseUid = `manual-${Date.now()}`;
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      firebaseUid,
      interests,
      location: { type: "Point", coordinates: [0, 0] },
      avatar: "",
      bio: "",
      courses: [],
      badges: [],
      points: 0,
    });

    await newUser.save();

    return new Response(
        JSON.stringify({
          message: "Signup successful",
          user: { name: newUser.name, email: newUser.email, firebaseUid: newUser.firebaseUid },
        }),
        { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ message: "Signup failed", error: error.message }), { status: 500 });
  }
}
