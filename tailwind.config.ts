import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/visuals/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/tools/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep "ink" canvas — richer than flat slate, reads as near-black navy
        ink: {
          DEFAULT: "#070912",
          50: "#0b0e1a",
          100: "#0d1120",
          200: "#121829",
          300: "#1a2236",
        },
        // Brand gradient stops (cyan → blue → indigo)
        brand: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px -12px rgba(59,130,246,0.45)",
        "glow-lg": "0 0 0 1px rgba(255,255,255,0.05), 0 18px 60px -18px rgba(59,130,246,0.55)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.9)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease both",
        shimmer: "shimmer 2.5s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
