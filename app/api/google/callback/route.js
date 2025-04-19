import { getGoogleOAuthClient } from '@/lib/googleAuth.js';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb.js';
import User from '@/models/user.js';
import { google } from 'googleapis';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const oauth2Client = getGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();

    await connectDB();

    let user = await User.findOne({ email: data.email });
    if (!user) {
        user = await User.create({
            email: data.email,
            name: data.name,
            avatar: data.picture,
            courses: [],
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const redirectUrl = new URL('http://localhost:3000/dashboard');
    redirectUrl.searchParams.set('token', token);
    return Response.redirect(redirectUrl.toString());
}
