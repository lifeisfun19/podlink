// /app/api/offline-users/route.js

import connectDB from "@/lib/mongodb";
import User from "@/models/user.js";
import { authenticate } from "@/lib/auth";

export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const radiusInKm = parseFloat(searchParams.get("radius")) || 5; // default: 5 km

    const authResult = await authenticate(req);
    if (authResult.error) {
        return Response.json({ error: authResult.error }, { status: 401 });
    }

    const user = await User.findById(authResult.userId);
    if (!user || !user.location || !user.location.coordinates) {
        return Response.json({ error: "User location not set" }, { status: 400 });
    }

    const [lng, lat] = user.location.coordinates;
    const radiusInRadians = radiusInKm / 6371; // Earth radius in km

    try {
        const nearbyUsers = await User.find({
            _id: { $ne: user._id }, // Exclude current user
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radiusInRadians],
                },
            },
        }).select("name avatar interests location");

        return Response.json(nearbyUsers);
    } catch (err) {
        console.error("Failed to fetch nearby users:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
