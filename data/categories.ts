/**
 * Categorías principales de The Loop.
 * Estos slugs se usan también para filtrar productos en el catálogo
 * y serían las futuras rutas /categoria/[slug] cuando crezca el sitio.
 */

export type CategorySlug = "accesorios" | "indumentaria" | "perfumeria";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string; // frase corta para la card
  description: string; // descripción algo más larga
  // TODO: reemplazar por foto real de cada categoría (ej: /categorias/accesorios.jpg)
  image: string;
  // Gradiente de acento por categoría (para los hovers)
  gradient: string;
}

export const categories: Category[] = [
  {
    slug: "accesorios",
    name: "Accesorios de moda",
    tagline: "Detalles que definen el look",
    description:
      "Relojes, anteojos de sol, carteras, bijou y marroquinería de marcas internacionales. Lo último de cada temporada, listo para tu vidriera.",
    image: "/categorias/accesorios.jpg",
    gradient: "from-violet-500/30 via-fuchsia-500/10 to-transparent",
  },
  {
    slug: "indumentaria",
    name: "Indumentaria",
    tagline: "Tendencia importada, calce premium",
    description:
      "Prendas urbanas y de temporada con telas de primera calidad. Curaduría de estilos que se venden solos en el punto de venta.",
    image: "/categorias/indumentaria.jpg",
    gradient: "from-indigo-500/30 via-violet-500/10 to-transparent",
  },
  {
    slug: "perfumeria",
    name: "Perfumería",
    tagline: "Fragancias originales y nicho",
    description:
      "Perfumes importados originales, líneas premium y nicho. Stock real con trazabilidad para que vendas con total confianza.",
    image: "/categorias/perfumeria.jpg",
    gradient: "from-purple-500/30 via-pink-500/10 to-transparent",
  },
];
