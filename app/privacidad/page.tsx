import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de QuéEstudio: qué datos usamos, cookies, Google AdSense y tus opciones.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Política de Privacidad</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Última actualización: {new Date().getFullYear()}
      </p>

      <div className="prose-sm mt-6 space-y-6 text-ink-soft [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_p]:leading-relaxed">
        <p>
          En {site.name} ({site.brand}) nos tomamos en serio tu privacidad. Este
          sitio es un test vocacional lúdico y orientativo. Acá te contamos, en
          criollo, qué información se maneja cuando lo usás.
        </p>

        <section>
          <h2>Qué datos recopilamos</h2>
          <p>
            No te pedimos registro ni datos personales para hacer el test. Las
            respuestas del quiz se procesan en tu propio navegador para calcular
            el resultado y <strong>no se envían ni se guardan</strong> en ningún
            servidor nuestro.
          </p>
          <p>
            Como la mayoría de los sitios, recibimos automáticamente datos
            técnicos anónimos (tipo de dispositivo, navegador, páginas visitadas)
            a través de herramientas de analítica y publicidad.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Usamos cookies y tecnologías similares para recordar tus preferencias
            (por ejemplo, tu elección en el banner de cookies) y para mostrar
            publicidad. Podés bloquear o borrar las cookies desde la configuración
            de tu navegador, aunque algunas funciones podrían dejar de andar.
          </p>
        </section>

        <section>
          <h2>Google AdSense y cookies de terceros</h2>
          <p>
            Este sitio se financia con publicidad de <strong>Google AdSense</strong>.
            Google y sus socios utilizan cookies para mostrarte anuncios basados
            en tus visitas a este y otros sitios web.
          </p>
          <p>
            El uso de la cookie de publicidad de Google (por ejemplo, la cookie
            DoubleClick) les permite a Google y a sus socios publicar anuncios
            basados en tu actividad de navegación. Podés desactivar la publicidad
            personalizada visitando la{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline"
            >
              Configuración de anuncios de Google
            </a>
            , o gestionar cookies de terceros en{" "}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline"
            >
              www.aboutads.info
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Enlaces a otros sitios</h2>
          <p>
            Podemos mencionar universidades u otras páginas externas. No somos
            responsables de las prácticas de privacidad de esos sitios; te
            recomendamos leer sus propias políticas.
          </p>
        </section>

        <section>
          <h2>Menores de edad</h2>
          <p>
            El test está pensado para adolescentes y jóvenes. No recopilamos de
            forma consciente datos personales identificables de menores.
          </p>
        </section>

        <section>
          <h2>Contacto</h2>
          <p>
            Si tenés alguna duda sobre esta política, escribinos a través de
            nuestras redes: {site.social.instagram} en Instagram.
          </p>
        </section>
      </div>
    </div>
  );
}
