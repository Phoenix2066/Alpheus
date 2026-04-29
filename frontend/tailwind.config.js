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
        accent: {
          light: '#fbbf24', // amber-400
          DEFAULT: '#f59e0b', // amber-500
        },
        surface: {
          light: '#f8fafc', // slate-50
          dark: '#0f172a', // slate-900
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
