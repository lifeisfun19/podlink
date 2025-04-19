// scripts/seedLeadership.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "<your-db-name>"; // 🔁 Replace with your actual database name

const dummyUsers = [
    { name: "Alice Sparks", avatar: "/images/default-avatar.png", points: 180 },
    { name: "Leo Tran", avatar: "/images/default-avatar.png", points: 140 },
    { name: "Maya Patel", avatar: "/images/default-avatar.png", points: 200 },
    { name: "Daniela Ruiz", avatar: "/images/default-avatar.png", points: 95 },
    { name: "Cheng Wang", avatar: "/images/default-avatar.png", points: 170 },
    { name: "Amir Nasri", avatar: "/images/default-avatar.png", points: 210 },
    { name: "Sophie Dubois", avatar: "/images/default-avatar.png", points: 130 },
    { name: "Omar Al-Fayed", avatar: "/images/default-avatar.png", points: 85 },
    { name: "Emily Zane", avatar: "/images/default-avatar.png", points: 160 },
    { name: "Jonas Müller", avatar: "/images/default-avatar.png", points: 115 },
];

async function seed() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("users");

        await collection.insertMany(dummyUsers);

        console.log("🎉 Seeded leaderboard users successfully.");
    } catch (err) {
        console.error("❌ Error seeding leaderboard users:", err);
    } finally {
        await client.close();
    }
}

seed();
