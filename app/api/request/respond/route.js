// app/api/request/send/route.js
import { authenticate } from "@/lib/auth.js";
import ConnectDB from "@/lib/mongodb.js";
import User from "@/models/user.js";
import Request from "@/models/Request.js";

export async function POST(req) {
    await ConnectDB();

    const user = await authenticate(req);
    if (!user) {
        console.error("❌ Auth failed: no user returned from authenticate()");
        return new Response("Unauthorized", { status: 401 });
    }

    const { toUserId } = await req.json();
    const fromUser = await User.findOne({ email: user.email }); // Use email from Firebase token

    if (!fromUser) {
        console.error("❌ No matching user in DB for email:", user.email);
        return new Response("User not found", { status: 404 });
    }

    const existing = await Request.findOne({
        fromUserId: fromUser._id,
        toUserId,
    });

    if (existing) {
        return new Response("Already requested", { status: 409 });
    }

    await Request.create({
        fromUserId: fromUser._id,
        toUserId,
    });

    return new Response("Request sent", { status: 200 });
}
