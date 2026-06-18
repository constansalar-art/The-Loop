import { cn } from "@/lib/utils";

/**
 * Mancha de luz violeta decorativa (glow radial difuminado).
 * Se usa de fondo en varias secciones para dar profundidad y el toque neón.
 * Es puramente estético (aria-hidden) y no interfiere con clics.
 */
export default function GlowOrb({
  className,
  size = 600,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full blur-3xl glow-radial opacity-60",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
