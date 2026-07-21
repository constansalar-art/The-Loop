import Link from "next/link";
import { site } from "@/data/site";

/** Header minimal: logo de la marca + link a carreras. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-lg font-black text-white shadow-card">
            ?
          </span>
          <span className="font-display text-lg font-black tracking-tight">
            Qué<span className="text-brand">Estudio</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            href="/carreras"
            className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-brand-soft hover:text-brand"
          >
            Carreras
          </Link>
          <Link
            href="/test"
            className="sticker rounded-full bg-ink px-4 py-1.5 font-display font-bold text-white"
          >
            Hacer el test
          </Link>
        </nav>
      </div>
    </header>
  );
}
