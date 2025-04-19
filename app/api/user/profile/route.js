import User from '@/models/user.js'; // Import the User model
import { authenticate } from '@/lib/auth'; // Import the updated authenticate function

// GET request to fetch the user's profile
export async function GET(req) {
    try {
        // Get the Firebase ID token from the request headers (Authorization header)
        const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        // Verify the token and extract user UID
        const user = await authenticate(req); // Use the `authenticate` function to verify and fetch user
        if (!user) {
            return new Response(JSON.stringify({ message: 'Authentication failed' }), { status: 401 });
        }

        // Return the user's profile
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return new Response(
            JSON.stringify({ message: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}

// POST request to update the user's profile
export async function POST(req) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token
        if (!token) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
        }

        // Verify the token and extract user UID
        const user = await authenticate(req); // Use `authenticate` to verify and fetch user
        if (!user) {
            return new Response(JSON.stringify({ message: 'Authentication failed' }), { status: 401 });
        }

        // Parse the request body to get the updated profile data
        const body = await req.json();

        // Update the user's profile in the database
        const updatedProfile = await User.findOneAndUpdate(
            { firebaseUid: user.firebaseUid }, // Find by Firebase UID
            body, // Update the profile with the provided data
            { new: true } // Return the updated document
        );

        if (!updatedProfile) {
            return new Response(JSON.stringify({ message: 'Profile update failed' }), { status: 400 });
        }

        // Return the updated profile data
        return new Response(JSON.stringify(updatedProfile), { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return new Response(
            JSON.stringify({ message: error.message || "Internal server error" }),
            { status: 500 }
        );
    }
}
