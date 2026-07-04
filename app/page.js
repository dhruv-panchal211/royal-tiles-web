'use client';

import { useState, useEffect } from 'react';
import Preloader from '@/components/Preloader/Preloader';
import Hero from '@/components/Hero/Hero';
import HeritageStrip from '@/components/HeritageStrip/HeritageStrip';
import HorizontalScroll from '@/components/HorizontalScroll/HorizontalScroll';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import TileShowcase from '@/components/TileShowcase/TileShowcase';
import Timeline from '@/components/Timeline/Timeline';
import Configurator from '@/components/Configurator/Configurator';
import Gallery from '@/components/Gallery/Gallery';
import CTA from '@/components/CTA/CTA';
import Footer from '@/components/Footer/Footer';
import { ScrollTrigger } from '@/lib/gsap';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      // sections mounted after preloader -> recalc pin/scroll positions
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loaded]);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <main>
        <Hero />
        <HeritageStrip />
        <section id="process">
          <HorizontalScroll />
        </section>
        <section id="collections">
          <ProductGrid />
        </section>
        <TileShowcase />
        <Timeline />
        <Configurator />
        <Gallery />
        <section id="contact">
          <CTA />
        </section>
        <Footer />
      </main>
    </>
  );
}
