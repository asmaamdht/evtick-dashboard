/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f9386",
        second: "#A9E7DF",
        textColor: "#b3b0c3",
      },

    },
    fontFamily: {
      hand: ["Caveat", "cursive"],
      header: ['"Playfair Display"', 'serif'],
      text: ['"DM Sans"', 'sans-serif'],
    },
  },
  plugins: [],
}

