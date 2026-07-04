'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Mounts its children only while the wrapper is near the viewport, and
 * unmounts them once it scrolls well out of view. This keeps the number of
 * concurrent WebGL contexts low so the browser never loses one — essential
 * when several R3F canvases live on the same page.
 */
export default function InView({
  children,
  className,
  style,
  rootMargin = '300px',
  once = false,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return (
    <div ref={ref} className={className} style={style}>
      {inView ? children : null}
    </div>
  );
}
