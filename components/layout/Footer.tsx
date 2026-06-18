import { navLinks, site } from "@/data/site";
import { categories } from "@/data/categories";

/**
 * Footer completo con navegación, categorías, datos y redes sociales.
 * TODO: reemplazar los links de redes (data/site.ts) y el logo por los reales.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  // Iconos de redes (SVG inline) mapeados a las URLs de site.socials.
  const socials = [
    {
      label: "Instagram",
      href: site.socials.instagram,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: site.socials.tiktok,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .73-5.07V9.66a5.66 5.66 0 0 0-.73-.05A5.68 5.68 0 1 0 15.54 15V8.93a7.34 7.34 0 0 0 4.29 1.37V7.21a4.28 4.28 0 0 1-3.23-1.39z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: site.socials.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative border-t border-border bg-surface/30">
      <div className="container-loop py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca + descripción + redes */}
          <div className="lg:col-span-1">
            <a href="#inicio" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 2a10 10 0 1 0 0 20 6 6 0 0 1 0-12 4 4 0 1 1 0-8z" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold">The Loop</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-glow-sm"
                >
                  <span className="h-5 w-5">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navegación
            </h4>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Categorías
            </h4>
            <ul className="mt-4 space-y-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <a
                    href="#catalogo"
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>{site.city}</li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {year} The Loop. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted">
            Sitio de demostración · Contenido de muestra
          </p>
        </div>
      </div>
    </footer>
  );
}
