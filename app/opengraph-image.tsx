import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = "QuéEstudio — Test vocacional argentino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** OG por defecto (home y páginas sin imagen propia). */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          backgroundImage: "linear-gradient(135deg, #6D28D9, #8B5CF6 55%, #FF3D77)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, opacity: 0.9 }}>QuéEstudio</div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -2,
            marginTop: 20,
            maxWidth: 1000,
          }}
        >
          ¿No sabés qué carrera estudiar?
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 26, opacity: 0.92, maxWidth: 900 }}>
          Hacé el test vocacional y descubrilo en 2 minutos.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 28,
            fontWeight: 700,
            background: "rgba(255,255,255,0.2)",
            padding: "14px 30px",
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          {site.brand} · Gratis
        </div>
      </div>
    ),
    { ...size },
  );
}
