"use client";

import { FormEvent, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { site, whatsappUrl } from "@/data/site";

/**
 * Sección de contacto: formulario + botón de WhatsApp + datos.
 *
 * El formulario es un MOCK de demostración: no envía a ningún backend.
 * Simula el envío y muestra un mensaje de éxito.
 * TODO: conectar a un endpoint real (API route, Formspree, Resend, etc.).
 */
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // Simulamos una llamada de red. Reemplazar por el fetch real.
    setTimeout(() => setStatus("sent"), 1200);
  }

  return (
    <section id="contacto" className="relative py-24 sm:py-32">
      <div className="container-loop">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Columna izquierda: encabezado + datos + WhatsApp */}
          <div>
            <SectionHeading
              eyebrow="Contacto"
              title={
                <>
                  Hablemos de tu <span className="text-gradient">próximo pedido</span>
                </>
              }
              description="Dejanos tus datos y te contactamos a la brevedad con el catálogo, precios y condiciones. ¿Es urgente? Escribinos por WhatsApp."
            />

            <div className="mt-10 space-y-4">
              {/* Datos de contacto. TODO: reemplazar por los reales (data/site.ts) */}
              <ContactRow label="Email" value={site.email} href={`mailto:${site.email}`} />
              <ContactRow
                label="Teléfono"
                value={site.phoneDisplay}
                href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`}
              />
              <ContactRow label="Ubicación" value={site.city} />
            </div>

            <div className="mt-8">
              <MagneticButton
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                {/* Icono WhatsApp */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.477-.602zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Escribir por WhatsApp
              </MagneticButton>
            </div>
          </div>

          {/* Columna derecha: formulario */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="surface-card relative overflow-hidden p-7 sm:p-9"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full glow-radial opacity-40" />

              {status === "sent" ? (
                // Estado de éxito (mock)
                <div className="relative flex min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-glow">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    Gracias por escribirnos. Te vamos a responder dentro de las
                    próximas 24 horas hábiles.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-5">
                  <Field label="Nombre y apellido" htmlFor="name">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Ej: Camila Fernández"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" htmlFor="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="vos@email.com"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Teléfono" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+54 9 11 ..."
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Mensaje" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Contanos qué rubro te interesa, si tenés local, etc."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:bg-accent-2 hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "Enviando…" : "Enviar consulta"}
                  </button>
                  <p className="text-center text-xs text-muted">
                    Al enviar aceptás ser contactado por el equipo comercial de
                    The Loop.
                  </p>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Estilos compartidos de los inputs.
const inputClass =
  "w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

// Campo de formulario con label.
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-text"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Fila de dato de contacto.
function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/50 px-5 py-4 transition-colors hover:border-accent/40">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-medium text-text">{value}</span>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
