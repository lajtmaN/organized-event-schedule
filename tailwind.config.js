/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,jsx,js}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: "#5865f2",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
