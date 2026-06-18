import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { site } from "@/data/site";

/**
 * Fuentes vía next/font (se auto-hostean, sin requests externos en runtime).
 * - Space Grotesk: sans geométrica moderna para los títulos.
 * - Inter: neutra y legible para el texto de cuerpo.
 * Se exponen como variables CSS que consume tailwind.config.ts.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Importación premium en Argentina`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "importadora",
    "moda",
    "indumentaria",
    "perfumería",
    "accesorios",
    "mayorista",
    "revendedores",
    "Argentina",
  ],
  openGraph: {
    title: `${site.name} · Importación premium en Argentina`,
    description: site.description,
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable}`}>
      <body className="bg-bg text-text antialiased">
        {/* Lenis + GSAP: scroll suave global y animaciones al scroll */}
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
