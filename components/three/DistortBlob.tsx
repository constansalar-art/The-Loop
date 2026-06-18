"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Objeto 3D del Hero: un "blob" abstracto y elegante que se deforma
 * suavemente (MeshDistortMaterial) y rota lento. Reacciona al movimiento
 * del mouse con una leve inclinación. Material metálico con tinte violeta.
 *
 * Props:
 * - lowPerf: en mobile reduce la geometría y desactiva las partículas
 *   para mantener el rendimiento.
 */
export default function DistortBlob({ lowPerf = false }: { lowPerf?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Animación por frame: rotación lenta + seguimiento suave del mouse.
  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer; // posición del mouse normalizada (-1 a 1)
    // Rotación continua suave
    meshRef.current.rotation.y += 0.002;
    // Inclinación suave hacia el cursor (lerp para que sea fluido)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      y * 0.3,
      0.05,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      x * 0.15,
      0.05,
    );
  });

  // Escala responsiva según el viewport 3D.
  const scale = Math.min(viewport.width, viewport.height) * 0.32;

  return (
    <group>
      {/* Float: hace flotar suavemente el objeto para darle vida */}
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={meshRef} scale={scale} castShadow>
          {/* Menos segmentos en mobile para ganar performance */}
          <icosahedronGeometry args={[1, lowPerf ? 16 : 64]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            roughness={0.15}
            metalness={0.9}
            distort={lowPerf ? 0.3 : 0.45} // intensidad de la deformación
            speed={1.6} // velocidad de la deformación
            emissive="#5b21b6"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>

      {/* Partículas flotantes alrededor (se omiten en mobile/lowPerf) */}
      {!lowPerf && (
        <Sparkles
          count={60}
          scale={6}
          size={2.4}
          speed={0.4}
          opacity={0.6}
          color="#a855f7"
        />
      )}
    </group>
  );
}
