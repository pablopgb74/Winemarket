import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf0f0',
          100: '#fbe4e4',
          200: '#f6c9c9',
          300: '#f0a1a1',
          400: '#e87171',
          500: '#e04a4a',
          600: '#d43434',
          700: '#b82a2a',
          800: '#962626',
          900: '#7a2323',
          950: '#420f0f',
        },
        dark: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#c8c8c8',
          400: '#a0a0a0',
          500: '#888888',
          600: '#707070',
          700: '#585858',
          800: '#484848',
          900: '#383838',
          950: '#1a1a2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
}
export default config