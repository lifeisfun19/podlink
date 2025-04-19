import mongoose from 'mongoose';

const VirtualStudyHallSchema = new mongoose.Schema({
    title: { type: String, required: true },
    meetLink: { type: String, required: true },
});

export default mongoose.models.VirtualStudyHall || mongoose.model('VirtualStudyHall', VirtualStudyHallSchema);
