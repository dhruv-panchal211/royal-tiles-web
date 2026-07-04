'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './heritage.module.css';

const STATS = [
  { value: 1938, label: 'Founded', suffix: '' },
  { value: 85, label: 'Years crafting', suffix: '+' },
  { value: 100, label: 'Handmade', suffix: '%' },
  { value: 0, label: 'Two ever alike', suffix: '∞', literal: true },
];

const MARQUEE = [
  '1938 · Founded',
  '85+ Years · Crafting',
  '100% · Handmade',
  '∞ · Unique Tiles',
];

export default function HeritageStrip() {
  const ref = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={styles.strip}>
      <div className={styles.marqueeTrack}>
        {[...MARQUEE, ...MARQUEE].map((t, i) => (
          <span key={i} className={styles.marqueeItem}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>
              {s.literal ? (
                s.suffix
              ) : (
                <>
                  <span data-count={s.value}>0</span>
                  {s.suffix}
                </>
              )}
            </span>
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
