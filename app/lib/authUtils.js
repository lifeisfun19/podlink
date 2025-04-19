// lib/authUtils.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/api/auth/[...nextauth]/route.js';
import { auth } from '@/lib/firebase-admin.js'; // Firebase Admin SDK

/**
 * Gets the authenticated session from NextAuth.
 */
export async function getAuthSession() {
    try {
        return await getServerSession(authOptions);
    } catch (err) {
        console.error('Failed to retrieve session:', err);
        return null;
    }
}

/**
 * Middleware-style utility to enforce authentication in API routes.
 * Falls back to Firebase Admin verification if needed.
 */
export async function authenticate(req) {
    // First try NextAuth
    const session = await getAuthSession();
    if (session?.user) return session;

    // Fallback to Firebase (optional)
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return null;

    try {
        const decodedToken = await auth.verifyIdToken(token);
        return { user: { email: decodedToken.email, uid: decodedToken.uid } };
    } catch (error) {
        console.warn('Firebase token verification failed:', error);
        return null;
    }
}
