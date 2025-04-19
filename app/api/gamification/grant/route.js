import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb.js';
import { authenticate } from '@/lib/auth';
import User from '@/models/user.js';

export async function POST(req) {
    try {
        const user = await authenticate(req);
        const { badgeId } = await req.json();

        if (!user || !badgeId) {
            return NextResponse.json({ error: 'Unauthorized or missing badge' }, { status: 400 });
        }

        await connectDB();

        await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { badges: badgeId } }, // prevents duplicates
            { new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('🔥 Error granting badge:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
