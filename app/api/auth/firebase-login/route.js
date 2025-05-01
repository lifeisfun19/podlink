
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb.js";
import User from "@/models/user.js";
import admin from "@/lib/firebase-admin";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { token, password, email, signupMethod } = await req.json();

        // Validate token and password (for email/password signup only)
        if (!token && signupMethod === 'email' && (!password || password.trim() === "")) {
            return NextResponse.json({ error: "Password is required for email sign-up." }, { status: 400 });
        }

        if (!token && signupMethod !== 'email') {
            return NextResponse.json({ error: "Token is required for Google sign-up." }, { status: 400 });
        }

        await connectDB();

        let user;

        // Handle signup with Google (Firebase Auth)
        if (signupMethod === 'google' && token) {
            const decoded = await admin.auth().verifyIdToken(token).catch((error) => {
                console.error("❌ Error verifying Firebase ID token:", error.message);
                return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
            });

            const { uid, email, name, picture } = decoded;

            // Check if user exists
            user = await User.findOne({ firebaseUid: uid });

            if (!user) {
                user = await User.create({
                    firebaseUid: uid,
                    email,
                    name: name || "Unknown User",
                    avatar: picture || "default-avatar.jpg",
                    location: { type: "Point", coordinates: [0, 0] },
                    interests: [],
                    courses: [],
                    badges: [],
                    points: 0,
                    matches: [],
                    sessions: [],
                    participatedStudyHalls: [],
                    hostedStudyHalls: [],
                });
            }

        } else if (signupMethod === 'email' && password) {
            // Handle email sign up with password validation
            user = await User.findOne({ email });

            if (!user) {
                return NextResponse.json({ error: "User does not exist." }, { status: 404 });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return NextResponse.json({ error: "Invalid password." }, { status: 401 });
            }

        } else {
            return NextResponse.json({ error: "Invalid signup method." }, { status: 400 });
        }

        // Issue a JWT for authentication
        const appToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                interests: user.interests,
                location: user.location,
            },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Signup successful",
            token: appToken,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                interests: user.interests,
                location: user.location,
            },
        });
    } catch (error) {
        console.error("❌ Signup failed:", error.message);
        return NextResponse.json({ error: "Signup failed" }, { status: 500 });
    }
}
