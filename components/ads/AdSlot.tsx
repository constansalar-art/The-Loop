"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

interface AdSlotProps {
  /** ID del slot (creado en tu panel de AdSense). Si está vacío no se muestra. */
  slot: string;
  /** Etiqueta visible arriba del ad (obligatorio para cumplir políticas). */
  label?: string;
  className?: string;
}

/**
 * Bloque de anuncio discreto. Reserva su espacio y muestra un placeholder
 * mientras no haya configuración de AdSense, para no romper el layout.
 *
 * NO usar dentro del quiz: arruina la experiencia y baja el compartido.
 */
export function AdSlot({ slot, label = "Publicidad", className }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const enabled = Boolean(site.adsensePublisherId && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      // @ts-expect-error adsbygoogle lo inyecta el script global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* noop: el bloqueador de ads o la falta de config no deben romper la página */
    }
  }, [enabled]);

  return (
    <div className={className}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-ink-soft/60">
        {label}
      </p>
      {enabled ? (
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={site.adsensePublisherId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        // Placeholder que reserva el espacio en desarrollo / hasta configurar.
        <div className="flex min-h-[100px] items-center justify-center rounded-2xl border-2 border-dashed border-ink/15 bg-white/40 text-xs text-ink-soft/50">
          Espacio publicitario
        </div>
      )}
    </div>
  );
}
