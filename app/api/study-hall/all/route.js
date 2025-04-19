// app/api/study-hall/all/route.js
import connectDB from '@/lib/mongodb.js';
import StudyHall from '@/models/StudyHalls.js';
export const GET = async () => {
    try {
        await connectDB();

        // Fetch study halls and populate hostId and participants
        const studyHalls = await StudyHall.find()
            .populate('hostId', 'name avatar')  // Populating host info (name and avatar)
            .populate('participants', 'name avatar');  // Populating participants info (name and avatar)

        console.log(studyHalls); // Debugging log to inspect data

        return new Response(JSON.stringify(studyHalls), { status: 200 });
    } catch (error) {
        console.error('Error fetching Study Halls:', error); // Log the error
        return new Response('Failed to fetch study halls', { status: 500 });
    }
};
