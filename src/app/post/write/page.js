'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const router = useRouter(); // 리다이렉션을 위한 Next.js useRouter

    async function handleSubmit() {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, content }),
        });

        await res.json(); // API 응답 처리 (새 글 추가)

        // 메인 페이지(`/`)로 이동
        router.push('/');
    }

    return (
        <div>
            <h1>글 작성</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
            />
            <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자 (비우면 랜덤 닉네임)"
            />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="글 내용을 입력하세요" />
            <button onClick={handleSubmit}>작성하기</button>
        </div>
    );
}
