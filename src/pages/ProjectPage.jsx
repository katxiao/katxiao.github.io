import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { projects } from '../data/projects';

function formatDate(ym) {
  const [year, month] = ym.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

function VideoEmbed({ url }) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  if (isYouTube) {
    return (
      <iframe
        src={url}
        style={mediaStyles.iframe}
        title="Project video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video controls style={mediaStyles.video}>
      <source src={url} />
    </video>
  );
}

const mediaStyles = {
  iframe: { width: '100%', aspectRatio: '16/9', border: 'none', display: 'block' },
  video: { width: '100%', display: 'block' },
};

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <Link to="/projects" style={styles.backLink}>← projects</Link>
        </header>
        <main style={styles.main}>
          <p style={{ color: '#999', fontSize: 14 }}>Project not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/projects" style={styles.backLink}>← projects</Link>
      </header>

      <main style={styles.main}>
        <div style={styles.titleRow}>
          <div>
            <h1 style={styles.title}>{project.title}</h1>
            <time style={styles.date}>{formatDate(project.date)}</time>
          </div>
          <span style={{
            ...styles.typeBadge,
            background: project.type === 'hardware' ? '#f5f0eb' : '#ebf2f5',
            color: project.type === 'hardware' ? '#8a6a50' : '#4a7a8a',
          }}>
            {project.type}
          </span>
        </div>

        {project.tags.length > 0 && (
          <div style={styles.tags}>
            {project.tags.map(tag => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <hr style={styles.divider} />

        {project.images.length > 0 && (
          <div style={styles.images}>
            {project.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${project.title} — image ${i + 1}`}
                style={styles.image}
              />
            ))}
          </div>
        )}

        {project.videoUrl && (
          <div style={styles.videoWrapper}>
            <VideoEmbed url={project.videoUrl} />
          </div>
        )}

        <div className="post-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.content}
          </ReactMarkdown>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            style={styles.externalLink}
          >
            View project →
          </a>
        )}
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
    maxWidth: 720,
    margin: '0 auto',
    padding: '56px 24px 0',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    lineHeight: 1.25,
    color: '#111',
    marginBottom: 6,
  },
  date: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#999',
  },
  typeBadge: {
    flexShrink: 0,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 2,
    fontWeight: 600,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  tag: {
    fontSize: 11,
    letterSpacing: '0.08em',
    color: '#888',
    border: '1px solid #e0e0e0',
    padding: '3px 8px',
    borderRadius: 2,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    marginBottom: 36,
  },
  images: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 8,
    marginBottom: 24,
  },
  image: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    display: 'block',
    background: '#f5f5f5',
  },
  videoWrapper: {
    marginBottom: 24,
    background: '#000',
  },
  externalLink: {
    display: 'inline-block',
    marginTop: 32,
    fontSize: 12,
    letterSpacing: '0.1em',
    color: '#3498db',
    textDecoration: 'none',
  },
};
