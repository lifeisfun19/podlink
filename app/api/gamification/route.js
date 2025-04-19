// File: app/api/gamification/route.js

import db from '@/lib/mongodb.js';
import User from '@/models/user.js';
import { authenticate } from '@/lib/auth';

export async function GET(req) {
    try {
        await db();

        const user = await authenticate(req);
        if (!user || !user._id) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const existingUser = await User.findById(user._id);
        if (!existingUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const sessionCount = existingUser.sessions?.length || 0;

        // Assign badges based on session count
        const badges = [];
        if (sessionCount >= 1) badges.push('Starter');
        if (sessionCount >= 5) badges.push('Active Learner');
        if (sessionCount >= 10) badges.push('Study Pro'); // Optional extra tier

        // Update user document
        existingUser.badges = badges;
        await existingUser.save();

        return new Response(JSON.stringify({ badges }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('🔥 Gamification error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
