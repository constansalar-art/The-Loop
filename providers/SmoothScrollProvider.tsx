"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Provider de scroll suave con Lenis, integrado con GSAP ScrollTrigger.
 *
 * - Inicializa Lenis para el smooth scroll de toda la página.
 * - Sincroniza el RAF de Lenis con el ticker de GSAP para que las
 *   animaciones ligadas al scroll (ScrollTrigger) queden perfectamente
 *   alineadas con el desplazamiento suavizado.
 * - Respeta prefers-reduced-motion: si está activo, no inicializa Lenis
 *   (el navegador hace scroll normal).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Si el usuario pidió menos movimiento, no activamos el smooth scroll.
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1, // suavidad del scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Cada vez que Lenis hace scroll, le avisamos a ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    // Conectamos el loop de Lenis al ticker de GSAP (un solo RAF).
    const update = (time: number) => {
      lenis.raf(time * 1000); // GSAP entrega segundos; Lenis espera ms
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
