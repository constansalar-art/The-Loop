/**
 * Formatea un número como precio en pesos argentinos (ARS).
 * Ej: 18500 => "$ 18.500"
 *
 * Cuando sumes el carrito más adelante, este helper te sirve para
 * mostrar precios consistentes en cards, detalle de producto y checkout.
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
