"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { ReactNode } from "react";

/**
 * "Por qué elegirnos": 3-4 features con iconos.
 * Los iconos son SVG inline que animan sutilmente al hover de la card.
 */

type Feature = {
  title: string;
  text: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Importación directa",
    text: "Sin intermediarios. Mejor precio y trazabilidad total del origen al depósito.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    title: "Stock real",
    text: "Mercadería disponible para entrega inmediata. Si está en la web, está en el depósito.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
  {
    title: "Envíos a todo el país",
    text: "Despacho ágil a las 23 provincias mediante operadores logísticos confiables.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Atención a revendedores",
    text: "Precios mayoristas, asesoría personalizada y prioridad en cada reposición.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-loop">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          align="center"
          title={
            <>
              La logística que tu negocio{" "}
              <span className="text-gradient">no ve, pero siente</span>
            </>
          }
          description="Nos ocupamos de la parte difícil de importar para que vos te dediques a vender."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-colors duration-500 hover:border-accent/40"
            >
              {/* Glow sutil que aparece al hover */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full glow-radial opacity-0 transition-opacity duration-500 group-hover:opacity-60" />

              {/* Icono dentro de un cuadrado con acento */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110">
                <span className="h-6 w-6">{feature.icon}</span>
              </div>

              <h3 className="relative mt-6 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
