import connectDB from '@/lib/mongodb.js';
import StudyHall from '@/models/StudyHalls.js';
import User from '@/models/user.js';
import mongoose from 'mongoose';

export const POST = async (req) => {
    try {
        await connectDB();
        const { studyHallId, userId } = await req.json();

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(studyHallId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return new Response('Invalid ID format', { status: 400 });
        }

        const studyHall = await StudyHall.findById(studyHallId);
        if (!studyHall) {
            return new Response('Study hall not found', { status: 404 });
        }

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Add userId to participants if not already present
        if (!studyHall.participants.includes(userObjectId)) {
            studyHall.participants.push(userObjectId);
            await studyHall.save();

            // Update the user's participatedStudyHalls array
            await User.findByIdAndUpdate(userObjectId, {
                $addToSet: { participatedStudyHalls: studyHall._id }
            });
        }

        return new Response('RSVP successful', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to RSVP', { status: 500 });
    }
};
