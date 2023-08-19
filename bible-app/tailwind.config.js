/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        serenity: {
          100: "#B3CEE5",
          200: "#91B8D9",
          300: "#6FA2CE",
          400: "#4C8CC2",
          500: "#3975A7",
          600: "#2D5D85",
          700: "#224563",
        },
        freesia: {
          100: "#FBE7A8",
          200: "#FADB7C",
          300: "#F8CF50",
          400: "#F6C324",
          500: "#E3AE09",
          600: "#B78C08",
          700: "#8B6A06",
        },
        midnightBlue: {
          100: "#AFAFED",
          200: "#8A8AE5",
          300: "#6464DC",
          400: "#3F3FD4",
          500: "#2A2ABB",
          600: "#212196",
          700: "#191970",
        },
      },
    },
  },
  plugins: [],
}
