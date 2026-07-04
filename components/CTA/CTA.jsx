'use client';

import dynamic from 'next/dynamic';
import { useIsMobile } from '@/lib/hooks';
import InView from '@/components/InView';
import styles from './cta.module.css';

const CTACanvas = dynamic(() => import('./CTACanvas'), { ssr: false });

export default function CTA() {
  const isMobile = useIsMobile();

  return (
    <section className={styles.section}>
      {!isMobile && (
        <InView className={styles.canvas}>
          <CTACanvas />
        </InView>
      )}
      <div className={styles.content}>
        <span className="caption" style={{ color: 'var(--color-gold)' }}>
          Own a piece of 1938
        </span>
        <h2 className={styles.h2}>Own a piece of 1938.</h2>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.primary}`}>
            Request a Sample
          </button>
          <button className={styles.btn}>View Catalogue</button>
        </div>
      </div>
    </section>
  );
}
