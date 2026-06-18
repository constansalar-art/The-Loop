import { brands } from "@/data/brands";
import Reveal from "@/components/ui/Reveal";

/**
 * Carrusel de marcas / partners (logos placeholder).
 * Implementado como marquee infinito en CSS: duplicamos la lista y la
 * desplazamos -50% (ver animación `marquee` en tailwind.config.ts).
 *
 * TODO: reemplazar el texto de cada marca por su logo real (<Image />).
 */
export default function Brands() {
  // Duplicamos para el loop continuo sin cortes.
  const loop = [...brands, ...brands];

  return (
    <section className="relative overflow-hidden border-y border-border py-16">
      <div className="container-loop">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Trabajamos con marcas líderes a nivel internacional
          </p>
        </Reveal>
      </div>

      {/* Pista del marquee con fade en los bordes */}
      <div className="relative mt-10">
        {/* Máscaras laterales para el efecto de desvanecido */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {loop.map((brand, i) => (
            <span
              key={`${brand.name}-${i}`}
              className="select-none whitespace-nowrap font-display text-2xl font-bold text-white/30 transition-colors duration-300 hover:text-white sm:text-3xl"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
