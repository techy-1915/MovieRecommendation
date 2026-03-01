/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        dark: '#0f0f0f',
        card: '#1a1a1a',
      }
    },
  },
  plugins: [],
}
