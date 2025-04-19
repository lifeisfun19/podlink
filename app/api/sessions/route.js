import db from '@/lib/mongodb.js';
import User from '@/models/user.js';
import { authenticate } from '@/lib/auth';

export async function GET(req) {
    await db();

    const user = await authenticate(req);

    // ✅ Handle unauthenticated access gracefully
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized. Token missing or invalid.' }), {
            status: 401,
        });
    }

    try {
        const u = await User.findById(user._id);

        if (!u) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(u.sessions || []), { status: 200 });

    } catch (err) {
        console.error('❌ Error fetching user sessions:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
