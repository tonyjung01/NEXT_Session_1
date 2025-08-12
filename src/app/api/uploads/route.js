// app/api/uploads/route.js
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req) {
    try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            return NextResponse.json({ error: 'Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
        }

        const form = await req.formData();
        const file = form.get('file');
        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'file is required (multipart/form-data)' }, { status: 400 });
        }

        const filename = form.get('filename') || file.name || 'upload';
        const access = (form.get('access') || 'public').toString(); // 'public' | 'private'

        const uploaded = await put(filename.toString(), file, {
            access,
            token,
            contentType: file.type || undefined,
        });

        return NextResponse.json({ url: uploaded.url });
    } catch (error) {
        console.error('POST /api/uploads error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
