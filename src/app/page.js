export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getDb } from '@/lib/firebase-admin';

export default async function HomePage() {
    const db = getDb();
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(50).get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return (
        <div>
            <h1>글 목록</h1>
            {posts.length === 0 ? (
                <p>아직 작성된 글이 없습니다.</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <strong>{post.author}</strong>: <Link href={`/post/${post.id}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/post/write">
                <button>글 작성하기</button>
            </Link>
        </div>
    );
}
