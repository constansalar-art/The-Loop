"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Area } from "@/data/areas";
import { getCareer } from "@/data/carreras";
import { site } from "@/data/site";
import { ResultCard } from "./ResultCard";
import { ShareButtons } from "./ShareButtons";
import { AreaIcon } from "@/components/ui/AreaIcon";
import { AdSlot } from "@/components/ads/AdSlot";

export function ResultView({ area }: { area: Area }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const featured = area.featuredCareers
    .map((slug) => getCareer(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
      {/* Reveal de impacto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: area.color.accent }}
        >
          <AreaIcon code={area.code} className="h-4 w-4" strokeWidth={2.4} />
          Tu resultado
        </motion.span>
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.2 }}
          className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl"
        >
          {area.title}
        </motion.h1>
      </motion.div>

      {/* Placa */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.35 }}
        className="mt-6"
      >
        <ResultCard ref={cardRef} area={area} />
      </motion.div>

      {/* Compartir */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-6"
      >
        <p className="mb-3 text-center font-display text-lg font-bold">
          Mandáselo a alguien que no sabe qué estudiar 👇
        </p>
        <ShareButtons area={area} cardRef={cardRef} />
      </motion.div>

      {/* Disclaimer suave */}
      <p className="mt-6 rounded-2xl bg-white/60 px-4 py-3 text-center text-xs text-ink-soft">
        Esto es un test orientativo y para divertirte, no reemplaza una
        orientación vocacional profesional. Usalo como una primera pista 🙂
      </p>

      {/* Ad debajo de la placa (no la tapa) */}
      <AdSlot slot={site.adSlots.resultado} className="my-8" />

      {/* Carreras relacionadas */}
      <section className="mt-4">
        <h2 className="font-display text-xl font-extrabold">
          Conocé estas carreras en detalle
        </h2>
        <div className="mt-4 space-y-3">
          {featured.map((c) => (
            <Link
              key={c.slug}
              href={`/carreras/${c.slug}`}
              className="sticker flex items-center gap-3 rounded-2xl bg-white p-4"
            >
              <span
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-white"
                style={{ backgroundColor: area.color.accent }}
              >
                <AreaIcon code={c.areaCode} className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-bold leading-tight">{c.name}</span>
                <span className="block truncate text-sm text-ink-soft">{c.intro}</span>
              </span>
              <span className="text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Universidades */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-extrabold">
          Dónde estudiar en Argentina
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {area.universities.map((u) => (
            <span
              key={u}
              className="rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-sm font-semibold"
            >
              {u}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-soft/70">
          La oferta de carreras por universidad puede cambiar: verificá siempre
          en el sitio oficial de cada facultad.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/test"
          className="sticker flex-1 rounded-2xl bg-brand px-4 py-3.5 text-center font-display font-bold text-white"
        >
          🔄 Volver a hacer el test
        </Link>
        <Link
          href="/carreras"
          className="sticker flex-1 rounded-2xl bg-white px-4 py-3.5 text-center font-display font-bold text-ink"
        >
          Ver todas las carreras
        </Link>
      </div>
    </div>
  );
}
