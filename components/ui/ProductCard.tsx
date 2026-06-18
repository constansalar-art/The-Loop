"use client";

import { MouseEvent, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { formatARS } from "@/lib/format";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Card de producto con efecto de tilt 3D al hover (solo CSS/transform,
 * sin WebGL) + glow violeta que sigue al cursor.
 *
 * La imagen es un placeholder con gradiente; cuando tengas las fotos reales
 * reemplazás el bloque marcado con TODO por un <Image /> de next/image.
 */
export default function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Guardamos la transform y la posición del glow para el hover.
  const [transform, setTransform] = useState("");
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMove(e: MouseEvent) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 → 1
    const py = (e.clientY - rect.top) / rect.height; // 0 → 1
    // Rotación máxima de ~8 grados hacia donde apunta el cursor.
    const rotateY = (px - 0.5) * 16;
    const rotateX = (0.5 - py) * 16;
    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    );
    setGlow({ x: px * 100, y: py * 100, opacity: 1 });
  }

  function handleLeave() {
    setTransform("");
    setGlow((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform }}
      className="group relative rounded-2xl border border-border bg-surface transition-[transform,box-shadow] duration-200 ease-out hover:border-accent/40 hover:shadow-glow will-change-transform"
    >
      {/* Glow violeta que sigue al cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, rgba(139,92,246,0.18), transparent 60%)`,
        }}
      />

      {/* Imagen / placeholder del producto.
          TODO: reemplazar por <Image src={product.image} ... /> de next/image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-gradient-to-br from-surface-2 to-bg">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl font-bold text-white/5">
            {product.brand}
          </span>
        </div>
        {/* Etiqueta destacada (Nuevo, Top ventas, etc.) */}
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-glow-sm">
            {product.tag}
          </span>
        )}
        {/* Aviso de stock (mock) */}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur">
            Sin stock
          </span>
        )}
      </div>

      {/* Datos del producto */}
      <div className="relative p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          {product.brand}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-text">
          {product.name}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {formatARS(product.price)}
          </span>
          {/* Placeholder de acción. A futuro: botón "Agregar al carrito". */}
          <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors group-hover:border-accent group-hover:text-white">
            Ver más
          </span>
        </div>
      </div>
    </div>
  );
}
