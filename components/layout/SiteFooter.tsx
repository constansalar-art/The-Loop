import Link from "next/link";
import { site } from "@/data/site";

/** Footer con links legales (importantes para AdSense) y disclaimer. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-ink/10 bg-white/50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-lg font-black text-white">
                ?
              </span>
              <span className="font-display text-lg font-black">
                Qué<span className="text-brand">Estudio</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-ink-soft">
              El test vocacional argentino. Un juego orientativo para darte una
              mano a pensar qué estudiar. No reemplaza una orientación vocacional
              profesional.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <span className="col-span-2 font-display text-xs font-bold uppercase tracking-widest text-ink-soft/60">
              El sitio
            </span>
            <Link href="/test" className="text-ink-soft hover:text-brand">
              Hacer el test
            </Link>
            <Link href="/carreras" className="text-ink-soft hover:text-brand">
              Carreras
            </Link>
            <Link href="/sobre" className="text-ink-soft hover:text-brand">
              Sobre el test
            </Link>
            <Link href="/privacidad" className="text-ink-soft hover:text-brand">
              Privacidad
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-ink/10 pt-6 text-xs text-ink-soft/70 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.brand}
          </p>
          <p>Hecho con onda en Argentina 🇦🇷</p>
        </div>
      </div>
    </footer>
  );
}
