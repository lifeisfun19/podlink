import db from '@/lib/mongodb.js';
import User from '@/models/user.js';
import { authenticate } from '@/lib/auth.js';

export async function GET(req) {
  await db();

  const user = await authenticate(req);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const currentUser = await User.findById(user._id);

  // If currentUser is null or does not exist, respond with 404
  if (!currentUser) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const others = await User.find({
    _id: { $ne: user._id },
    courses: { $in: currentUser.courses },
  });

  return new Response(JSON.stringify(others), { status: 200 });
}

export async function POST(req) {
  await db();

  const user = await authenticate(req);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { partnerId } = await req.json();

  const session = {
    date: new Date(),
    partner: partnerId,
    mode: 'online',
    link: `https://meet.google.com/lookup/${Math.random().toString(36).substring(7)}`
  };

  await User.findByIdAndUpdate(user._id, { $push: { sessions: session } });

  return new Response(JSON.stringify({ message: 'Session created' }), { status: 200 });
}
