import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface TempleSceneObjects {
  exteriorGroup: THREE.Group;
  interiorGroup: THREE.Group;
  exteriorColliders: BoxCollider[];
  interiorColliders: BoxCollider[];
  interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  occlusionMeshes: THREE.Mesh[];
  ringBell: () => void;
  offerFlowers: () => void;
  offerBilvaLeaves: () => void;
  performAbhishek: () => void;
  lightTempleDiya: () => void;
  updateAnimation: (time: number) => void;
}

export function createShivaTempleSystem(): TempleSceneObjects {
  const exteriorGroup = new THREE.Group();
  exteriorGroup.name = "shivaTempleExteriorGroup";

  const interiorGroup = new THREE.Group();
  interiorGroup.name = "shivaTempleInteriorGroup";

  const exteriorColliders: BoxCollider[] = [];
  const interiorColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];

  // Temple World Position: Prominent North-East plaza at (14, 0, -32)
  const tx = 14;
  const tz = -32;

  // Exterior Dimensions
  const plinthWidth = 16.0;
  const plinthDepth = 18.0;
  const plinthHeight = 1.2;

  // Materials with authentic Nagara temple sandstone and polished black granite
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm terracotta / sandstone temple stone
    roughness: 0.72,
  });

  const carvedStoneMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Rich ochre carved stone
    roughness: 0.78,
  });

  const goldKalashaMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const saffronFlagMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  // Deep mirror-polished black granite for sanctum & Shivling
  const blackGraniteMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.12,
    metalness: 0.3,
  });

  const darkSanctumStoneMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.35,
    metalness: 0.1,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.22,
  });

  // =========================================================================
  // PART A: TEMPLE EXTERIOR ARCHITECTURE (Nagara Architectural Style)
  // =========================================================================
  // 1. Elevated Stone Plinth (Jagati)
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthWidth, plinthHeight, plinthDepth),
    sandstoneMat
  );
  plinth.position.set(tx, plinthHeight / 2, tz);
  plinth.receiveShadow = true;
  exteriorGroup.add(plinth);

  // Stepped Plinth Base Moulding
  const plinthBase = new THREE.Mesh(
    new THREE.BoxGeometry(plinthWidth + 1.2, 0.35, plinthDepth + 1.2),
    carvedStoneMat
  );
  plinthBase.position.set(tx, 0.18, tz);
  exteriorGroup.add(plinthBase);

  // Grand Stone Entrance Steps facing south towards road
  const stepCount = 5;
  for (let s = 0; s < stepCount; s++) {
    const stepDepth = 0.55;
    const stepH = plinthHeight / stepCount;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, stepH, stepDepth * (stepCount - s)),
      sandstoneMat
    );
    step.position.set(tx, (s + 0.5) * stepH, tz + plinthDepth / 2 + (s + 0.5) * (stepDepth / 2));
    step.receiveShadow = true;
    exteriorGroup.add(step);
  }

  // Stone Balustrades flanking the steps
  [-3.4, 3.4].forEach((bx) => {
    const balustrade = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 1.4, 3.2),
      carvedStoneMat
    );
    balustrade.position.set(tx + bx, plinthHeight / 2 + 0.5, tz + plinthDepth / 2 + 1.5);
    exteriorGroup.add(balustrade);
  });

  // 2. Mandapa (Pillared Entrance Hall)
  const pillarGeo = new THREE.CylinderGeometry(0.36, 0.46, 4.5, 12);
  const pillarOffsetPositions = [
    { x: -5.5, z: 5.5 },
    { x: 5.5, z: 5.5 },
    { x: -5.5, z: 0 },
    { x: 5.5, z: 0 },
    { x: -2.6, z: 6.5 },
    { x: 2.6, z: 6.5 },
  ];

  pillarOffsetPositions.forEach((pos) => {
    const p = new THREE.Mesh(pillarGeo, carvedStoneMat);
    p.position.set(tx + pos.x, plinthHeight + 2.25, tz + pos.z);
    p.castShadow = true;
    exteriorGroup.add(p);
  });

  // Mandapa Stepped Tiered Roof
  const mandapaRoof = new THREE.Mesh(
    new THREE.BoxGeometry(13.2, 0.6, 9.2),
    sandstoneMat
  );
  mandapaRoof.position.set(tx, plinthHeight + 4.8, tz + 3.5);
  mandapaRoof.castShadow = true;
  exteriorGroup.add(mandapaRoof);

  const mandapaTier2 = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 0.5, 7.5),
    carvedStoneMat
  );
  mandapaTier2.position.set(tx, plinthHeight + 5.35, tz + 3.5);
  exteriorGroup.add(mandapaTier2);

  // 3. Soaring Nagara Shikhara (16m Spire with layered urushringas and amalaka)
  const shikharaBase = new THREE.Mesh(
    new THREE.BoxGeometry(11.2, 5.2, 11.2),
    carvedStoneMat
  );
  shikharaBase.position.set(tx, plinthHeight + 2.6, tz - 4.5);
  shikharaBase.castShadow = true;
  exteriorGroup.add(shikharaBase);

  // Curved Spire Pyramid
  const spireGeo = new THREE.ConeGeometry(5.8, 9.2, 12);
  const spire = new THREE.Mesh(spireGeo, sandstoneMat);
  spire.position.set(tx, plinthHeight + 9.8, tz - 4.5);
  spire.castShadow = true;
  exteriorGroup.add(spire);

  // Corner Urushringas (Mini spires on the four corners of Shikhara)
  [-3.8, 3.8].forEach((ux) => {
    [-3.8, 3.8].forEach((uz) => {
      const miniSpire = new THREE.Mesh(
        new THREE.ConeGeometry(1.2, 3.8, 8),
        carvedStoneMat
      );
      miniSpire.position.set(tx + ux, plinthHeight + 6.8, tz - 4.5 + uz);
      miniSpire.castShadow = true;
      exteriorGroup.add(miniSpire);
    });
  });

  // Ribbed Amalaka Disc on top
  const amalaka = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.48, 14, 28),
    goldKalashaMat
  );
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.set(tx, plinthHeight + 14.4, tz - 4.5);
  exteriorGroup.add(amalaka);

  // Golden Kalasha Spire Finial
  const kalasha = new THREE.Mesh(
    new THREE.ConeGeometry(0.52, 1.8, 12),
    goldKalashaMat
  );
  kalasha.position.set(tx, plinthHeight + 15.6, tz - 4.5);
  exteriorGroup.add(kalasha);

  // Saffron Temple Flag (Dhwaja) fluttering high
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 3.4, 8),
    brassMat
  );
  flagPole.position.set(tx, plinthHeight + 16.8, tz - 4.5);
  exteriorGroup.add(flagPole);

  const flagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.1),
    saffronFlagMat
  );
  flagMesh.position.set(tx + 0.9, plinthHeight + 17.5, tz - 4.5);
  exteriorGroup.add(flagMesh);

  // Exterior Brass Entrance Bells
  const bellGroup = new THREE.Group();
  [-1.8, 1.8].forEach((bx) => {
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 12), brassMat);
    bell.rotation.x = Math.PI;
    bell.position.set(tx + bx, plinthHeight + 4.2, tz + 6.8);
    bellGroup.add(bell);
  });
  exteriorGroup.add(bellGroup);

  // Golden Temple Uplighting Spotlights
  const templeLight = new THREE.PointLight(0xf59e0b, 3.8, 26.0, 1.2);
  templeLight.position.set(tx, plinthHeight + 6.0, tz + 4.0);
  templeLight.castShadow = true;
  exteriorGroup.add(templeLight);

  const spireUplight = new THREE.SpotLight(0xfde047, 4.2, 32.0, 0.6, 0.3);
  spireUplight.position.set(tx, 0.5, tz + 12.0);
  spireUplight.target = kalasha;
  exteriorGroup.add(spireUplight);

  // Exterior Colliders
  exteriorColliders.push({
    id: "temple-ext-sanctum",
    minX: tx - 6.0,
    maxX: tx + 6.0,
    minZ: tz - 10.5,
    maxZ: tz + 0.5,
  });
  exteriorColliders.push({
    id: "temple-ext-left-mandapa",
    minX: tx - 7.5,
    maxX: tx - 2.8,
    minZ: tz,
    maxZ: tz + 8.5,
  });
  exteriorColliders.push({
    id: "temple-ext-right-mandapa",
    minX: tx + 2.8,
    maxX: tx + 7.5,
    minZ: tz,
    maxZ: tz + 8.5,
  });

  // =========================================================================
  // PART B: TEMPLE INTERIOR & SACRED SHIVA SANCTUM (GARBHAGRIHA)
  // =========================================================================
  const intWidth = 16.0;
  const intDepth = 16.0;
  const intHeight = 6.4;

  const interiorBounds = {
    minX: tx - intWidth / 2,
    maxX: tx + intWidth / 2,
    minZ: tz - intDepth / 2,
    maxZ: tz + intDepth / 2,
  };

  const entranceDoorPos = new THREE.Vector3(tx, 0, interiorBounds.maxZ - 2.2);
  const streetExitPos = new THREE.Vector3(tx, 0, tz + plinthDepth / 2 + 3.0);

  // 1. Sanctum Stone Floor (Dark polished stone with central carved lotus mandala)
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intWidth, intDepth),
    darkSanctumStoneMat
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(tx, 0.06, tz);
  floorMesh.receiveShadow = true;
  interiorGroup.add(floorMesh);

  // Inlaid Ring of Polished Marble around the Sanctum
  const marbleRing = new THREE.Mesh(
    new THREE.RingGeometry(2.6, 3.4, 32),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.25 })
  );
  marbleRing.rotation.x = -Math.PI / 2;
  marbleRing.position.set(tx, 0.07, tz);
  interiorGroup.add(marbleRing);

  // 2. High Temple Vault Ceiling
  const ceilingMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intWidth, intDepth),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8, transparent: true, opacity: 1.0 })
  );
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(tx, intHeight, tz);
  interiorGroup.add(ceilingMesh);
  occlusionMeshes.push(ceilingMesh);

  // 3. Sanctum Walls (Occlusion Fading Supported)
  const templeWallMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Deep sacred sandstone with carving
    roughness: 0.7,
    transparent: true,
    opacity: 1.0,
  });

  // North Wall
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(intWidth, intHeight, 0.35), templeWallMat);
  northWall.position.set(tx, intHeight / 2, interiorBounds.minZ);
  interiorGroup.add(northWall);
  occlusionMeshes.push(northWall);

  // West Wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, intHeight, intDepth), templeWallMat);
  westWall.position.set(interiorBounds.minX, intHeight / 2, tz);
  interiorGroup.add(westWall);
  occlusionMeshes.push(westWall);

  // East Wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, intHeight, intDepth), templeWallMat);
  eastWall.position.set(interiorBounds.maxX, intHeight / 2, tz);
  interiorGroup.add(eastWall);
  occlusionMeshes.push(eastWall);

  // South Wall (Double Arch Doorway)
  const doorWidth = 3.8;
  const sideW = (intWidth - doorWidth) / 2;

  const southWallW = new THREE.Mesh(new THREE.BoxGeometry(sideW, intHeight, 0.35), templeWallMat);
  southWallW.position.set(interiorBounds.minX + sideW / 2, intHeight / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallW);
  occlusionMeshes.push(southWallW);

  const southWallE = new THREE.Mesh(new THREE.BoxGeometry(sideW, intHeight, 0.35), templeWallMat);
  southWallE.position.set(interiorBounds.maxX - sideW / 2, intHeight / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallE);
  occlusionMeshes.push(southWallE);

  // 4. Sanctum Interior Carved Stone Pillars
  const intPillars = [
    { x: -4.5, z: -4.5 },
    { x: 4.5, z: -4.5 },
    { x: -4.5, z: 4.5 },
    { x: 4.5, z: 4.5 },
  ];
  intPillars.forEach((ip) => {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.5, intHeight, 12),
      carvedStoneMat
    );
    col.position.set(tx + ip.x, intHeight / 2, tz + ip.z);
    col.castShadow = true;
    interiorGroup.add(col);

    interiorColliders.push({
      id: `shiva-int-col-${ip.x}-${ip.z}`,
      minX: tx + ip.x - 0.6,
      maxX: tx + ip.x + 0.6,
      minZ: tz + ip.z - 0.6,
      maxZ: tz + ip.z + 0.6,
    });
  });

  // =========================================================================
  // PART C: CONSECRATED SHIVLING & YONI BASE SANCTUM
  // =========================================================================
  const sanctumGroup = new THREE.Group();
  sanctumGroup.position.set(tx, 0.1, tz);

  // 1. Two-Tier Carved Black Granite Plinth
  const lowerPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.4, 0.35, 32),
    blackGraniteMat
  );
  lowerPlinth.position.y = 0.18;
  sanctumGroup.add(lowerPlinth);

  const midPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 2.0, 0.3, 32),
    blackGraniteMat
  );
  midPlinth.position.y = 0.5;
  sanctumGroup.add(midPlinth);

  // 2. Carved Yoni Peetham (Sacred circular base with drainage spout pointing North)
  const yoniBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.35, 0.35, 32),
    blackGraniteMat
  );
  yoniBase.position.y = 0.82;
  sanctumGroup.add(yoniBase);

  // Yoni Drainage Snout (Pranala Spout)
  const spout = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.3, 1.1),
    blackGraniteMat
  );
  spout.position.set(0, 0.82, -1.2);
  sanctumGroup.add(spout);

  // 3. Sacred Polished Black Granite SHIVLING (Proportionally Modeled)
  // Height: ~0.95m, Diameter: ~0.44m with smooth rounded hemispherical crown
  const shivlingCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.25, 0.75, 32),
    blackGraniteMat
  );
  shivlingCylinder.position.y = 1.35;
  sanctumGroup.add(shivlingCylinder);

  const shivlingDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    blackGraniteMat
  );
  shivlingDome.position.y = 1.72;
  sanctumGroup.add(shivlingDome);

  // Sacred White Tripund (Three Horizontal Chandan Lines) on front face
  const tripundMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let l = 0; l < 3; l++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.016, 0.01), tripundMat);
    line.position.set(0, 1.55 - l * 0.035, 0.248);
    sanctumGroup.add(line);
  }

  // Crimson Kumkum Bindi in center of Tripund
  const redBindi = new THREE.Mesh(
    new THREE.CircleGeometry(0.018, 12),
    new THREE.MeshBasicMaterial({ color: 0xdc2626 })
  );
  redBindi.position.set(0, 1.515, 0.252);
  sanctumGroup.add(redBindi);

  // 4. Brass Abhishek Patra (Suspended holy vessel continuously dripping water/milk)
  const abhishekPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.2, 0.45, 16),
    brassMat
  );
  abhishekPot.position.y = 3.2;
  sanctumGroup.add(abhishekPot);

  // Tripod Brass Chains suspending the Abhishek Pot
  for (let c = 0; c < 3; c++) {
    const angle = (c * Math.PI * 2) / 3;
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 2.0, 6),
      brassMat
    );
    chain.position.set(Math.cos(angle) * 0.22, 4.2, Math.sin(angle) * 0.22);
    sanctumGroup.add(chain);
  }

  // Trickling Water Stream from vessel to Shivling
  const waterStream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.018, 1.3, 8),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.8 })
  );
  waterStream.position.y = 2.45;
  sanctumGroup.add(waterStream);

  // Water Ripple Splash on Shivling Crown
  const splashRipple = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.08, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
  );
  splashRipple.rotation.x = -Math.PI / 2;
  splashRipple.position.y = 1.96;
  sanctumGroup.add(splashRipple);

  // 5. Bilva Leaves & Fresh Floral Offerings at the Peetham
  const flowerGroup = new THREE.Group();
  const bilvaMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 }); // Sacred Bel Patra
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
  const roseMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.4 });

  // Bel Patra on the crown of Shivling
  const topBilva = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 5), bilvaMat);
  topBilva.rotation.set(-Math.PI / 2, 0, 0);
  topBilva.position.set(0, 1.98, 0);
  sanctumGroup.add(topBilva);

  // Concentric circle of rose petals, marigolds, and Bilva leaves in the Yoni Peetham groove
  for (let i = 0; i < 20; i++) {
    const angle = (i * Math.PI * 2) / 20;
    const rad = 0.65 + (i % 2) * 0.25;

    // Bilva trifoliate leaf
    const bilva = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 5), bilvaMat);
    bilva.rotation.set(-Math.PI / 2, 0, angle);
    bilva.position.set(Math.cos(angle) * rad, 1.02, Math.sin(angle) * rad);
    flowerGroup.add(bilva);

    // Rose Petal
    const rose = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), roseMat);
    rose.position.set(Math.cos(angle + 0.12) * (rad + 0.12), 1.02, Math.sin(angle + 0.12) * (rad + 0.12));
    flowerGroup.add(rose);

    // Marigold Petal
    const marigold = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), marigoldMat);
    marigold.position.set(Math.cos(angle - 0.12) * (rad + 0.1), 1.02, Math.sin(angle - 0.12) * (rad + 0.1));
    flowerGroup.add(marigold);
  }
  sanctumGroup.add(flowerGroup);

  // 6. Tall Brass Akhand Deepasthambhas (Diyas) flanking the altar
  const diyaGroup = new THREE.Group();
  [-1.6, 1.6].forEach((dx) => {
    const akhandDiya = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.85, 12), brassMat);
    akhandDiya.position.set(dx, 0.42, 0.6);
    diyaGroup.add(akhandDiya);

    const diyaFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.24, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    diyaFlame.position.set(dx, 0.96, 0.6);
    diyaGroup.add(diyaFlame);

    const flameLight = new THREE.PointLight(0xf59e0b, 2.2, 6.0, 1.2);
    flameLight.position.set(dx, 1.05, 0.6);
    diyaGroup.add(flameLight);
  });
  sanctumGroup.add(diyaGroup);

  // 7. Sacred Golden Devotional Sanctum Glow
  const sanctumAura = new THREE.PointLight(0xfde047, 3.2, 12.0, 1.1);
  sanctumAura.position.set(0, 2.2, 0);
  sanctumGroup.add(sanctumAura);

  interiorGroup.add(sanctumGroup);

  // Sanctum Collider (Blocks walking directly into the sacred Shivling)
  interiorColliders.push({
    id: "shiva-int-shivling-pedestal",
    minX: tx - 2.2,
    maxX: tx + 2.2,
    minZ: tz - 2.2,
    maxZ: tz + 2.2,
  });

  // Hanging Sanctum Brass Bell
  const sanctumBell = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 12), brassMat);
  sanctumBell.rotation.x = Math.PI;
  sanctumBell.position.set(tx, intHeight - 1.2, tz + 2.2);
  interiorGroup.add(sanctumBell);

  let bellSwayAngle = 0;
  let bellSwaySpeed = 0;

  const ringBell = () => {
    bellSwaySpeed = 0.35;
  };

  const offerFlowers = () => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 0.5 + Math.random() * 0.45;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), roseMat);
      petal.position.set(Math.cos(angle) * rad, 1.05, Math.sin(angle) * rad);
      flowerGroup.add(petal);
    }
  };

  const offerBilvaLeaves = () => {
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const bLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 5), bilvaMat);
      bLeaf.rotation.set(-Math.PI / 2, 0, angle);
      bLeaf.position.set(Math.cos(angle) * 0.15, 1.95, Math.sin(angle) * 0.15);
      sanctumGroup.add(bLeaf);
    }
  };

  const performAbhishek = () => {
    // Temporarily increase water stream opacity & splash ripple scale
    waterStream.scale.set(1.6, 1.0, 1.6);
    splashRipple.scale.set(1.5, 1.5, 1.5);
    setTimeout(() => {
      waterStream.scale.set(1.0, 1.0, 1.0);
      splashRipple.scale.set(1.0, 1.0, 1.0);
    }, 3500);
  };

  const lightTempleDiya = () => {
    sanctumAura.intensity = Math.min(sanctumAura.intensity + 0.6, 5.0);
  };

  const updateAnimation = (time: number) => {
    // Bell sway physics
    if (Math.abs(bellSwaySpeed) > 0.005 || Math.abs(bellSwayAngle) > 0.005) {
      bellSwayAngle += bellSwaySpeed;
      bellSwaySpeed = -bellSwayAngle * 0.15;
      bellSwaySpeed *= 0.94;
      sanctumBell.rotation.z = bellSwayAngle;
    } else {
      sanctumBell.rotation.z = 0;
    }

    // Flag flutter
    flagMesh.rotation.y = Math.sin(time * 3.5) * 0.15;

    // Sacred Abhishek Water Ripple pulsating
    splashRipple.scale.setScalar(1.0 + Math.sin(time * 12.0) * 0.15);

    // Diya flicker
    sanctumAura.intensity = 3.2 + Math.sin(time * 7.5) * 0.25;
  };

  return {
    exteriorGroup,
    interiorGroup,
    exteriorColliders,
    interiorColliders,
    interiorBounds,
    entranceDoorPos,
    streetExitPos,
    occlusionMeshes,
    ringBell,
    offerFlowers,
    offerBilvaLeaves,
    performAbhishek,
    lightTempleDiya,
    updateAnimation,
  };
}
