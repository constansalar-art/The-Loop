import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { whatsappUrl } from "@/data/site";

/**
 * Bloque de captación de revendedores / mayoristas.
 * CTA específico, destacado visualmente con un panel de acento.
 */
export default function Resellers() {
  // Beneficios concretos para revendedores.
  const beneficios = [
    "Lista de precios mayorista",
    "Cantidades mínimas accesibles",
    "Prioridad en reposición de stock",
    "Asesor comercial dedicado",
  ];

  return (
    <section id="revendedores" className="relative py-24 sm:py-32">
      <div className="container-loop">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface p-8 sm:p-12 lg:p-16">
            {/* Fondos decorativos */}
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full glow-radial opacity-60" />
            <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full glow-radial opacity-40" />
            <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-30" />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow">
                  <span className="h-px w-6 bg-accent" />
                  Revendedores &amp; Mayoristas
                </span>
                <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                  Sumate a la red de{" "}
                  <span className="text-gradient">revendedores The Loop</span>
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                  Accedé a precios mayoristas, stock prioritario y el respaldo de
                  una importadora que cumple. Ideal para tiendas, showrooms y
                  emprendedores que quieren crecer con producto importado.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <MagneticButton
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    Quiero los precios mayoristas
                  </MagneticButton>
                  <MagneticButton href="#contacto" variant="ghost">
                    Dejar mis datos
                  </MagneticButton>
                </div>
              </div>

              {/* Lista de beneficios */}
              <div className="grid gap-4">
                {beneficios.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-bg/40 px-5 py-4"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-white shadow-glow-sm">
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
                    <span className="font-medium text-text">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
