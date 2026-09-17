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
        // Trip.com Signature Color Palette
        // Primary Blue & Deep Navy
        teal: {
          950: "#0A1B33", // Trip.com Dark Midnight Navy (headers, hero dark gradient)
          900: "#0F294D", // Trip.com Iconic Deep Navy (navbars, main headers, footers)
          800: "#143D73", // Deep Travel Navy
          700: "#1A5BB8", // Rich Royal Blue
          600: "#2681FF", // Trip.com Signature Primary Royal Blue (buttons, active tabs)
          500: "#287DFA", // Trip.com Bright Vibrant Blue
          400: "#529CFF", // Soft Blue Accent
          100: "#EBF3FF", // Trip.com Ice-Blue Tag / Pill Background
          50: "#F2F7FF",  // Trip.com Ultra Light Blue Surface
        },
        // Trip.com Signature Orange & Amber Accent
        gold: {
          600: "#E65A00", // Dark Orange (hover)
          500: "#FF7700", // Trip.com Iconic Bright Orange (ratings, deals, badges)
          400: "#FF8C33", // Bright Orange Accent
          300: "#FFA866",
          100: "#FFF0E6", // Soft Orange Badge Background
          50: "#FFF8F5",  // Ultra Soft Orange
        },
        // Trip.com Clean Travel Portal Surfaces & Borders
        sand: {
          500: "#9AA7B8",
          400: "#CFD7E3",
          300: "#E4E8EE", // Trip.com Standard Card & Input Borders
          200: "#ECEFF4", // Trip.com Inactive Tab / Neutral Fill
          100: "#F0F3F7", // Trip.com Subtle Surface Grey
          50: "#F5F7FA",  // Trip.com Canvas Background (crisp off-white / light grey)
        },
        // Trip.com Deep Navy Typography Ink
        ink: {
          950: "#0A1B33",
          900: "#0F294D", // Trip.com Primary Headline Navy
          800: "#1D3557",
          700: "#334C70",
          600: "#455873", // Trip.com Secondary Body Text
          500: "#6E829E",
          400: "#8592A6", // Trip.com Muted / Placeholder Text
          200: "#D8E0EC",
          100: "#EEF2F8",
        },
        // Explicit Trip.com Tokens
        trip: {
          blue: "#2681FF",
          "blue-hover": "#1870ED",
          navy: "#0F294D",
          orange: "#FF7700",
          "orange-hover": "#E65A00",
          ice: "#EBF3FF",
          canvas: "#F5F7FA",
          border: "#E4E8EE",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "Work Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(15, 41, 77, 0.08), 0 2px 6px -1px rgba(15, 41, 77, 0.04)',
        'warm-lg': '0 10px 30px -4px rgba(15, 41, 77, 0.12), 0 4px 12px -2px rgba(15, 41, 77, 0.06)',
        'elevated': '0 20px 40px -8px rgba(15, 41, 77, 0.16), 0 6px 16px -4px rgba(15, 41, 77, 0.08)',
      }
    },
  },
  plugins: [],
};

export default config;
