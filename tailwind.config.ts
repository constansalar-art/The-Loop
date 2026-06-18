import type { Config } from "tailwindcss";

/**
 * Configuración de Tailwind para The Loop.
 * La paleta vive como variables CSS en globals.css; acá las exponemos
 * a Tailwind para poder usar clases tipo `bg-bg`, `text-accent`, etc.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeamos las variables CSS para usarlas como utilidades de Tailwind.
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        // Inyectadas vía next/font en el layout raíz.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Glow violeta reutilizable para botones, cards y acentos.
        glow: "0 0 40px -8px rgba(139, 92, 246, 0.55)",
        "glow-sm": "0 0 24px -6px rgba(139, 92, 246, 0.45)",
        "glow-lg": "0 0 80px -10px rgba(168, 85, 247, 0.6)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
