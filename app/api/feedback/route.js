import connectDB from '@/lib/mongodb';
import Feedback from '@/models/feedback';
import User from '@/models/user'; // Ensure you import the User model to check user validity

void connectDB();

export async function GET() {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name'); // Populate userId to show name
        return new Response(JSON.stringify(feedbacks), { status: 200 });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        return new Response(JSON.stringify({ error: 'Error fetching feedbacks' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { userId, message } = await req.json();

        // Check if the userId exists in the User collection
        const user = await User.findOne({ firebaseUid: userId });  // Assuming you store firebaseUid in the User model
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 400 });
        }

        // Create a new feedback document
        const feedback = new Feedback({
            userId: userId, // Store Firebase UID directly as string
            message,
        });

        await feedback.save();

        return new Response(JSON.stringify({ success: true, feedback }), { status: 201 });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return new Response(JSON.stringify({ error: 'Error submitting feedback' }), { status: 500 });
    }
}
