import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

function formatDate(ym) {
  const [year, month] = ym.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

function ProjectTile({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} style={tileStyles.link}>
      <article style={tileStyles.card}>
        <div style={tileStyles.cardHeader}>
          <div>
            <h2 style={tileStyles.title}>{project.title}</h2>
            <time style={tileStyles.date}>{formatDate(project.date)}</time>
          </div>
          <span style={{
            ...tileStyles.typeBadge,
            background: project.type === 'hardware' ? '#f5f0eb' : '#ebf2f5',
            color: project.type === 'hardware' ? '#8a6a50' : '#4a7a8a',
          }}>
            {project.type}
          </span>
        </div>

        <p style={tileStyles.description}>{project.description}</p>

        {project.tags.length > 0 && (
          <div style={tileStyles.tags}>
            {project.tags.map(tag => (
              <span key={tag} style={tileStyles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <span style={tileStyles.readMore}>View project →</span>
      </article>
    </Link>
  );
}

const tileStyles = {
  link: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: 36,
    paddingBottom: 8,
    transition: 'opacity 0.15s',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#111',
    marginBottom: 4,
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
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.75,
    marginBottom: 14,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    fontSize: 11,
    letterSpacing: '0.08em',
    color: '#888',
    border: '1px solid #e0e0e0',
    padding: '3px 8px',
    borderRadius: 2,
  },
  readMore: {
    fontSize: 12,
    letterSpacing: '0.1em',
    color: '#3498db',
  },
};

export default function Projects() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>← Katharine Xiao</Link>
        <h2 style={styles.heading}>projects</h2>
      </header>

      <main style={styles.main}>
        {projects.map(project => (
          <ProjectTile key={project.id} project={project} />
        ))}
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
    maxWidth: 720,
    margin: '0 auto',
    padding: '48px 24px 0',
  },
};
