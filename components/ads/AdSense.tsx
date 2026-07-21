import Script from "next/script";
import { site } from "@/data/site";

/**
 * Carga el script global de Google AdSense.
 * Sólo se inyecta si completaste `adsensePublisherId` en data/site.ts.
 * (Va en el layout raíz, una sola vez.)
 */
export function AdSenseScript() {
  if (!site.adsensePublisherId) return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsensePublisherId}`}
    />
  );
}
