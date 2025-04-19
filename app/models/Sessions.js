// models/Session.js
import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    course: { type: String, required: true },
    time: { type: String, required: true },
    meetLink: { type: String, required: true },
    status: { type: String, default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
