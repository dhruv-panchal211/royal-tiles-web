# Royal Tiles — Heritage Mosaic & Terrazzo

A premium, immersive 3D marketing site for a handmade mosaic & terrazzo tile
manufacturer crafting tiles by hand since 1938.

## Stack

- **Next.js 14** (App Router, JS)
- **React Three Fiber** + **drei** — 3D tile rendering
- **Custom GLSL** — seeded procedural terrazzo shader (`lib/terrazzo.glsl.js`)
- **GSAP** + **ScrollTrigger** — scroll-linked animation, pinning, horizontal scroll
- **Lenis** — smooth scroll, wired into the GSAP ticker
- **Tailwind CSS** + **CSS Modules** — design tokens + component styles
- **next/font** — Playfair Display, DM Sans, DM Mono

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Architecture notes

- **One procedural shader, no assets.** The terrazzo surface (chips, speckle,
  lighting, matte→polish gloss) is generated entirely in GLSL via a voronoi
  cellular pattern. Seed-based, so every tile is unique. No textures or HDR
  files are fetched at runtime.
- **WebGL context budget.** Several sections use their own `<Canvas>`. Browsers
  cap concurrent WebGL contexts, so each canvas is wrapped in
  [`components/InView.jsx`](components/InView.jsx) — it mounts the canvas only
  when near the viewport and unmounts it when far. This keeps 1–2 contexts live
  at a time and avoids "Context Lost".
- **DPR capped at `[1, 2]`** on every canvas.
- **Mobile:** R3F canvases are skipped on small screens (`useIsMobile`) in
  favour of lightweight CSS terrazzo fallbacks.
- **Reduced motion:** Lenis, pinning, and scrub animations are disabled and
  content is shown in its final state when `prefers-reduced-motion: reduce`.

## Sections

| # | Section | Component |
|---|---------|-----------|
| 0 | Preloader | `Preloader/` |
| 1 | Hero (pinned, 3D tile slab) | `Hero/` |
| 2 | Heritage marquee + count-up | `HeritageStrip/` |
| 3 | Horizontal "Craft" story (5 panels) | `HorizontalScroll/` |
| 4 | Product collections grid | `ProductGrid/` |
| 5 | Interactive 3×3 floating tiles + drawer | `TileShowcase/` |
| 6 | Process timeline (SVG line draw) | `Timeline/` |
| 7 | Pattern + finish configurator | `Configurator/` |
| 8 | Project gallery (masonry) | `Gallery/` |
| 9 | "Own a piece of 1938" CTA (gold tile + dust) | `CTA/` |
| 10 | Footer (mini rotating tile) | `Footer/` |

## Design tokens

Defined in both `app/globals.css` (CSS vars) and `tailwind.config.js`
(`clay`, `sand`, `slate`, `chalk`, `cement`, `indigo`, `gold`).
