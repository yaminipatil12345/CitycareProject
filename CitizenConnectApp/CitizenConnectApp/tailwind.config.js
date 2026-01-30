/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // 👈 add this for Expo Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
