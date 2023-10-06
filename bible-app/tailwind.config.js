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
        scarlet: {
          100: "#FF9A8A",
          200: "#FF735C",
          300: "#FF4B2E",
          400: "#FF2400",
          500: "#D11E00",
          600: "#A31700",
          700: "#751100",
        },
        beige: {
          100: "#BD9D78",
          200: "",
          300: "",
          400: "",
          500: "",
          600: "",
          700: "",
        },
        blueGray: {
          100: "#CDDEEE",
          200: "#ABC7E3",
          300: "#88B0D7",
          400: "#6699CC",
          500: "#4482C1",
          600: "#366BA1",
          700: "#2A547E",
        },
      },
      fontFamily: {
        body: ["Bebas Neue"],
        header: ["Shrikhand", "cursive"],
      },
    },
  },
  plugins: [],
}
