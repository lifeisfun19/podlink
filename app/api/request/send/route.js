// /app/api/request/send/route.js
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { authenticate } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const token = await authenticate(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { receiverId, mode, course, location, meetLink } = await req.json();
        const { db } = await connectToDB();

        const newRequest = {
            senderId: token.uid,
            receiverId,
            mode, // 'online' or 'offline'
            course: course || null,
            location: location || null,
            meetLink,
            status: 'pending',
            createdAt: new Date(),
        };

        const result = await db.collection('requests').insertOne(newRequest);

        return NextResponse.json({ success: true, requestId: result.insertedId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
