'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostPage() {
    const params = useParams();
    const router = useRouter();

    const [post, setPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`/api/posts/${params.id}`);
            if (!res.ok) {
                setPost(null);
                return;
            }
            const data = await res.json();
            setPost(data);
            setTitle(data.title ?? '');
            setAuthor(data.author ?? '');
            setContent(data.content ?? '');
        };

        fetchPost();
    }, [params.id]);

    if (!post) {
        return <p>글을 찾을 수 없습니다.</p>;
    }

    async function handleDelete() {
        const ok = window.confirm('정말 삭제하시겠습니까?');
        if (!ok) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${params.id}`, { method: 'DELETE' });
            if (res.status === 204) {
                router.push('/');
                return;
            }
            const err = await res.json().catch(() => ({}));
            alert(err.error || '삭제에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSave() {
        setIsSubmitting(true);
        try {
            let mediaUrl = post.mediaUrl || undefined;
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

            const res = await fetch(`/api/posts/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, content, mediaUrl }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert(err.error || '수정에 실패했습니다.');
                return;
            }
            const updated = await res.json();
            setPost(updated);
            setIsEditing(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            {isEditing ? (
                <div>
                    <h1>글 수정</h1>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="작성자"
                    />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={handleSave} disabled={isSubmitting}>
                            저장
                        </button>
                        <button onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                            취소
                        </button>
                        <button onClick={handleDelete} disabled={isSubmitting} style={{ color: 'red' }}>
                            삭제
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>{post.title}</h1>
                    <p>
                        <strong>작성자:</strong> {post.author}
                    </p>
                    <p>{post.content}</p>
                    {post.mediaUrl && (
                        <div style={{ margin: '12px 0' }}>
                            {/\.(mp4|webm|ogg)(\?|$)/i.test(post.mediaUrl) ? (
                                <video src={post.mediaUrl} controls style={{ maxWidth: '100%' }} />
                            ) : (
                                <img src={post.mediaUrl} alt="media" style={{ maxWidth: '100%' }} />
                            )}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setIsEditing(true)}>수정</button>
                        <button onClick={handleDelete} style={{ color: 'red' }}>
                            삭제
                        </button>
                        <Link href="/">홈으로</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
