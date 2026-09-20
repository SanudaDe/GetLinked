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
        // GetLinked Brand Teal Signature Color Palette
        // Signature Teal & Deep Marine Pine
        teal: {
          950: "#042022", // Deep Midnight Teal (headers, dark sidebars, dark banners)
          900: "#0A3B3E", // Deep Brand Teal (navbars, main headers, footers)
          800: "#10595C", // Deep Forest Teal
          700: "#15777B", // Rich Dark Teal
          600: "#1A9499", // Primary Vibrant Teal (buttons, active tabs)
          500: "#25ACA9", // GetLinked Signature Brand Teal (exact logo match)
          400: "#42C4C1", // Soft Bright Teal Accent
          300: "#73D8D5", // Muted Teal Highlight
          200: "#ADEAE8", // Light Mint-Teal
          100: "#DDF6F5", // Ice-Teal Tag / Pill Background
          50: "#F0FAF9",  // Ultra Light Teal Surface
        },
        // Signature Orange & Amber Accent
        gold: {
          600: "#E65A00", // Dark Orange (hover)
          500: "#FF7700", // Iconic Bright Orange (ratings, deals, badges)
          400: "#FF8C33", // Bright Orange Accent
          300: "#FFA866",
          100: "#FFF0E6", // Soft Orange Badge Background
          50: "#FFF8F5",  // Ultra Soft Orange
        },
        // Clean Travel Portal Surfaces & Borders
        sand: {
          500: "#9AA7B8",
          400: "#CFD7E3",
          300: "#E4E8EE", // Standard Card & Input Borders
          200: "#ECEFF4", // Inactive Tab / Neutral Fill
          100: "#F0F3F7", // Subtle Surface Grey
          50: "#F5F7FA",  // Canvas Background (crisp off-white / light grey)
        },
        // Deep Teal Typography Ink
        ink: {
          950: "#041C1E", // Deepest Midnight Teal-Ink
          900: "#092E32", // Primary Headline Deep Teal-Ink
          800: "#134246",
          700: "#22565C",
          600: "#386C72", // Secondary Body Text
          500: "#5B8D93",
          400: "#83A9AF", // Muted / Placeholder Text
          200: "#D0E4E7",
          100: "#EDF6F7",
        },
        // Explicit Brand Tokens
        trip: {
          blue: "#25ACA9",
          "blue-hover": "#1D9693",
          navy: "#0A3B3E",
          orange: "#FF7700",
          "orange-hover": "#E65A00",
          ice: "#DDF6F5",
          canvas: "#F5F7FA",
          border: "#E4E8EE",
        },
        // Luxury Boutique Editorial Palette
        editorial: {
          canvas: "#FAF8F5",
          sand: "#F4EFEA",
          "sand-dark": "#E9E3D8",
          ink: "#122026",
          "ink-light": "#25333A",
          muted: "#5E686F",
          subtle: "#8A949C",
          border: "#E7E2DA",
          "border-dark": "#D5CEBF",
          gold: "#C4A67B",
          pill: "#25aca9",
          "pill-hover": "#1e9693",
          script: "#7D7266",
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
