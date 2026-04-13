import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DraggablePhoto, { CARD_W, CARD_H } from '../components/DraggablePhoto';
import { ceramicItems } from '../data/ceramics';

const COLS = 4;
const COL_GAP = CARD_W + 60;
const ROW_GAP = CARD_H + 60;
const OFFSET_X = 80;
const OFFSET_Y = 20;

function getInitialPosition(index) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return {
    x: col * COL_GAP + OFFSET_X,
    y: row * ROW_GAP + OFFSET_Y,
  };
}

export default function Gallery() {
  const allMotionValues = useRef({});
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);
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

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>← Katharine Xiao</Link>
        <h2 style={styles.heading}>ceramics</h2>
      </header>

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
};
