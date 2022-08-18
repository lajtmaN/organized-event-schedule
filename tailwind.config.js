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
      gridTemplateColumns: {
        "auto-w-72": "repeat(auto-fill, minmax(auto, 286px))",
      }
    },
  },
  plugins: [require("flowbite/plugin")],
};
