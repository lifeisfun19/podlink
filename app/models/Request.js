import mongoose from 'mongoose';

const sessionRequestSchema = new mongoose.Schema(
    {
        fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
        toUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        createdAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
    }
);

// Adding index for faster queries on 'fromUserId' and 'toUserId'
sessionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const SessionRequest = mongoose.models.SessionRequest || mongoose.model('SessionRequest', sessionRequestSchema);

export default SessionRequest;
