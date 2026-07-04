'use client';

import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import {
  terrazzoVertex,
  terrazzoFragment,
  TERRAZZO_PALETTE,
} from '@/lib/terrazzo.glsl';

export const TerrazzoMaterial = shaderMaterial(
  {
    uSeed: 0,
    uTime: 0,
    uPolish: 0.2,
    uScale: 14,
    uBase: new THREE.Color(...TERRAZZO_PALETTE.base),
    uChipA: new THREE.Color(...TERRAZZO_PALETTE.chipA),
    uChipB: new THREE.Color(...TERRAZZO_PALETTE.chipB),
    uChipC: new THREE.Color(...TERRAZZO_PALETTE.chipC),
    uChipD: new THREE.Color(...TERRAZZO_PALETTE.chipD),
  },
  terrazzoVertex,
  terrazzoFragment
);

extend({ TerrazzoMaterial });
