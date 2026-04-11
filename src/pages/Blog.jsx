import { Link } from 'react-router-dom';
import { posts } from '../data/posts';

const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>← Katharine Xiao</Link>
        <h2 style={styles.heading}>blog</h2>
      </header>

      <main style={styles.main}>
        {sorted.map((post, i) => (
          <article key={post.slug}>
            {i > 0 && <hr style={styles.divider} />}
            <time style={styles.date}>{formatDate(post.date)}</time>
            <h2 style={styles.title}>
              <Link to={`/blog/${post.slug}`} style={styles.titleLink}>
                {post.title}
              </Link>
            </h2>
            <p style={styles.excerpt}>{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} style={styles.readMore}>
              Read →
            </Link>
          </article>
        ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '0 0 80px',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 24,
    padding: '32px 48px 24px',
    borderBottom: '1px solid #f0f0f0',
  },
  backLink: {
    fontSize: 12,
    letterSpacing: '0.1em',
    color: '#3498db',
    textDecoration: 'none',
  },
  heading: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#111',
  },
  main: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '56px 24px 0',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '48px 0',
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
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: 12,
  },
  titleLink: {
    color: '#111',
    textDecoration: 'none',
  },
  excerpt: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.7,
    marginBottom: 16,
  },
  readMore: {
    fontSize: 12,
    letterSpacing: '0.1em',
    color: '#3498db',
    textDecoration: 'none',
  },
};
