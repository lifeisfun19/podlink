import { getGoogleOAuthClient } from '@/lib/googleAuth.js';

export async function GET() {
    const oauth2Client = getGoogleOAuthClient();
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    });

    return Response.redirect(url);
}
