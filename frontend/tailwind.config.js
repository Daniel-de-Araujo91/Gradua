const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    ".flowbite-react\\class-list.json",
    ".flowbite-react/class-list.json"
  ],
  theme: {
    extend: {
      colors: {
        gradua: {
          inicio: '#1e3a5f',
          agenda: '#85305a',
          forum: ' #1e5f22',
          perfil: '#c26d23'
        }
      }
    },
  },
  plugins: [
     require('flowbite/plugin'),
     flowbiteReact
  ],
}