'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './preloader.module.css';

// Position (as % of the logo box) of the three red shapes — the tile's
// evolution: plain square -> shaped square -> fully shaped "flag".
// Covers are sized a touch larger than each shape; extra sits on the white
// background so it stays invisible. Order = the order they reveal.
const SHAPES = [
  { left: '-2%', top: '47.5%', width: '33%', height: '31%' }, // plain square
  { left: '25%', top: '21.5%', width: '37%', height: '32%' }, // shaped square
  { left: '55.5%', top: '-2%', width: '35%', height: '30%' }, // flag
];

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const coverRefs = useRef([]);
  const sparkRefs = useRef([]);
  const [hidden, setHidden] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const tl = gsap.timeline();

    if (reduced) {
      gsap.set(logoRef.current, { opacity: 1, scale: 1 });
      gsap.set(coverRefs.current, { opacity: 0 });
      tl.to(rootRef.current, {
        opacity: 0,
        duration: 0.25,
        delay: 0.4,
        onComplete: () => {
          setHidden(true);
          onCompleteRef.current?.();
        },
      });
      return () => tl.kill();
    }

    // initial: logo present but the three red shapes hidden under white covers
    gsap.set(logoRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(coverRefs.current, { opacity: 1, scale: 1 });
    gsap.set(sparkRefs.current, { opacity: 0, scale: 0.5 });
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // logo (without its squares) eases in
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power3.out',
    });

    // reveal each shape in turn — the tile evolving
    SHAPES.forEach((_, i) => {
      const at = 0.75 + i * 0.6;
      tl.to(
        coverRefs.current[i],
        { opacity: 0, scale: 1.18, duration: 0.45, ease: 'power2.in' },
        at
      );
      // highlight pulse as the shape appears
      tl.fromTo(
        sparkRefs.current[i],
        { opacity: 0.9, scale: 0.7 },
        {
          opacity: 0,
          scale: 1.5,
          duration: 0.7,
          ease: 'power2.out',
          immediateRender: false,
        },
        at + 0.05
      );
      // little pop on the logo to accent the new shape
      tl.to(
        logoRef.current,
        { scale: 1.015, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' },
        at + 0.05
      );
    });

    // loading line fills across the whole sequence (replaces the % counter)
    tl.to(barRef.current, { scaleX: 1, duration: 2.5, ease: 'power1.inOut' }, 0.2);

    // settle, then lift away to reveal the hero
    tl.to(logoRef.current, { scale: 1.05, duration: 0.4, ease: 'power2.in' }, '+=0.15');
    tl.to(
      rootRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setHidden(true);
          onCompleteRef.current?.();
        },
      },
      '-=0.1'
    );

    return () => tl.kill();
  }, []);

  if (hidden) return null;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.logoWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/logo.png"
          alt="Royal Tiles"
          className={styles.logo}
        />
        {SHAPES.map((s, i) => (
          <span
            key={`c${i}`}
            ref={(el) => (coverRefs.current[i] = el)}
            className={styles.cover}
            style={s}
            aria-hidden
          />
        ))}
        {SHAPES.map((s, i) => (
          <span
            key={`s${i}`}
            ref={(el) => (sparkRefs.current[i] = el)}
            className={styles.spark}
            style={s}
            aria-hidden
          />
        ))}
      </div>
      <div className={styles.bar} aria-hidden>
        <span ref={barRef} className={styles.barFill} />
      </div>
    </div>
  );
}
