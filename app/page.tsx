import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Categories from "@/components/sections/Categories";
import FeaturedCatalog from "@/components/sections/FeaturedCatalog";
import Brands from "@/components/sections/Brands";
import WhyUs from "@/components/sections/WhyUs";
import Resellers from "@/components/sections/Resellers";
import Contact from "@/components/sections/Contact";

/**
 * Home de The Loop.
 * Compone todas las secciones en el orden definido para la demo.
 * El orden de las secciones es el "storytelling" de la marca:
 * impacto (Hero) → confianza (About) → oferta (Categorías/Catálogo) →
 * prueba social (Marcas) → diferenciales (Por qué) → conversión
 * (Revendedores/Contacto).
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Categories />
        <FeaturedCatalog />
        <Brands />
        <WhyUs />
        <Resellers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
