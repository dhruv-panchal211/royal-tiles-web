'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import HandPour from './HandPour';
import styles from './hero.module.css';

const HEADLINE = [
  ['Every', 'Tile'],
  ['Tells', 'a'],
  ['Different', 'Story.'],
];

// Floor tiles are always square, at their natural size (~TILE_SIZE px).
// Column/row counts are derived from the viewport at mount so the grid
// covers the whole hero without stretching any tile.
const TILE_SIZE = 160;
const TILE_GAP = 6;

// Fills + pour clip injected into the fetched mold SVG.
const SVG_INJECT = `
<style>
  #strokes path { stroke: #1C1B1A; stroke-opacity: 0.45; }
  #poured [data-region-id="region-1"] { fill: #D9D6D0; }
  #poured [data-region-id="region-3"] { fill: #C68A6E; }
  #poured .pour-bg { fill: #F5F2ED; }
</style>
<defs>
  <clipPath id="pourClip" clipPathUnits="userSpaceOnUse">
    <rect id="pourRect" x="0" y="119" width="120" height="0" />
  </clipPath>
</defs>`;

export default function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const pourRectRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let ctx;
    let cancelled = false;

    // Load the regionized mold SVG and prepare it for pouring. Runs async;
    // the (already-created) timeline drives the pour rect via pourRectRef.
    async function loadMold() {
      let svgText = '';
      try {
        const res = await fetch('/tile-mold.svg');
        svgText = await res.text();
      } catch {
        return;
      }
      if (cancelled || !stageRef.current) return;

      // inject our defs/styles right after the opening <svg ...> tag
      svgText = svgText.replace(/>/, '>' + SVG_INJECT);
      stageRef.current.innerHTML = svgText;

      const svg = stageRef.current.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('class', styles.moldSvg);

      // wrap the regions so colour is clipped (poured) from the bottom up
      const regions = svg.querySelector('#regions');
      if (regions) {
        regions.setAttribute('id', 'poured');
        regions.setAttribute('clip-path', 'url(#pourClip)');
        // cream tile body, revealed together with the pigment
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('class', 'pour-bg');
        bg.setAttribute('x', '0');
        bg.setAttribute('y', '0');
        bg.setAttribute('width', '120');
        bg.setAttribute('height', '119');
        regions.insertBefore(bg, regions.firstChild);
      }

      pourRectRef.current = svg.querySelector('#pourRect');

      // reduced motion: show a finished tile, no scroll choreography
      if (reduced && pourRectRef.current) {
        pourRectRef.current.setAttribute('y', '0');
        pourRectRef.current.setAttribute('height', '119');
      }
    }

    loadMold();

    if (reduced) {
      gsap.set(`.${styles.word}`, { yPercent: 0, opacity: 1 });
      gsap.set(`.${styles.handLayer}`, { autoAlpha: 0 });
      return () => {
        cancelled = true;
      };
    }

    // Build the floor grid imperatively so the tiles are always square at
    // their natural size: column/row counts come from the viewport.
    const secW = sectionRef.current.offsetWidth;
    const secH = sectionRef.current.offsetHeight;
    const cols = Math.max(3, Math.round(secW / TILE_SIZE));
    const size = (secW - (cols - 1) * TILE_GAP) / cols;
    const rows = Math.ceil((secH + TILE_GAP) / (size + TILE_GAP));
    // centre-ish cell of the visible rows — where the tile lands
    const visRows = Math.max(1, Math.round(secH / (size + TILE_GAP)));
    const LAND_INDEX =
      Math.floor((visRows - 1) / 2) * cols + Math.floor((cols - 1) / 2);

    const floorEl = gridRef.current;
    floorEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    floorEl.innerHTML = '';
    for (let i = 0; i < cols * rows; i++) {
      const d = document.createElement('div');
      d.className = styles.floorCell;
      d.style.backgroundImage = 'url(/tile-filled.svg)';
      // the landing cell stays unfiltered so the arriving tile crossfades
      // into it seamlessly
      if (i !== LAND_INDEX) {
        d.style.filter = `hue-rotate(${((i * 31) % 12) - 6}deg) brightness(${
          0.94 + ((i * 13) % 5) * 0.03
        })`;
      }
      floorEl.appendChild(d);
    }

    // IMPORTANT: the pinned timeline is created synchronously on mount so
    // ScrollTrigger registers this section's pin BEFORE the later sections
    // compute their positions. (Creating it after the SVG fetch left every
    // other trigger ~1 viewport early — they slid over the hero mid-pin.)
    {
      ctx = gsap.context(() => {
        // intro: headline words rise in
        gsap.from(`.${styles.word}`, {
          yPercent: 120,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.08,
          delay: 0.2,
        });

        const cells = gridRef.current.children;
        gsap.set(cells, {
          autoAlpha: 0,
          scale: 0.6,
          transformOrigin: '50% 50%',
        });
        // the landing cell must match the arriving tile exactly — no pop
        gsap.set(cells[LAND_INDEX], { scale: 1 });
        gsap.set(`.${styles.handLayer}`, {
          yPercent: -65,
          autoAlpha: 0,
          rotation: -6,
          transformOrigin: '64% 52%',
        });
        gsap.set('[data-stream]', { scaleY: 0, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 — the ladle tips in and pours pigment into the mold
        tl.to(
          `.${styles.handLayer}`,
          {
            yPercent: 0,
            autoAlpha: 1,
            rotation: 2,
            ease: 'power2.out',
            duration: 1,
          },
          0
        );
        // the stream of pigment falls from the spout
        tl.to(
          '[data-stream]',
          { scaleY: 1, autoAlpha: 1, ease: 'power1.out', duration: 0.7 },
          0.7
        );
        // pigment floods the mold from the bottom up, in time with the pour
        // (driven through a proxy so the tween exists before the SVG loads)
        const pour = { v: 0 };
        tl.to(
          pour,
          {
            v: 1,
            ease: 'power1.inOut',
            duration: 4,
            onUpdate: () => {
              const r = pourRectRef.current;
              if (r) {
                r.setAttribute('y', String(119 * (1 - pour.v)));
                r.setAttribute('height', String(119 * pour.v));
              }
            },
          },
          0.9
        );
        // ladle tips deeper as it empties, then eases back — the pouring gesture
        tl.to(
          `.${styles.handLayer}`,
          { rotation: 7, ease: 'sine.inOut', duration: 2.4 },
          1
        );
        tl.to(
          `.${styles.handLayer}`,
          { rotation: 3, ease: 'sine.inOut', duration: 1.4 },
          3.4
        );
        // headline + labels lift away while the tile fills
        tl.to(
          `.${styles.headline}`,
          { yPercent: -50, opacity: 0, ease: 'none', duration: 3 },
          0
        );
        tl.to(
          [`.${styles.scrollCue}`, `.${styles.since}`],
          { opacity: 0, duration: 1, ease: 'none' },
          0
        );
        // stream tapers off and the ladle lifts away once the tile is full
        tl.to(
          '[data-stream]',
          { scaleY: 0.12, autoAlpha: 0, ease: 'power1.in', duration: 0.6 },
          4.5
        );
        tl.to(
          `.${styles.handLayer}`,
          {
            yPercent: -70,
            autoAlpha: 0,
            rotation: -4,
            ease: 'power2.in',
            duration: 1,
          },
          4.8
        );

        // Phase 2 — hold the completed tile a beat
        tl.to({}, { duration: 1 });

        // Phase 3 — the finished tile shrinks into its place on the floor,
        // becoming one of the tiles; the rest are laid in one by one
        const landCell = cells[LAND_INDEX];
        tl.to(
          stageRef.current,
          {
            x: () =>
              landCell.offsetLeft +
              landCell.offsetWidth / 2 -
              sectionRef.current.offsetWidth / 2,
            y: () =>
              landCell.offsetTop +
              landCell.offsetHeight / 2 -
              sectionRef.current.offsetHeight / 2,
            scaleX: () => landCell.offsetWidth / stageRef.current.offsetWidth,
            scaleY: () =>
              landCell.offsetHeight / stageRef.current.offsetHeight,
            ease: 'power2.inOut',
            duration: 2.5,
          },
          'floor'
        );
        // crossfade: the arriving tile becomes the landing floor tile
        tl.to(landCell, { autoAlpha: 1, duration: 0.25 }, 'floor+=2.35');
        tl.to(stageRef.current, { autoAlpha: 0, duration: 0.25 }, 'floor+=2.5');
        // remaining tiles pop in one by one, radiating out from the laid tile
        tl.to(
          cells,
          {
            autoAlpha: 1,
            scale: 1,
            ease: 'back.out(1.6)',
            duration: 0.4,
            stagger: {
              each: 0.22,
              grid: [rows, cols],
              from: LAND_INDEX,
            },
          },
          'floor+=2.7'
        );
        // the finished floor settles gently
        tl.fromTo(
          `.${styles.floorScene}`,
          { scale: 1.04 },
          { scale: 1, ease: 'power1.out', duration: 2, immediateRender: false },
          'floor+=2.9'
        );
        // hold the finished floor on screen before the section unpins
        tl.to({}, { duration: 2 });
      }, sectionRef);
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* full-bleed tiled floor — square cells are built at mount so every
          tile keeps its natural size (revealed last, tile by tile) */}
      <div className={styles.floorScene} aria-hidden>
        <div ref={gridRef} className={styles.floor} />
      </div>

      {/* the animated mold / single tile */}
      <div className={styles.stageWrap}>
        <div ref={stageRef} className={styles.stage} aria-hidden />
      </div>

      {/* metal ladle pouring pigment */}
      <HandPour />

      <div className={styles.content}>
        <span className={styles.since}>Since 1938</span>

        <h1 className={styles.headline}>
          {HEADLINE.map((line, i) => (
            <span key={i} className={styles.line}>
              {line.map((w, j) => (
                <span key={j} className={styles.wordMask}>
                  <span className={styles.word}>{w}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className={styles.scrollCue}>
          <span className={styles.cueText}>Scroll to pour</span>
          <span className={styles.arrow} aria-hidden>
            ↓
          </span>
        </div>
      </div>
    </section>
  );
}
