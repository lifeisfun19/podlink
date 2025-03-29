import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authenticate } from "@/lib/auth"; // Import authentication function

export async function GET(req) {
  await connectDB(); // Ensure database is connected

  // Authenticate user using JWT token
  const auth = authenticate(req);
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { status: 401 });
  }

  const userId = auth.userId; // Extract user ID from token

  try {
    // Find the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Define search criteria
    const searchCriteria = {
      _id: { $ne: userId }, // Exclude the current user
      interests: { $in: currentUser.interests }, // Match at least one interest
    };

    // If user has a location, match users in the same location
    if (currentUser.location) {
      searchCriteria.location = currentUser.location;
    }

    // Find matching users
    const matches = await User.find(searchCriteria).select("-password"); // Exclude password field

    return new Response(JSON.stringify(matches), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching matches:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
