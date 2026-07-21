import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AREA_ORDER, AREAS, getAreaBySlug } from "@/data/areas";
import { site } from "@/data/site";
import { ResultView } from "@/components/result/ResultView";

interface Params {
  params: { area: string };
}

/** Pre-genera las 6 páginas de resultado en build (para URL directa + OG). */
export function generateStaticParams() {
  return AREA_ORDER.map((code) => ({ area: AREAS[code].slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const area = getAreaBySlug(params.area);
  if (!area) return {};

  const title = `Deberías estudiar: ${area.headline}`;
  const description = `${area.phrase} Carreras y facultades argentinas para tu perfil. Hacé el test vocacional y descubrí el tuyo.`;
  const url = `${site.url}/resultado/${area.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/resultado/${area.slug}` },
    openGraph: {
      title: `${site.name} · ${title}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} · ${title}`,
      description,
    },
  };
}

export default function ResultadoPage({ params }: Params) {
  const area = getAreaBySlug(params.area);
  if (!area) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Deberías estudiar: ${area.headline}`,
    description: area.phrase,
    about: area.name,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResultView area={area} />
    </>
  );
}
