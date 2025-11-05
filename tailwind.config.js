/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sila: {
          dark: '#0b0c22',
          primary: '#4f3aa7',
          light: '#b39cff',
        },
      },
    },
  },
  plugins: [],
}

