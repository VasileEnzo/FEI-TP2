/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        grid: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "20px 20px"
      }
    },
  },
  plugins: [],
}
