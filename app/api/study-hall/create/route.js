// app/api/study-hall/create/route.js

import connectDB from '@/lib/mongodb.js';
import { firebaseAuth as auth } from '@/lib/firebase-admin';
import StudyHall from '@/models/StudyHalls.js';

export const POST = async (req) => {
    try {
        await connectDB();

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Unauthorized: Missing token' }), { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        const hostId = decodedToken.uid;

        const { title, topic, date, location, rsvp_limit } = await req.json();

        if (!title || !topic || !date || !location || !rsvp_limit) {
            return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
        }

        const newStudyHall = new StudyHall({
            title,
            topic,
            hostId,
            date: new Date(date),
            location,
            rsvpLimit: parseInt(rsvp_limit),
            participants: [],
        });

        await newStudyHall.save();

        return new Response(JSON.stringify({ message: 'Study Hall created successfully', studyHall: newStudyHall }), { status: 201 });
    } catch (error) {
        console.error('Error creating Study Hall:', error);
        return new Response(JSON.stringify({ message: 'Failed to create study hall', error: error.message }), { status: 500 });
    }
};
