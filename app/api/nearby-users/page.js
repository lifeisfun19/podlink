import { connectDB } from "@/lib/mongodb";
import User from "@/models/User"; // Adjust based on your schema

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));

    if (isNaN(lat) || isNaN(lng)) {
      return new Response(JSON.stringify({ error: "Missing or invalid latitude/longitude" }), { status: 400 });
    }

    // Find nearby users (Modify this logic based on how your User schema stores location)
    const users = await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 5000, // 5km radius
        },
      },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
