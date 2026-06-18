"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Barra de navegación fija.
 * - Fondo translúcido con blur que se intensifica al hacer scroll.
 * - Logo tipográfico (TODO: reemplazar por el logo real / <Image />).
 * - Menú hamburguesa animado en mobile.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Detectamos el scroll para dar más opacidad/blur a la barra.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-loop flex h-16 items-center justify-between sm:h-20">
        {/* Logo. TODO: reemplazar por el logotipo real */}
        <a href="#inicio" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-glow-sm transition-transform duration-300 group-hover:rotate-12">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2a10 10 0 1 0 0 20 6 6 0 0 1 0-12 4 4 0 1 1 0-8z" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            The Loop
          </span>
        </a>

        {/* Links desktop */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative text-sm font-medium text-muted transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a
          href="#contacto"
          className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-all duration-300 hover:bg-accent-2 hover:shadow-glow lg:inline-flex"
        >
          Contactanos
        </a>

        {/* Botón hamburguesa (mobile) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span className={cn("h-0.5 w-5 bg-white transition-transform", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-5 bg-white transition-opacity", open && "opacity-0")} />
            <span className={cn("h-0.5 w-5 bg-white transition-transform", open && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </nav>

      {/* Menú mobile desplegable */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-border bg-bg/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-loop flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-muted transition-colors hover:bg-surface hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  href="#contacto"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Contactanos
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
