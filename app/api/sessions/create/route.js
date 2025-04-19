// /app/api/session/create/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Sessions.js';

export async function POST(req) {
    try {
        const token = await authenticate(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { to, course, time, meetLink } = await req.json();
        const from = token.uid;

        await connectDB();
        const session = await Session.create({ from, to, course, time, meetLink });

        return NextResponse.json({ success: true, session });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
