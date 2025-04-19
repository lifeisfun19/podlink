import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    default: null, // Ensures the field exists for email/password users
    required: function() { return this.password !== null; }, // Make password required if not using Firebase sign-up
  },

  name: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: [0, 0],
    },
  },

  interests: {
    type: [String],
    default: [],
  },
  courses: {
    type: [String],
    default: [],
  },
  matches: {
    type: [mongoose.Schema.Types.ObjectId], // Refers to other Users
    ref: 'User',
    default: [],
  },

  sessions: [
    {
      date: { type: Date },
      partner: { type: String },
      mode: { type: String, enum: ['online', 'offline'] },
      link: { type: String },
    }
  ],

  badges: {
    type: [String],
    default: [],
  },
  points: {
    type: Number,
    default: 0,
  },

  // New Fields for Study Halls
  hostedStudyHalls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyHall', // Refers to StudyHall model
      default: [],
    },
  ],
  participatedStudyHalls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyHall', // Refers to StudyHall model
      default: [],
    },
  ],
});

// Enable geospatial queries
userSchema.index({ location: '2dsphere' });

// Pre-save hook to hash the password before saving it (if password is provided)
userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
