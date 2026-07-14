import './globals.css';
import { DM_Serif_Display, DM_Sans, DM_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';

// Magazine-style high-contrast display serif (mapped onto the legacy
// --font-playfair variable so all components pick it up).
const playfair = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Royal Tiles — Handmade Mosaic & Terrazzo Since 1938',
  description:
    'Every tile tells a different story. Handcrafted mosaic and terrazzo tiles, poured, pressed, and polished by hand since 1938.',
};

export const viewport = {
  themeColor: '#C68A6E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
