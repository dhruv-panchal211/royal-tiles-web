'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './grid.module.css';

const COLLECTIONS = [
  { name: 'Terrazzo Classic', sku: 'TZ-001', span: 'sm', hue: 28 },
  { name: 'Geometric Mosaic', sku: 'GM-014', span: 'lg', hue: 210 },
  { name: 'Floral Series', sku: 'FL-007', span: 'sm', hue: 340 },
  { name: 'Heritage Encaustic', sku: 'HE-022', span: 'lg', hue: 45 },
  { name: 'Minimal Lines', sku: 'ML-003', span: 'sm', hue: 200 },
  { name: 'Custom Order', sku: 'CO-000', span: 'sm', hue: 18 },
];

export default function ProductGrid() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.card}`, {
        y: 80,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section}>
      <header className={styles.head}>
        <span className="caption" style={{ color: 'var(--color-clay)' }}>
          The Collections
        </span>
        <h2 className={styles.h2}>Patterns with a past.</h2>
      </header>

      <div className={styles.grid}>
        {COLLECTIONS.map((c, i) => (
          <article
            key={i}
            className={`${styles.card} ${styles[c.span]}`}
            style={{ '--hue': `${c.hue}deg` }}
          >
            <div className={styles.tileFace} aria-hidden />
            <div className={styles.meta}>
              <h3 className={styles.name}>{c.name}</h3>
              <span className={styles.sku}>{c.sku}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
