// Procedural seeded terrazzo shader.
// Generates rounded aggregate "chips" of varied colour and size over a cement
// base using cellular (voronoi) noise, plus simple lighting and an animated
// gloss band driven by uPolish to fake a matte -> polished finish.

export const terrazzoVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const terrazzoFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  uniform float uSeed;
  uniform float uTime;
  uniform float uPolish;   // 0.0 matte -> 1.0 mirror polish
  uniform float uScale;    // chip density
  uniform vec3 uBase;      // cement base colour
  uniform vec3 uChipA;
  uniform vec3 uChipB;
  uniform vec3 uChipC;
  uniform vec3 uChipD;

  vec2 hash2(vec2 p) {
    p += uSeed;
    return fract(sin(vec2(
      dot(p, vec2(127.1, 311.7)),
      dot(p, vec2(269.5, 183.3))
    )) * 43758.5453);
  }

  float hash1(vec2 p) {
    return fract(sin(dot(p + uSeed, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Voronoi: returns F1 distance (x), cell id hash (y)
  vec2 voronoi(vec2 uv) {
    vec2 g = floor(uv);
    vec2 f = fract(uv);
    float minDist = 8.0;
    vec2 minCell = vec2(0.0);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 cell = vec2(float(x), float(y));
        vec2 o = hash2(g + cell);
        vec2 r = cell + o - f;
        float d = dot(r, r);
        if (d < minDist) {
          minDist = d;
          minCell = g + cell;
        }
      }
    }
    return vec2(sqrt(minDist), hash1(minCell));
  }

  void main() {
    // multi-frequency chips: large + small aggregate
    vec2 res = voronoi(vUv * uScale);
    vec2 res2 = voronoi(vUv * uScale * 2.3 + 31.0);

    vec3 color = uBase;

    // pick chip colour by cell hash
    float id = res.y;
    vec3 chip = uChipA;
    if (id > 0.75) chip = uChipB;
    else if (id > 0.5) chip = uChipC;
    else if (id > 0.28) chip = uChipD;

    // chip occupies cell where distance under a size threshold (size varies per cell)
    float size = mix(0.32, 0.62, hash1(floor(vUv * uScale) + 7.0));
    float chipMask = smoothstep(size, size - 0.06, res.x);

    // smaller speckles
    float smallMask = smoothstep(0.22, 0.16, res2.x) * step(0.6, res2.y);
    vec3 smallChip = mix(uChipB, uChipA, hash1(floor(vUv * uScale * 2.3)));

    color = mix(color, chip, chipMask);
    color = mix(color, smallChip, smallMask * 0.7);

    // fine grain
    float grain = hash1(floor(vUv * 600.0)) * 0.06 - 0.03;
    color += grain;

    // lighting — workshop skylight from upper-left
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    float ambient = 0.55;
    color *= ambient + diff * 0.7;

    // specular highlight, intensified by polish
    vec3 H = normalize(L + vViewDir);
    float spec = pow(clamp(dot(N, H), 0.0, 1.0), mix(8.0, 120.0, uPolish));
    color += spec * mix(0.05, 0.9, uPolish) * vec3(1.0, 0.97, 0.9);

    // moving gloss band for polished finish
    float band = sin((vUv.x + vUv.y) * 6.2831 + uTime * 0.6);
    band = smoothstep(0.85, 1.0, band);
    color += band * uPolish * 0.12;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

// Brand terrazzo palette — white cement with red / grey / charcoal chips
export const TERRAZZO_PALETTE = {
  base: [0.96, 0.95, 0.93], // white cement
  chipA: [0.88, 0.14, 0.11], // brand red
  chipB: [0.54, 0.55, 0.56], // grey
  chipC: [0.11, 0.11, 0.1], // charcoal
  chipD: [0.82, 0.82, 0.82], // light grey
};

// Cream/white terrazzo for the red CTA section so the tile reads on red
export const GOLD_PALETTE = {
  base: [0.97, 0.96, 0.93],
  chipA: [0.7, 0.09, 0.06], // deep red
  chipB: [0.62, 0.62, 0.62],
  chipC: [0.13, 0.13, 0.12],
  chipD: [1.0, 1.0, 1.0],
};
