import type { Config } from "tailwindcss";

// The site's colour tokens, defined once. The dark student portal
// (/test-platform, /courses, /checkout, login) and the public site share
// them: graphite neutrals, saffron (gold) accent, jade/success for
// right/owned/saved, danger for wrong/errors. Use these, not Tailwind's
// built-in slate/gray/yellow/green/red.

// True graphite, no blue tint. Dark theme: 950 page background, 900 card
// surface, 800 borders and raised surfaces, 300-400 body/secondary text.
const graphite = {
  50: "#f8f8f7",
  100: "#f1f1ef",
  200: "#e2e1de",
  300: "#cbc9c5",
  400: "#a3a09a",
  500: "#7a7771",
  600: "#5c5a55",
  700: "#43413e",
  800: "#2b2a28",
  900: "#1b1a19",
  950: "#0f0f0e",
};

// Brand accent (gold/saffron): primary buttons, active states, highlights.
// On the dark theme the main button is saffron-400 with graphite-950 text.
const saffron = {
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
};

const jade = {
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
};

const danger = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite,
        saffron,
        jade,
        success: jade,
        danger,
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
