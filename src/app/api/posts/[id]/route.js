// app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import { posts } from '../route'; // posts 배열 불러오기

export async function GET(req, { params }) {
    const post = posts.find((p) => p.id.toString() === params.id);

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
}

export async function PUT(req, { params }) {
    const postIndex = posts.findIndex((p) => p.id.toString() === params.id);

    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let body = {};
    try {
        body = await req.json();
    } catch (_) {
        // ignore parse error; will be handled by validation below
    }

    const { title, author, content } = body;
    if (title === undefined && author === undefined && content === undefined) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updatedPost = {
        ...posts[postIndex],
        ...(title !== undefined ? { title } : {}),
        ...(author !== undefined ? { author } : {}),
        ...(content !== undefined ? { content } : {}),
    };

    posts[postIndex] = updatedPost;
    return NextResponse.json(updatedPost);
}

export async function DELETE(_req, { params }) {
    const postIndex = posts.findIndex((p) => p.id.toString() === params.id);

    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts.splice(postIndex, 1);
    return new Response(null, { status: 204 });
}
