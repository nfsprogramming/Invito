/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "#F8F3EA",
        surface: "#FFFDF8",
        plum: {
          DEFAULT: "#321C32",
          dark: "#241323",
          light: "#4A2B4A",
          subtle: "#F5EFF5",
        },
        gold: {
          DEFAULT: "#C6A15B",
          light: "#E8D7AE",
          dark: "#A8833E",
          pale: "#FBF7EF",
        },
        rose: {
          DEFAULT: "#B97878",
          soft: "#F3E3E1",
          deep: "#8E4B4B",
        },
        ink: {
          DEFAULT: "#2A2423",
          secondary: "#756C67",
          muted: "#9B918A",
        },
        border: {
          DEFAULT: "#E7DDD0",
          light: "#F0E8DC",
          dark: "#D4C7B5",
        },
        success: "#527A61",
        danger: "#B65C5C",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "'Playfair Display'", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        stationery: "0 10px 30px -5px rgba(50, 28, 50, 0.07), 0 2px 6px -1px rgba(198, 161, 91, 0.08)",
        "stationery-hover": "0 20px 40px -8px rgba(50, 28, 50, 0.12), 0 4px 12px -2px rgba(198, 161, 91, 0.16)",
        gold: "0 0 25px rgba(198, 161, 91, 0.25)",
        plum: "0 12px 30px -6px rgba(50, 28, 50, 0.35)",
      },
    },
  },
  plugins: [],
};
