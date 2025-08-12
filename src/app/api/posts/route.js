// app/api/posts/route.js
import { NextResponse } from 'next/server';

export let posts = []; // 서버 메모리에 저장

export async function GET() {
    return NextResponse.json(posts);
}

export async function POST(req) {
    const { title, author, content } = await req.json();

    function getRandomNickname() {
        const adjectives = ['Happy', 'Crazy', 'Silent', 'Brave', 'Funny', 'Mysterious'];
        const animals = ['Panda 🐼', 'Tiger 🐯', 'Fox 🦊', 'Rabbit 🐰', 'Penguin 🐧'];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        return `${randomAdj} ${randomAnimal}`;
    }

    const nickname = author ? author : getRandomNickname();

    // 새로운 글 추가
    const newPost = { id: posts.length + 1, title, author: nickname, content, createdAt: new Date() };
    posts.push(newPost); // 메모리에 저장

    return NextResponse.json(newPost);
}
