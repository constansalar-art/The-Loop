import { ImageResponse } from "next/og";
import { getAreaBySlug, type AreaCode } from "@/data/areas";
import { site } from "@/data/site";

export const alt = "Resultado del test vocacional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Paths de ícono por área (mismo lenguaje visual que en el sitio). */
const ICON_PATHS: Record<AreaCode, string[]> = {
  TEC: ["M8 6 2 12l6 6", "M16 6l6 6-6 6", "M13 4l-2 16"],
  NEG: ["M3 17l6-6 4 4 8-8", "M15 7h6v6"],
  SAL: ["M22 12h-4l-2.5 7-5-16L8 12H2"],
  SOC: ["M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"],
  DER: ["M12 3v18", "M6 7h12", "M6 7l-3 6a3 3 0 0 0 6 0z", "M18 7l-3 6a3 3 0 0 0 6 0z", "M8 21h8"],
  ART: ["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z", "M2 2l7.6 7.6"],
};

export default function OgImage({ params }: { params: { area: string } }) {
  const area = getAreaBySlug(params.area);

  // Fallback genérico si el slug no existe.
  const data = area ?? {
    headline: "Test vocacional",
    phrase: site.tagline,
    name: "Descubrí qué estudiar",
    code: "TEC" as AreaCode,
    color: { from: "#6D28D9", to: "#8B5CF6" },
    related: [] as string[],
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundImage: `linear-gradient(135deg, ${data.color.from}, ${data.color.to})`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
            QuéEstudio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              background: "rgba(255,255,255,0.2)",
              padding: "10px 22px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Test vocacional
          </div>
        </div>

        {/* Centro */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 96,
              borderRadius: 28,
              background: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              {ICON_PATHS[data.code].map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, opacity: 0.85 }}>
            Deberías estudiar
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, marginTop: 8, maxWidth: 980 }}>
            {data.headline}
          </div>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.9, marginTop: 22, maxWidth: 920, lineHeight: 1.3 }}>
            {truncate(data.phrase, 130)}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, fontWeight: 700 }}>
          <div style={{ display: "flex" }}>{site.brand}</div>
          <div style={{ display: "flex", opacity: 0.85 }}>Hacé el tuyo gratis →</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}
