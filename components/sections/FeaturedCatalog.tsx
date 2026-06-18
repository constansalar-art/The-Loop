"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * Catálogo destacado: grid de productos mock con filtro por categoría.
 * Las cards reaccionan al hover con tilt 3D + glow (ver ProductCard).
 *
 * El filtro es client-side sobre la data mock. Cuando conectes un backend,
 * reemplazás `products` por los datos reales sin tocar la UI.
 */

type Filter = "todos" | (typeof categories)[number]["slug"];

export default function FeaturedCatalog() {
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered =
    filter === "todos"
      ? products
      : products.filter((p) => p.category === filter);

  // Opciones del filtro: "Todos" + las 3 categorías.
  const filters: { value: Filter; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...categories.map((c) => ({ value: c.slug as Filter, label: c.name })),
  ];

  return (
    <section id="catalogo" className="relative py-24 sm:py-32">
      <div className="container-loop">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Catálogo destacado"
            title={
              <>
                Una selección de lo que{" "}
                <span className="text-gradient">mejor se mueve</span>
              </>
            }
            description="Una muestra de nuestro catálogo. Pedinos el listado completo con precios mayoristas actualizados."
          />
        </div>

        {/* Filtros por categoría */}
        <div className="mt-10 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
                filter === f.value
                  ? "border-accent bg-accent text-white shadow-glow-sm"
                  : "border-border bg-surface/50 text-muted hover:border-accent/50 hover:text-white",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        {/* CTA al pie del catálogo */}
        <div className="mt-14 flex justify-center">
          <MagneticButton href="#contacto" variant="ghost">
            Solicitar catálogo completo
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
