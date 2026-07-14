'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './gallery.module.css';

const PROJECTS = [
  { name: 'Café Marseille', loc: 'Lisbon', col: 'Terrazzo Classic', h: 1.3, hue: 0, b: 1 },
  { name: 'Villa Aoki', loc: 'Kyoto', col: 'Minimal Lines', h: 1.0, hue: -8, b: 1.05 },
  { name: 'Hotel Estela', loc: 'Barcelona', col: 'Heritage Encaustic', h: 1.5, hue: 5, b: 0.94 },
  { name: 'The Florian', loc: 'Venice', col: 'Geometric Mosaic', h: 1.1, hue: -5, b: 1 },
  { name: 'Casa Bloom', loc: 'Mexico City', col: 'Floral Series', h: 1.4, hue: 9, b: 1.02 },
  { name: 'Atelier Nord', loc: 'Copenhagen', col: 'Slate', h: 0.95, hue: 0, b: 0.9 },
  { name: 'Rooftop Sole', loc: 'Rome', col: 'Terracotta', h: 1.25, hue: -10, b: 0.96 },
  { name: 'Maison Verte', loc: 'Paris', col: 'Bone', h: 1.05, hue: 7, b: 1.08 },
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
      <header className={styles.head}>
        <span className={styles.kicker}>Installations — in the wild</span>
        <blockquote className={styles.quote}>
          <span className={styles.quoteMark} aria-hidden>
            “
          </span>
          A floor you can read <em>like a memory.</em>
          <cite>— Architectural Digest</cite>
        </blockquote>
      </header>

      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <figure
            key={i}
            className={styles.card}
            style={{ '--ratio': p.h }}
          >
            <div
              className={styles.image}
              style={{
                filter: `hue-rotate(${p.hue}deg) brightness(${p.b})`,
              }}
              aria-hidden
            />
            <figcaption className={styles.overlay}>
              <span className={styles.pIndex}>
                № {String(i + 1).padStart(2, '0')}
              </span>
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
