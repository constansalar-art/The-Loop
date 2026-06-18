"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import GlowOrb from "@/components/ui/GlowOrb";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Hero principal.
 * - Escena 3D de fondo cargada con next/dynamic (ssr:false) → lazy-load,
 *   no entra en el bundle inicial ni se renderiza en el servidor.
 * - Si el usuario prefiere menos movimiento, NO se monta el Canvas:
 *   mostramos un fallback estático con un glow elegante.
 */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  // Mientras carga el chunk del 3D mostramos un glow suave (sin layout shift).
  loading: () => <div className="absolute inset-0 glow-radial opacity-30" />,
});

// Variantes para animar la entrada del texto de forma escalonada.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Capa 3D de fondo (o fallback estático si reduced-motion) */}
      <div className="absolute inset-0 -z-10">
        {prefersReducedMotion ? (
          <div className="absolute inset-0 glow-radial opacity-40" />
        ) : (
          <HeroScene />
        )}
      </div>

      {/* Glows decorativos + grilla sutil */}
      <GlowOrb className="left-[-10%] top-[10%]" size={520} />
      <GlowOrb className="bottom-[-15%] right-[-5%]" size={460} />
      <div className="absolute inset-0 -z-10 bg-grid-faint [background-size:64px_64px] opacity-[0.4]" />
      {/* Degradado para que el texto sea legible sobre la escena */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-transparent to-bg" />

      <div className="container-loop">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* Badge superior */}
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent" />
            Importación &amp; distribución premium · Argentina
          </motion.span>

          {/* Título de impacto */}
          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
          >
            The <span className="text-gradient">Loop</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            Traemos las marcas que tu negocio necesita. Accesorios, indumentaria
            y perfumería importada, con stock real y entrega en todo el país.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#catalogo" variant="primary">
              Ver catálogo
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <MagneticButton href="#revendedores" variant="ghost">
              Quiero ser revendedor
            </MagneticButton>
          </motion.div>

          {/* Mini métricas para reforzar la imagen confiable */}
          <motion.div
            variants={item}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-4"
          >
            {[
              { value: "+150", label: "Marcas internacionales" },
              { value: "24/48h", label: "Despacho promedio" },
              { value: "100%", label: "Productos originales" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
