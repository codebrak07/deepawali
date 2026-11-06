import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface HanumanTempleSceneObjects {
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
  offerPrasad: () => void;
  lightDiya: () => void;
  updateAnimation: (time: number) => void;
}

export function createHanumanTempleSystem(): HanumanTempleSceneObjects {
  const exteriorGroup = new THREE.Group();
  exteriorGroup.name = "hanumanTempleExteriorGroup";

  const interiorGroup = new THREE.Group();
  interiorGroup.name = "hanumanTempleInteriorGroup";

  const exteriorColliders: BoxCollider[] = [];
  const interiorColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];

  // Temple World Position: Prominent North-West plaza at (-12, 0, -32)
  // At the head of Hanuman Mandir Lane
  const tx = -12;
  const tz = -32;

  // Exterior Dimensions
  const plinthWidth = 14.0;
  const plinthDepth = 15.0;
  const plinthHeight = 1.0;

  // Materials with traditional Indian temple palette
  const saffronStoneMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Sacred saffron sindoor stone
    roughness: 0.75,
  });

  const carvedSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412, // Deep terracotta red sandstone
    roughness: 0.8,
  });

  const goldKalashaMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const saffronFlagMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.3,
  });

  // =========================================================================
  // PART A: HANUMAN TEMPLE EXTERIOR ARCHITECTURE
  // =========================================================================
  // 1. Elevated Stone Plinth (Jagati)
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthWidth, plinthHeight, plinthDepth),
    saffronStoneMat
  );
  plinth.position.set(tx, plinthHeight / 2, tz);
  plinth.receiveShadow = true;
  exteriorGroup.add(plinth);

  // Entrance Steps facing south toward Hanuman Mandir Lane
  const stepCount = 5;
  for (let s = 0; s < stepCount; s++) {
    const stepDepth = 0.5;
    const stepH = plinthHeight / stepCount;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, stepH, stepDepth * (stepCount - s)),
      saffronStoneMat
    );
    step.position.set(tx, (s + 0.5) * stepH, tz + plinthDepth / 2 + (s + 0.5) * (stepDepth / 2));
    step.receiveShadow = true;
    exteriorGroup.add(step);
  }

  // 2. Mandapa with Carved Saffron Columns
  const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 4.2, 12);
  const pillarOffsetPositions = [
    { x: -4.5, z: 4.5 },
    { x: 4.5, z: 4.5 },
    { x: -4.5, z: 0 },
    { x: 4.5, z: 0 },
    { x: -2.0, z: 5.5 },
    { x: 2.0, z: 5.5 },
  ];

  pillarOffsetPositions.forEach((pos) => {
    const p = new THREE.Mesh(pillarGeo, carvedSandstoneMat);
    p.position.set(tx + pos.x, plinthHeight + 2.1, tz + pos.z);
    p.castShadow = true;
    exteriorGroup.add(p);
  });

  // Mandapa Roof
  const mandapaRoof = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 0.55, 8.0),
    saffronStoneMat
  );
  mandapaRoof.position.set(tx, plinthHeight + 4.5, tz + 2.8);
  mandapaRoof.castShadow = true;
  exteriorGroup.add(mandapaRoof);

  // 3. Shikhara (Sanctum Spire Tower with layered cornices)
  const shikharaBase = new THREE.Mesh(
    new THREE.BoxGeometry(9.0, 4.5, 9.0),
    carvedSandstoneMat
  );
  shikharaBase.position.set(tx, plinthHeight + 2.25, tz - 3.5);
  shikharaBase.castShadow = true;
  exteriorGroup.add(shikharaBase);

  // Stepped Pyramid Shikhara
  const shikharaSpire = new THREE.Mesh(
    new THREE.ConeGeometry(4.8, 7.5, 8),
    saffronStoneMat
  );
  shikharaSpire.position.set(tx, plinthHeight + 8.25, tz - 3.5);
  shikharaSpire.castShadow = true;
  exteriorGroup.add(shikharaSpire);

  // Ribbed Amalaka Disc
  const amalaka = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.38, 12, 24),
    goldKalashaMat
  );
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.set(tx, plinthHeight + 12.2, tz - 3.5);
  exteriorGroup.add(amalaka);

  // Golden Kalasha Spire Finial
  const kalasha = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 1.4, 12),
    goldKalashaMat
  );
  kalasha.position.set(tx, plinthHeight + 13.2, tz - 3.5);
  exteriorGroup.add(kalasha);

  // Saffron Dhwaja (Triangular Hanuman Flag with pole)
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8),
    brassMat
  );
  flagPole.position.set(tx, plinthHeight + 14.5, tz - 3.5);
  exteriorGroup.add(flagPole);

  const flagMesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    saffronFlagMat
  );
  // Triangular flag geometry
  const flagVertices = new Float32Array([
    0, 0, 0,
    1.6, 0.45, 0,
    0, 0.9, 0,
  ]);
  flagMesh.geometry.setAttribute("position", new THREE.BufferAttribute(flagVertices, 3));
  flagMesh.position.set(tx, plinthHeight + 14.8, tz - 3.5);
  exteriorGroup.add(flagMesh);

  // Exterior Brass Entrance Bells
  const bellGroup = new THREE.Group();
  [-1.5, 1.5].forEach((bx) => {
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.4, 12), brassMat);
    bell.rotation.x = Math.PI;
    bell.position.set(tx + bx, plinthHeight + 4.0, tz + 5.8);
    bellGroup.add(bell);
  });
  exteriorGroup.add(bellGroup);

  // Saffron & Golden Temple Lighting
  const templeLight = new THREE.PointLight(0xea580c, 3.5, 22.0, 1.2);
  templeLight.position.set(tx, plinthHeight + 5.2, tz + 3.0);
  templeLight.castShadow = true;
  exteriorGroup.add(templeLight);

  const spireLight = new THREE.PointLight(0xf59e0b, 2.5, 18.0, 1.2);
  spireLight.position.set(tx, plinthHeight + 11.0, tz - 3.5);
  exteriorGroup.add(spireLight);

  // Exterior Colliders
  exteriorColliders.push({
    id: "hanuman-ext-sanctum",
    minX: tx - 5.0,
    maxX: tx + 5.0,
    minZ: tz - 8.5,
    maxZ: tz + 0.5,
  });
  exteriorColliders.push({
    id: "hanuman-ext-mandapa-left",
    minX: tx - 6.0,
    maxX: tx - 2.2,
    minZ: tz,
    maxZ: tz + 7.5,
  });
  exteriorColliders.push({
    id: "hanuman-ext-mandapa-right",
    minX: tx + 2.2,
    maxX: tx + 6.0,
    minZ: tz,
    maxZ: tz + 7.5,
  });

  // =========================================================================
  // PART B: HANUMAN MANDIR INTERIOR & GARBHAGRIHA
  // =========================================================================
  const intWidth = 14.0;
  const intDepth = 14.0;
  const intHeight = 5.8;

  const interiorBounds = {
    minX: tx - intWidth / 2,
    maxX: tx + intWidth / 2,
    minZ: tz - intDepth / 2,
    maxZ: tz + intDepth / 2,
  };

  const entranceDoorPos = new THREE.Vector3(tx, 0, interiorBounds.maxZ - 1.8);
  const streetExitPos = new THREE.Vector3(tx, 0, tz + plinthDepth / 2 + 2.5);

  // 1. Warm Marble Floor with floral border
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intWidth, intDepth),
    new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.25, metalness: 0.05 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(tx, 0.06, tz);
  floorMesh.receiveShadow = true;
  interiorGroup.add(floorMesh);

  // 2. Ceiling
  const ceilingMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intWidth, intDepth),
    new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8, transparent: true, opacity: 1.0 })
  );
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(tx, intHeight, tz);
  interiorGroup.add(ceilingMesh);
  occlusionMeshes.push(ceilingMesh);

  // 3. Walls
  const templeWallMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
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

  // South Wall with central arched portal
  const doorWidth = 3.2;
  const sideW = (intWidth - doorWidth) / 2;

  const southWallW = new THREE.Mesh(new THREE.BoxGeometry(sideW, intHeight, 0.35), templeWallMat);
  southWallW.position.set(interiorBounds.minX + sideW / 2, intHeight / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallW);
  occlusionMeshes.push(southWallW);

  const southWallE = new THREE.Mesh(new THREE.BoxGeometry(sideW, intHeight, 0.35), templeWallMat);
  southWallE.position.set(interiorBounds.maxX - sideW / 2, intHeight / 2, interiorBounds.maxZ);
  interiorGroup.add(southWallE);
  occlusionMeshes.push(southWallE);

  // Lintel with marigold garland
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, intHeight - 3.2, 0.35), templeWallMat);
  lintel.position.set(tx, intHeight - (intHeight - 3.2) / 2, interiorBounds.maxZ);
  interiorGroup.add(lintel);
  occlusionMeshes.push(lintel);

  // Garland on entrance
  const entranceGarland = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.3, 0.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xf97316 })
  );
  entranceGarland.position.set(tx, 3.1, interiorBounds.maxZ - 0.2);
  interiorGroup.add(entranceGarland);

  // 4. Sanctum Interior Columns
  const intPillars = [
    { x: -3.8, z: -3.8 },
    { x: 3.8, z: -3.8 },
    { x: -3.8, z: 3.8 },
    { x: 3.8, z: 3.8 },
  ];
  intPillars.forEach((ip) => {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.42, intHeight, 12),
      carvedSandstoneMat
    );
    col.position.set(tx + ip.x, intHeight / 2, tz + ip.z);
    col.castShadow = true;
    interiorGroup.add(col);

    interiorColliders.push({
      id: `hanuman-int-col-${ip.x}-${ip.z}`,
      minX: tx + ip.x - 0.55,
      maxX: tx + ip.x + 0.55,
      minZ: tz + ip.z - 0.55,
      maxZ: tz + ip.z + 0.55,
    });
  });

  // =========================================================================
  // PART C: CONSECRATED HANUMAN MURTI & PEDESTAL SANCTUM
  // =========================================================================
  const sanctumGroup = new THREE.Group();
  sanctumGroup.position.set(tx, 0.1, tz - 2.5); // Elevated sanctum at north end of hall

  // 1. Two-Tier Marble Altar
  const altarLower = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.45, 2.8),
    marbleMat
  );
  altarLower.position.y = 0.22;
  sanctumGroup.add(altarLower);

  const altarUpper = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.45, 2.2),
    marbleMat
  );
  altarUpper.position.y = 0.67;
  sanctumGroup.add(altarUpper);

  // Lotus Pedestal
  const lotusBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.1, 0.35, 16),
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
  );
  lotusBase.position.y = 1.05;
  sanctumGroup.add(lotusBase);

  // 2. Sculpted Hanuman Idol (Murti)
  // Saffron sindoor textured material
  const sindoorMat = new THREE.MeshStandardMaterial({
    color: 0xea580c, // Bright festive sindoor vermilion
    roughness: 0.5,
    metalness: 0.15,
  });

  const murtiGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const idolGroup = new THREE.Group();
  idolGroup.position.y = 1.25;

  // Legs in heroic standing pose
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.9, 10), sindoorMat);
  leftLeg.position.set(-0.24, 0.45, 0);
  idolGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.9, 10), sindoorMat);
  rightLeg.position.set(0.24, 0.45, 0);
  idolGroup.add(rightLeg);

  // Golden Dhoti wrap
  const dhoti = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.35, 0.65, 12), murtiGoldMat);
  dhoti.position.y = 0.95;
  idolGroup.add(dhoti);

  // Powerful Torso with chest musculature
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.85, 12), sindoorMat);
  torso.position.y = 1.55;
  idolGroup.add(torso);

  // Sacred Vanamala (Floral Garland)
  const garlandTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.05, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xf97316 })
  );
  garlandTorus.rotation.x = Math.PI / 2.5;
  garlandTorus.position.set(0, 1.5, 0.05);
  idolGroup.add(garlandTorus);

  // Head with serene divine expression
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), sindoorMat);
  head.position.y = 2.15;
  idolGroup.add(head);

  // Royal Golden Mukut (Crown)
  const mukut = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.55, 10), murtiGoldMat);
  mukut.position.y = 2.55;
  idolGroup.add(mukut);

  // Right Arm raised in Abhaya Mudra (Blessing)
  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.48, 8), sindoorMat);
  rightUpperArm.rotation.z = -Math.PI / 3;
  rightUpperArm.position.set(0.42, 1.7, 0);
  idolGroup.add(rightUpperArm);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), sindoorMat);
  rightForearm.position.set(0.6, 2.0, 0.1);
  idolGroup.add(rightForearm);

  const rightPalm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.06), sindoorMat);
  rightPalm.position.set(0.6, 2.25, 0.12);
  idolGroup.add(rightPalm);

  // Left Arm holding the Golden Gada (Mace)
  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.48, 8), sindoorMat);
  leftUpperArm.rotation.z = Math.PI / 4;
  leftUpperArm.position.set(-0.42, 1.6, 0);
  idolGroup.add(leftUpperArm);

  // Golden Gada (Mace)
  const gadaShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), murtiGoldMat);
  gadaShaft.rotation.z = -0.15;
  gadaShaft.position.set(-0.7, 1.1, 0.2);
  idolGroup.add(gadaShaft);

  const gadaHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), murtiGoldMat);
  gadaHead.position.set(-0.55, 1.95, 0.2);
  idolGroup.add(gadaHead);

  sanctumGroup.add(idolGroup);

  // 3. Flower Offerings and Marigolds at Idol's feet
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(0, 0.92, 0.4);
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
  for (let i = 0; i < 18; i++) {
    const angle = (i * Math.PI * 2) / 18;
    const r = 0.55 + (i % 2) * 0.15;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), marigoldMat);
    petal.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
    flowerGroup.add(petal);
  }
  sanctumGroup.add(flowerGroup);

  // 4. Brass Prasad Thali (Boondi Laddoos & Mithai)
  const prasadThali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.35, 0.04, 16),
    brassMat
  );
  prasadThali.position.set(0.8, 0.92, 0.5);
  sanctumGroup.add(prasadThali);

  // Golden Boondi Laddoos on thali
  const laddooMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 });
  [-0.1, 0, 0.1].forEach((lx) => {
    [-0.08, 0.08].forEach((lz) => {
      const laddoo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), laddooMat);
      laddoo.position.set(0.8 + lx, 0.98, 0.5 + lz);
      sanctumGroup.add(laddoo);
    });
  });

  // 5. Twin Brass Akhand Diyas
  const diyaGroup = new THREE.Group();
  [-1.5, 1.5].forEach((dx) => {
    const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 0.75, 12), brassMat);
    diyaBase.position.set(dx, 0.38, 0.6);
    diyaGroup.add(diyaBase);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.22, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    flame.position.set(dx, 0.88, 0.6);
    diyaGroup.add(flame);

    const dLight = new THREE.PointLight(0xf59e0b, 2.0, 5.0, 1.2);
    dLight.position.set(dx, 1.0, 0.6);
    diyaGroup.add(dLight);
  });
  sanctumGroup.add(diyaGroup);

  // 6. Sanctum Devotional Aura Light
  const auraLight = new THREE.PointLight(0xf97316, 3.6, 12.0, 1.1);
  auraLight.position.set(0, 2.5, 0.5);
  sanctumGroup.add(auraLight);

  interiorGroup.add(sanctumGroup);

  // Sanctum Collider (Protects sacred idol area)
  interiorColliders.push({
    id: "hanuman-int-altar",
    minX: tx - 2.5,
    maxX: tx + 2.5,
    minZ: tz - 4.5,
    maxZ: tz - 0.8,
  });

  // Hanging Sanctum Bell
  const sanctumBell = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.42, 12), brassMat);
  sanctumBell.rotation.x = Math.PI;
  sanctumBell.position.set(tx, intHeight - 1.2, tz + 0.8);
  interiorGroup.add(sanctumBell);

  let bellSwayAngle = 0;
  let bellSwaySpeed = 0;

  const ringBell = () => {
    bellSwaySpeed = 0.35;
  };

  const offerFlowers = () => {
    // Add extra marigold petals on the altar
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.4;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), marigoldMat);
      petal.position.set(Math.cos(angle) * r, 0.05, Math.sin(angle) * r);
      flowerGroup.add(petal);
    }
  };

  const offerPrasad = () => {
    // Glow effect around prasad thali
    const pLight = new THREE.PointLight(0xfde047, 2.0, 3.0, 1.2);
    pLight.position.set(0.8, 1.2, 0.5);
    sanctumGroup.add(pLight);
    setTimeout(() => {
      sanctumGroup.remove(pLight);
    }, 4000);
  };

  const lightDiya = () => {
    // Enhance diya illumination
    auraLight.intensity = Math.min(auraLight.intensity + 0.5, 5.0);
  };

  const updateAnimation = (time: number) => {
    // Bell sway physics
    if (Math.abs(bellSwaySpeed) > 0.005 || Math.abs(bellSwayAngle) > 0.005) {
      bellSwayAngle += bellSwaySpeed;
      bellSwaySpeed = -bellSwayAngle * 0.15; // Spring return
      bellSwaySpeed *= 0.94; // Damping
      sanctumBell.rotation.z = bellSwayAngle;
    } else {
      sanctumBell.rotation.z = 0;
    }

    // Gentle flag flutter
    flagMesh.rotation.y = Math.sin(time * 3.5) * 0.15;

    // Subtle diya flicker
    auraLight.intensity = 3.6 + Math.sin(time * 8.0) * 0.3;
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
    offerPrasad,
    lightDiya,
    updateAnimation,
  };
}
