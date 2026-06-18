"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * Envoltorio para revelar contenido al hacer scroll.
 * Usa Framer Motion: el contenido aparece con un fade + desplazamiento
 * cuando entra en el viewport. Soporta un `delay` para escalonar elementos.
 *
 * Respeta prefers-reduced-motion automáticamente (Framer Motion desactiva
 * las transforms si el usuario lo pidió).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  // once: true → la animación corre una sola vez. margin → dispara un poco antes.
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
