'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '@/components/three/TileMaterial';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ConfigTile({ pattern, targetPolish }) {
  const matRef = useRef();
  const meshRef = useRef();

  const colors = useMemo(
    () => ({
      base: new THREE.Color(...pattern.base),
      chipA: new THREE.Color(...pattern.chipA),
      chipB: new THREE.Color(...pattern.chipB),
      chipC: new THREE.Color(...pattern.chipC),
      chipD: new THREE.Color(...pattern.chipD),
    }),
    [pattern]
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
      matRef.current.uPolish = lerp(
        matRef.current.uPolish,
        targetPolish,
        0.08
      );
    }
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.35;
      meshRef.current.rotation.x = -0.25;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[4, 4, 0.2]} />
      <terrazzoMaterial
        ref={matRef}
        key={pattern.id}
        uSeed={pattern.seed}
        uScale={pattern.scale}
        uPolish={targetPolish}
        uBase={colors.base}
        uChipA={colors.chipA}
        uChipB={colors.chipB}
        uChipC={colors.chipC}
        uChipD={colors.chipD}
      />
    </mesh>
  );
}

export default function ConfiguratorCanvas({ pattern, targetPolish }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 5, 4]} intensity={1.4} />
      <directionalLight position={[4, -2, 3]} intensity={0.4} color="#D4A843" />
      <ConfigTile pattern={pattern} targetPolish={targetPolish} />
    </Canvas>
  );
}
