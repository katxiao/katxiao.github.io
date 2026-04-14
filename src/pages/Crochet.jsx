import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { crochetItems } from '../data/crochet';

function getResponsive(width) {
  if (width < 500)  return { capacity: 2, figureHeight: 80,  padding: 16 };
  if (width < 768)  return { capacity: 3, figureHeight: 100, padding: 32 };
  return              { capacity: 5, figureHeight: 130, padding: 60 };
}

// Split items into rows of SHELF_CAPACITY
function toRows(items, perRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  // Always show at least one (empty) shelf
  if (rows.length === 0) rows.push([]);
  return rows;
}

function Figurine({ item, index, figureHeight, onSelect }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <motion.div
      layoutId={`fig-${item.id}`}
      onClick={() => onSelect(item)}
      style={styles.figureWrap}
      animate={{ y: [0, -5, 0] }}
      transition={{
        y: {
          duration: 2.6 + (index % 4) * 0.35,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.45,
        },
        layout: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      whileHover={{ y: -10, transition: { duration: 0.2, repeat: 0 } }}
    >
      {(item.src && !imgFailed) ? (
        <img
          src={item.src}
          alt={item.title}
          onError={() => setImgFailed(true)}
          style={{ ...styles.figureImg, height: figureHeight }}
          draggable={false}
        />
      ) : (
        <div style={styles.figurePlaceholder}>
          <span style={styles.placeholderText}>✦</span>
        </div>
      )}
      <div style={styles.figureShadow} />
    </motion.div>
  );
}

function InspectOverlay({ item, onClose }) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={styles.backdrop}
        onClick={onClose}
      />

      {/* Centering wrapper — Framer owns transform on the layoutId element,
          so centering lives on a plain div instead */}
      <div style={styles.inspectContainer}>
      <motion.div
        layoutId={`fig-${item.id}`}
        style={styles.inspectCard}
      >
        {(item.src && !imgFailed) ? (
          <img
            src={item.src}
            alt={item.title}
            onError={() => setImgFailed(true)}
            style={styles.inspectImg}
            draggable={false}
          />
        ) : (
          <div style={{ ...styles.figurePlaceholder, width: 220, height: 280 }}>
            <span style={{ ...styles.placeholderText, fontSize: 40 }}>✦</span>
          </div>
        )}
        {(item.title || item.description) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3 }}
            style={styles.inspectCaption}
          >
            {item.title && <p style={styles.inspectTitle}>{item.title}</p>}
            {item.description && <p style={styles.inspectDesc}>{item.description}</p>}
          </motion.div>
        )}
      </motion.div>
      </div>
    </>
  );
}

export default function Crochet() {
  const [selected, setSelected] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() { setWindowWidth(window.innerWidth); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { capacity, figureHeight, padding } = getResponsive(windowWidth);
  const rows = toRows(crochetItems, capacity);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>← Katharine Xiao</Link>
        <h2 style={styles.heading}>crochet</h2>
      </header>

      <div style={{ ...styles.room, padding: `60px ${padding}px 0` }}>
        {rows.map((row, ri) => (
          <div key={ri} style={styles.shelfUnit}>
            <div style={{ ...styles.shelfRow, minHeight: figureHeight + 50 }}>
              {row.map((item, i) => (
                <Figurine
                  key={item.id}
                  item={item}
                  index={ri * capacity + i}
                  figureHeight={figureHeight}
                  onSelect={setSelected}
                />
              ))}
              {row.length === 0 && (
                <p style={styles.emptyHint}>
                  Add your figurines to <code>src/data/crochet.js</code>
                </p>
              )}
            </div>
            <div style={styles.plank}>
              <div style={styles.plankEdge} />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <InspectOverlay item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f0e8',
    backgroundImage: 'radial-gradient(rgba(140, 110, 70, 0.13) 1px, transparent 1px)',
    backgroundSize: '22px 22px',
    paddingBottom: 80,
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 24,
    padding: '32px 48px 24px',
    borderBottom: '1px solid #e8e0d0',
    marginBottom: 0,
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
  room: {
    display: 'flex',
    flexDirection: 'column',
    gap: 60,
    padding: '60px 60px 0',
    maxWidth: 900,
    margin: '0 auto',
  },
  shelfUnit: {
    display: 'flex',
    flexDirection: 'column',
  },
  shelfRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingBottom: 8,
    minHeight: 180,
  },
  plank: {
    position: 'relative',
    height: 18,
    background: 'linear-gradient(180deg, #c8a06a 0%, #a8783c 60%, #96682e 100%)',
    borderRadius: 3,
    boxShadow: '0 6px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
  },
  plankEdge: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 5,
    background: '#7a5020',
    borderRadius: '0 0 3px 3px',
  },
  figureWrap: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  figureImg: {
    height: 130,
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))',
  },
  figurePlaceholder: {
    width: 80,
    height: 130,
    background: '#ede8df',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 20,
    color: '#c8b89a',
  },
  figureShadow: {
    width: '70%',
    height: 6,
    background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
    marginTop: 2,
  },
  emptyHint: {
    fontSize: 12,
    color: '#bbb',
    letterSpacing: '0.05em',
    alignSelf: 'center',
    margin: '0 auto',
  },
  // Inspect overlay
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(40, 30, 20, 0.45)',
    backdropFilter: 'blur(3px)',
    zIndex: 100,
  },
  inspectContainer: {
    position: 'fixed',
    inset: 0,
    zIndex: 101,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  inspectCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: 'calc(100vh - 80px)',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  inspectImg: {
    maxHeight: 'min(320px, 55vh)',
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.3))',
    flexShrink: 1,
  },
  inspectCaption: {
    marginTop: 14,
    textAlign: 'center',
    flexShrink: 0,
  },
  inspectTitle: {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#fff',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    margin: '0 0 4px',
  },
  inspectDesc: {
    fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.6,
    margin: 0,
  },
};
