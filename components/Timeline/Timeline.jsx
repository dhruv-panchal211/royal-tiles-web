'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './timeline.module.css';

const STEPS = [
  { t: 'Pigment Selection', d: 'Mineral colour is weighed and mixed by hand, batch by batch.' },
  { t: 'Mold Preparation', d: 'Brass dividers are set into the mold to hold each pattern line.' },
  { t: 'The Pour', d: 'Coloured cement is ladled into each cell, one shade at a time.' },
  { t: 'Backing Layer', d: 'A coarse mortar is added to give the tile its body and strength.' },
  { t: 'Hydraulic Press', d: '200 tonnes of pressure bond the layers into a single slab.' },
  { t: 'Curing', d: 'Tiles rest and cure slowly for up to four weeks.' },
  { t: 'Honing & Polish', d: 'The surface is ground back until the pattern reveals itself.' },
  { t: 'Inspection', d: 'Every tile is checked by eye. None is ever quite the same.' },
];

export default function Timeline() {
  const ref = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = reduced ? 0 : len;

      if (!reduced) {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });

        gsap.utils.toArray(`.${styles.step}`).forEach((el) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          });
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={styles.section}>
      <header className={styles.head}>
        <span className={styles.kicker}>The process — start to finish</span>
        <h2 className={styles.h2}>
          Eight steps. <em>Eighty-five years.</em>
        </h2>
      </header>

      <div className={styles.timeline}>
        <svg
          className={styles.line}
          preserveAspectRatio="none"
          viewBox="0 0 10 1000"
          aria-hidden
        >
          <path
            ref={pathRef}
            d="M5,0 L5,1000"
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="2"
          />
        </svg>

        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`${styles.step} ${i % 2 ? styles.right : styles.left}`}
          >
            <img src="/tile-filled.svg" alt="" className={styles.dot} />
            <span className={styles.watermark} aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>Step {i + 1} / 08</span>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepBody}>{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
