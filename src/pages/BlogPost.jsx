import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { posts } from '../data/posts';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link to="/blog" style={styles.backLink}>← blog</Link>
        </header>
        <main style={styles.main}>
          <p style={{ color: '#999', fontSize: 14 }}>Post not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/blog" style={styles.backLink}>← blog</Link>
      </header>

      <main style={styles.main}>
        <time style={styles.date}>{formatDate(post.date)}</time>
        <h1 style={styles.title}>{post.title}</h1>
        <hr style={styles.divider} />
        <div className="post-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '0 0 100px',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    padding: '32px 48px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  backLink: {
    fontSize: 12,
    letterSpacing: '0.1em',
    color: '#3498db',
    textDecoration: 'none',
  },
  main: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '56px 24px 0',
  },
  date: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 1.25,
    marginBottom: 32,
    color: '#111',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    marginBottom: 40,
  },
};
