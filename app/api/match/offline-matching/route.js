// File: app/api/match/offline-matching/route.js
import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth.js';
import { ObjectId } from 'mongodb';
import connectDB from "@/lib/mongodb.js";

// Max distance in kilometers
const MAX_DISTANCE_KM = 20;

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function POST(req) {
    try {
        const user = await authenticate(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { lat, lng } = await req.json();
        if (!lat || !lng) {
            return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
        }

        const db = await connectDB();
        const users = db.collection('users');

        const allUsers = await users.find({ _id: { $ne: new ObjectId(user.id) } }).toArray();
        const nearbyUsers = allUsers.filter(u => {
            if (!u.location || !u.location.lat || !u.location.lng) return false;
            const distance = getDistance(lat, lng, u.location.lat, u.location.lng);
            return distance <= MAX_DISTANCE_KM;
        });

        return NextResponse.json({ nearbyUsers });
    } catch (err) {
        console.error('Offline match error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
