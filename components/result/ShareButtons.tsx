"use client";

import { useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import type { Area } from "@/data/areas";
import { site } from "@/data/site";

interface ShareButtonsProps {
  area: Area;
  cardRef: RefObject<HTMLDivElement>;
}

export function ShareButtons({ area, cardRef }: ShareButtonsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const shareUrl = `${site.url}/resultado/${area.slug}`;
  const shareText = `Hice el test vocacional y me tocó: ${area.headline} 👀 ¿Y a vos qué te toca?`;

  /** Genera el PNG de la placa a alta resolución. */
  async function generatePng(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 2.5,
      cacheBust: true,
      backgroundColor: area.color.from,
    });
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function handleDownload() {
    try {
      setBusy(true);
      const blob = await generatePng();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `queestudio-${area.slug}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo generar la imagen. Probá de nuevo o sacá una captura 📸");
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    try {
      setBusy(true);
      // Intentamos compartir la imagen; si no se puede, compartimos el link.
      const blob = await generatePng();
      const file = blob
        ? new File([blob], `queestudio-${area.slug}.png`, { type: "image/png" })
        : null;

      if (
        file &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], text: shareText, url: shareUrl });
      } else if (navigator.share) {
        await navigator.share({ title: site.name, text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("¡Link copiado! Pegalo donde quieras 🔗");
      }
    } catch {
      /* el usuario canceló el share: no hacemos nada */
    } finally {
      setBusy(false);
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  }

  async function shareInstagram() {
    // Instagram no permite compartir a Stories desde la web directamente:
    // descargamos la placa y avisamos cómo subirla.
    await handleDownload();
    alert(
      "Descargamos tu placa 📥 Abrí Instagram, creá una historia y subí la imagen. ¡No te olvides de etiquetarnos!",
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          disabled={busy}
          className="sticker flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-display font-bold text-ink disabled:opacity-60"
        >
          <IconDownload /> {busy ? "Generando…" : "Descargar"}
        </button>
        <button
          onClick={handleShare}
          disabled={busy}
          className="sticker flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 font-display font-bold text-white disabled:opacity-60"
        >
          <IconShare /> Compartir
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={shareWhatsApp}
          disabled={busy}
          className="sticker flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-display text-sm font-bold text-white disabled:opacity-60"
          style={{ backgroundColor: "#25D366" }}
        >
          <IconWhatsApp /> WhatsApp
        </button>
        <button
          onClick={shareInstagram}
          disabled={busy}
          className="sticker flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-display text-sm font-bold text-white disabled:opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
          }}
        >
          <IconInstagram /> Historias
        </button>
      </div>

      <button
        onClick={() => router.push("/test")}
        className="sticker flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3.5 font-display font-bold text-white"
      >
        🔄 Hacer el test de nuevo
      </button>
    </div>
  );
}

/* --- Íconos inline (sin dependencias) --- */
function IconDownload() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
