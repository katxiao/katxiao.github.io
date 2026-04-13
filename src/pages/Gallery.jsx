import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DraggablePhoto, { CARD_W, CARD_H } from '../components/DraggablePhoto';
import { ceramicItems } from '../data/ceramics';

const COLS = 4;
const COL_GAP = CARD_W + 60;
const ROW_GAP = CARD_H + 60;
const OFFSET_X = 80;
const OFFSET_Y = 20;
const CANVAS_BREAKPOINT = 900;

function getInitialPosition(index) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: col * COL_GAP + OFFSET_X,
    y: row * ROW_GAP + OFFSET_Y,
  };
}

function GridPhoto({ item }) {
  const [hovered, setHovered] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  return (
    <div
      style={styles.gridItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.gridImageWrap}>
        <img
          src={item.src}
          alt={item.title}
          style={{
            ...styles.gridImage,
            opacity: (hovered && item.hoverSrc && !hoverFailed) ? 0 : 1,
            transition: 'opacity 0.55s ease-in-out, transform 0.55s ease-in-out',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
        {(item.hoverSrc && !hoverFailed) && (
          <img
            src={item.hoverSrc}
            alt={item.title}
            onError={() => setHoverFailed(true)}
            style={{
              ...styles.gridImage,
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: hovered ? 1 : 0,
              transform: 'scale(1.06)',
              transition: 'opacity 0.55s ease-in-out',
            }}
          />
        )}
        <div style={styles.edgeFade} />
        <div style={{
          ...styles.gridOverlay,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
        }}>
          {item.title && <p style={styles.gridTitle}>{item.title}</p>}
          {item.description && <p style={styles.gridDesc}>{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const allMotionValues = useRef({});
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() { setWindowWidth(window.innerWidth); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const lastStarTime = useRef(0);

  const emitStars = useCallback((cx, cy) => {
    const now = Date.now();
    if (now - lastStarTime.current < 40) return;
    lastStarTime.current = now;

    const batch = Array.from({ length: 2 }, () => ({
      id: Math.random(),
      x: cx + (Math.random() - 0.5) * 30,
      y: cy + (Math.random() - 0.5) * 30,
      size: 10 + Math.random() * 8,
    }));

    setStars(s => [...s, ...batch]);
    setTimeout(() => {
      setStars(s => s.filter(star => !batch.some(b => b.id === star.id)));
    }, 900);
  }, []);

  const canvasHeight = Math.ceil(ceramicItems.length / COLS) * ROW_GAP + 120;
  const isSmall = windowWidth < CANVAS_BREAKPOINT;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>← Katharine Xiao</Link>
        <h2 style={styles.heading}>ceramics</h2>
      </header>

      {isSmall ? (
        <div style={styles.grid}>
          {ceramicItems.map((item) => (
            <GridPhoto key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div ref={canvasRef} style={{ ...styles.canvas, minHeight: canvasHeight }}>
          <AnimatePresence>
            {stars.map(star => (
              <motion.span
                key={star.id}
                initial={{ opacity: 0.85, scale: 1, x: star.x, y: star.y }}
                animate={{ opacity: 0, scale: 0.2, y: star.y - 30 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                style={{ ...styles.star, fontSize: star.size }}
              >
                ✦
              </motion.span>
            ))}
          </AnimatePresence>

          {ceramicItems.map((item, i) => {
            const { x, y } = getInitialPosition(i);
            return (
              <DraggablePhoto
                key={item.id}
                id={item.id}
                src={item.src}
                hoverSrc={item.hoverSrc}
                title={item.title}
                description={item.description}
                initialX={x}
                initialY={y}
                allMotionValues={allMotionValues}
                canvasRef={canvasRef}
                emitStars={emitStars}
              />
            );
          })}
        </div>
      )}
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
    marginBottom: 8,
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
  canvas: {
    position: 'relative',
    margin: '0 auto',
    width: COLS * COL_GAP + OFFSET_X * 2,
    maxWidth: '100%',
  },
  star: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#c8a96e',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 200,
    lineHeight: 1,
  },
  // Small-screen grid layout
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20,
    padding: '24px 24px 0',
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridImageWrap: {
    position: 'relative',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    background: '#f2f2f2',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  edgeFade: {
    position: 'absolute',
    inset: 0,
    boxShadow: 'inset 0 0 40px 18px rgba(255, 255, 255, 0.92)',
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    padding: '14px 14px 16px',
    background: 'rgba(255, 255, 255, 0.93)',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'none',
    transition: 'opacity 0.55s ease-in-out, transform 0.55s ease-in-out',
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#111',
    margin: '0 0 2px',
    letterSpacing: '0.02em',
  },
  gridDesc: {
    fontSize: 11,
    fontFamily: 'Montserrat, sans-serif',
    color: '#666',
    lineHeight: 1.55,
    margin: 0,
  },
};
