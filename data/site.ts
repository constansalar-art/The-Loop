/**
 * Configuración global del sitio.
 * Cambiá acá el dominio, la marca y el publisher de AdSense.
 */
export const site = {
  name: "QuéEstudio",
  // Nombre corto para la marca de agua de la placa.
  brand: "queestudio.ar",
  // URL de producción. Se usa para metadata, OG, sitemap y links compartidos.
  // Reemplazá por tu dominio real antes de publicar.
  url: "https://queestudio.ar",
  tagline: "El test vocacional que te dice qué carrera estudiar",
  description:
    "Test vocacional argentino: 10 preguntas rápidas para descubrir qué carrera universitaria estudiar y en qué facultades de Argentina hacerlo. Gratis y en 2 minutos.",
  locale: "es_AR",
  themeColor: "#6D28D9",

  // === Google AdSense ===
  // Pegá acá tu Publisher ID (formato ca-pub-XXXXXXXXXXXXXXXX).
  // Mientras esté vacío, no se carga el script ni se muestran ads.
  adsensePublisherId: "", // p.ej. "ca-pub-1234567890123456"
  // IDs de slot por ubicación (los creás en tu panel de AdSense).
  adSlots: {
    resultado: "", // p.ej. "1234567890"
    carrera: "",
  },

  social: {
    tiktok: "@queestudio",
    instagram: "@queestudio.ar",
  },
} as const;

export type Site = typeof site;
