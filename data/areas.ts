/**
 * Las 6 áreas del test.
 *
 * Cada área es un "resultado": trae el copy de la placa compartible, las
 * carreras relacionadas, las universidades y su identidad de color.
 *
 * Los colores se guardan como HEX crudo (no variables ni clases de Tailwind)
 * porque también los consume la OG image dinámica (@vercel/og / next/og),
 * que corre en Satori y solo entiende estilos inline con valores literales.
 */

export type AreaCode = "TEC" | "NEG" | "SAL" | "SOC" | "DER" | "ART";

export interface Area {
  code: AreaCode;
  slug: string;
  /** Nombre corto del área. */
  name: string;
  /** Emoji representativo (lo usa la OG image, que renderiza emojis nativos). */
  emoji: string;
  /** Título del resultado ("Lo tuyo es..."). */
  title: string;
  /** Lo que va grande en la placa ("Deberías estudiar: X"). */
  headline: string;
  /** Frase con onda. */
  phrase: string;
  /** Carreras que "también te pegan". */
  related: string[];
  /** Universidades donde estudiarla. */
  universities: string[];
  /** Slugs de las carreras destacadas (para linkear a /carreras/[slug]). */
  featuredCareers: string[];
  color: {
    /** Gradiente de fondo de la placa. */
    from: string;
    to: string;
    /** Color sólido de acento (chips, íconos sobre fondo claro). */
    accent: string;
    /** Fondo suave para secciones del sitio. */
    soft: string;
  };
}

export const AREAS: Record<AreaCode, Area> = {
  TEC: {
    code: "TEC",
    slug: "tec",
    name: "Tecnología / Ingeniería",
    emoji: "💻",
    title: "Lo tuyo es la Tecnología / Ingeniería",
    headline: "Ingeniería en Sistemas / Informática",
    phrase:
      "Sos de los que rompen algo para entender cómo anda. El mundo lo mueven los que saben construirlo, y vos tenés esa cabeza.",
    related: [
      "Ciencias de la Computación",
      "Ingeniería Industrial",
      "Ciencia de Datos",
      "Ingeniería Electrónica",
    ],
    universities: ["UTN", "UBA", "ITBA", "UADE", "Universidad Austral"],
    featuredCareers: ["ingenieria-en-sistemas", "ciencia-de-datos", "ingenieria-industrial"],
    color: { from: "#2563EB", to: "#22D3EE", accent: "#2563EB", soft: "#E7F0FF" },
  },
  NEG: {
    code: "NEG",
    slug: "neg",
    name: "Negocios / Economía",
    emoji: "📈",
    title: "Lo tuyo son los Negocios",
    headline: "Administración de Empresas",
    phrase:
      "Ves oportunidades donde otros ven problemas. Naciste para tener lo tuyo o para hacer crecer algo grande.",
    related: [
      "Economía",
      "Marketing",
      "Negocios Digitales",
      "Comercio Internacional",
      "Contador Público",
    ],
    universities: ["UdeSA (San Andrés)", "Universidad Austral", "UBA", "UCA", "UADE", "UTDT (Di Tella)"],
    featuredCareers: ["administracion-de-empresas", "economia", "marketing"],
    color: { from: "#0E9F6E", to: "#34D399", accent: "#0E9F6E", soft: "#E4F7EF" },
  },
  SAL: {
    code: "SAL",
    slug: "sal",
    name: "Salud / Ciencias de la vida",
    emoji: "🩺",
    title: "Lo tuyo es la Salud",
    headline: "Medicina",
    phrase:
      "Te importa la gente de verdad y tenés estómago para lo difícil. Un camino largo, pero de los que dejan huella.",
    related: [
      "Nutrición",
      "Kinesiología",
      "Psicología",
      "Enfermería",
      "Bioquímica",
      "Veterinaria",
    ],
    universities: ["UBA", "Universidad Austral", "UCA", "Universidad Favaloro", "Universidad Maimónides"],
    featuredCareers: ["medicina", "psicologia", "nutricion"],
    color: { from: "#F43F5E", to: "#FB7185", accent: "#E11D48", soft: "#FDE7EC" },
  },
  SOC: {
    code: "SOC",
    slug: "soc",
    name: "Social / Comunicación",
    emoji: "🎙️",
    title: "Lo tuyo es lo Social y la Comunicación",
    headline: "Comunicación / Periodismo",
    phrase:
      "Entendés a las personas y al mundo mejor que la media. Lo tuyo es conectar, contar y explicar lo que otros no ven.",
    related: [
      "Relaciones Internacionales",
      "Ciencia Política",
      "Psicología",
      "Relaciones Públicas",
      "Sociología",
    ],
    universities: ["UBA", "Universidad Austral", "UP (Palermo)", "UCA", "USAL"],
    featuredCareers: ["comunicacion-periodismo", "relaciones-internacionales", "ciencia-politica"],
    color: { from: "#F97316", to: "#FBBF24", accent: "#EA580C", soft: "#FEF0E2" },
  },
  DER: {
    code: "DER",
    slug: "der",
    name: "Derecho",
    emoji: "⚖️",
    title: "Lo tuyo es el Derecho",
    headline: "Abogacía",
    phrase:
      "Tenés lógica, palabra y no aflojás en una discusión. El derecho es tu cancha.",
    related: ["Escribanía / Notariado", "Relaciones del Trabajo", "Ciencia Política"],
    universities: ["UBA", "UCA", "Universidad Austral", "UdeSA", "UTDT", "UP"],
    featuredCareers: ["abogacia", "escribania", "ciencia-politica"],
    color: { from: "#4F46E5", to: "#7C3AED", accent: "#4F46E5", soft: "#ECEAFE" },
  },
  ART: {
    code: "ART",
    slug: "art",
    name: "Arte / Diseño / Creatividad",
    emoji: "🎨",
    title: "Lo tuyo es lo Creativo",
    headline: "Diseño (Gráfico / Industrial / Indumentaria)",
    phrase:
      "Tu cabeza no para de crear. Necesitás un laburo donde lo que imaginás se vuelva real.",
    related: [
      "Arquitectura",
      "Publicidad",
      "Diseño UX/UI",
      "Imagen y Sonido",
      "Cine",
    ],
    universities: ["UBA (FADU)", "UP (Palermo)", "UADE", "UCA"],
    featuredCareers: ["diseno-grafico", "arquitectura", "diseno-ux-ui"],
    color: { from: "#DB2777", to: "#F472B6", accent: "#DB2777", soft: "#FCE7F1" },
  },
};

/** Orden fijo para iterar (áreas en el orden lógico del test). */
export const AREA_ORDER: AreaCode[] = ["TEC", "NEG", "SAL", "SOC", "DER", "ART"];

export function getArea(code: string): Area | undefined {
  const upper = code.toUpperCase() as AreaCode;
  return AREAS[upper];
}

/** Busca un área por su slug de URL (tec, neg, sal, ...). */
export function getAreaBySlug(slug: string): Area | undefined {
  return AREA_ORDER.map((c) => AREAS[c]).find((a) => a.slug === slug.toLowerCase());
}
