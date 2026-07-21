import type { Config } from "tailwindcss";

/**
 * Tailwind — QuéEstudio.
 * Identidad: base clara "papel", tinta casi negra y un violeta de marca
 * bien saturado. Cada área del test trae su propio color (ver data/areas.ts),
 * así que acá solo vive la identidad global del sitio.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  // Los colores por área se generan dinámicamente (bg-[var(--area)]),
  // por eso safelisteamos algunas utilidades que Tailwind no ve en el markup.
  safelist: [],
  theme: {
    extend: {
      colors: {
        paper: "#FBF7F0", // fondo crema
        ink: "#141019", // tinta casi negra con tinte violeta
        "ink-soft": "#4b4453",
        brand: {
          DEFAULT: "#6D28D9", // violeta marca
          bright: "#8B5CF6",
          soft: "#EDE7FF",
        },
        pop: "#FF3D77", // rosa acento para energía
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 0 0 #141019",
        "card-lg": "0 6px 0 0 #141019",
        pop: "6px 6px 0 0 #141019",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
