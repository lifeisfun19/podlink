import mongoose from 'mongoose';

const sessionRequestSchema = new mongoose.Schema(
    {
        fromUserId: { type: String, required: true },
        toUserId: { type: String, required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    },
    {
        timestamps: true,
    }
);

sessionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const SessionRequest =
    mongoose.models.SessionRequest || mongoose.model('SessionRequest', sessionRequestSchema);

export default SessionRequest;
