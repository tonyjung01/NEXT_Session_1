'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [file, setFile] = useState(null);
    const router = useRouter(); // 리다이렉션을 위한 Next.js useRouter

    async function handleSubmit() {
        let mediaUrl = undefined;
        if (file) {
            const form = new FormData();
            form.append('file', file);
            form.append('filename', file.name);
            form.append('access', 'public');
            const up = await fetch('/api/uploads', { method: 'POST', body: form });
            if (up.ok) {
                const { url } = await up.json();
                mediaUrl = url;
            }
        }

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, content, mediaUrl }),
        });

        await res.json();
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
            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleSubmit}>작성하기</button>
        </div>
    );
}
