import db from '@/lib/mongodb.js';
import User from '@/models/user.js';
import { authenticate } from '@/lib/auth';

export async function POST(req) {
    await db();
    const user = await authenticate(req);
    const { courses } = await req.json();
    const courseArr = courses.split(',').map(c => c.trim());
    await User.findByIdAndUpdate(user._id, { courses: courseArr });
    return new Response(JSON.stringify({ message: 'Courses updated' }), { status: 200 });
}
