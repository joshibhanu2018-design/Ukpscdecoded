import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b8c1",
          400: "#91919f",
          500: "#747484",
          600: "#5e5e6c",
          700: "#4d4d58",
          800: "#3d3d46",  
          900: "#2d2d33",
          950: "#1a1a1f",
        },
        saffron: {
          50: "#fff9eb",
          100: "#ffefc6",
          200: "#ffdc88",
          300: "#ffc94a",
          400: "#ffb620",
          500: "#f59307",
          600: "#d96d02",
          700: "#b44b06",
          800: "#92390c",
          900: "#78300d",
          950: "#451702",
        },
        jade: {
          50: "#edfcf5",
          100: "#d3f8e5",
          200: "#aaf0cf",
          300: "#73e3b3",
          400: "#3bce93",
          500: "#17b47a",
          600: "#0b9163",
          700: "#097452",
          800: "#0b5c42",
          900: "#0a4b37",
          950: "#052a20",
        },
        ivory: {
          50: "#fefdf8",
          100: "#fdf9ed",
          200: "#faf2d4",
          300: "#f6e8b4",
          400: "#f0d880",
          500: "#e9c44f",
          600: "#d4a72e",
          700: "#b18524",
          800: "#8f6923",
          900: "#755620",
          950: "#432e0e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
