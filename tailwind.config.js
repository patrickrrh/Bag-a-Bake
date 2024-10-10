/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#331612",
        background: "#FEFAF9",
        black: "#1B1514",
        placeholder: "#828282",
        brown: "#B0795A",
        orange: "#FA6F33"
      },
    },
  },
  plugins: [],
}

