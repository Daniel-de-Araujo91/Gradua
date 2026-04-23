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
          agenda: '#6d597a',
          forum: '#52796f',
          perfil: '#b85d43'
        }
      }
    },
  },
  plugins: [],
}