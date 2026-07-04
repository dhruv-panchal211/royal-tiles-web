'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Tile from '@/components/three/Tile';
import { GOLD_PALETTE } from '@/lib/terrazzo.glsl';

function Dust({ count = 220 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * 0.12; // slow upward drift
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#FFFFFF"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function GoldTile() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <group ref={ref} rotation={[0.3, 0, 0]}>
      <Tile
        seed={6.2}
        polish={0.92}
        scale={15}
        size={[3.4, 3.4, 0.18]}
        palette={GOLD_PALETTE}
        animate={false}
      />
    </group>
  );
}

export default function CTACanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#E1241C']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 4, 5]} intensity={1.5} color="#fff3d6" />
      <directionalLight position={[3, -2, 2]} intensity={0.6} color="#D4A843" />
      <GoldTile />
      <Dust />
    </Canvas>
  );
}
