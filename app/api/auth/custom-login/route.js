import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ message: "Email and password are required." }),
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "No account found with this email." }),
                { status: 401 }
            );
        }

        // If the user does not have a password (Google sign-up)
        if (!user.password) {
            return new Response(
                JSON.stringify({
                    message:
                        "This account was created using Google Sign-In. Please use the 'Sign in with Google' button.",
                }),
                { status: 403 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Incorrect password. Please try again." }),
                { status: 401 }
            );
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
        console.log("Sending POST request to /api/auth/login");

        return new Response(
            JSON.stringify({
                message: "Login successful.",
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    interests: user.interests,
                    location: user.location,
                    avatar: user.avatar,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Login Error:", error);
        return new Response(
            JSON.stringify({ message: "Login failed.", error: error.message }),
            { status: 500 }
        );
    }
}
