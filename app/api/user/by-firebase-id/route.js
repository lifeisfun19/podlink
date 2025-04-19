import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';

export const GET = async (req) => {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const firebaseUid = searchParams.get('firebaseUid');

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return new Response('User not found', { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error fetching user by Firebase UID', { status: 500 });
    }
};
