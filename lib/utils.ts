import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Helper para combinar clases de Tailwind de forma segura.
 * Resuelve conflictos (la última gana) y permite clases condicionales.
 *
 * Ejemplo: cn("p-4", isActive && "bg-accent", "p-6") => "bg-accent p-6"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
