/**
 * Configuración central del sitio: datos de contacto, redes y navegación.
 * Centralizar esto te permite cambiar el teléfono, mail o links de redes
 * en un solo lugar. Reemplazá los placeholders por los datos reales.
 */

export const site = {
  name: "The Loop",
  // Frase de marca para metadata / footer
  description:
    "Importadora y distribuidora en Argentina de accesorios de moda, indumentaria y perfumería premium.",
  // TODO: reemplazar por datos reales de contacto
  email: "hola@theloop.com.ar",
  phoneDisplay: "+54 9 11 5555-1234",
  // Número en formato internacional sin signos para el link de WhatsApp
  whatsapp: "5491155551234",
  whatsappMessage:
    "¡Hola The Loop! Me interesa conocer más sobre el catálogo y trabajar como revendedor.",
  city: "Buenos Aires, Argentina",
  // Redes sociales (reemplazá las URLs por las reales)
  socials: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    linkedin: "https://linkedin.com/",
  },
};

/** Items del menú de navegación (anclas a las secciones de la home). */
export const navLinks = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#categorias", label: "Categorías" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#revendedores", label: "Revendedores" },
  { href: "#contacto", label: "Contacto" },
];

/** Link de WhatsApp listo para usar (con mensaje pre-cargado). */
export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;
