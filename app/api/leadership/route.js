// app/api/leadership/route.js
import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';

export async function GET() {
    try {
        await connectDB();

        const leaders = await User.find({ points: { $gt: 0 } })
            .sort({ points: -1 })
            .limit(50)
            .select('name avatar points');

        return new Response(JSON.stringify(leaders), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('🔥 Leadership API error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
