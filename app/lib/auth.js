// File: lib/auth.js

import { verifyFirebaseIdToken } from "@/lib/firebase-admin.js";
import User from "@/models/user.js";
import connectDB from "@/lib/mongodb.js";

export async function authenticate(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No authorization token found");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyFirebaseIdToken(token);

    await connectDB(); // Ensure DB is connected

    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      user = await User.findOne({ email: decodedToken.email });
      if (user) {
        user.firebaseUid = decodedToken.uid;
        await user.save();
        console.log("🔄 Linked Firebase UID to existing email user:", user.email);
      }
    }

    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || "",
        avatar: decodedToken.picture || "",
        bio: "",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        interests: [],
        courses: [],
        matches: [],
        sessions: [],
        badges: ["🎉 Welcome"],
        points: 10,
        createdAt: new Date(),
      });
      console.log("🎉 New user created:", user.email);
    }

    return user;
  } catch (error) {
    console.error("❌ Firebase Token verification failed:", error.message);
    throw new Error("Authentication failed. Please check your credentials.");
  }
}
