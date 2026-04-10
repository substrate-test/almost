import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'almost-bg': '#0b0b0b',
        'almost-surface': '#141414',
        'almost-border': '#2a2a2a',
        'almost-pink': '#FE0155',
        'almost-text': '#f0ece4',
        'almost-muted': '#555555',
        'almost-secondary': '#888888',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      keyframes: {
        'screen-in': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px 8px rgba(254,1,85,0.15)' },
          '50%': { boxShadow: '0 0 60px 20px rgba(254,1,85,0.3)' },
        },
        'count-up': {
          from: { opacity: '0.4', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'screen-in': 'screen-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'count-up': 'count-up 0.4s ease-out forwards',
        'breathe': 'breathe 5s ease-in-out infinite',
        'sheet-up': 'sheet-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
