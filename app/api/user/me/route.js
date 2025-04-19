// /app/api/users/me/route.js

import { authenticate } from '@/lib/auth';
import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';

export async function GET(req) {
  const user = await authenticate(req);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectDB();
  const existingUser = await User.findOne({ uid: user.uid });

  if (!existingUser) {
    return new Response('User not found', { status: 404 });
  }

  return Response.json(existingUser);
}
