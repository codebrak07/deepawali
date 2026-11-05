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

  // Temple World Position in locality: prominent North-East plaza at (14, 0, -32)
  const tx = 14;
  const tz = -32;

  // Exterior Dimensions
  const plinthWidth = 16.0;
  const plinthDepth = 18.0;
  const plinthHeight = 1.2;

  // Materials
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm terracotta / sandstone temple stone
    roughness: 0.75,
  });

  const carvedStoneMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.8,
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

  const blackGraniteMat = new THREE.MeshStandardMaterial({
    color: 0x111827, // Deep polished black granite
    roughness: 0.15,
    metalness: 0.2,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  });

  // =========================================================================
  // PART A: TEMPLE EXTERIOR ARCHITECTURE
  // =========================================================================
  // 1. Elevated Stone Plinth (Jagati)
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(plinthWidth, plinthHeight, plinthDepth),
    sandstoneMat
  );
  plinth.position.set(tx, plinthHeight / 2, tz);
  plinth.receiveShadow = true;
  exteriorGroup.add(plinth);

  // Grand Stone Entrance Steps facing south towards road
  const stepCount = 5;
  for (let s = 0; s < stepCount; s++) {
    const stepDepth = 0.55;
    const stepH = plinthHeight / stepCount;
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, stepH, stepDepth * (stepCount - s)),
      sandstoneMat
    );
    step.position.set(tx, (s + 0.5) * stepH, tz + plinthDepth / 2 + (s + 0.5) * (stepDepth / 2));
    step.receiveShadow = true;
    exteriorGroup.add(step);
  }

  // 2. Mandapa (Pillared Entrance Hall)
  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.45, 4.5, 12);
  const pillarOffsetPositions = [
    { x: -5.5, z: 5.5 },
    { x: 5.5, z: 5.5 },
    { x: -5.5, z: 0 },
    { x: 5.5, z: 0 },
    { x: -2.5, z: 6.5 },
    { x: 2.5, z: 6.5 },
  ];

  pillarOffsetPositions.forEach((pos) => {
    const p = new THREE.Mesh(pillarGeo, carvedStoneMat);
    p.position.set(tx + pos.x, plinthHeight + 2.25, tz + pos.z);
    p.castShadow = true;
    exteriorGroup.add(p);
  });

  // Mandapa Roof
  const mandapaRoof = new THREE.Mesh(
    new THREE.BoxGeometry(13.0, 0.6, 9.0),
    sandstoneMat
  );
  mandapaRoof.position.set(tx, plinthHeight + 4.8, tz + 3.5);
  mandapaRoof.castShadow = true;
  exteriorGroup.add(mandapaRoof);

  // 3. Soaring Nagara Shikhara (14m Spire with layered amalaka)
  const shikharaBase = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 5.0, 11.0),
    carvedStoneMat
  );
  shikharaBase.position.set(tx, plinthHeight + 2.5, tz - 4.5);
  shikharaBase.castShadow = true;
  exteriorGroup.add(shikharaBase);

  // Curved Spire Pyramid
  const spireGeo = new THREE.ConeGeometry(5.8, 8.5, 12);
  const spire = new THREE.Mesh(spireGeo, sandstoneMat);
  spire.position.set(tx, plinthHeight + 9.25, tz - 4.5);
  spire.castShadow = true;
  exteriorGroup.add(spire);

  // Ribbed Amalaka Disc on top
  const amalaka = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.45, 12, 24),
    goldKalashaMat
  );
  amalaka.rotation.x = Math.PI / 2;
  amalaka.position.set(tx, plinthHeight + 13.8, tz - 4.5);
  exteriorGroup.add(amalaka);

  // Golden Kalasha Spire Finial
  const kalasha = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1.6, 12),
    goldKalashaMat
  );
  kalasha.position.set(tx, plinthHeight + 15.0, tz - 4.5);
  exteriorGroup.add(kalasha);

  // Saffron Temple Flag (Dhwaja) fluttering high
  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8),
    brassMat
  );
  flagPole.position.set(tx, plinthHeight + 16.2, tz - 4.5);
  exteriorGroup.add(flagPole);

  const flagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.0),
    saffronFlagMat
  );
  flagMesh.position.set(tx + 0.8, plinthHeight + 16.8, tz - 4.5);
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
  const templeLight = new THREE.PointLight(0xf59e0b, 3.8, 25.0, 1.2);
  templeLight.position.set(tx, plinthHeight + 6.0, tz + 4.0);
  templeLight.castShadow = true;
  exteriorGroup.add(templeLight);

  const spireUplight = new THREE.SpotLight(0xfde047, 4.0, 30.0, 0.6, 0.3);
  spireUplight.position.set(tx, 0.5, tz + 12.0);
  spireUplight.target = kalasha;
  exteriorGroup.add(spireUplight);

  // Exterior Colliders
  exteriorColliders.push({
    id: "temple-ext-sanctum",
    minX: tx - 6.0,
    maxX: tx + 6.0,
    minZ: tz - 10.0,
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
  // PART B: TEMPLE INTERIOR & SACRED SHIVA SANCTUM
  // =========================================================================
  // Interior space: Centered at (14, 0.05, -32), width 16m, depth 16m, height 6.2m
  const intWidth = 16.0;
  const intDepth = 16.0;
  const intHeight = 6.2;

  const interiorBounds = {
    minX: tx - intWidth / 2,
    maxX: tx + intWidth / 2,
    minZ: tz - intDepth / 2,
    maxZ: tz + intDepth / 2,
  };

  const entranceDoorPos = new THREE.Vector3(tx, 0, interiorBounds.maxZ - 2.2);
  const streetExitPos = new THREE.Vector3(tx, 0, tz + plinthDepth / 2 + 3.0);

  // 1. Temple Sanctum Stone Floor (Dark polished stone with central kolam)
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(intWidth, intDepth),
    new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.3, metalness: 0.1 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(tx, 0.06, tz);
  floorMesh.receiveShadow = true;
  interiorGroup.add(floorMesh);

  // Sacred Lotus Kolam Mandala under sanctum
  const kolamMesh = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 32),
    new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.85 })
  );
  kolamMesh.rotation.x = -Math.PI / 2;
  kolamMesh.position.set(tx, 0.07, tz);
  interiorGroup.add(kolamMesh);

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
  const doorWidth = 3.6;
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
      id: `int-col-${ip.x}-${ip.z}`,
      minX: tx + ip.x - 0.6,
      maxX: tx + ip.x + 0.6,
      minZ: tz + ip.z - 0.6,
      maxZ: tz + ip.z + 0.6,
    });
  });

  // =========================================================================
  // PART C: SACRED SHIVLING & YONI BASE SANCTUM
  // =========================================================================
  const sanctumGroup = new THREE.Group();
  sanctumGroup.position.set(tx, 0.1, tz);

  // 1. Two-Tier Marble Plinth
  const lowerPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.4, 0.4, 24),
    blackGraniteMat
  );
  sanctumGroup.add(lowerPlinth);

  // 2. Carved Yoni Peetham (Sacred base with holy drainage snout facing north)
  const yoniBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.45, 0.45, 24),
    blackGraniteMat
  );
  yoniBase.position.y = 0.42;
  sanctumGroup.add(yoniBase);

  // Yoni Snout (Pranala spout)
  const spout = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.35, 1.2),
    blackGraniteMat
  );
  spout.position.set(0, 0.42, -1.2);
  sanctumGroup.add(spout);

  // 3. Sacred Polished Black Granite SHIVLING
  const shivlingCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.48, 1.05, 24),
    blackGraniteMat
  );
  shivlingCylinder.position.y = 1.05;
  sanctumGroup.add(shivlingCylinder);

  const shivlingDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    blackGraniteMat
  );
  shivlingDome.position.y = 1.57;
  sanctumGroup.add(shivlingDome);

  // Sacred White Tripund & Crimson Chandan Tilak on Shivling
  const tripundMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let l = 0; l < 3; l++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.022, 0.02), tripundMat);
    line.position.set(0, 1.35 - l * 0.05, 0.48);
    sanctumGroup.add(line);
  }
  const redBindi = new THREE.Mesh(
    new THREE.CircleGeometry(0.025, 12),
    new THREE.MeshBasicMaterial({ color: 0xdc2626 })
  );
  redBindi.position.set(0, 1.3, 0.495);
  sanctumGroup.add(redBindi);

  // 4. Brass Abhishek Patra (Holy vessel dripping water above Shivling)
  const abhishekPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.25, 0.5, 16),
    brassMat
  );
  abhishekPot.position.y = 3.4;
  sanctumGroup.add(abhishekPot);

  // Hanging Brass Chains for Abhishek Pot
  for (let c = 0; c < 3; c++) {
    const angle = (c * Math.PI * 2) / 3;
    const chain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 2.2, 6),
      brassMat
    );
    chain.position.set(Math.cos(angle) * 0.28, 4.4, Math.sin(angle) * 0.28);
    sanctumGroup.add(chain);
  }

  // Sacred Water Stream / Droplet effect
  const waterStream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.02, 1.8, 8),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.75 })
  );
  waterStream.position.y = 2.4;
  sanctumGroup.add(waterStream);

  // 5. Bilva Leaves & Flower Offerings at the base of Shivling
  const flowerGroup = new THREE.Group();
  const bilvaMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }); // Emerald Bilva
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
  const roseMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.5 });

  // Concentric circle of flowers and Bilva leaves
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16;
    const rad = 0.85 + (i % 2) * 0.25;

    // Bilva leaf trifoliate
    const bilva = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 6), bilvaMat);
    bilva.rotation.set(-Math.PI / 2, 0, angle);
    bilva.position.set(Math.cos(angle) * rad, 0.65, Math.sin(angle) * rad);
    flowerGroup.add(bilva);

    // Marigold Petal
    const marigold = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), marigoldMat);
    marigold.position.set(Math.cos(angle + 0.15) * (rad + 0.15), 0.66, Math.sin(angle + 0.15) * (rad + 0.15));
    flowerGroup.add(marigold);

    // Rose Petal
    const rose = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), roseMat);
    rose.position.set(Math.cos(angle - 0.15) * (rad + 0.2), 0.66, Math.sin(angle - 0.15) * (rad + 0.2));
    flowerGroup.add(rose);
  }
  sanctumGroup.add(flowerGroup);

  // 6. Brass Akhand Diyas flanking the Shivling
  const diyaGroup = new THREE.Group();
  [-1.6, 1.6].forEach((dx) => {
    const akhandDiya = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.15, 0.8, 12), brassMat);
    akhandDiya.position.set(dx, 0.4, 0.8);
    diyaGroup.add(akhandDiya);

    const diyaFlame = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.25, 8),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    diyaFlame.position.set(dx, 0.92, 0.8);
    diyaGroup.add(diyaFlame);

    const flameLight = new THREE.PointLight(0xf59e0b, 1.8, 6.0, 1.2);
    flameLight.position.set(dx, 1.0, 0.8);
    diyaGroup.add(flameLight);
  });
  sanctumGroup.add(diyaGroup);

  // 7. Sacred Golden Sanctum Glow Light
  const sanctumAura = new THREE.PointLight(0xfde047, 3.2, 12.0, 1.1);
  sanctumAura.position.set(0, 2.2, 0);
  sanctumGroup.add(sanctumAura);

  interiorGroup.add(sanctumGroup);

  // Sanctum Collider (Blocks walking into the sacred Shivling)
  interiorColliders.push({
    id: "int-shivling-pedestal",
    minX: tx - 2.0,
    maxX: tx + 2.0,
    minZ: tz - 2.0,
    maxZ: tz + 2.0,
  });

  // Hanging Brass Temple Bell inside for the user to ring
  const interiorBellGroup = new THREE.Group();
  interiorBellGroup.position.set(tx, intHeight - 1.5, tz + 4.2);

  const bellChain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6),
    brassMat
  );
  bellChain.position.y = 0.8;
  interiorBellGroup.add(bellChain);

  const bigBell = new THREE.Mesh(
    new THREE.ConeGeometry(0.48, 0.75, 16),
    brassMat
  );
  bigBell.rotation.x = Math.PI;
  interiorBellGroup.add(bigBell);

  interiorGroup.add(interiorBellGroup);

  // =========================================================================
  // PART D: INTERACTION HANDLERS & DYNAMICS
  // =========================================================================
  let bellSwayTime = 0;
  let isBellRinging = false;

  const ringBell = () => {
    isBellRinging = true;
    bellSwayTime = 0;
  };

  const offerFlowers = () => {
    // Add 8 fresh rose and marigold petals around Shivling
    for (let f = 0; f < 8; f++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 0.55 + Math.random() * 0.45;
      const petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 6, 6),
        new THREE.MeshStandardMaterial({ color: f % 2 === 0 ? 0xbe123c : 0xf59e0b })
      );
      petal.position.set(Math.cos(angle) * rad, 0.68, Math.sin(angle) * rad);
      flowerGroup.add(petal);
    }
  };

  const offerBilvaLeaves = () => {
    // Add 4 fresh sacred Bilva leaves onto the top of the Shivling
    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2;
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.22, 6),
        bilvaMat
      );
      leaf.rotation.set(-Math.PI / 2.2, 0, angle);
      leaf.position.set(Math.cos(angle) * 0.22, 1.58, Math.sin(angle) * 0.22);
      sanctumGroup.add(leaf);
    }
  };

  const lightTempleDiya = () => {
    // Intensify diya lighting
    sanctumAura.intensity = Math.min(sanctumAura.intensity + 0.6, 5.0);
  };

  const updateAnimation = (time: number) => {
    // 1. Water stream subtle shimmer
    waterStream.scale.x = 1.0 + Math.sin(time * 8.0) * 0.15;
    waterStream.scale.z = 1.0 + Math.cos(time * 8.0) * 0.15;

    // 2. Temple flag wind wave
    flagMesh.rotation.y = Math.sin(time * 3.5) * 0.25;

    // 3. Bell ringing sway dynamic
    if (isBellRinging) {
      bellSwayTime += 0.05;
      const sway = Math.sin(bellSwayTime * 12.0) * Math.exp(-bellSwayTime * 1.5) * 0.4;
      interiorBellGroup.rotation.z = sway;
      if (bellSwayTime > 3.0) {
        isBellRinging = false;
        interiorBellGroup.rotation.z = 0;
      }
    }
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
    lightTempleDiya,
    updateAnimation,
  };
}

