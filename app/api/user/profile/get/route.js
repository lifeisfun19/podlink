// File: app/api/profile/get/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth.js';
import connectDB from '@/lib/mongodb.js';
import { ObjectId } from 'mongodb';

export async function GET(req) {
    try {
        const user = await authenticate(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const db = await connectDB();
        const users = db.collection('users');
        const data = await users.findOne({ _id: new ObjectId(user.id) });

        return NextResponse.json({ user: data });
    } catch (err) {
        console.error('Get profile error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
