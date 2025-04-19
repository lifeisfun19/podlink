import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb.js';
import { authenticate } from '@/lib/auth';
import User from "@/models/user.js"; // Make sure this model exists

export async function POST(req) {
    const user = await authenticate(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { courses } = await req.json();
    if (!Array.isArray(courses)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }



    await connectDB();

    await User.findByIdAndUpdate(user.id, {
        courses,
    });


    return NextResponse.json({ success: true });
}
