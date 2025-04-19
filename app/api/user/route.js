// File: app/api/user/profile/route.js
import { authenticate } from '@/lib/auth';
import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';

export async function GET(req) {
    try {
        await connectDB();
        const user = await authenticate(req);
        if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const foundUser = await User.findById(user._id).lean();
        if (!foundUser) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

        return new Response(JSON.stringify({ courses: foundUser.courses || [] }), { status: 200 });
    } catch (err) {
        console.error('GET /profile error', err);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
