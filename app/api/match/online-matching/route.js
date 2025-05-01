// app/api/match/online-matching/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const course = searchParams.get('query');

        if (!course) {
            return NextResponse.json({ error: 'Missing course query' }, { status: 400 });
        }

        const users = await User.find({
            courses: course,
        }).select('name avatar email courses location');

        return NextResponse.json(users);
    } catch (error) {
        console.error('❌ Error in online-matching API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
