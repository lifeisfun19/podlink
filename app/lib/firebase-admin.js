import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const projectId = process.env.FIREBASE_PROJECT_ID;

        if (!privateKey || !clientEmail || !projectId) {
            throw new Error("❌ Missing Firebase Admin environment variables.");
        }

        admin.initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });

        console.log("✅ Firebase Admin initialized.");
    } catch (error) {
        console.error("🔥 Firebase Admin initialization failed:", error);
        throw error;
    }
}

// ✅ Create reusable auth instance
const firebaseAuth = admin.auth();

/**
 * ✅ Custom function to verify Firebase ID token
 * @param {string} token - Firebase ID token from client
 * @returns {Promise<object>} - Decoded user info
 */
async function verifyFirebaseIdToken(token) {
    if (!token) {
        throw new Error("No token provided.");
    }

    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("❌ Failed to verify Firebase ID token:", error.message);
        throw new Error("Invalid or expired Firebase ID token.");
    }
}

// ✅ Export named instances
export { admin, firebaseAuth, verifyFirebaseIdToken };
export default admin;
