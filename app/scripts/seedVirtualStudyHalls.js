// scripts/seedVirtualStudyHalls.js
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import connectDB from '../lib/mongodb.js';
import VirtualStudyHall from '../models/virtualstudyhalls.js'; // ensure correct filename

const halls = [
    {
        title: 'Focus Zone 🧠',
        meetLink: 'https://meet.google.com/dzi-rfcj-twf',
    },
    {
        title: 'Late Night Coders 🌙',
        meetLink: 'https://meet.google.com/jcb-vajf-rzz',
    },
    {
        title: 'Math Mastery 📐',
        meetLink: 'https://meet.google.com/oxq-iqer-ixt',
    },
];

async function seedVirtualStudyHalls() {
    try {
        await connectDB();

        await VirtualStudyHall.deleteMany({});
        await VirtualStudyHall.insertMany(halls);

        console.log("✅ Virtual Study Halls seeded successfully.");
        process.exit(0);
    } catch (err) {
        console.error("🔥 Seeding failed:", err);
        process.exit(1);
    }
}

void seedVirtualStudyHalls();
