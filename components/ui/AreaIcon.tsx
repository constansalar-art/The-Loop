import type { AreaCode } from "@/data/areas";

interface AreaIconProps {
  code: AreaCode;
  className?: string;
  strokeWidth?: number;
}

/**
 * Ícono de línea por área, limpio y consistente (viewBox 24x24).
 * Se usa en la placa y en las cards. Un solo ícono por área, sin amontonar.
 */
export function AreaIcon({ code, className = "h-8 w-8", strokeWidth = 1.8 }: AreaIconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (code) {
    case "TEC": // chevrons de código
      return (
        <svg {...common} aria-hidden>
          <path d="M8 6 2 12l6 6" />
          <path d="M16 6l6 6-6 6" />
          <path d="M13 4l-2 16" />
        </svg>
      );
    case "NEG": // flecha de crecimiento
      return (
        <svg {...common} aria-hidden>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </svg>
      );
    case "SAL": // pulso / actividad
      return (
        <svg {...common} aria-hidden>
          <path d="M22 12h-4l-2.5 7-5-16L8 12H2" />
        </svg>
      );
    case "SOC": // globo de diálogo
      return (
        <svg {...common} aria-hidden>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
        </svg>
      );
    case "DER": // balanza
      return (
        <svg {...common} aria-hidden>
          <path d="M12 3v18" />
          <path d="M6 7h12" />
          <path d="M6 7l-3 6a3 3 0 0 0 6 0z" />
          <path d="M18 7l-3 6a3 3 0 0 0 6 0z" />
          <path d="M8 21h8" />
        </svg>
      );
    case "ART": // pincel / lápiz
      return (
        <svg {...common} aria-hidden>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" />
          <path d="M2 2l7.6 7.6" />
          <circle cx="11" cy="11" r="1.6" />
        </svg>
      );
  }
}
