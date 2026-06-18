"use client";

import { motion } from "framer-motion";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * Card grande de categoría con hover effect:
 * - El gradiente de acento se intensifica.
 * - La flecha y el contenido se desplazan suavemente.
 * - Brillo violeta en el borde.
 *
 * El bloque de imagen es un placeholder; reemplazá el <div> marcado con
 * TODO por un <Image fill /> con la foto real de la categoría.
 */
export default function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <motion.a
      href="#catalogo"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-colors duration-500 hover:border-accent/50"
    >
      {/* Imagen de fondo (placeholder).
          TODO: reemplazar por <Image src={category.image} fill alt={category.name} /> */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-bg" />

      {/* Gradiente de acento que se intensifica en hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-50 transition-opacity duration-500 group-hover:opacity-100",
          category.gradient,
        )}
      />

      {/* Número decorativo grande de fondo */}
      <span className="absolute right-6 top-4 font-display text-[8rem] font-bold leading-none text-white/[0.04] transition-transform duration-500 group-hover:scale-110">
        0{index + 1}
      </span>

      {/* Contenido */}
      <div className="relative z-10 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {category.tagline}
        </p>
        <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          {category.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {category.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
          Ver productos
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}
