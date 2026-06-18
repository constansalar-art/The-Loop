import type { CategorySlug } from "./categories";

/**
 * Modelo de producto del catálogo.
 *
 * NOTA (preparado para carrito): el modelo ya incluye `id`, `slug`, `price`
 * y `stock` para que, cuando sumemos el e-commerce, podamos enganchar un
 * CartProvider sin tener que rehacer la data. Por ahora es solo vidriera.
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number; // en ARS
  // TODO: reemplazar por la foto real del producto (ej: /productos/<slug>.jpg)
  image: string;
  // Etiqueta opcional para destacar la card (Nuevo, Top ventas, etc.)
  tag?: string;
  // Indica disponibilidad real (mock). Útil a futuro para el carrito.
  inStock: boolean;
}

/**
 * Catálogo destacado mock. Contenido realista en español (Argentina).
 * Las imágenes apuntan a /productos/*.jpg (placeholders) que reemplazás luego.
 */
export const products: Product[] = [
  {
    id: "p-001",
    slug: "reloj-cronografo-acero",
    name: "Cronógrafo Acero Inoxidable",
    brand: "Nordmann",
    category: "accesorios",
    price: 189900,
    image: "/productos/reloj-cronografo-acero.jpg",
    tag: "Top ventas",
    inStock: true,
  },
  {
    id: "p-002",
    slug: "anteojos-sol-acetato",
    name: "Anteojos de Sol Acetato UV400",
    brand: "Vanté",
    category: "accesorios",
    price: 54900,
    image: "/productos/anteojos-sol-acetato.jpg",
    tag: "Nuevo",
    inStock: true,
  },
  {
    id: "p-003",
    slug: "cartera-cuero-vegano",
    name: "Cartera Estructurada Cuero Vegano",
    brand: "Maison Luré",
    category: "accesorios",
    price: 97500,
    image: "/productos/cartera-cuero-vegano.jpg",
    inStock: true,
  },
  {
    id: "p-004",
    slug: "campera-puffer-tech",
    name: "Campera Puffer Tech Repelente",
    brand: "Atlas Co.",
    category: "indumentaria",
    price: 142000,
    image: "/productos/campera-puffer-tech.jpg",
    tag: "Temporada",
    inStock: true,
  },
  {
    id: "p-005",
    slug: "buzo-oversize-algodon",
    name: "Buzo Oversize Algodón Peinado",
    brand: "Atlas Co.",
    category: "indumentaria",
    price: 68900,
    image: "/productos/buzo-oversize-algodon.jpg",
    inStock: true,
  },
  {
    id: "p-006",
    slug: "remera-premium-pima",
    name: "Remera Premium Algodón Pima",
    brand: "Núcleo",
    category: "indumentaria",
    price: 32900,
    image: "/productos/remera-premium-pima.jpg",
    tag: "Más vendido",
    inStock: true,
  },
  {
    id: "p-007",
    slug: "eau-de-parfum-noir",
    name: "Eau de Parfum · Noir Intense 100ml",
    brand: "Lumière Paris",
    category: "perfumeria",
    price: 124900,
    image: "/productos/eau-de-parfum-noir.jpg",
    tag: "Nicho",
    inStock: true,
  },
  {
    id: "p-008",
    slug: "perfume-citrus-bloom",
    name: "Citrus Bloom Eau de Toilette 90ml",
    brand: "Lumière Paris",
    category: "perfumeria",
    price: 86900,
    image: "/productos/perfume-citrus-bloom.jpg",
    inStock: true,
  },
  {
    id: "p-009",
    slug: "set-perfume-deluxe",
    name: "Set Deluxe · Fragancia + Body Mist",
    brand: "Aurea",
    category: "perfumeria",
    price: 109900,
    image: "/productos/set-perfume-deluxe.jpg",
    tag: "Edición limitada",
    inStock: false,
  },
];

/** Devuelve los productos de una categoría (helper para futuros filtros). */
export function getProductsByCategory(category: CategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}
