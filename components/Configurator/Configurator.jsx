'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import InView from '@/components/InView';
import styles from './configurator.module.css';

const ConfiguratorCanvas = dynamic(() => import('./ConfiguratorCanvas'), {
  ssr: false,
});

// Brand-led terrazzo palettes for the live 3D tile
const PATTERNS = [
  { id: 'classic', label: 'Classic Clay', seed: 1.2, scale: 16, base: [0.96, 0.95, 0.93], chipA: [0.78, 0.54, 0.43], chipB: [0.54, 0.55, 0.56], chipC: [0.11, 0.11, 0.1], chipD: [0.82, 0.82, 0.82], swatch: 'none' },
  { id: 'terracotta', label: 'Terracotta', seed: 4.8, scale: 14, base: [0.94, 0.91, 0.88], chipA: [0.66, 0.44, 0.33], chipB: [0.78, 0.54, 0.43], chipC: [0.14, 0.12, 0.11], chipD: [0.9, 0.72, 0.6], swatch: 'saturate(1.3) brightness(0.88)' },
  { id: 'blush', label: 'Blush', seed: 5.6, scale: 13, base: [0.97, 0.94, 0.92], chipA: [0.9, 0.74, 0.66], chipB: [0.94, 0.85, 0.79], chipC: [0.4, 0.33, 0.3], chipD: [0.98, 0.92, 0.87], swatch: 'saturate(0.6) brightness(1.1)' },
  { id: 'slate', label: 'Slate', seed: 7.1, scale: 18, base: [0.94, 0.94, 0.94], chipA: [0.42, 0.44, 0.47], chipB: [0.62, 0.63, 0.65], chipC: [0.15, 0.15, 0.16], chipD: [0.8, 0.8, 0.82], swatch: 'grayscale(1)' },
  { id: 'charcoal', label: 'Charcoal', seed: 2.5, scale: 20, base: [0.85, 0.85, 0.84], chipA: [0.18, 0.18, 0.18], chipB: [0.35, 0.35, 0.36], chipC: [0.08, 0.08, 0.08], chipD: [0.55, 0.55, 0.56], swatch: 'grayscale(1) brightness(0.72)' },
  { id: 'bone', label: 'Bone', seed: 9.4, scale: 15, base: [0.97, 0.96, 0.93], chipA: [0.85, 0.82, 0.76], chipB: [0.74, 0.71, 0.65], chipC: [0.78, 0.54, 0.43], chipD: [0.92, 0.9, 0.85], swatch: 'saturate(0.2) brightness(1.15)' },
];

const FINISHES = [
  { id: 'matte', label: 'Matte', polish: 0.08 },
  { id: 'honed', label: 'Honed', polish: 0.4 },
  { id: 'polished', label: 'Polished', polish: 0.95 },
];

export default function Configurator() {
  const [pattern, setPattern] = useState(0);
  const [finish, setFinish] = useState(0);

  return (
    <section className={styles.section}>
      <header className={styles.head}>
        <span className={styles.kicker}>The configurator — specify</span>
        <h2 className={styles.h2}>
          Your pattern. <em>Your finish.</em>
        </h2>
      </header>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <span className={styles.panelLabel}>01 — Pattern</span>
          <div className={styles.swatches}>
            {PATTERNS.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.swatch} ${
                  pattern === i ? styles.active : ''
                }`}
                onClick={() => setPattern(i)}
                aria-label={p.label}
              >
                <img
                  src="/tile-filled.svg"
                  alt=""
                  className={styles.swatchFace}
                  style={{ filter: p.swatch }}
                />
                <span className={styles.swatchLabel}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <InView className={styles.stage}>
          <ConfiguratorCanvas
            pattern={PATTERNS[pattern]}
            targetPolish={FINISHES[finish].polish}
          />
        </InView>

        <div className={`${styles.panel} ${styles.right}`}>
          <span className={styles.panelLabel}>02 — Finish</span>
          <div className={styles.finishes}>
            {FINISHES.map((f, i) => (
              <button
                key={f.id}
                className={`${styles.finishBtn} ${
                  finish === i ? styles.active : ''
                }`}
                onClick={() => setFinish(i)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className={styles.note}>
            Hold a finished tile to the light and the surface changes with the
            angle. That is the cement, not a print.
          </p>
        </div>
      </div>
    </section>
  );
}
