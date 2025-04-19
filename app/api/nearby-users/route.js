import connectDB from '@/lib/mongodb';
import User from '@/models/user.js';
import { authenticate } from '@/lib/auth';

export async function GET(req) {
  await connectDB();
  const user = await authenticate(req);
  const { lat, lng } = Object.fromEntries(new URL(req.url).searchParams);

  if (!lat || !lng) {
    return Response.json({ message: 'Missing coordinates' }, { status: 400 });
  }

  const users = await User.find({
    _id: { $ne: user._id },
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: 3000, // 3km
      },
    },
  }).select('name bio location');

  return Response.json(users);
}
