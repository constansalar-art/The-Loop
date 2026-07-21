import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { TOTAL_QUESTIONS } from "@/data/quiz";

export const metadata: Metadata = {
  title: "Sobre este test vocacional",
  description:
    "Qué es QuéEstudio, cómo funciona el test vocacional, cómo calculamos tu resultado y por qué es orientativo y no reemplaza una orientación profesional.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
        Sobre este test
      </h1>

      <div className="mt-6 space-y-6 text-ink-soft [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_p]:leading-relaxed">
        <p>
          <strong>{site.name}</strong> es un test vocacional pensado para
          adolescentes y jóvenes argentinos que están en esa etapa de “no sé qué
          estudiar”. La idea es simple: {TOTAL_QUESTIONS} preguntas rápidas, con
          onda, que te den una primera pista sobre qué área de carreras va más
          con tu forma de ser.
        </p>

        <section>
          <h2>Cómo funciona</h2>
          <p>
            Cada pregunta plantea una situación cotidiana y vos elegís la opción
            que más te representa. Detrás, cada respuesta suma puntos a seis
            grandes áreas: Tecnología/Ingeniería, Negocios/Economía, Salud,
            Social/Comunicación, Derecho y Arte/Diseño. Al terminar, te mostramos
            el área con la que tenés más afinidad, junto a carreras concretas y
            universidades argentinas donde podés estudiarlas.
          </p>
        </section>

        <section>
          <h2>¿Es científico?</h2>
          <p>
            No. Y no queremos que lo tomes como tal. {site.name} es una
            herramienta <strong>lúdica y orientativa</strong>: un punto de
            partida para pensar y para charlar con amigos, familia o un
            orientador. No usa tests psicométricos validados ni reemplaza el
            trabajo de un profesional de la orientación vocacional.
          </p>
          <p>
            Si estás frente a una decisión importante, lo ideal es complementar
            esta pista con información de las universidades, charlas
            informativas, y —si podés— una orientación vocacional profesional.
          </p>
        </section>

        <section>
          <h2>Sobre la información de carreras</h2>
          <p>
            Las descripciones de carreras, salidas laborales y universidades son
            orientativas y están basadas en información general del sistema
            universitario argentino. La oferta académica cambia con el tiempo, así
            que siempre conviene verificar los datos en los sitios oficiales de
            cada facultad.
          </p>
        </section>

        <section>
          <h2>Por qué es gratis</h2>
          <p>
            El test es y va a seguir siendo gratis. Para mantenerlo, el sitio se
            financia con publicidad (Google AdSense). Tratamos de que los avisos
            sean discretos y nunca aparezcan en el medio del quiz, para no
            arruinarte la experiencia.
          </p>
        </section>

        <div className="sticker rounded-4xl bg-brand p-6 text-center text-white">
          <p className="font-display text-lg font-bold">
            ¿Listo para descubrir lo tuyo?
          </p>
          <Link
            href="/test"
            className="sticker mt-3 inline-flex rounded-2xl bg-white px-6 py-3 font-display font-bold text-brand"
          >
            Empezar el test →
          </Link>
        </div>
      </div>
    </div>
  );
}
