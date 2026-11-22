/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        canvas: "#F7F5F0",
        stone: "#EFECE4",
        surface: "#FFFFFF",
        obsidian: "#060510",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#64748B",
        },
        brand: {
          DEFAULT: "#0B5D4B",
          light: "#ECFDF5",
          dark: "#064E3B",
        },
      },
    },
  },
  plugins: [],
};
