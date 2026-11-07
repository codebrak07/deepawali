import * as THREE from "three";
import { createTempleMaterials, TempleMaterialsCollection } from "./templeMaterials";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface ShivaTemple3DSystem {
  exteriorGroup: THREE.Group;
  interiorGroup: THREE.Group;
  exteriorColliders: BoxCollider[];
  interiorColliders: BoxCollider[];
  occlusionMeshes: THREE.Mesh[];
  interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  shivlingPosition: THREE.Vector3;
  nandiPosition: THREE.Vector3;
  ringBell: () => void;
  offerFlowers: () => void;
  offerBilvaLeaves: () => void;
  performAbhishek: () => void;
  lightTempleDiya: () => void;
  updateAnimation: (time: number) => void;
}

export interface HanumanTemple3DSystem {
  exteriorGroup: THREE.Group;
  interiorGroup: THREE.Group;
  exteriorColliders: BoxCollider[];
  interiorColliders: BoxCollider[];
  occlusionMeshes: THREE.Mesh[];
  interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  murtiPosition: THREE.Vector3;
  ringBell: () => void;
  offerGarland: () => void;
  seekBlessings: () => void;
  lightDiya: () => void;
  updateAnimation: (time: number) => void;
}

/**
 * Builds the complete 3D architectural Lord Shiva Temple system.
 */
