import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import connectDB from '@/lib/mongodb.js';
import '@/lib/firebase-admin.js';
import User from '@/models/user.js';

export async function POST(req) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        // ✅ Verify Firebase ID token
        const decodedToken = await getAuth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        // ✅ Safely parse request body
        let body;
        try {
            body = await req.json();
        } catch  {
            return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
        }

        const {
            name,
            email,
            avatar,
            location, // { coordinates: [lng, lat] }
            interests,
            courses,
            bio,
        } = body;

        await connectDB();

        const update = {
            name,
            email,
            avatar,
            bio: bio || '',
            interests: interests || [],
            courses: courses || [],
            location: location || { type: 'Point', coordinates: [0, 0] },
            lastSynced: new Date(),
        };

        // Upsert the user, meaning if they exist, update; if not, create a new entry
        const result = await User.updateOne(
            { firebaseUid },
            { $set: update },
            { upsert: true }
        );
        console.log('Authorization header:', authHeader);
        console.log('Decoded token:', decodedToken);
        console.log('Update data:', update);

        return NextResponse.json({ message: '✅ User synced successfully.', result });
    } catch (error) {
        console.error('🔥 Sync error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
