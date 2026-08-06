import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Abgeleitet vom Farbschema der Praxis-Website (zahnarzt-schenefeld.de):
        // gedecktes Stahlblau #3d5d86 als Primärfarbe.
        brand: {
          50: "#f2f5f8",
          100: "#e2e8f0",
          200: "#c3d0e0",
          300: "#9aacc6",
          400: "#6a85a8",
          500: "#4f6c92",
          600: "#3d5d86",
          700: "#314a6b",
          800: "#263a54",
        },
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
