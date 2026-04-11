import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="/assets/profile.jpeg"
          alt="Katharine Xiao"
          style={styles.avatar}
        />
        <h1 style={styles.name}>Katharine Xiao</h1>
        <nav style={styles.nav}>
          <Link to="/blog" style={styles.link}>blog</Link>
          <Link to="/projects" style={styles.link}>projects</Link>
          <Link to="/gallery" style={styles.link}>ceramics</Link>
          <div style={styles.divider} />
          <span style={styles.label}>Reach me at</span>
          <a href="https://www.linkedin.com/in/katharine-x-5238365a/" target="_blank" rel="noreferrer" style={styles.link}>
            linkedin
          </a>
          <a href="https://github.com/katxiao" target="_blank" rel="noreferrer" style={styles.link}>
            github
          </a>
        </nav>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: 24,
  },
  name: {
    fontSize: 32,
    fontWeight: 600,
    letterSpacing: '0.02em',
    marginBottom: 32,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  link: {
    fontSize: 13,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#3498db',
    textDecoration: 'none',
  },
  divider: {
    width: 24,
    borderTop: '1px solid #e8e8e8',
    margin: '4px 0',
  },
  label: {
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#bbb',
  },
};
