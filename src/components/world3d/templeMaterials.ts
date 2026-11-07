import * as THREE from "three";

/**
 * PBR Temple Materials Library according to Creative OS & 44_AGENCYLIKE_UI guidelines.
 * Features physically accurate roughness, metallic values, and warm Indian temple tones.
 */
export interface TempleMaterialsCollection {
  dholpurSandstone: THREE.MeshStandardMaterial;
  carvedOchreStone: THREE.MeshStandardMaterial;
  makranaMarble: THREE.MeshStandardMaterial;
  blackGraniteShivling: THREE.MeshStandardMaterial;
  peethamStone: THREE.MeshStandardMaterial;
  templeBrass: THREE.MeshStandardMaterial;
  goldKalasha: THREE.MeshStandardMaterial;
  sindoorHanuman: THREE.MeshStandardMaterial;
  saffronFlag: THREE.MeshStandardMaterial;
  marigoldGarland: THREE.MeshStandardMaterial;
  roseGarland: THREE.MeshStandardMaterial;
  tulsiLeaves: THREE.MeshStandardMaterial;
  diyaClay: THREE.MeshStandardMaterial;
  flameEmissive: THREE.MeshBasicMaterial;
  sanctumWall: THREE.MeshStandardMaterial;
  sanctumFloor: THREE.MeshStandardMaterial;
  nandiStone: THREE.MeshStandardMaterial;
}

export function createTempleMaterials(): TempleMaterialsCollection {
  // 1. Dholpur Red Sandstone (Authentic Nagara Temple Walls)
  const dholpurSandstone = new THREE.MeshStandardMaterial({
    color: 0xc25e2e, // Warm Rajasthani / Khajuraho red sandstone
    roughness: 0.72,
    metalness: 0.08,
  });

  // 2. Carved Ochre Temple Stone (Intricate pillar friezes and cornice bands)
  const carvedOchreStone = new THREE.MeshStandardMaterial({
    color: 0x9a481c,
    roughness: 0.82,
    metalness: 0.05,
  });

  // 3. Makrana Pure White Marble (Floor inlays and sacred pedestals)
  const makranaMarble = new THREE.MeshStandardMaterial({
    color: 0xfbfbfb,
    roughness: 0.18,
    metalness: 0.15,
  });

  // 4. Polished Black Granite (Sacred Shiva Lingam with mirror gloss)
  const blackGraniteShivling = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.08,
    metalness: 0.45,
  });

  // 5. Peetham / Yoni Pedestal Dark Basalt
  const peethamStone = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.25,
    metalness: 0.25,
  });

  // 6. Radiant Temple Brass (Hanging bells, lamps, Trishul, and Gada)
  const templeBrass = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.88,
  });

  // 7. Gold Leaf Kalasha (Temple Spire Pinnacle)
  const goldKalasha = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.15,
    metalness: 0.95,
  });

  // 8. Sindoor Devotional Murti Finish (Lord Hanuman sacred vermilion)
  const sindoorHanuman = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Rich vermilion sindoor with subtle devotional grain
    roughness: 0.65,
    metalness: 0.12,
  });

  // 9. Saffron Silk Temple Flag (Fluttering Dhwaja)
  const saffronFlag = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.45,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  // 10. Fresh Marigold Garland (Genda Phool)
  const marigoldGarland = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.6,
  });

  // 11. Red Rose Garland
  const roseGarland = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.55,
  });

  // 12. Sacred Tulsi Leaves
  const tulsiLeaves = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.5,
  });

  // 13. Terracotta Clay Diya
  const diyaClay = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.75,
  });

  // 14. Radiant Flame Emissive Glow
  const flameEmissive = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  // 15. Inner Sanctum Sandstone Wall
  const sanctumWall = new THREE.MeshStandardMaterial({
    color: 0x6c2f14,
    roughness: 0.68,
    transparent: true,
    opacity: 1.0,
  });

  // 16. Inner Sanctum Polished Floor
  const sanctumFloor = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.28,
    metalness: 0.2,
  });

  // 17. Sacred Nandi Bull Black Stone
  const nandiStone = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.22,
    metalness: 0.3,
  });

  return {
    dholpurSandstone,
    carvedOchreStone,
    makranaMarble,
    blackGraniteShivling,
    peethamStone,
    templeBrass,
    goldKalasha,
    sindoorHanuman,
    saffronFlag,
    marigoldGarland,
    roseGarland,
    tulsiLeaves,
    diyaClay,
    flameEmissive,
    sanctumWall,
    sanctumFloor,
    nandiStone,
  };
}

