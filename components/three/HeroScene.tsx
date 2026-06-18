"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr, Preload } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import DistortBlob from "./DistortBlob";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Escena 3D del Hero (React Three Fiber).
 *
 * Performance / buenas prácticas:
 * - Se monta vía next/dynamic con ssr:false desde el Hero (lazy-load).
 * - PAUSA el render cuando la sección no está visible (IntersectionObserver):
 *   `frameloop` pasa a "never" y no consume GPU mientras scrolleás abajo.
 * - DEGRADA en mobile: geometría liviana, sin partículas y DPR acotado.
 * - AdaptiveDpr baja la resolución si cae el framerate.
 */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Pausamos la escena cuando el Hero sale del viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        // Si no está visible, no renderiza frames (ahorra GPU/batería).
        frameloop={isVisible ? "always" : "never"}
        // DPR acotado: más bajo en mobile para no recalentar el dispositivo.
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Iluminación cuidada: ambiente + dos point lights de acento */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#6366f1" />
        <pointLight position={[0, 3, -5]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <DistortBlob lowPerf={isMobile} />
          {/* Environment para reflejos metálicos realistas (preset liviano) */}
          <Environment preset="city" />
          <Preload all />
        </Suspense>

        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
