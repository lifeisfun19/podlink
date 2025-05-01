import { NextResponse } from "next/server";
import  connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';
import jwt from "jsonwebtoken";
import admin from '@/lib/firebase-admin.js'; // See note below

export async function POST(req) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ message: "ID token is missing." }, { status: 400 });
        }

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture } = decodedToken;

        await connectDB();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if doesn't exist
            user = new User({
                name: name || "Google User",
                email,
                avatar: picture,
                password: null, // Mark as Google-auth account
            });
            await user.save();
        }

        const token = jwt.sign(
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
            message: "Google Sign-In successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                interests: user.interests,
                location: user.location,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("❌ Google Sign-In Error:", error);
        return NextResponse.json(
            { message: "Google login failed", error: error.message },
            { status: 500 }
        );
    }
}
