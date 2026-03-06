/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f4fd',
          100: '#c5e3fa',
          500: '#1B4F8A',
          600: '#154080',
          700: '#0e3070',
        },
        medical: {
          green:  '#27AE60',
          orange: '#E67E22',
          red:    '#E74C3C',
          yellow: '#F39C12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}