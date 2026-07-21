import Link from "next/link";
import type { Metadata } from "next";
import { AREA_ORDER, AREAS } from "@/data/areas";
import { site } from "@/data/site";
import { TOTAL_QUESTIONS } from "@/data/quiz";
import { AreaIcon } from "@/components/ui/AreaIcon";

export const metadata: Metadata = {
  title: `${site.name} — Test vocacional: descubrí qué carrera estudiar`,
  description: site.description,
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "¿Cuánto tarda el test vocacional?",
    a: "Menos de 2 minutos. Son 10 preguntas rápidas, una por pantalla, sin registrarte ni dejar ningún dato.",
  },
  {
    q: "¿El test es gratis?",
    a: "Sí, es 100% gratis. Podés hacerlo las veces que quieras y compartir tu resultado con quien quieras.",
  },
  {
    q: "¿Cómo sabe qué carrera me conviene?",
    a: "Cada respuesta suma puntos a 6 grandes áreas (Tecnología, Negocios, Salud, Social, Derecho y Arte). Al terminar, te mostramos el área con más afinidad y las carreras y facultades argentinas relacionadas.",
  },
  {
    q: "¿Reemplaza a una orientación vocacional profesional?",
    a: "No. Es un test orientativo y para divertirte, pensado para darte una primera pista. Si estás en una decisión importante, siempre conviene complementar con un orientador vocacional.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:pt-16">
        {/* manchas de color de fondo */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-pop/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <span className="sticker inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-ink">
            <span className="h-2 w-2 animate-pulse rounded-full bg-pop" />
            {TOTAL_QUESTIONS} preguntas · 2 minutos · gratis
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            ¿No sabés{" "}
            <span className="relative whitespace-nowrap text-brand">
              qué estudiar?
              <svg
                className="absolute -bottom-2 left-0 w-full text-pop"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 9c60-6 236-8 296-3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg text-ink-soft">
            Hacé el test vocacional y descubrí en 2 minutos qué carrera va con
            vos y en qué facultades de Argentina podés estudiarla.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/test"
              className="sticker group inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 font-display text-xl font-extrabold text-white sm:w-auto"
            >
              Empezar test
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <p className="text-xs text-ink-soft/70">
              Sin registro. No pedimos ningún dato.
            </p>
          </div>
        </div>

        {/* chips de áreas flotando */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {AREA_ORDER.map((code) => {
            const a = AREAS[code];
            return (
              <span
                key={code}
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-sm font-semibold"
                style={{ color: a.color.accent }}
              >
                <AreaIcon code={code} className="h-4 w-4" />
                <span className="text-ink">{a.name.split(" / ")[0]}</span>
              </span>
            );
          })}
        </div>
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-extrabold sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "1", t: "Respondé 10 preguntas", d: "Situaciones con onda, nada de cuestionarios aburridos. Elegís lo que más va con vos." },
              { n: "2", t: "Calculamos tu área", d: "Sumamos tus gustos en 6 grandes áreas y encontramos con cuál tenés más afinidad." },
              { n: "3", t: "Compartí tu resultado", d: "Te damos una placa lista para mandar al grupo, con tu carrera y dónde estudiarla." },
            ].map((s) => (
              <div key={s.n} className="sticker rounded-2xl bg-white p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft font-display text-lg font-black text-brand">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ÁREAS (coleccionable) ===== */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-extrabold sm:text-3xl">
            6 resultados posibles. ¿Cuál te va a tocar?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink-soft">
            Cada resultado tiene su color, su carrera y su vibe. Coleccionables.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AREA_ORDER.map((code) => {
              const a = AREAS[code];
              return (
                <Link
                  key={code}
                  href={`/resultado/${a.slug}`}
                  className="sticker overflow-hidden rounded-2xl text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${a.color.from}, ${a.color.to})`,
                  }}
                >
                  <div className="flex h-full flex-col p-4">
                    <AreaIcon code={code} className="h-7 w-7" />
                    <span className="mt-3 font-display text-sm font-extrabold leading-tight">
                      {a.headline}
                    </span>
                    <span className="mt-auto pt-3 text-[11px] font-semibold uppercase tracking-wide opacity-80">
                      {a.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-extrabold sm:text-3xl">
            Preguntas frecuentes
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="sticker group rounded-2xl bg-white p-4 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between font-display font-bold marker:content-['']">
                  {f.q}
                  <span className="text-brand transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <div className="sticker relative overflow-hidden rounded-4xl bg-ink p-8 text-center text-white sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/40 blur-2xl" />
            <h2 className="relative font-display text-2xl font-extrabold sm:text-3xl">
              Dale, dejá de dudar.
            </h2>
            <p className="relative mx-auto mt-2 max-w-sm text-white/70">
              10 preguntas y sabés por dónde arrancar. ¿Qué podés perder?
            </p>
            <Link
              href="/test"
              className="sticker relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-pop px-8 py-4 font-display text-lg font-extrabold text-white"
            >
              Hacer el test ahora →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
