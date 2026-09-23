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
        // Main 3-Color Brand Palette
        sinopia: {
          DEFAULT: "#D7400B",
          hover: "#BD3607",
          dark: "#A52E04",
          light: "#F7E6DF",
        },
        vanilla: {
          DEFAULT: "#E0DDAE",
          surface: "#ECE9C4",
          card: "#F4F2D8",
          dark: "#D0CD96",
          border: "#C8C488",
        },
        caribbean: {
          DEFAULT: "#336467",
          hover: "#254F52",
          dark: "#1A3739",
          muted: "#467679",
          light: "#E5ECEC",
        },
        // Component-level tokens mapped to Main Palette
        teal: {
          950: "#1A3739",
          900: "#254F52",
          800: "#2C5A5D",
          700: "#336467",
          600: "#3B7478",
          500: "#D7400B", // Primary brand button / action
          400: "#E05524",
          300: "#F08D69",
          200: "#F7B8A0",
          100: "#FCE8DF",
          50: "#FFF6F2",
        },
        gold: {
          600: "#BD3607",
          500: "#D7400B", // Sinopia accent
          400: "#E05524",
          300: "#F08D69",
          100: "#FCE8DF",
          50: "#FFF6F2",
        },
        sand: {
          500: "#8F8B5A",
          400: "#B8B37C",
          300: "#C8C488",
          200: "#D5D19C",
          100: "#DCD8A7",
          50: "#E0DDAE", // Vanilla Canvas Background
        },
        ink: {
          950: "#152E30",
          900: "#1E4143",
          800: "#275356",
          700: "#336467", // Caribbean Primary Text
          600: "#417478",
          500: "#508589",
          400: "#709FA2",
          200: "#C0D7D9",
          100: "#E4EEF0",
        },
        trip: {
          blue: "#D7400B",
          "blue-hover": "#BD3607",
          navy: "#336467",
          orange: "#D7400B",
          "orange-hover": "#BD3607",
          ice: "#E0DDAE",
          canvas: "#E0DDAE",
          border: "#C8C488",
        },
        editorial: {
          canvas: "#E0DDAE",
          sand: "#E0DDAE",
          "sand-dark": "#D0CD96",
          ink: "#336467",
          "ink-light": "#254F52",
          muted: "#467679",
          subtle: "#628C8F",
          border: "#C8C488",
          "border-dark": "#B8B37C",
          gold: "#D7400B",
          pill: "#D7400B",
          "pill-hover": "#BD3607",
          script: "#336467",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        script: ["var(--font-caveat)", "Caveat", "cursive"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        fraunces: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        work: ["var(--font-work-sans)", "Work Sans", "sans-serif"],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(10, 59, 62, 0.08), 0 2px 6px -1px rgba(10, 59, 62, 0.04)',
        'warm-lg': '0 10px 30px -4px rgba(10, 59, 62, 0.12), 0 4px 12px -2px rgba(10, 59, 62, 0.06)',
        'elevated': '0 20px 40px -8px rgba(10, 59, 62, 0.16), 0 6px 16px -4px rgba(10, 59, 62, 0.08)',
        'editorial': '0 25px 50px -12px rgba(10, 59, 62, 0.15)',
      }
    },
  },
  plugins: [],
};

export default config;
