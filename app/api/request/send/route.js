// /app/api/request/send/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import SessionRequest from '@/models/Request';

export async function POST(req) {
    try {
        const token = await authenticate(req);
        if (!token || !token.uid) {
            console.error("❌ Missing or invalid token");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        console.log("🧾 Request Body:", body);

        const { receiverId } = body;
        if (!receiverId) {
            return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
        }

        await connectDB();

        const newRequest = await SessionRequest.create({
            fromUserId: token.uid,
            toUserId: receiverId,
        });

        return NextResponse.json({ success: true, requestId: newRequest._id });
    } catch (err) {
        console.error("🔥 Error in POST /api/request/send:", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
