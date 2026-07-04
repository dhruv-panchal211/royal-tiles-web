'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import Tile from '@/components/three/Tile';
import { useIsMobile } from '@/lib/hooks';
import InView from '@/components/InView';
import styles from './footer.module.css';

function FooterTile() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[-2, 3, 4]} intensity={1.2} />
      <Tile
        seed={8.3}
        polish={0.4}
        size={[2.6, 2.6, 0.14]}
        rotationSpeed={0.01}
        rotation={[0.5, 0.3, 0]}
      />
    </Canvas>
  );
}

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.wordmark}>Royal Tiles</span>
          <span className={styles.est}>Est. 1938</span>
        </div>

        <nav className={styles.nav}>
          <a href="#collections">Collections</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className={styles.bottom}>
          <address className={styles.address}>
            Via dei Mosaici 19
            <br />
            Vicenza, Italy
            <br />
            hello@royaltiles.example
          </address>
          <div className={styles.social}>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Journal</a>
          </div>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Royal Tiles. Each footer visit is
          unique.
        </p>
      </div>

      {!isMobile && (
        <InView className={styles.tile}>
          <FooterTile />
        </InView>
      )}
    </footer>
  );
}
