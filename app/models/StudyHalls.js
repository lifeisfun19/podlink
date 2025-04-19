// models/StudyHalls.js
import mongoose from 'mongoose';

const studyHallSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    hostId: { type: String, required: true }, // ✅ Firebase UID as string
    date: { type: Date, required: true },
    location: { type: String, required: true },
    rsvp_limit: { type: Number, default: 0 },


    participants: [
        {
            type: String, // ✅ Firebase UID of participant
            default: [],
        },
    ],
});
delete mongoose.connection.models["StudyHall"];

export default mongoose.models.StudyHall || mongoose.model('StudyHall', studyHallSchema);
