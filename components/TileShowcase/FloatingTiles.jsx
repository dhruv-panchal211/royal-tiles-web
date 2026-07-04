'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Tile from '@/components/three/Tile';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const GRID = Array.from({ length: 9 }).map((_, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    seed: i * 12.37 + 1.1,
    base: [(col - 1) * 2.6, (1 - row) * 2.6, 0],
    depth: ((col + row) % 3) * 0.6 + 0.4, // parallax factor
    polish: 0.2 + ((i * 7) % 5) * 0.12,
  };
});

function TileItem({ data, index, selected, onSelect, pointer }) {
  const group = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const isSel = selected === index;

    if (isSel) {
      // fly toward the camera, fill viewport
      const target = new THREE.Vector3();
      camera.getWorldDirection(target);
      target.multiplyScalar(4).add(camera.position);
      group.current.position.lerp(target, 0.12);
      group.current.rotation.x = lerp(group.current.rotation.x, 0, 0.12);
      group.current.rotation.y = lerp(group.current.rotation.y, 0, 0.12);
      group.current.scale.setScalar(
        lerp(group.current.scale.x, 1.4, 0.12)
      );
    } else {
      const px = pointer.current.x * data.depth;
      const py = pointer.current.y * data.depth;
      const bob = Math.sin(t * 0.8 + index) * 0.15;
      const pushed = selected !== null ? 1.6 : 0; // scatter when one is open
      group.current.position.x = lerp(
        group.current.position.x,
        data.base[0] + px + (data.base[0] < 0 ? -pushed : pushed),
        0.08
      );
      group.current.position.y = lerp(
        group.current.position.y,
        data.base[1] + py + bob,
        0.08
      );
      group.current.position.z = lerp(
        group.current.position.z,
        data.base[2] + px * 0.5,
        0.08
      );
      group.current.rotation.y = lerp(
        group.current.rotation.y,
        px * 0.3,
        0.08
      );
      group.current.scale.setScalar(
        lerp(group.current.scale.x, selected !== null ? 0.6 : 1, 0.08)
      );
    }
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <Tile
        seed={data.seed}
        polish={data.polish}
        scale={13}
        size={[2.2, 2.2, 0.14]}
        animate={false}
      />
    </group>
  );
}

export default function FloatingTiles({ selected, onSelect }) {
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    pointer.current.x = lerp(pointer.current.x, state.pointer.x, 0.1);
    pointer.current.y = lerp(pointer.current.y, state.pointer.y, 0.1);
  });

  return (
    <>
      <color attach="background" args={['#F5F2ED']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 5, 5]} intensity={1.3} />
      <directionalLight position={[4, -3, 2]} intensity={0.4} color="#D4A843" />
      {/* click empty space to deselect */}
      <mesh
        position={[0, 0, -3]}
        onClick={() => onSelect(null)}
        visible={false}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial />
      </mesh>
      {GRID.map((d, i) => (
        <TileItem
          key={i}
          data={d}
          index={i}
          selected={selected}
          onSelect={onSelect}
          pointer={pointer}
        />
      ))}
    </>
  );
}
