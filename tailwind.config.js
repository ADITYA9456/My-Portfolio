const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `var(--color-${name})`
    : `color-mix(in srgb, var(--color-${name}) calc(${opacityValue} * 100%), transparent)`

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: token('night'),
        paper: token('paper'),
        dots: token('dots'),
        tech: token('tech'),
        muted: token('muted'),
        surface: token('surface'),
        ink: token('ink'),
        line: token('line'),
        rule: token('rule'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif)'],
      },
    },
  },
  plugins: [],
}
