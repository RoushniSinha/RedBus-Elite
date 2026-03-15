/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // OLED-optimised dark background
        'oled-black': '#000000',
      },
    },
  },
  plugins: [],
}
