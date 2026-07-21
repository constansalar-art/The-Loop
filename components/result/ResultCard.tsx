import { forwardRef } from "react";
import type { Area } from "@/data/areas";
import { site } from "@/data/site";
import { AreaIcon } from "@/components/ui/AreaIcon";

interface ResultCardProps {
  area: Area;
}

/**
 * LA PLACA. Es el producto: pensada para captura de pantalla vertical (4:5),
 * limpia, con identidad de color por área. Este nodo es el que exporta
 * html-to-image, así que todo su estilo tiene que ser autocontenido.
 */
export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard({ area }, ref) {
    return (
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-4xl text-white"
        style={{
          aspectRatio: "4 / 5",
          backgroundImage: `linear-gradient(150deg, ${area.color.from} 0%, ${area.color.to} 100%)`,
        }}
      >
        {/* Textura de círculos concéntricos suave */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 15%, rgba(255,255,255,0.6) 0, transparent 42%), radial-gradient(circle at 15% 90%, rgba(255,255,255,0.35) 0, transparent 45%)",
          }}
        />

        <div className="relative flex h-full flex-col p-6 sm:p-7">
          {/* Encabezado marca */}
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-black tracking-tight">
              Qué<span className="opacity-80">Estudio</span>
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Test vocacional
            </span>
          </div>

          {/* Ícono */}
          <div className="mt-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <AreaIcon code={area.code} className="h-8 w-8" strokeWidth={2} />
          </div>

          {/* Título principal */}
          <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-white/80">
            Deberías estudiar
          </p>
          <h2 className="mt-1 font-display text-[28px] font-extrabold leading-[1.05] sm:text-[32px]">
            {area.headline}
          </h2>

          {/* Frase */}
          <p className="mt-3 text-[13px] font-medium leading-snug text-white/90 sm:text-sm">
            “{area.phrase}”
          </p>

          {/* Datos */}
          <div className="mt-auto space-y-3 pt-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                También te pega
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {area.related.slice(0, 3).map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                Dónde estudiarla
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug">
                {area.universities.slice(0, 5).join(" · ")}
              </p>
            </div>
          </div>

          {/* Marca de agua / URL */}
          <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-3">
            <span className="text-[11px] font-bold tracking-wide">{site.brand}</span>
            <span className="text-[10px] font-medium text-white/70">
              Hacé el tuyo 👆
            </span>
          </div>
        </div>
      </div>
    );
  },
);