export function buildShivaTempleArchitecture(
  tx = 14.0,
  tz = -32.0,
  materials?: TempleMaterialsCollection
): ShivaTemple3DSystem {
  const mats = materials || createTempleMaterials();

  const exteriorGroup = new THREE.Group();
  exteriorGroup.name = "shivaTempleExteriorGroup";

  const interiorGroup = new THREE.Group();
  interiorGroup.name = "shivaTempleInteriorGroup";

  const exteriorColliders: BoxCollider[] = [];
  const interiorColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];

  // =========================================================================
  // 1. EXTERIOR ARCHITECTURE: Nagara Shikhara, Vimana, & Mandapa Portico
  // =========================================================================
  const plinthW = 16.0;
  const plinthD = 18.0;

  // Foundation Plinth (Adhisthana)
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthW, 0.40, plinthD),
    mats.dholpurSandstone
  );
  plinth.position.set(tx, 0.20, tz);
  plinth.receiveShadow = true;
  exteriorGroup.add(plinth);

  // Grand Sandstone Entrance Steps (4-tier staircase ascending to plinth at y = 0.40m)
  const plinthFrontZ = tz + plinthD / 2; // -23.0
  const stepTiers = [
    { w: 7.2, h: 0.10, d: 0.42, y: 0.05, z: plinthFrontZ + 1.26 },
    { w: 6.8, h: 0.10, d: 0.42, y: 0.15, z: plinthFrontZ + 0.84 },
    { w: 6.4, h: 0.10, d: 0.42, y: 0.25, z: plinthFrontZ + 0.42 },
    { w: 6.0, h: 0.10, d: 0.42, y: 0.35, z: plinthFrontZ + 0.00 },
  ];
  stepTiers.forEach((st) => {
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(st.w, st.h, st.d), mats.dholpurSandstone);
    stepMesh.position.set(tx, st.y, st.z);
    stepMesh.receiveShadow = true;
    exteriorGroup.add(stepMesh);
  });

  // Flanking Carved Stone Balustrades with Guarding Brass Diyas
  [-3.8, 3.8].forEach((sideX) => {
    const balustrade = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.55, 1.6),
      mats.carvedOchreStone
    );
    balustrade.position.set(tx + sideX, 0.35, plinthFrontZ + 0.65);
    exteriorGroup.add(balustrade);

    const stepDiya = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.12, 12),
      mats.templeBrass
    );
    stepDiya.position.set(tx + sideX, 0.68, plinthFrontZ + 1.2);
    exteriorGroup.add(stepDiya);
  });

  // Layered Vimana / Shikhara over Garbhagriha (Rising majestically to 16.5m)
  const shikharaTiers = [
    { w: 9.6, h: 2.2, y: 3.5 },
    { w: 8.2, h: 2.4, y: 5.7 },
    { w: 6.8, h: 2.6, y: 8.1 },
    { w: 5.4, h: 2.4, y: 10.4 },
    { w: 4.0, h: 2.2, y: 12.5 },
    { w: 2.6, h: 1.8, y: 14.2 },
  ];

  shikharaTiers.forEach((tier) => {
    const tierMesh = new THREE.Mesh(
      new THREE.BoxGeometry(tier.w, tier.h, tier.w),
      mats.dholpurSandstone
    );
    tierMesh.position.set(tx, tier.y, tz - 4.2);
    tierMesh.castShadow = true;
    tierMesh.receiveShadow = true;
    exteriorGroup.add(tierMesh);

    // Carved Cornice Relief Band
    const cornice = new THREE.Mesh(
      new THREE.BoxGeometry(tier.w + 0.4, 0.24, tier.w + 0.4),
      mats.carvedOchreStone
    );
    cornice.position.set(tx, tier.y + tier.h / 2, tz - 4.2);
    exteriorGroup.add(cornice);
  });

  // Amalaka (Sacred Grooved Stone Disc at Spire Summit)
  const amalaka = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2.0, 0.9, 16),
    mats.carvedOchreStone
  );
  amalaka.position.set(tx, 15.6, tz - 4.2);
  exteriorGroup.add(amalaka);

  // Golden Kalasha Pinnacle
  const kalasha = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 1.8, 12),
    mats.goldKalasha
  );
  kalasha.position.set(tx, 16.9, tz - 4.2);
  exteriorGroup.add(kalasha);

  // Saffron Dhwaja Flag Pole & Fluttering Silk Pennant
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8),
    mats.templeBrass
  );
  flagPole.position.set(tx, 18.2, tz - 4.2);
  exteriorGroup.add(flagPole);

  const flagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.2),
    mats.saffronFlag
  );
  flagMesh.position.set(tx + 0.95, 18.8, tz - 4.2);
  exteriorGroup.add(flagMesh);

  // Exterior Entrance Mandapa with 4 Carved Pillars
  const extPillarPositions = [
    { x: -3.8, z: 6.5 },
    { x: 3.8, z: 6.5 },
    { x: -3.8, z: 2.5 },
    { x: 3.8, z: 2.5 },
  ];

  extPillarPositions.forEach((pos) => {
    // 16-sided faceted shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.45, 4.2, 16),
      mats.carvedOchreStone
    );
    shaft.position.set(tx + pos.x, 2.3, tz + pos.z);
    shaft.castShadow = true;
    exteriorGroup.add(shaft);

    // Lotus Capital
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.38, 0.4, 12),
      mats.dholpurSandstone
    );
    cap.position.set(tx + pos.x, 4.4, tz + pos.z);
    exteriorGroup.add(cap);
  });

  // Torana Entrance Arch (Makara Motif)
  const toranaBeam = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.65, 1.2),
    mats.dholpurSandstone
  );
  toranaBeam.position.set(tx, 4.7, tz + 6.5);
  exteriorGroup.add(toranaBeam);

  // Hanging Brass Entrance Bells
  const extBells: THREE.Mesh[] = [];
  [-2.2, 0, 2.2].forEach((bx) => {
    const bell = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.42, 12),
      mats.templeBrass
    );
    bell.rotation.x = Math.PI;
    bell.position.set(tx + bx, 4.1, tz + 6.5);
    exteriorGroup.add(bell);
    extBells.push(bell);
  });

  // Exterior Colliders
  exteriorColliders.push(
    { id: "shiva-ext-sanctum", minX: tx - 5.5, maxX: tx + 5.5, minZ: tz - 9.5, maxZ: tz - 0.5 },
    { id: "shiva-ext-wall-l", minX: tx - 7.5, maxX: tx - 2.8, minZ: tz - 0.5, maxZ: tz + 7.5 },
    { id: "shiva-ext-wall-r", minX: tx + 2.8, maxX: tx + 7.5, minZ: tz - 0.5, maxZ: tz + 7.5 }
  );

  // =========================================================================
  // 2. INTERIOR ARCHITECTURE: Garbhagriha, Shivling, Yoni, Nandi & Rituals
  // =========================================================================
  const intW = 16.0;
  const intD = 16.0;
  const intH = 6.4;

  const interiorBounds = {
    minX: tx - intW / 2,
    maxX: tx + intW / 2,
    minZ: tz - intD / 2,
    maxZ: tz + intD / 2,
  };

  const entranceDoorPos = new THREE.Vector3(tx, 0.0, interiorBounds.maxZ - 2.2);
  const streetExitPos = new THREE.Vector3(tx, 0.0, -17.5);

  // Sanctum Polished Floor (Flush at y = 0.00 to guarantee 0 sinking!)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(intW, intD),
    mats.sanctumFloor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(tx, 0.00, tz);
  floor.receiveShadow = true;
  interiorGroup.add(floor);

  // Central Inlaid Makrana White Marble Mandala
  const marbleMandala = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 32),
    mats.makranaMarble
  );
  marbleMandala.rotation.x = -Math.PI / 2;
  marbleMandala.position.set(tx, 0.005, tz - 1.5);
  marbleMandala.receiveShadow = true;
  interiorGroup.add(marbleMandala);

  // High Vault Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(intW, intD),
    mats.carvedOchreStone
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(tx, intH, tz);
  interiorGroup.add(ceiling);
  occlusionMeshes.push(ceiling);

  // Interior Sanctum Walls
  const wallThick = 0.40;
  // North Wall
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(intW, intH, wallThick), mats.sanctumWall);
  northWall.position.set(tx, intH / 2, interiorBounds.minZ);
  interiorGroup.add(northWall);
  occlusionMeshes.push(northWall);

  // West Wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, intH, intD), mats.sanctumWall);
  westWall.position.set(interiorBounds.minX, intH / 2, tz);
  interiorGroup.add(westWall);
  occlusionMeshes.push(westWall);

  // East Wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, intH, intD), mats.sanctumWall);
  eastWall.position.set(interiorBounds.maxX, intH / 2, tz);
  interiorGroup.add(eastWall);
  occlusionMeshes.push(eastWall);

  // South Wall (with Generous 3.6m Walkable Entrance)
  const doorWidth = 3.6;
  const sideW = (intW - doorWidth) / 2;

  const southWallL = new THREE.Mesh(new THREE.BoxGeometry(sideW, intH, wallThick), mats.sanctumWall);
  southWallL.position.set(interiorBounds.minX + sideW / 2, intH / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallL);
  occlusionMeshes.push(southWallL);

  const southWallR = new THREE.Mesh(new THREE.BoxGeometry(sideW, intH, wallThick), mats.sanctumWall);
  southWallR.position.set(interiorBounds.maxX - sideW / 2, intH / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallR);
  occlusionMeshes.push(southWallR);

  // Interior Colliders
  interiorColliders.push(
    { id: "shiva-int-wall-n", minX: interiorBounds.minX, maxX: interiorBounds.maxX, minZ: interiorBounds.minZ - 1, maxZ: interiorBounds.minZ },
    { id: "shiva-int-wall-w", minX: interiorBounds.minX - 1, maxX: interiorBounds.minX, minZ: interiorBounds.minZ, maxZ: interiorBounds.maxZ },
    { id: "shiva-int-wall-e", minX: interiorBounds.maxX, maxX: interiorBounds.maxX + 1, minZ: interiorBounds.minZ, maxZ: interiorBounds.maxZ },
    { id: "shiva-int-wall-sw", minX: interiorBounds.minX, maxX: tx - doorWidth / 2, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 1 },
    { id: "shiva-int-wall-se", minX: tx + doorWidth / 2, maxX: interiorBounds.maxX, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 1 }
  );

  // -------------------------------------------------------------------------
  // 3. SACRED SHIVA LINGAM & YONI PEETHAM
  // -------------------------------------------------------------------------
  const shivlingPos = new THREE.Vector3(tx, 0.0, tz - 1.5);

  // Yoni Base / Peetham
  const peethamBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.95, 0.32, 24),
    mats.peethamStone
  );
  peethamBase.position.set(shivlingPos.x, 0.16, shivlingPos.z);
  peethamBase.castShadow = true;
  interiorGroup.add(peethamBase);

  // Northern Drainage Spout (Snana Droni)
  const spout = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.18, 0.65),
    mats.peethamStone
  );
  spout.position.set(shivlingPos.x, 0.22, shivlingPos.z - 0.85);
  interiorGroup.add(spout);

  // Cylindrical Polished Black Granite Shiva Lingam
  const lingam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.72, 24),
    mats.blackGraniteShivling
  );
  lingam.position.set(shivlingPos.x, 0.58, shivlingPos.z);
  lingam.castShadow = true;
  interiorGroup.add(lingam);

  // Lingam Hemispherical Dome Top
  const lingamDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.blackGraniteShivling
  );
  lingamDome.position.set(shivlingPos.x, 0.94, shivlingPos.z);
  interiorGroup.add(lingamDome);

  // Tripundra & Kumkum Bindi Markings (White Vibhuti stripes & red tilak)
  const tripundraMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f4 });
  [-0.04, 0.0, 0.04].forEach((yo) => {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.01), tripundraMat);
    stripe.position.set(shivlingPos.x, 0.74 + yo, shivlingPos.z + 0.262);
    interiorGroup.add(stripe);
  });
  const bindi = new THREE.Mesh(new THREE.CircleGeometry(0.018, 12), new THREE.MeshBasicMaterial({ color: 0xbe123c }));
  bindi.position.set(shivlingPos.x, 0.74, shivlingPos.z + 0.265);
  interiorGroup.add(bindi);

  // Bilva Leaves Offering (Bel Patra)
  const bilvaGroup = new THREE.Group();
  for (let b = 0; b < 3; b++) {
    const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.06, 6), mats.tulsiLeaves);
    leaf.rotation.x = -Math.PI / 2;
    leaf.rotation.z = (b * Math.PI * 2) / 3;
    leaf.position.set(Math.cos(leaf.rotation.z) * 0.08, 0, Math.sin(leaf.rotation.z) * 0.08);
    bilvaGroup.add(leaf);
  }
  bilvaGroup.position.set(shivlingPos.x, 1.10, shivlingPos.z);
  interiorGroup.add(bilvaGroup);

  // Fresh Marigold Flower Mala draped on Shivling
  const flowerMala = new THREE.Mesh(
    new THREE.TorusGeometry(0.30, 0.045, 8, 24),
    mats.marigoldGarland
  );
  flowerMala.rotation.x = Math.PI / 2.2;
  flowerMala.position.set(shivlingPos.x, 0.62, shivlingPos.z);
  interiorGroup.add(flowerMala);

  // Sacred Brass Abhishek Patra hanging suspended from ceiling
  const abhishekPot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    mats.templeBrass
  );
  abhishekPot.position.set(shivlingPos.x, 2.8, shivlingPos.z);
  interiorGroup.add(abhishekPot);

  const suspendChain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 3.6, 6),
    mats.templeBrass
  );
  suspendChain.position.set(shivlingPos.x, 4.6, shivlingPos.z);
  interiorGroup.add(suspendChain);

  // Sacred Brass Trishul & Damru
  const trishulGroup = new THREE.Group();
  const trishulStaff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.6, 8), mats.templeBrass);
  trishulStaff.position.y = 1.3;
  trishulGroup.add(trishulStaff);

  const trishulHead = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.45, 4), mats.templeBrass);
  trishulHead.position.y = 2.6;
  trishulGroup.add(trishulHead);

  [-0.14, 0.14].forEach((px) => {
    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 4), mats.templeBrass);
    prong.position.set(px, 2.5, 0);
    trishulGroup.add(prong);
  });

  const damru = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.16, 12), mats.carvedOchreStone);
  damru.position.set(0, 1.9, 0);
  damru.rotation.z = Math.PI / 2;
  trishulGroup.add(damru);

  trishulGroup.position.set(shivlingPos.x + 1.2, 0, shivlingPos.z);
  interiorGroup.add(trishulGroup);

  // -------------------------------------------------------------------------
  // 4. DEVOTIONAL NANDI BULL FACING SHIVLING
  // -------------------------------------------------------------------------
  const nandiPos = new THREE.Vector3(tx, 0.0, tz + 3.2);

  const nandiDais = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.28, 1.8), mats.peethamStone);
  nandiDais.position.set(nandiPos.x, 0.14, nandiPos.z);
  interiorGroup.add(nandiDais);

  const nandiBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.95), mats.nandiStone);
  nandiBody.position.set(nandiPos.x, 0.46, nandiPos.z);
  nandiBody.castShadow = true;
  interiorGroup.add(nandiBody);

  const nandiHead = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.35, 0.42), mats.nandiStone);
  nandiHead.position.set(nandiPos.x, 0.70, nandiPos.z - 0.42);
  interiorGroup.add(nandiHead);

  // Horns
  [-0.14, 0.14].forEach((hx) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 6), mats.templeBrass);
    horn.rotation.x = -0.4;
    horn.position.set(nandiPos.x + hx, 0.92, nandiPos.z - 0.44);
    interiorGroup.add(horn);
  });

  // Nandi Bell Mala
  const nandiMala = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 6, 16), mats.templeBrass);
  nandiMala.rotation.x = Math.PI / 3;
  nandiMala.position.set(nandiPos.x, 0.58, nandiPos.z - 0.32);
  interiorGroup.add(nandiMala);

  // -------------------------------------------------------------------------
  // 5. SANCTUM LIGHTING & DECORATIONS
  // -------------------------------------------------------------------------
  const sanctumGlow = new THREE.PointLight(0xf59e0b, 3.5, 14.0, 1.4);
  sanctumGlow.position.set(shivlingPos.x, 2.2, shivlingPos.z);
  sanctumGlow.castShadow = true;
  interiorGroup.add(sanctumGlow);

  // Akhand Brass Deepastambha with Flickering Flame
  const deepastambha = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.4, 12), mats.templeBrass);
  deepastambha.position.set(shivlingPos.x - 1.2, 0.7, shivlingPos.z);
  interiorGroup.add(deepastambha);

  const deepaFlame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), mats.flameEmissive);
  deepaFlame.position.set(shivlingPos.x - 1.2, 1.48, shivlingPos.z);
  interiorGroup.add(deepaFlame);

  const deepaLight = new THREE.PointLight(0xfbbf24, 1.8, 6.0, 1.2);
  deepaLight.position.set(shivlingPos.x - 1.2, 1.55, shivlingPos.z);
  interiorGroup.add(deepaLight);

  // Aarti Thali on Brass Tripod
  const aartiThali = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.20, 0.04, 16), mats.templeBrass);
  aartiThali.position.set(shivlingPos.x, 0.42, shivlingPos.z + 1.1);
  interiorGroup.add(aartiThali);

  const aartiFlame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 8), mats.flameEmissive);
  aartiFlame.position.set(shivlingPos.x, 0.48, shivlingPos.z + 1.1);
  interiorGroup.add(aartiFlame);

  // Collider around sacred Shivling & Peetham (keeps player from walking through)
  interiorColliders.push(
    { id: "shiva-lingam-collider", minX: shivlingPos.x - 1.0, maxX: shivlingPos.x + 1.0, minZ: shivlingPos.z - 1.2, maxZ: shivlingPos.z + 1.0 },
    { id: "shiva-nandi-collider", minX: nandiPos.x - 0.7, maxX: nandiPos.x + 0.7, minZ: nandiPos.z - 1.0, maxZ: nandiPos.z + 1.0 }
  );

  // Animation & Interaction callbacks
  let bellSwing = 0;
  const ringBell = () => {
    bellSwing = Math.PI * 0.4;
  };

  const offerFlowers = () => {
    flowerMala.scale.set(1.2, 1.2, 1.2);
  };

  const offerBilvaLeaves = () => {
    bilvaGroup.scale.set(1.4, 1.4, 1.4);
  };

  const performAbhishek = () => {
    sanctumGlow.intensity = 5.5;
  };

  const lightTempleDiya = () => {
    deepaLight.intensity = 3.2;
  };

  const updateAnimation = (time: number) => {
    // Subtle sacred oil lamp flame flicker
    const flicker = Math.sin(time * 12.0) * 0.12 + Math.cos(time * 17.0) * 0.08;
    deepaFlame.scale.set(1.0 + flicker, 1.0 + flicker * 1.5, 1.0 + flicker);
    aartiFlame.scale.set(1.0 + flicker, 1.0 + flicker * 1.4, 1.0 + flicker);
    deepaLight.intensity = 1.8 + flicker * 0.4;

    // Bell oscillation decay
    if (bellSwing > 0.01) {
      bellSwing *= 0.94;
      extBells.forEach((b, idx) => {
        b.rotation.z = Math.sin(time * 14.0 + idx) * bellSwing;
      });
    }

    // Flag flutter in sacred breeze
    flagMesh.rotation.y = Math.sin(time * 3.5) * 0.22;
  };

  return {
    exteriorGroup,
    interiorGroup,
    exteriorColliders,
    interiorColliders,
    occlusionMeshes,
    interiorBounds,
    entranceDoorPos,
    streetExitPos,
    shivlingPosition: shivlingPos,
    nandiPosition: nandiPos,
    ringBell,
    offerFlowers,
    offerBilvaLeaves,
    performAbhishek,
    lightTempleDiya,
    updateAnimation,
  };
}

