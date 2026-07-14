'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './grid.module.css';

const COLLECTIONS = [
  { name: 'Terrazzo Classic', sku: 'TZ—001', note: '12 patterns', hue: 0 },
  { name: 'Geometric Mosaic', sku: 'GM—014', note: '18 patterns', hue: -8 },
  { name: 'Floral Series', sku: 'FL—007', note: '9 patterns', hue: 6 },
  { name: 'Heritage Encaustic', sku: 'HE—022', note: '24 patterns', hue: -4 },
  { name: 'Minimal Lines', sku: 'ML—003', note: '7 patterns', hue: 10 },
  { name: 'Custom Order', sku: 'CO—000', note: 'yours', hue: -12 },
];

export default function ProductGrid() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.row}`, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section}>
      <header className={styles.head}>
        <span className={styles.kicker}>Collections — the catalogue</span>
        <h2 className={styles.h2}>
          Patterns with <em>a past.</em>
        </h2>
      </header>

      <div className={styles.index}>
        {COLLECTIONS.map((c, i) => (
          <article key={i} className={styles.row}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <h3 className={styles.name}>{c.name}</h3>
            <span className={styles.meta}>
              {c.sku} · {c.note}
            </span>
            <span className={styles.thumb}>
              <img
                src="/tile-filled.svg"
                alt=""
                style={{ filter: `hue-rotate(${c.hue}deg)` }}
              />
            </span>
            <span className={styles.arrow} aria-hidden>
              →
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
