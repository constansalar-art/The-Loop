"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Botón "magnético": se acerca sutilmente al cursor cuando el mouse pasa
 * por encima, con un glow violeta. Un detalle premium de microinteracción.
 *
 * - variant "primary": relleno violeta con glow.
 * - variant "ghost": borde sutil, fondo translúcido.
 * Puede renderizar un <a> (si se pasa `href`) o un <button>.
 */
type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  target?: string;
  rel?: string;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  target,
  rel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Posición del botón relativa al cursor (suavizada con springs).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });
  const tx = useTransform(springX, (v) => `${v}px`);
  const ty = useTransform(springY, (v) => `${v}px`);

  function handleMove(e: MouseEvent) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Desplazamos como máximo ~25% del tamaño hacia el cursor.
    const relX = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const relY = (e.clientY - rect.top - rect.height / 2) * 0.35;
    x.set(relX);
    y.set(relY);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 will-change-transform";

  const variants = {
    primary:
      "bg-accent text-white shadow-glow hover:bg-accent-2 hover:shadow-glow-lg",
    ghost:
      "border border-border bg-surface/50 text-text backdrop-blur hover:border-accent hover:text-white",
  };

  const content = (
    <motion.span
      style={{ x: tx, y: ty }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  const sharedProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    className: cn(base, variants[variant], className),
  };

  // Si hay href, es un enlace; si no, un botón.
  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...sharedProps}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...sharedProps}>
      {content}
    </button>
  );
}
