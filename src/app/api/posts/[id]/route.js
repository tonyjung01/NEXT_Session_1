// app/api/posts/[id]/route.js
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function GET(_req, { params }) {
    try {
        const db = getDb();
        const doc = await db.collection('posts').doc(params.id).get();
        if (!doc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error(`GET /api/posts/${params.id} error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const db = getDb();
        let body = {};
        try {
            body = await req.json();
        } catch (_) {}

        const { title, author, content, mediaUrl } = body;
        if (title === undefined && author === undefined && content === undefined && mediaUrl === undefined) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const docRef = db.collection('posts').doc(params.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const updated = {
            ...(title !== undefined ? { title } : {}),
            ...(author !== undefined ? { author } : {}),
            ...(content !== undefined ? { content } : {}),
            ...(mediaUrl !== undefined ? { mediaUrl } : {}),
            updatedAt: new Date().toISOString(),
        };
        await docRef.update(updated);
        const after = await docRef.get();

        return NextResponse.json({ id: after.id, ...after.data() });
    } catch (error) {
        console.error(`PATCH /api/posts/${params.id} error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(_req, { params }) {
    try {
        const db = getDb();
        const docRef = db.collection('posts').doc(params.id);
        const snap = await docRef.get();
        if (!snap.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        await docRef.delete();
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(`DELETE /api/posts/${params.id} error:`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
