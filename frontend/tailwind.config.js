/** @type {import('tailwindcss').Config} */
export default {
  // ── Enable class-based dark mode ──────────────────────
  // Adding/removing the "dark" class on <html> switches the theme.
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f5a623',
          light:   '#fbbf24',
          dim:     'rgba(245,166,35,0.12)',
        },
        // ── Dark surfaces ────────────────────────────────
        surface: {
          DEFAULT: '#141418',
          2:       '#1c1c22',
          3:       '#22222a',
        },
        border: {
          DEFAULT: '#28282f',
          2:       '#32323c',
        },
        muted:  '#6a6a8a',
        dimmed: '#404058',
      },

      fontFamily: {
        sans:  ['Syne', 'ui-sans-serif', 'system-ui'],
        serif: ['Instrument Serif', 'ui-serif', 'Georgia'],
        mono:  ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      keyframes: {
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.2s ease',
        fadeIn:    'fadeIn 0.15s ease',
        popIn:     'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },

  plugins: [],
};