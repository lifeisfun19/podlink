import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    await connectDB();

    try {
        const { userId } = await authenticate(req);

        const contentType = req.headers.get('content-type') || '';
        if (!contentType.startsWith('multipart/form-data')) {
            return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
        }

        // Read the raw request body
        const arrayBuffer = await req.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract boundary
        const boundaryMatch = contentType.match(/boundary=(.*)$/);
        if (!boundaryMatch) {
            return NextResponse.json({ error: 'Missing boundary in content-type' }, { status: 400 });
        }
        const boundary = boundaryMatch[1];

        // Convert buffer to text and parse fields manually (for simple fields + 1 file only)
        const parts = buffer
            .toString()
            .split(`--${boundary}`)
            .filter((part) => part.includes('Content-Disposition'));

        const fields = {};
        let avatarPath = null;

        for (const part of parts) {
            const [rawHeaders, rawValue] = part.split('\r\n\r\n');
            const value = rawValue?.trim?.().replace(/\r\n--$/, '');

            const nameMatch = rawHeaders.match(/name="([^"]+)"/);
            const filenameMatch = rawHeaders.match(/filename="([^"]+)"/);
            const name = nameMatch?.[1];

            if (filenameMatch) {
                const filename = filenameMatch[1];
                const fileBuffer = buffer.slice(
                    buffer.indexOf(value),
                    buffer.indexOf(value) + value.length
                );
                const filePath = `/public/uploads/${Date.now()}-${filename}`;
                const fullPath = path.join(process.cwd(), filePath);
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, fileBuffer);
                avatarPath = filePath.replace('/public', '');
            } else if (name) {
                fields[name] = value;
            }
        }

        const { name, bio, location, interests } = fields;

        const updated = await User.findByIdAndUpdate(
            userId,
            {
                name,
                bio,
                location,
                interests: interests?.split(',').map((tag) => tag.trim()) || [],
                ...(avatarPath && { avatar: avatarPath }),
            },
            { new: true }
        );

        return NextResponse.json({ success: true, user: updated });
    } catch (err) {
        console.error('Profile update error:', err);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
