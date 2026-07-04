'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import InView from '@/components/InView';
import styles from './configurator.module.css';

const ConfiguratorCanvas = dynamic(() => import('./ConfiguratorCanvas'), {
  ssr: false,
});

const PATTERNS = [
  { id: 'classic', label: 'Classic', seed: 1.2, scale: 16, base: [0.92, 0.89, 0.84], chipA: [0.78, 0.47, 0.29], chipB: [0.23, 0.26, 0.4], chipC: [0.15, 0.12, 0.1], chipD: [0.83, 0.66, 0.26] },
  { id: 'rose', label: 'Rosa', seed: 4.8, scale: 14, base: [0.95, 0.9, 0.88], chipA: [0.82, 0.45, 0.5], chipB: [0.6, 0.3, 0.38], chipC: [0.2, 0.15, 0.16], chipD: [0.9, 0.7, 0.55] },
  { id: 'forest', label: 'Verde', seed: 7.1, scale: 18, base: [0.9, 0.91, 0.86], chipA: [0.3, 0.45, 0.32], chipB: [0.18, 0.3, 0.22], chipC: [0.1, 0.12, 0.1], chipD: [0.7, 0.72, 0.5] },
  { id: 'mono', label: 'Monocromo', seed: 2.5, scale: 20, base: [0.93, 0.92, 0.9], chipA: [0.35, 0.34, 0.33], chipB: [0.6, 0.59, 0.57], chipC: [0.12, 0.12, 0.12], chipD: [0.8, 0.79, 0.77] },
  { id: 'indigo', label: 'Indaco', seed: 9.4, scale: 15, base: [0.9, 0.9, 0.92], chipA: [0.23, 0.29, 0.5], chipB: [0.4, 0.45, 0.65], chipC: [0.12, 0.14, 0.25], chipD: [0.75, 0.78, 0.85] },
  { id: 'amber', label: 'Ambra', seed: 5.6, scale: 13, base: [0.94, 0.9, 0.82], chipA: [0.85, 0.6, 0.25], chipB: [0.7, 0.42, 0.18], chipC: [0.3, 0.18, 0.08], chipD: [0.95, 0.8, 0.45] },
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
      <div className={styles.grid}>
        <div className={styles.panel}>
          <span className="caption" style={{ color: 'var(--color-clay)' }}>
            Pattern
          </span>
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
                <span
                  className={styles.swatchFace}
                  style={{
                    background: `rgb(${p.chipA.map((c) => c * 255).join(',')})`,
                  }}
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
          <span className="caption" style={{ color: 'var(--color-clay)' }}>
            Finish
          </span>
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
            Hold a finished tile to the light and the aggregate changes with
            the angle. That is the stone, not a print.
          </p>
        </div>
      </div>
    </section>
  );
}
