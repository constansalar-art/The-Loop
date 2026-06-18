# The Loop · Web institucional (prototipo)

Prototipo de demostración para **The Loop**, importadora y distribuidora argentina
de accesorios de moda, indumentaria y perfumería. Estética tech premium, oscura
con acento violeta neón, escena 3D interactiva en el Hero y captación de leads.

> ⚠️ Es una **demo**: el contenido es de muestra (mock) y el formulario no envía
> a ningún backend todavía. Está preparado para sumar carrito y datos reales.

## 🧱 Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (paleta vía variables CSS)
- **React Three Fiber** + **@react-three/drei** (escena 3D del Hero)
- **Framer Motion** (animaciones de UI)
- **GSAP + ScrollTrigger** + **Lenis** (smooth scroll y animaciones al scroll)

## 🚀 Correr en local

Requisitos: **Node 18.17+** (recomendado Node 20/22).

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el entorno de desarrollo
npm run dev
```

Abrí **http://localhost:3000** en el navegador.

Otros comandos:

```bash
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint    # linter
```

## ☁️ Deploy en Vercel (para compartir el link)

La forma más rápida de mostrárselo a tus socios con un link público:

1. Subí el proyecto a un repo de GitHub (este ya lo está).
2. Entrá a **https://vercel.com**, "Add New… → Project" e importá el repo.
3. Vercel detecta Next.js solo: dejá todo por defecto y "Deploy".
4. En 1–2 minutos te da una URL tipo `https://the-loop.vercel.app`.

No hace falta configurar variables de entorno para la demo.

> Alternativa por CLI: `npm i -g vercel && vercel` (seguí los pasos).

## 📁 Estructura

```
app/                  Layout raíz, página home y estilos globales
components/
  layout/             Navbar y Footer
  sections/           Una por sección (Hero, About, Categories, …)
  three/              Escena 3D (HeroScene + DistortBlob)
  ui/                 Reutilizables (cards, botones, headings, reveal)
providers/            SmoothScrollProvider (Lenis + GSAP)
hooks/                useMediaQuery, usePrefersReducedMotion
data/                 Mock data: products, categories, brands, site
lib/                  Helpers (cn, formato ARS)
public/               Assets estáticos (placeholders)
```

## ✏️ Qué reemplazar con contenido real

Buscá los comentarios `TODO:` en el código. Los puntos clave:

- **`data/site.ts`** → email, teléfono, WhatsApp, redes sociales, ubicación.
- **`data/products.ts`** → catálogo real (nombre, marca, categoría, precio, foto).
- **`data/categories.ts`** y **`data/brands.ts`** → categorías y logos de marcas.
- **Imágenes**: hoy las cards usan placeholders con gradiente. Subí las fotos a
  `public/productos/` y `public/categorias/` y cambiá los `<div>` placeholder por
  `<Image />` de `next/image` (marcado con `TODO`).
- **Logo**: en `Navbar.tsx` y `Footer.tsx` hay un logo tipográfico provisorio.

## 🎨 Personalizar la identidad

Toda la paleta vive como variables CSS en **`app/globals.css`** (`:root`):
`--bg`, `--surface`, `--text`, `--accent`, etc. Cambiando esos hex se recalibra
toda la web. Fuentes y sombras (glow) se configuran en `tailwind.config.ts`.

## ♿ Performance y accesibilidad

- La escena 3D **lazy-loadea** (no entra al bundle inicial), **se pausa** cuando
  el Hero sale de la pantalla y **degrada en mobile** (geometría liviana, sin
  partículas).
- Se respeta **`prefers-reduced-motion`**: sin 3D animado ni smooth scroll para
  quienes lo configuran.

## 🛒 Preparado para crecer

El modelo de datos (`Product` con `id`, `slug`, `price`, `inStock`) y la
arquitectura de componentes ya están pensados para sumar un carrito/checkout
más adelante sin rehacer la UI.
