import connectDB from "@/lib/mongodb";
import User from "@/models/user.js";

export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    try {
        const user = await User.findById(uid).select("interests location mode availability").exec();
        return new Response(JSON.stringify(user || {}), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Could not fetch preferences:", error);
        return new Response(JSON.stringify({ error: "Could not fetch preferences" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const { uid, interests, location, mode, availability } = body;

        const updatedUser = await User.findByIdAndUpdate(
            uid,
            { interests, location, mode, availability },
            { new: true }
        ).exec();

        return new Response(JSON.stringify(updatedUser), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("❌ Failed to update preferences:", error);
        return new Response(JSON.stringify({ error: "Failed to update preferences" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
