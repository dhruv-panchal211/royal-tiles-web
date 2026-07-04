'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './gallery.module.css';

const PROJECTS = [
  { name: 'Café Marseille', loc: 'Lisbon', col: 'Terrazzo Classic', h: 1.3, hue: 28 },
  { name: 'Villa Aoki', loc: 'Kyoto', col: 'Minimal Lines', h: 1.0, hue: 200 },
  { name: 'Hotel Estela', loc: 'Barcelona', col: 'Heritage Encaustic', h: 1.5, hue: 45 },
  { name: 'The Florian', loc: 'Venice', col: 'Geometric Mosaic', h: 1.1, hue: 210 },
  { name: 'Casa Bloom', loc: 'Mexico City', col: 'Floral Series', h: 1.4, hue: 340 },
  { name: 'Atelier Nord', loc: 'Copenhagen', col: 'Monocromo', h: 0.95, hue: 0 },
  { name: 'Rooftop Sole', loc: 'Rome', col: 'Ambra', h: 1.25, hue: 38 },
  { name: 'Maison Verte', loc: 'Paris', col: 'Verde', h: 1.05, hue: 140 },
];

export default function Gallery() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.card}`, {
        scale: 0.95,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.05,
        scrollTrigger: { trigger: `.${styles.grid}`, start: 'top 80%' },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section}>
      <blockquote className={styles.quote}>
        “A floor you can read like a memory.”
        <cite>— Architectural Digest</cite>
      </blockquote>

      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <figure
            key={i}
            className={styles.card}
            style={{ '--hue': `${p.hue}deg`, '--ratio': p.h }}
          >
            <div className={styles.image} aria-hidden />
            <figcaption className={styles.overlay}>
              <span className={styles.pName}>{p.name}</span>
              <span className={styles.pMeta}>
                {p.loc} · {p.col}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
