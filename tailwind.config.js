/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF5EA', 100: '#FFFBF3', 200: '#F5EBD9', 300: '#EADBC1' },
        plum: { DEFAULT: '#4A1D3F', 400: '#7A3F6A', 500: '#5E2A51', 700: '#3A1531', 900: '#24091E' },
        gold: { DEFAULT: '#C9A24B', 300: '#E7CD8A', 400: '#D8B565', 600: '#A9822F' },
        blush: '#F2C9C4',
      },
      fontFamily: {
        hand: ['Caveat', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 2px rgba(74,29,63,.08), 0 8px 24px -8px rgba(74,29,63,.25)',
        glow: '0 0 0 0 rgba(201,162,75,.6)',
      },
    },
  },
  plugins: [],
}
