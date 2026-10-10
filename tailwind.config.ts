import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
          DEFAULT: "#FFFFFF",
          surface: "#F9FAFB",
          card: "#FFFFFF",
          dark: "#F3F4F6",
          border: "#E5E7EB",
        },
        caribbean: {
          DEFAULT: "#336467",
          hover: "#254F52",
          dark: "#1A3739",
          muted: "#467679",
          light: "#F0FDFA",
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
          500: "#6B7280",
          400: "#D1D5DB",
          300: "#E5E7EB",
          200: "#F3F4F6",
          100: "#F9FAFB",
          50: "#FFFFFF", // Pure Modern White Canvas Background
        },
        ink: {
          950: "#0F172A",
          900: "#1E293B",
          800: "#1A3739",
          700: "#2C5A5D", // Primary Text
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          200: "#E2E8F0",
          100: "#F1F5F9",
        },
        trip: {
          blue: "#D7400B",
          "blue-hover": "#BD3607",
          navy: "#1A3739",
          orange: "#D7400B",
          "orange-hover": "#BD3607",
          ice: "#F8FAFC",
          canvas: "#FFFFFF",
          border: "#E5E7EB",
        },
        editorial: {
          canvas: "#FFFFFF",
          sand: "#FFFFFF",
          "sand-dark": "#F3F4F6",
          ink: "#1A3739",
          "ink-light": "#254F52",
          muted: "#4B5563",
          subtle: "#6B7280",
          border: "#E5E7EB",
          "border-dark": "#D1D5DB",
          gold: "#D7400B",
          pill: "#D7400B",
          "pill-hover": "#BD3607",
          script: "#1A3739",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Garamond", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Garamond", "Georgia", "serif"],
        script: ["var(--font-caveat)", "Caveat", "cursive"],
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "Work Sans", "system-ui", "-apple-system", "sans-serif"],
        fraunces: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        work: ["var(--font-work-sans)", "Work Sans", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'warm-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.07), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 20px 40px -8px rgba(15, 23, 42, 0.10), 0 6px 16px -4px rgba(15, 23, 42, 0.04)',
        'editorial': '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
};

export default config;
