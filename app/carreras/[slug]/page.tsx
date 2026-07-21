import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CAREERS, getCareer, careersByArea } from "@/data/carreras";
import { AREAS } from "@/data/areas";
import { site } from "@/data/site";
import { AreaIcon } from "@/components/ui/AreaIcon";
import { AdSlot } from "@/components/ads/AdSlot";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return CAREERS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const career = getCareer(params.slug);
  if (!career) return {};
  return {
    title: career.seoTitle,
    description: career.seoDescription,
    alternates: { canonical: `/carreras/${career.slug}` },
    openGraph: {
      title: career.seoTitle,
      description: career.seoDescription,
      url: `${site.url}/carreras/${career.slug}`,
      type: "article",
    },
  };
}

export default function CarreraPage({ params }: Params) {
  const career = getCareer(params.slug);
  if (!career) notFound();

  const area = AREAS[career.areaCode];
  const related = careersByArea(career.areaCode).filter((c) => c.slug !== career.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: career.seoTitle,
        description: career.seoDescription,
        about: career.name,
        articleSection: area.name,
      },
      {
        "@type": "FAQPage",
        mainEntity: career.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-2xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-soft">
          <Link href="/carreras" className="hover:text-brand">
            Carreras
          </Link>{" "}
          <span className="opacity-40">/</span>{" "}
          <span className="text-ink">{career.name}</span>
        </nav>

        {/* Header con color de área */}
        <div
          className="sticker mt-4 rounded-4xl p-6 text-white"
          style={{
            backgroundImage: `linear-gradient(135deg, ${area.color.from}, ${area.color.to})`,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90">
            <AreaIcon code={career.areaCode} className="h-4 w-4" strokeWidth={2.4} />
            {area.name}
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {career.name}
          </h1>
          <p className="mt-3 text-white/90">{career.intro}</p>
          <div className="mt-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            ⏱️ Duración: {career.duration}
          </div>
        </div>

        {/* De qué se trata */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">¿De qué se trata?</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{career.about}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {career.topics.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-brand">◆</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Es para vos si */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Es para vos si…</h2>
          <ul className="mt-3 space-y-2">
            {career.forYouIf.map((f) => (
              <li key={f} className="sticker flex items-center gap-3 rounded-2xl bg-white p-3">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ad discreto */}
        <AdSlot slot={site.adSlots.carrera} className="my-8" />

        {/* Dónde estudiar */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">
            ¿Dónde estudiar {career.name} en Argentina?
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {career.whereToStudy.map((u) => (
              <span
                key={u}
                className="rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-sm font-semibold"
              >
                {u}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-soft/70">
            Listado orientativo. Los planes y la oferta de cada universidad
            cambian: verificá en el sitio oficial de la facultad antes de decidir.
          </p>
        </section>

        {/* Salida laboral */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">
            Salida laboral de {career.name}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{career.jobOutlook}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {career.jobRoles.map((r) => (
              <span
                key={r}
                className="rounded-lg bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand"
              >
                {r}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Preguntas frecuentes</h2>
          <div className="mt-4 space-y-3">
            {career.faqs.map((f) => (
              <details key={f.q} className="sticker group rounded-2xl bg-white p-4">
                <summary className="flex cursor-pointer items-center justify-between font-display font-bold marker:content-['']">
                  {f.q}
                  <span className="text-brand transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA test */}
        <div className="sticker mt-10 rounded-4xl bg-ink p-6 text-center text-white">
          <h2 className="font-display text-xl font-extrabold">
            ¿No sabés si es lo tuyo?
          </h2>
          <p className="mt-1 text-white/70">
            Hacé el test vocacional en 2 minutos y salí de la duda.
          </p>
          <Link
            href="/test"
            className="sticker mt-4 inline-flex rounded-2xl bg-pop px-6 py-3 font-display font-bold text-white"
          >
            Hacer el test →
          </Link>
        </div>

        {/* Relacionadas */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-extrabold">
              Otras carreras del área {area.name}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/carreras/${c.slug}`}
                  className="rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-sm font-semibold hover:border-brand hover:text-brand"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
