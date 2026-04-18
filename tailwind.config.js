/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inter)"],
        heading: ["var(--font-poppins)"],
        logo: ["var(--font-orbitron)"],
      },
    },
  },
  plugins: [],
}