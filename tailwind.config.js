/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080A09',
        'bg-secondary': '#101311',
        surface: '#151916',
        border: 'rgba(255,255,255,0.10)',
        'text-primary': '#F2F3EF',
        'text-secondary': '#A7ADA5',
        accent: '#B7D36B',
        'accent-dark': '#52613A',
        orange: '#D88A4A',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
