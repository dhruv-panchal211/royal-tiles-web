'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './horizontal.module.css';

const PANELS = [
  {
    n: '01',
    title: 'It starts with raw pigment.',
    body: 'Soft clay. Zinc grey. Bone white. Mineral colour, measured by eye and by memory.',
    art: 'pigment',
  },
  {
    n: '02',
    title: 'Hand-poured into every mold.',
    body: 'No machine decides where the colour settles. A craftsman does, one pour at a time.',
    art: 'pour',
  },
  {
    n: '03',
    title: 'Pressed under 200 tonnes.',
    body: 'Two hundred tonnes of pressure. One pair of hands to guide it.',
    art: 'press',
  },
  {
    n: '04',
    title: 'Cured. Polished. Unique.',
    body: 'Weeks of patience, then the surface is honed until the cement begins to shine.',
    art: 'polish',
  },
  {
    n: '05',
    title: 'No two are ever the same.',
    body: 'Same pattern. Same mold. A different story in every single tile.',
    art: 'grid',
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getScroll = () => track.scrollWidth - window.innerWidth;

      const horizontal = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + getScroll(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // reveal text per panel, scrubbed by the horizontal movement
      gsap.utils.toArray(`.${styles.panelInner}`).forEach((el) => {
        gsap.from(el.querySelectorAll('[data-reveal]'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            containerAnimation: horizontal,
            start: 'left 75%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={trackRef} className={styles.track}>
        {PANELS.map((p, i) => (
          <article key={i} className={styles.panel}>
            <span className={styles.bigNum} aria-hidden>
              {p.n}
            </span>

            <div className={styles.panelInner}>
              <div className={`${styles.art} ${styles['art_' + p.art]}`}>
                {p.art === 'pigment' &&
                  Array.from({ length: 3 }).map((_, k) => (
                    <span key={k} className={styles.heap} data-i={k} />
                  ))}
                {p.art === 'pour' && (
                  <span className={styles.pourBox}>
                    <img src="/tile-mold.svg" alt="" className={styles.pourMold} />
                    <img src="/tile-filled.svg" alt="" className={styles.pourFill} />
                  </span>
                )}
                {p.art === 'press' && (
                  <img src="/tile-filled.svg" alt="" className={styles.pressTile} />
                )}
                {p.art === 'polish' && (
                  <span className={styles.polishBox}>
                    <img src="/tile-filled.svg" alt="" />
                    <span className={styles.sheen} />
                  </span>
                )}
                {p.art === 'grid' &&
                  Array.from({ length: 9 }).map((_, k) => (
                    <img
                      key={k}
                      src="/tile-filled.svg"
                      alt=""
                      className={styles.gridTile}
                      style={{
                        filter: `hue-rotate(${((k * 37) % 14) - 7}deg) brightness(${
                          0.92 + (k % 4) * 0.04
                        })`,
                      }}
                    />
                  ))}
              </div>

              <span className={styles.kicker} data-reveal>
                The craft — {p.n} / 05
              </span>
              <h3 className={styles.title} data-reveal>
                {p.title}
              </h3>
              <p className={styles.body} data-reveal>
                {p.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
