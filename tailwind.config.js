/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        red: '#E1241C',
        'red-deep': '#B5160F',
        ink: '#1C1B1A',
        grey: '#8A8C8F',
        paper: '#F5F2ED',
        line: '#E6E1D9',
        /* legacy aliases mapped to the brand palette */
        clay: '#E1241C',
        sand: '#F5F2ED',
        slate: '#1C1B1A',
        chalk: '#FFFFFF',
        cement: '#8A8C8F',
        indigo: '#5B5F66',
        gold: '#E1241C',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(3.5rem, 8vw, 8rem)', { lineHeight: '0.95' }],
        h2: ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1.05' }],
        h3: ['clamp(1.25rem, 2vw, 2rem)', { lineHeight: '1.2' }],
      },
      letterSpacing: {
        caption: '0.15em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
