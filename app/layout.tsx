import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AdSenseScript } from "@/components/ads/AdSense";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Test vocacional: ¿Qué carrera estudiar?`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "test vocacional",
    "qué carrera estudiar",
    "no sé qué estudiar",
    "test vocacional gratis",
    "orientación vocacional",
    "carreras universitarias Argentina",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ¿Qué carrera deberías estudiar?`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ¿Qué carrera deberías estudiar?`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#6D28D9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CookieBanner />
        <AdSenseScript />
      </body>
    </html>
  );
}
