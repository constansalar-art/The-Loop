"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "qe_cookie_consent";

/**
 * Banner de consentimiento de cookies simple (requisito de AdSense).
 * Guarda la elección en localStorage y no vuelve a molestar.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage no disponible: no mostramos para no romper */
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* noop */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl">
      <div className="sticker rounded-2xl bg-white p-4 text-sm">
        <p className="text-ink">
          Usamos cookies propias y de terceros (Google AdSense) para mostrar
          publicidad y medir el tráfico. Podés leer más en nuestra{" "}
          <Link href="/privacidad" className="font-semibold text-brand underline">
            Política de Privacidad
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => decide("accepted")}
            className="sticker flex-1 rounded-xl bg-brand px-4 py-2 font-display text-sm font-bold text-white"
          >
            Aceptar
          </button>
          <button
            onClick={() => decide("rejected")}
            className="sticker flex-1 rounded-xl bg-white px-4 py-2 font-display text-sm font-bold text-ink"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
