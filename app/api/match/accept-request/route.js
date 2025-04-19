// File: app/api/match/accept-request/route.js

import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import connectDB from '@/lib/mongodb';
import adminApp from '@/lib/firebase-admin.js';

export async function POST(req) {
    try {
        const { sessionId } = await req.json();
        const authHeader = req.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await getAuth(adminApp).verifyIdToken(token);
        const currentUserId = decodedToken.uid;

        const { db } = await connectDB();

        // Find the session and validate
        const session = await db.collection('sessions').findOne({ _id: sessionId });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (session.receiverId !== currentUserId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Generate a dummy Google Meet link for now (replace with proper Meet API later)
        const meetLink = `https://meet.google.com/${generateRandomMeetCode()}`;

        // Update session status to 'accepted' and attach Google Meet link
        await db.collection('sessions').updateOne(
            { _id: sessionId },
            {
                $set: {
                    status: 'accepted',
                    meetLink,
                    acceptedAt: new Date(),
                },
            }
        );

        return NextResponse.json({ success: true, meetLink });
    } catch (error) {
        console.error('Error accepting session request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper: Generates a fake Google Meet code (format: xxx-xxxx-xxx)
function generateRandomMeetCode() {
    const charset = 'abcdefghijklmnopqrstuvwxyz';
    const random = (len) =>
        Array.from({ length: len }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    return `${random(3)}-${random(4)}-${random(3)}`;
}
