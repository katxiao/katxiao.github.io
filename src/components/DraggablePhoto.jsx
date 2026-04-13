import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export const CARD_W = 280;
export const CARD_H = 280; // square card; caption lives as a hover overlay
const GAP = 12;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Resolves all pairwise overlaps iteratively.
// The dragged card is fixed in place; all other cards adjust around it (and each other).
// Works against each card's `tx`/`ty` (target position) so cascading chains resolve
// correctly even while spring animations are still in flight.
function resolveAllCollisions({ draggedId, allValues, maxX, maxY }) {
  // Build a working snapshot of target positions
  const targets = {};
  Object.entries(allValues).forEach(([id, mv]) => {
    targets[id] = { x: mv.tx, y: mv.ty };
  });

  const MAX_ITER = 20;
  for (let iter = 0; iter < MAX_ITER; iter++) {
    let anyOverlap = false;
    const ids = Object.keys(targets);

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const idA = ids[i];
        const idB = ids[j];
        const { x: ax, y: ay } = targets[idA];
        const { x: bx, y: by } = targets[idB];

        const overlapX = (CARD_W + GAP) - Math.abs(ax - bx);
        const overlapY = (CARD_H + GAP) - Math.abs(ay - by);

        if (overlapX > 0 && overlapY > 0) {
          anyOverlap = true;
          const bIsDragged = Number(idB) === draggedId;

          // Resolve along the axis with the smaller overlap.
          // The dragged card never moves; if B is dragged push A, otherwise push B.
          if (overlapX <= overlapY) {
            if (bIsDragged) {
              const dir = bx >= ax ? -1 : 1;
              targets[idA].x = clamp(ax + dir * overlapX, 0, maxX);
            } else {
              const dir = ax >= bx ? -1 : 1;
              targets[idB].x = clamp(bx + dir * overlapX, 0, maxX);
            }
          } else {
            if (bIsDragged) {
              const dir = by >= ay ? -1 : 1;
              targets[idA].y = clamp(ay + dir * overlapY, 0, maxY);
            } else {
              const dir = ay >= by ? -1 : 1;
              targets[idB].y = clamp(by + dir * overlapY, 0, maxY);
            }
          }
        }
      }
    }

    if (!anyOverlap) break;
  }

  return targets;
}

export default function DraggablePhoto({ id, src, hoverSrc, title, description, initialX, initialY, allMotionValues, canvasRef }) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const [srcFailed, setSrcFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  useEffect(() => {
    // tx/ty track where this card is headed (its last animated target).
    // We use these — not the live motion values — as the starting point for
    // cascade resolution so we don't fight in-flight spring animations.
    allMotionValues.current[id] = { x, y, tx: initialX, ty: initialY };
    return () => { delete allMotionValues.current[id]; };
  }, [id, x, y, initialX, initialY, allMotionValues]);

  function getBounds() {
    const canvas = canvasRef.current;
    if (!canvas) return { maxX: Infinity, maxY: Infinity };
    return {
      maxX: canvas.offsetWidth - CARD_W,
      maxY: canvas.offsetHeight - CARD_H,
    };
  }

  function resolveCollisions() {
    const myX = x.get();
    const myY = y.get();

    // Keep this card's target in sync with its live dragged position
    const self = allMotionValues.current[id];
    if (self) { self.tx = myX; self.ty = myY; }

    const { maxX, maxY } = getBounds();
    const targets = resolveAllCollisions({
      draggedId: id,
      allValues: allMotionValues.current,
      maxX,
      maxY,
    });

    const springOpts = { type: 'spring', stiffness: 280, damping: 28, mass: 0.6 };
    Object.entries(targets).forEach(([otherId, target]) => {
      if (Number(otherId) === id) return;
      const mv = allMotionValues.current[otherId];
      if (!mv) return;
      // Only call animate when the target has actually changed.
      // Calling animate() restarts the spring from the current mid-flight position,
      // so firing it every drag event (even when nothing changed) kills all progress.
      const xChanged = Math.abs(target.x - mv.tx) > 0.5;
      const yChanged = Math.abs(target.y - mv.ty) > 0.5;
      if (xChanged || yChanged) {
        mv.tx = target.x;
        mv.ty = target.y;
        if (xChanged) animate(mv.x, target.x, springOpts);
        if (yChanged) animate(mv.y, target.y, springOpts);
      }
    });
  }

  return (
    // initial="rest" + whileHover="hover" propagates the variant name down to children,
    // so the image zoom and caption overlay both respond to the same hover gesture.
    // whileDrag is an object (not a variant) so it overrides independently.
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={canvasRef}
      initial="rest"
      whileHover="hover"
      whileDrag={{ scale: 1.03, zIndex: 50 }}
      style={{ ...styles.card, x, y }}
      onDrag={resolveCollisions}
    >
      <div style={styles.imageContainer}>
        {(src && !srcFailed) ? (
          <motion.img
            src={src}
            alt={title}
            onError={() => setSrcFailed(true)}
            variants={{
              rest:  { scale: 1,    opacity: 1 },
              hover: { scale: 1.06, opacity: (hoverSrc && !hoverFailed) ? 0 : 1 },
            }}
            transition={transition}
            style={styles.image}
            draggable={false}
          />
        ) : (
          <div style={styles.placeholder}>
            <span style={styles.placeholderText}>photo</span>
          </div>
        )}

        {/* Alternative image — cross-fades in on hover; hidden if the file doesn't exist */}
        {(hoverSrc && !hoverFailed) && (
          <motion.img
            src={hoverSrc}
            alt={title}
            onError={() => setHoverFailed(true)}
            variants={{
              rest:  { opacity: 0, scale: 1.06 },
              hover: { opacity: 1, scale: 1.06 },
            }}
            transition={transition}
            style={{ ...styles.image, position: 'absolute', top: 0, left: 0 }}
            draggable={false}
          />
        )}

        {/* Edge fade — inset shadow blends image borders into the white page background.
            Adjust the two px values (blur spread) to taste. */}
        <div style={styles.edgeFade} />

        {/* Caption overlay — fades in and slides up on hover */}
        <motion.div
          variants={overlayVariants}
          transition={transition}
          style={styles.overlay}
        >
          {title && <p style={styles.overlayTitle}>{title}</p>}
          {description && <p style={styles.overlayDescription}>{description}</p>}
        </motion.div>
      </div>
    </motion.div>
  );
}

const transition = { duration: 0.3, ease: 'easeOut' };

const overlayVariants = {
  rest:  { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0 },
};

const styles = {
  card: {
    position: 'absolute',
    width: CARD_W,
    cursor: 'grab',
    userSelect: 'none',
  },
  imageContainer: {
    position: 'relative',
    width: CARD_W,
    height: CARD_H,
    overflow: 'hidden',
    background: '#f2f2f2',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#efefef',
  },
  placeholderText: {
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#bbb',
  },
  edgeFade: {
    position: 'absolute',
    inset: 0,
    boxShadow: 'inset 0 0 40px 18px rgba(255, 255, 255, 0.92)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    left: 0,
    right: 0,
    padding: '14px 14px 16px',
    background: 'rgba(255, 255, 255, 0.93)',
    backdropFilter: 'blur(4px)',
    pointerEvents: 'none',
  },
  overlayTitle: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#111',
    margin: '0 0 3px',
    letterSpacing: '0.02em',
  },
  overlayDescription: {
    fontSize: 11,
    fontFamily: 'Montserrat, sans-serif',
    color: '#666',
    lineHeight: 1.55,
    margin: 0,
  },
};
