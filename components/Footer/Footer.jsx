'use client';

import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.wordmark}>
            Royal <em>Tiles</em>
          </span>
          <img src="/tile-filled.svg" alt="" className={styles.mark} />
        </div>

        <div className={styles.middle}>
          <nav className={styles.nav}>
            <span className={styles.colLabel}>Explore</span>
            <a href="#collections">Collections</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <address className={styles.address}>
            <span className={styles.colLabel}>Workshop</span>
            Via dei Mosaici 19
            <br />
            Vicenza, Italy
            <br />
            hello@royaltiles.example
          </address>

          <div className={styles.social}>
            <span className={styles.colLabel}>Follow</span>
            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">Journal</a>
          </div>

          <div className={styles.est}>
            <span className={styles.colLabel}>Est.</span>
            <span className={styles.estYear}>1938</span>
            <span className={styles.estNote}>Bespoke cement terrazzo surfaces</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Royal Tiles® — Each footer visit is
            unique.
          </p>
          <span className={styles.legal}>Poured by hand since 1938</span>
        </div>
      </div>
    </footer>
  );
}
