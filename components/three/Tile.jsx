'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TERRAZZO_PALETTE } from '@/lib/terrazzo.glsl';
import './TileMaterial';

/**
 * A single terrazzo tile slab. Self-contained: shader provides the surface,
 * lighting and finish, so no textures/HDRs are needed.
 */
export default function Tile({
  seed = 0,
  polish = 0.25,
  scale = 14,
  size = [4, 4, 0.18],
  palette = TERRAZZO_PALETTE,
  bevel = 0.04,
  animate = true,
  rotationSpeed = 0.0015,
  ...props
}) {
  const matRef = useRef();
  const meshRef = useRef();

  const colors = useMemo(
    () => ({
      base: new THREE.Color(...palette.base),
      chipA: new THREE.Color(...palette.chipA),
      chipB: new THREE.Color(...palette.chipB),
      chipC: new THREE.Color(...palette.chipC),
      chipD: new THREE.Color(...palette.chipD),
    }),
    [palette]
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
    }
    if (animate && meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta * 60;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow {...props}>
      <boxGeometry args={[size[0], size[1], size[2], 1, 1, 1]} />
      <terrazzoMaterial
        ref={matRef}
        key={TERRAZZO_PALETTE === palette ? 'default' : 'custom'}
        uSeed={seed}
        uPolish={polish}
        uScale={scale}
        uBase={colors.base}
        uChipA={colors.chipA}
        uChipB={colors.chipB}
        uChipC={colors.chipC}
        uChipD={colors.chipD}
      />
    </mesh>
  );
}
