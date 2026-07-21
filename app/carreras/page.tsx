import type { Metadata } from "next";
import Link from "next/link";
import { AREA_ORDER, AREAS } from "@/data/areas";
import { careersByArea } from "@/data/carreras";
import { AreaIcon } from "@/components/ui/AreaIcon";

export const metadata: Metadata = {
  title: "Carreras universitarias en Argentina: guía por área",
  description:
    "Explorá carreras universitarias en Argentina agrupadas por área: de qué se trata cada una, dónde estudiarla y cuál es su salida laboral. Encontrá la tuya.",
  alternates: { canonical: "/carreras" },
};

export default function CarrerasIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="max-w-2xl">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-brand">
          Guía de carreras
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
          Carreras universitarias en Argentina
        </h1>
        <p className="mt-3 text-ink-soft">
          Una guía corta y sin vueltas de las carreras más elegidas: de qué se
          trata cada una, dónde estudiarla y cómo es la salida laboral. ¿Todavía
          no sabés cuál va con vos?{" "}
          <Link href="/test" className="font-semibold text-brand underline">
            Hacé el test
          </Link>
          .
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {AREA_ORDER.map((code) => {
          const area = AREAS[code];
          const careers = careersByArea(code);
          if (careers.length === 0) return null;
          return (
            <section key={code}>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: area.color.accent }}
                >
                  <AreaIcon code={code} className="h-6 w-6" strokeWidth={2} />
                </span>
                <h2 className="font-display text-xl font-extrabold">{area.name}</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {careers.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/carreras/${c.slug}`}
                    className="sticker rounded-2xl bg-white p-4"
                  >
                    <h3 className="font-display font-bold leading-tight">{c.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{c.intro}</p>
                    <span className="mt-2 inline-block text-sm font-semibold text-brand">
                      Leer más →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
