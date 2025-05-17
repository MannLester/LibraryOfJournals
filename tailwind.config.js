/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-gray': '#6B6B6B',
        'login-gray': '#DFDFDF',
        'signup-pink': '#E9184C',
        'paper': '#F5F3EE',
      },
      fontFamily: {
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'roboto': ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
