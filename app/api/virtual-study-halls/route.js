import connectDB from '@/lib/mongodb';
import VirtualStudyHall from '@/models/virtualstudyhalls.js';

export async function GET() {
    try {
        await connectDB();
        const halls = await VirtualStudyHall.find().lean();
        return Response.json({ halls }); // ✅ ensure the key is exactly 'halls' and it's an array
    } catch (error) {
        console.error('Error fetching virtual study halls:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch virtual study halls' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
