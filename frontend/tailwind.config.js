/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        primaryHover: '#059669',
        darkBg: '#0f172a',
        darkSurface: '#1e293b',
        lightBg: '#f8fafc',
        lightSurface: '#ffffff',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
