// app/scripts/seedTestUsers.js

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });  // ✅ Ensures correct .env path

import mongoose from 'mongoose';

// ✅ Now that env is loaded, read the URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ Please define the MONGODB_URI environment variable");
}

const userSchema = new mongoose.Schema({
    uid: String,
    name: String,
    email: String,
    avatar: String,
    location: {
        lat: Number,
        lng: Number,
    },
    interests: [String],
    courses: [String],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const dummyUsers = [
    {
        uid: "testuser1",
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: "/avatars/alice.png",
        location: { lat: 40.7128, lng: -74.0060 },
        interests: ["AI", "Math"],
        courses: ["Math101", "CS50"],
    },
    {
        uid: "testuser2",
        name: "Bob Lee",
        email: "bob@example.com",
        avatar: "/avatars/bob.png",
        location: { lat: 40.7130, lng: -74.0062 },
        interests: ["Math", "Physics"],
        courses: ["Math101"],
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        await User.deleteMany({});
        await User.insertMany(dummyUsers);
        console.log("✅ Dummy users inserted successfully");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding users:", error);
        process.exit(1);
    }
}

void seed();