/**
 * Builds the complete 3D architectural Lord Hanuman Temple system.
 */
export function buildHanumanTempleArchitecture(
  tx = -12.0,
  tz = -32.0,
  materials?: TempleMaterialsCollection
): HanumanTemple3DSystem {
  const mats = materials || createTempleMaterials();

  const exteriorGroup = new THREE.Group();
  exteriorGroup.name = "hanumanTempleExteriorGroup";

  const interiorGroup = new THREE.Group();
  interiorGroup.name = "hanumanTempleInteriorGroup";

  const exteriorColliders: BoxCollider[] = [];
  const interiorColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];

  // =========================================================================
  // 1. EXTERIOR ARCHITECTURE: Stepped Pyramidal Shikhara & Saffron Pennant
  // =========================================================================
  const plinthW = 14.0;
  const plinthD = 16.0;

  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthW, 0.40, plinthD),
    mats.dholpurSandstone
  );
  plinth.position.set(tx, 0.20, tz);
  plinth.receiveShadow = true;
  exteriorGroup.add(plinth);

  // Grand Sandstone Entrance Steps (4-tier staircase ascending to plinth at y = 0.40m)
  const plinthFrontZ = tz + plinthD / 2; // -24.0
  const hStepTiers = [
    { w: 6.8, h: 0.10, d: 0.42, y: 0.05, z: plinthFrontZ + 1.26 },
    { w: 6.4, h: 0.10, d: 0.42, y: 0.15, z: plinthFrontZ + 0.84 },
    { w: 6.0, h: 0.10, d: 0.42, y: 0.25, z: plinthFrontZ + 0.42 },
    { w: 5.6, h: 0.10, d: 0.42, y: 0.35, z: plinthFrontZ + 0.00 },
  ];
  hStepTiers.forEach((st) => {
    const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(st.w, st.h, st.d), mats.dholpurSandstone);
    stepMesh.position.set(tx, st.y, st.z);
    stepMesh.receiveShadow = true;
    exteriorGroup.add(stepMesh);
  });

  // Flanking Carved Stone Balustrades with Guarding Brass Diyas
  [-3.6, 3.6].forEach((sideX) => {
    const balustrade = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.55, 1.6),
      mats.carvedOchreStone
    );
    balustrade.position.set(tx + sideX, 0.35, plinthFrontZ + 0.65);
    exteriorGroup.add(balustrade);

    const stepDiya = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.12, 12),
      mats.templeBrass
    );
    stepDiya.position.set(tx + sideX, 0.68, plinthFrontZ + 1.2);
    exteriorGroup.add(stepDiya);
  });

  // Stepped Pyramidal Shikhara
  const tiers = [
    { w: 8.4, h: 2.2, y: 3.5 },
    { w: 7.0, h: 2.4, y: 5.7 },
    { w: 5.6, h: 2.4, y: 7.9 },
    { w: 4.2, h: 2.2, y: 10.0 },
    { w: 2.8, h: 2.0, y: 11.9 },
  ];

  tiers.forEach((t) => {
    const tier = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.w), mats.dholpurSandstone);
    tier.position.set(tx, t.y, tz - 3.8);
    tier.castShadow = true;
    exteriorGroup.add(tier);
  });

  // Golden Kalasha & Large Hanuman Saffron Flag
  const kalasha = new THREE.Mesh(new THREE.ConeGeometry(0.50, 1.6, 12), mats.goldKalasha);
  kalasha.position.set(tx, 13.6, tz - 3.8);
  exteriorGroup.add(kalasha);

  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8), mats.templeBrass);
  flagPole.position.set(tx, 14.8, tz - 3.8);
  exteriorGroup.add(flagPole);

  const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.4), mats.saffronFlag);
  flagMesh.position.set(tx + 1.05, 15.4, tz - 3.8);
  exteriorGroup.add(flagMesh);

  // Entrance Pillars & Torana
  [-3.2, 3.2].forEach((px) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 4.2, 12), mats.carvedOchreStone);
    col.position.set(tx + px, 2.3, tz + 6.0);
    exteriorGroup.add(col);
  });

  const torana = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.60, 1.0), mats.dholpurSandstone);
  torana.position.set(tx, 4.6, tz + 6.0);
  exteriorGroup.add(torana);

  // Exterior Colliders
  exteriorColliders.push(
    { id: "hanuman-ext-sanctum", minX: tx - 5.0, maxX: tx + 5.0, minZ: tz - 8.5, maxZ: tz - 0.5 },
    { id: "hanuman-ext-wall-l", minX: tx - 6.8, maxX: tx - 2.5, minZ: tz - 0.5, maxZ: tz + 6.5 },
    { id: "hanuman-ext-wall-r", minX: tx + 2.5, maxX: tx + 6.8, minZ: tz - 0.5, maxZ: tz + 6.5 }
  );

  // =========================================================================
  // 2. INTERIOR ARCHITECTURE: Garbhagriha & Lord Hanuman Murti
  // =========================================================================
  const intW = 14.0;
  const intD = 14.0;
  const intH = 6.2;

  const interiorBounds = {
    minX: tx - intW / 2,
    maxX: tx + intW / 2,
    minZ: tz - intD / 2,
    maxZ: tz + intD / 2,
  };

  const entranceDoorPos = new THREE.Vector3(tx, 0.0, interiorBounds.maxZ - 2.2);
  const streetExitPos = new THREE.Vector3(tx, 0.0, -18.0);

  // Floor (Flush at y = 0.00 to guarantee 0 sinking!)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(intW, intD), mats.sanctumFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(tx, 0.00, tz);
  floor.receiveShadow = true;
  interiorGroup.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(intW, intD), mats.carvedOchreStone);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(tx, intH, tz);
  interiorGroup.add(ceiling);
  occlusionMeshes.push(ceiling);

  // Walls
  const wallThick = 0.40;
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(intW, intH, wallThick), mats.sanctumWall);
  northWall.position.set(tx, intH / 2, interiorBounds.minZ);
  interiorGroup.add(northWall);
  occlusionMeshes.push(northWall);

  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, intH, intD), mats.sanctumWall);
  westWall.position.set(interiorBounds.minX, intH / 2, tz);
  interiorGroup.add(westWall);
  occlusionMeshes.push(westWall);

  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, intH, intD), mats.sanctumWall);
  eastWall.position.set(interiorBounds.maxX, intH / 2, tz);
  interiorGroup.add(eastWall);
  occlusionMeshes.push(eastWall);

  const doorWidth = 3.6;
  const sideW = (intW - doorWidth) / 2;

  const southWallL = new THREE.Mesh(new THREE.BoxGeometry(sideW, intH, wallThick), mats.sanctumWall);
  southWallL.position.set(interiorBounds.minX + sideW / 2, intH / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallL);
  occlusionMeshes.push(southWallL);

  const southWallR = new THREE.Mesh(new THREE.BoxGeometry(sideW, intH, wallThick), mats.sanctumWall);
  southWallR.position.set(interiorBounds.maxX - sideW / 2, intH / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallR);
  occlusionMeshes.push(southWallR);

  // Interior Colliders
  interiorColliders.push(
    { id: "hanuman-int-wall-n", minX: interiorBounds.minX, maxX: interiorBounds.maxX, minZ: interiorBounds.minZ - 1, maxZ: interiorBounds.minZ },
    { id: "hanuman-int-wall-w", minX: interiorBounds.minX - 1, maxX: interiorBounds.minX, minZ: interiorBounds.minZ, maxZ: interiorBounds.maxZ },
    { id: "hanuman-int-wall-e", minX: interiorBounds.maxX, maxX: interiorBounds.maxX + 1, minZ: interiorBounds.minZ, maxZ: interiorBounds.maxZ },
    { id: "hanuman-int-wall-sw", minX: interiorBounds.minX, maxX: tx - doorWidth / 2, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 1 },
    { id: "hanuman-int-wall-se", minX: tx + doorWidth / 2, maxX: interiorBounds.maxX, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 1 }
  );

  // -------------------------------------------------------------------------
  // 3. SACRED LORD HANUMAN DEVOTIONAL MURTI (Sculpted Sindoor Deity with Gada)
  // -------------------------------------------------------------------------
  const murtiPos = new THREE.Vector3(tx, 0.0, tz - 2.5);

  // Raised Marble Lotus Altar
  const altar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 1.8), mats.makranaMarble);
  altar.position.set(murtiPos.x, 0.225, murtiPos.z);
  interiorGroup.add(altar);

  // Murti Base / Feet
  const murtiGroup = new THREE.Group();
  murtiGroup.position.set(murtiPos.x, 0.45, murtiPos.z);

  // Legs & Dhoti in Sindoor Vermilion
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.75, 12), mats.sindoorHanuman);
  leftLeg.position.set(-0.20, 0.38, 0);
  murtiGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.75, 12), mats.sindoorHanuman);
  rightLeg.position.set(0.20, 0.38, 0);
  murtiGroup.add(rightLeg);

  // Torso & Chest in Sacred Sindoor
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.85, 0.42), mats.sindoorHanuman);
  torso.position.set(0, 1.15, 0);
  torso.castShadow = true;
  murtiGroup.add(torso);

  // Golden Sacred Thread (Yajnopavita / Janeu)
  const janeu = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.02, 6, 24), mats.templeBrass);
  janeu.rotation.set(0.4, 0.3, 0.8);
  janeu.position.set(0, 1.20, 0);
  murtiGroup.add(janeu);

  // Head with Divine Features
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mats.sindoorHanuman);
  head.position.set(0, 1.75, 0.04);
  murtiGroup.add(head);

  // Golden Mukut (Crown)
  const mukut = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.48, 12), mats.goldKalasha);
  mukut.position.set(0, 2.12, 0.04);
  murtiGroup.add(mukut);

  // Golden Kundalas (Earrings)
  [-0.24, 0.24].forEach((ex) => {
    const earring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 12), mats.templeBrass);
    earring.position.set(ex, 1.70, 0.04);
    murtiGroup.add(earring);
  });

  // Right Arm raised in Abhaya Mudra (Blessing gesture)
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.55, 10), mats.sindoorHanuman);
  rightArm.position.set(0.44, 1.35, 0.12);
  rightArm.rotation.set(-0.6, 0, -0.4);
  murtiGroup.add(rightArm);

  const abhayaPalm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.04), mats.sindoorHanuman);
  abhayaPalm.position.set(0.55, 1.62, 0.25);
  murtiGroup.add(abhayaPalm);

  // Left Arm holding the Mighty Golden Gada (Mace)
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.55, 10), mats.sindoorHanuman);
  leftArm.position.set(-0.44, 1.25, 0.08);
  leftArm.rotation.set(0.3, 0, 0.3);
  murtiGroup.add(leftArm);

  // Golden Gada (Mace)
  const gadaStaff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), mats.templeBrass);
  gadaStaff.position.set(-0.55, 0.90, 0.20);
  gadaStaff.rotation.z = -0.25;
  murtiGroup.add(gadaStaff);

  const gadaHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), mats.goldKalasha);
  gadaHead.position.set(-0.76, 1.70, 0.20);
  murtiGroup.add(gadaHead);

  // Fresh Marigold & Tulsi Garland draped on Murti
  const garland = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 8, 24), mats.marigoldGarland);
  garland.rotation.x = Math.PI / 2.3;
  garland.position.set(0, 1.18, 0.05);
  murtiGroup.add(garland);

  interiorGroup.add(murtiGroup);

  // Golden Sanctum Lighting
  const sanctumGlow = new THREE.PointLight(0xf97316, 3.8, 14.0, 1.2);
  sanctumGlow.position.set(murtiPos.x, 2.4, murtiPos.z + 0.8);
  sanctumGlow.castShadow = true;
  interiorGroup.add(sanctumGlow);

  // Murti Collider
  interiorColliders.push({
    id: "hanuman-murti-collider",
    minX: murtiPos.x - 1.4,
    maxX: murtiPos.x + 1.4,
    minZ: murtiPos.z - 1.2,
    maxZ: murtiPos.z + 1.2,
  });

  const ringBell = () => {};
  const offerGarland = () => {
    garland.scale.set(1.2, 1.2, 1.2);
  };
  const seekBlessings = () => {
    sanctumGlow.intensity = 5.8;
  };
  const lightDiya = () => {};

  const updateAnimation = (time: number) => {
    flagMesh.rotation.y = Math.sin(time * 3.8) * 0.24;
    sanctumGlow.intensity = 3.8 + Math.sin(time * 11.0) * 0.25;
  };

  return {
    exteriorGroup,
    interiorGroup,
    exteriorColliders,
    interiorColliders,
    occlusionMeshes,
    interiorBounds,
    entranceDoorPos,
    streetExitPos,
    murtiPosition: murtiPos,
    ringBell,
    offerGarland,
    seekBlessings,
    lightDiya,
    updateAnimation,
  };
}

