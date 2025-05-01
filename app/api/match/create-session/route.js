import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';  // Adjust the path as needed
import { createGoogleMeetEvent } from '@/lib/calendar';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Sessions';

export async function POST(req) {
    // Log the session for debugging
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    // Check if the session or user is undefined
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Parse the request body for the session data
    const { to, course, time } = await req.json();
    console.log('Received data:', { to, course, time });

    try {
        // Connect to MongoDB
        await connectDB();
        console.log('MongoDB connected successfully.');

        const startTime = new Date(time);
        const endTime = new Date(startTime.getTime() + 30 * 60000);

        // Log the start and end times to ensure they are correct
        console.log('Start time:', startTime);
        console.log('End time:', endTime);

        // Generate the Google Meet link using the createGoogleMeetEvent function
        const meetLink = await createGoogleMeetEvent({
            start: startTime,
            end: endTime,
            summary: `${session.user.name} wants to study ${course}`,
            attendees: [session.user.email, to],
        });

        console.log('Generated meet link:', meetLink);

        // Create a new session document to save to MongoDB
        const newSession = new Session({
            from: session.user.email,
            to,
            course,
            time,
            meetLink,
        });

        // Log the new session to check the data
        console.log('New Session:', newSession);

        // Save the session to the database
        await newSession.save();
        console.log('Session saved to database.');

        // Return success response
        return new Response(JSON.stringify({ message: 'Session created', meetLink }), { status: 200 });
    } catch (err) {
        console.error('Error creating session:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
