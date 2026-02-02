/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary, #323437)',
        'bg-secondary': '#2c2e31',
        'text-primary': '#d1d0c5',
        'text-secondary': '#646669',
        'accent': 'var(--color-accent, #5d8a66)',
        'error': '#ca4754',
        'correct': '#d1d0c5',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
