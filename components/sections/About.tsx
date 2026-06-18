import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GlowOrb from "@/components/ui/GlowOrb";

/**
 * Sección "Sobre nosotros".
 * Comunica la propuesta de valor: importadores con presencia en Argentina,
 * marcas internacionales, stock real y rapidez.
 */

// Pilares de valor que mostramos como bullets destacados.
const pilares = [
  {
    title: "Importación directa",
    text: "Trabajamos con proveedores internacionales seleccionados, sin intermediarios que inflen el precio.",
  },
  {
    title: "Stock real en Argentina",
    text: "Mercadería disponible en nuestro depósito, lista para despachar. Lo que ves, lo tenemos.",
  },
  {
    title: "Rapidez que vende",
    text: "Reposición ágil y despacho exprés para que tu negocio nunca quede sin producto.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="relative py-24 sm:py-32">
      <GlowOrb className="right-[-10%] top-0" size={420} />

      <div className="container-loop grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* Columna de texto */}
        <div>
          <SectionHeading
            eyebrow="Sobre nosotros"
            title={
              <>
                Conectamos las mejores marcas con{" "}
                <span className="text-gradient">tu negocio</span>
              </>
            }
            description="The Loop es una importadora y distribuidora con base en Argentina. Acercamos al mercado local moda, indumentaria y perfumería que normalmente costaría conseguir, con la confiabilidad de una operación profesional de punta a punta."
          />

          <div className="mt-10 space-y-6">
            {pilares.map((pilar, i) => (
              <Reveal key={pilar.title} delay={i * 0.1}>
                <div className="flex gap-4">
                  {/* Marcador con check */}
                  <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{pilar.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {pilar.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Columna visual: panel con "tarjeta" de marca + acento */}
        <Reveal delay={0.15} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8">
            {/* Gradiente decorativo */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full glow-radial opacity-50" />

            <div className="relative">
              <p className="eyebrow">Nuestra operación</p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { k: "Años importando", v: "+8" },
                  { k: "Clientes activos", v: "+1.200" },
                  { k: "Provincias con envío", v: "23" },
                  { k: "Pedidos al mes", v: "+5.000" },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-2xl border border-border bg-bg/40 p-5"
                  >
                    <p className="font-display text-3xl font-bold text-gradient">
                      {m.v}
                    </p>
                    <p className="mt-1 text-sm text-muted">{m.k}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft p-5">
                <p className="text-sm leading-relaxed text-text">
                  &ldquo;Nuestro compromiso es simple: producto original, stock
                  cuando lo necesitás y la atención que tu negocio merece.&rdquo;
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-accent">
                  — Equipo The Loop
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
