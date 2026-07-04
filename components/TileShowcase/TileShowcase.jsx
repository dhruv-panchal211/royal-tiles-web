'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { useIsMobile } from '@/lib/hooks';
import InView from '@/components/InView';
import FloatingTiles from './FloatingTiles';
import styles from './showcase.module.css';

const DETAILS = Array.from({ length: 9 }).map((_, i) => ({
  name: ['Aria', 'Sienna', 'Cove', 'Vela', 'Marlo', 'Ode', 'Pell', 'Rune', 'Sol'][i],
  collection: ['Terrazzo Classic', 'Geometric Mosaic', 'Heritage Encaustic'][i % 3],
  dim: '20 × 20 cm',
  finish: ['Matte', 'Honed', 'Polished'][i % 3],
  sku: `RT-${String(100 + i * 7)}`,
}));

export default function TileShowcase() {
  const [selected, setSelected] = useState(null);
  const isMobile = useIsMobile();
  const d = selected !== null ? DETAILS[selected] : null;

  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <span className="caption" style={{ color: 'var(--color-gold)' }}>
          Each tile is unique
        </span>
        <h2 className={styles.h2}>
          Nine tiles. One mold. <em>Nine stories.</em>
        </h2>
        <p className={styles.hint}>Click a tile to look closer.</p>
      </header>

      <div className={styles.stage}>
        {!isMobile ? (
          <InView style={{ width: '100%', height: '100%' }}>
            <Canvas
              dpr={[1, 2]}
              camera={{ position: [0, 0, 9], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
            >
              <FloatingTiles selected={selected} onSelect={setSelected} />
            </Canvas>
          </InView>
        ) : (
          <div className={styles.mobileGrid}>
            {DETAILS.map((t, i) => (
              <button
                key={i}
                className={styles.mobileTile}
                style={{ '--hue': `${(i * 41) % 360}deg` }}
                onClick={() => setSelected(i)}
              />
            ))}
          </div>
        )}
      </div>

      <aside
        className={`${styles.drawer} ${d ? styles.drawerOpen : ''}`}
        aria-hidden={!d}
      >
        {d && (
          <>
            <button
              className={styles.close}
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div
              className={styles.swatch}
              style={{ '--hue': `${(selected * 41) % 360}deg` }}
            />
            <span className={styles.dCollection}>{d.collection}</span>
            <h3 className={styles.dName}>“{d.name}”</h3>
            <dl className={styles.spec}>
              <div>
                <dt>Dimensions</dt>
                <dd>{d.dim}</dd>
              </div>
              <div>
                <dt>Finish</dt>
                <dd>{d.finish}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{d.sku}</dd>
              </div>
            </dl>
            <button className={styles.cta}>Request a sample</button>
          </>
        )}
      </aside>
    </section>
  );
}
