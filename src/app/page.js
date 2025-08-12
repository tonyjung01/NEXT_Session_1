import Link from 'next/link';

export default async function HomePage() {
    const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' });
    const posts = await res.json();

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
