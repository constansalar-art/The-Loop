"use client";

import { useEffect, useState } from "react";

/**
 * Detecta si el usuario activó "reducir movimiento" en su sistema.
 * Lo respetamos para no mostrar la escena 3D animada ni animaciones
 * agresivas (accesibilidad).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(media.matches);

    const listener = (event: MediaQueryListEvent) =>
      setPrefersReduced(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}
