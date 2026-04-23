/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gradua: {
          inicio: '#1e3a5f',
          agenda: '#047857',
          forum: '#c2410c',
          perfil: '#4c1d95'
        }
      }
    },
  },
  plugins: [],
}