/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{tsx,jsx}",
    "./node_modules/daisyui/dist/**/*.js",
    "./node_modules/react-daisyui/dist/**/*.js",
    "./node_modules/react-select/dist/react-select.esm.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

