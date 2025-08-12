// app/api/posts/route.js
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

function getRandomNickname() {
    const adjectives = ['Happy', 'Crazy', 'Silent', 'Brave', 'Funny', 'Mysterious'];
    const animals = ['Panda 🐼', 'Tiger 🐯', 'Fox 🦊', 'Rabbit 🐰', 'Penguin 🐧'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdj} ${randomAnimal}`;
}

export async function GET() {
    try {
        const db = getDb();
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(50).get();

        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(data);
    } catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { title, author, content, mediaUrl } = await req.json();
        if (!title || !content) {
            return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
        }

        const nickname = author || getRandomNickname();
        const db = getDb();
        const now = new Date().toISOString();
        const docRef = db.collection('posts').doc();
        const newPost = {
            title,
            author: nickname,
            content,
            ...(mediaUrl ? { mediaUrl } : {}),
            createdAt: now,
            updatedAt: now,
        };
        await docRef.set(newPost);

        return NextResponse.json({ id: docRef.id, ...newPost }, { status: 201 });
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
