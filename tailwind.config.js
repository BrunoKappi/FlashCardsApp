/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: '#E4A11B',
          brighter: '#f2bb4e',
        },
        blue: {
          DEFAULT: '#3B71CA',
          brighter: '#5f88cb',
        }
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
        mitr: ['Mitr', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
