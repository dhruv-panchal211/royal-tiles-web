'use client';

import styles from './cta.module.css';

const EDGE_TILES = Array.from({ length: 14 });

export default function CTA() {
  return (
    <section className={styles.section}>
      <span className={styles.watermark} aria-hidden>
        1938
      </span>

      <div className={styles.content}>
        <span className={styles.kicker}>Request a sample</span>
        <h2 className={styles.h2}>
          Own a piece <em>of 1938.</em>
        </h2>
        <p className={styles.sub}>
          One tile, poured by hand and posted to your door. Hold the weight of
          eighty-five years.
        </p>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.primary}`}>
            Request a Sample
          </button>
          <button className={styles.btn}>View Catalogue</button>
        </div>
      </div>

      {/* laid-tile edge along the bottom, like the floor beginning */}
      <div className={styles.edge} aria-hidden>
        {EDGE_TILES.map((_, i) => (
          <img
            key={i}
            src="/tile-filled.svg"
            alt=""
            style={{
              filter: `hue-rotate(${((i * 31) % 12) - 6}deg) brightness(${
                0.94 + ((i * 13) % 5) * 0.03
              })`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
