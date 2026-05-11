/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0f',
        accent: '#00d4ff',
      },
    },
  },
  plugins: [],
}
