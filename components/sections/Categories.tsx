import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import { categories } from "@/data/categories";

/**
 * Sección de categorías: 3 bloques grandes y animados.
 * Accesorios de moda · Indumentaria · Perfumería.
 */
export default function Categories() {
  return (
    <section id="categorias" className="relative py-24 sm:py-32">
      <div className="container-loop">
        <SectionHeading
          eyebrow="Categorías"
          align="center"
          title={
            <>
              Tres mundos, <span className="text-gradient">una sola fuente</span>
            </>
          }
          description="Curamos cada rubro para que encuentres lo que se vende, con la calidad que tu cliente espera."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category.slug} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
