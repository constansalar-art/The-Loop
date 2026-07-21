# QuéEstudio · Test vocacional argentino

Quiz rápido de **10 preguntas** que, según los gustos de la persona, le sugiere
qué carrera universitaria estudiar y en qué facultades argentinas hacerlo.

Producto **lúdico y orientativo** (no es orientación vocacional profesional),
pensado para tráfico viral desde **TikTok** + **SEO** en Google, y monetizado con
**Google AdSense**. La prioridad #1 del diseño es que el resultado dé ganas de
compartirlo: una **placa** descargable, limpia y coleccionable por área.

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (identidad "sticker": base crema, tinta casi negra, violeta de marca)
- **Framer Motion** (transiciones del quiz y reveal del resultado)
- **html-to-image** (descarga de la placa como PNG)
- **next/og** (`@vercel/og`) para la **OG image dinámica** por resultado
- Sin base de datos: toda la data (preguntas, carreras, universidades) es local
- Mobile-first, listo para **Vercel**

## 🚀 Correr en local

Requisitos: **Node 18.17+** (recomendado Node 20/22).

```bash
npm install
npm run dev      # http://localhost:3000
```

Otros comandos: `npm run build`, `npm run start`, `npm run lint`.

## 🗺️ Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Landing con gancho + botón "Empezar test" |
| `/test` | El quiz (una pregunta por pantalla, barra de progreso) |
| `/resultado/[area]` | Resultado por área (`tec`, `neg`, `sal`, `soc`, `der`, `art`). Funciona por URL directa y genera su propia OG image |
| `/carreras` | Índice de todas las carreras |
| `/carreras/[slug]` | Página SEO por carrera (de qué se trata, dónde estudiar, salida laboral) |
| `/sobre` | Sobre el test (ayuda a la aprobación de AdSense) |
| `/privacidad` | Política de privacidad (requisito de AdSense) |

`sitemap.xml` y `robots.txt` se generan automáticamente (`app/sitemap.ts`, `app/robots.ts`).

## 🎛️ Cómo ajustar el test

- **Preguntas y puntajes** → `data/quiz.ts`. Cada opción suma puntos a una o dos
  áreas (`AREA +N`).
- **Motor de puntaje (para tunear pesos y desempate)** → `lib/scoring.ts`.
  - `AREA_WEIGHTS`: multiplicador por área para balancear el test.
  - `TIEBREAK_ORDER`: orden de desempate. Hoy: `SAL > DER > TEC > NEG > SOC > ART`.
- **Resultados / placa** (título, frase, carreras, universidades, colores) →
  `data/areas.ts`.
- **Contenido SEO de carreras** → `data/carreras.ts`.
- **Marca, dominio y AdSense** → `data/site.ts`.

## 💰 Google AdSense

1. Completá `adsensePublisherId` en **`data/site.ts`** con tu ID
   (`ca-pub-XXXXXXXXXXXXXXXX`). Mientras esté vacío, **no** se carga el script ni
   se muestran anuncios (en su lugar se ve un placeholder gris).
2. Completá los `adSlots` (`resultado`, `carrera`) con los IDs de slot que creás
   en tu panel de AdSense.
3. Los ads son discretos y **nunca** aparecen dentro del quiz (arruina el
   compartido). Van debajo de la placa y en las páginas de carrera.
4. El sitio ya incluye `/privacidad`, `/sobre` y un banner de consentimiento de
   cookies, requisitos para la aprobación de AdSense.

## 🔗 Antes de publicar

- Cambiá `url` y `brand` en `data/site.ts` por tu dominio real (hoy
  `queestudio.ar`). De ahí salen la metadata, las OG images, el sitemap y los
  links compartidos.
- Verificá que la oferta de carreras por universidad siga vigente (los planes
  cambian). El disclaimer ya lo aclara, pero conviene chequear.

## ☁️ Deploy en Vercel

1. Subí el repo a GitHub.
2. En **vercel.com** → "Add New… → Project" e importá el repo.
3. Vercel detecta Next.js solo: "Deploy". No hacen falta variables de entorno.

## 📁 Estructura

```
app/
  page.tsx                     Landing
  test/                        Quiz
  resultado/[area]/            Resultado + opengraph-image dinámica
  carreras/, carreras/[slug]/  Índice y páginas SEO de carreras
  sobre/, privacidad/          Páginas legales / de contenido
  sitemap.ts, robots.ts        SEO técnico
components/
  quiz/        Quiz (client, Framer Motion)
  result/      ResultCard (la placa), ShareButtons, ResultView
  ads/         AdSense (script) + AdSlot
  layout/      Header, Footer, CookieBanner
  ui/          AreaIcon
data/          quiz, areas, carreras, site
lib/           scoring (tunable), utils
```
