/**
 * Marcas / partners (placeholder).
 * Por ahora son solo nombres que renderizamos como "logos" tipográficos
 * en el carrusel. Reemplazá cada item por el SVG/imagen del logo real.
 */

export interface Brand {
  name: string;
  // TODO: cuando tengas los logos reales, agregá `logo: "/marcas/<archivo>.svg"`
  // y renderizalos con <Image /> en lugar del texto.
}

export const brands: Brand[] = [
  { name: "Nordmann" },
  { name: "Vanté" },
  { name: "Maison Luré" },
  { name: "Atlas Co." },
  { name: "Núcleo" },
  { name: "Lumière Paris" },
  { name: "Aurea" },
  { name: "Brizo" },
  { name: "Helvet" },
  { name: "Ónix" },
];
