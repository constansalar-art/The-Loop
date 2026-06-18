"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar media queries desde React.
 * Lo usamos sobre todo para degradar la escena 3D en mobile.
 *
 * Ejemplo: const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Sincronizamos el estado inicial
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
