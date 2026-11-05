import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface InteriorSceneObjects {
  group: THREE.Group;
  furnitureColliders: BoxCollider[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
}

export function createSanaHomeInterior(): InteriorSceneObjects {
  const group = new THREE.Group();
  group.name = "sanaHomeInteriorGroup";

  // Position of Sana's Home Interior: centered at (-16, 0.05, -14)
  const cx = -16;
  const cz = -14;
  const width = 11.0;
  const depth = 9.0;
  const height = 3.6;

  const bounds = {
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
  };

  const entranceDoorPos = new THREE.Vector3(cx, 0, bounds.maxZ - 1.2);
  const streetExitPos = new THREE.Vector3(cx, 0, bounds.maxZ + 1.6);

  const furnitureColliders: BoxCollider[] = [];

  // ==========================================
  // 1. Interior Floor & Ceiling
  // ==========================================
  // Warm Italian marble / vitrified tile floor
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xfaf5ef,
    roughness: 0.25,
    metalness: 0.05,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(cx, 0.06, cz);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Ceiling with recessed warm LED coves
  const ceilingGeo = new THREE.PlaneGeometry(width, depth);
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.8 });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(cx, height, cz);
  group.add(ceilingMesh);

  // ==========================================
  // 2. Interior Walls
  // ==========================================
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });
  const accentWallMat = new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.6 }); // Royal Rose accent wall

  // North Wall (Back accent wall behind TV & sofa)
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.25), accentWallMat);
  northWall.position.set(cx, height / 2, bounds.minZ);
  group.add(northWall);

  // West Wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, height, depth), wallMat);
  westWall.position.set(bounds.minX, height / 2, cz);
  group.add(westWall);

  // East Wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, height, depth), wallMat);
  eastWall.position.set(bounds.maxX, height / 2, cz);
  group.add(eastWall);

  // South Wall (with doorway opening in the center)
  const southWallW = new THREE.Mesh(new THREE.BoxGeometry(width / 2 - 1.2, height, 0.25), wallMat);
  southWallW.position.set(cx - width / 4 - 0.6, height / 2, bounds.maxZ);
  group.add(southWallW);

  const southWallE = new THREE.Mesh(new THREE.BoxGeometry(width / 2 - 1.2, height, 0.25), wallMat);
  southWallE.position.set(cx + width / 4 + 0.6, height / 2, bounds.maxZ);
  group.add(southWallE);

  // Lintel above doorway
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.4, height - 2.6, 0.25), wallMat);
  lintel.position.set(cx, height - (height - 2.6) / 2, bounds.maxZ);
  group.add(lintel);

  // Decorative Marigold Toran above the doorway inside
  const toran = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.16, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xd97706, emissiveIntensity: 0.6 })
  );
  toran.position.set(cx, 2.5, bounds.maxZ - 0.15);
  group.add(toran);

  // Entrance Rangoli on the floor inside the doorway
  const rangoliMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9,
  });
  const inRangoli = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), rangoliMat);
  inRangoli.rotation.x = -Math.PI / 2;
  inRangoli.position.set(cx, 0.07, bounds.maxZ - 1.2);
  group.add(inRangoli);

  // Threshold Diya Pair inside
  [-0.9, 0.9].forEach((dx) => {
    const diya = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.1, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0x9a3412 })
    );
    diya.position.set(cx + dx, 0.1, bounds.maxZ - 0.5);
    group.add(diya);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.2, 6),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    flame.position.set(cx + dx, 0.2, bounds.maxZ - 0.5);
    group.add(flame);
  });

  // ==========================================
  // 3. Living Room: Sofa, Coffee Table & Rug
  // ==========================================
  // Decorative Indian Traditional Carpet / Rug
  const rugGeo = new THREE.PlaneGeometry(4.2, 3.2);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0x881337,
    roughness: 0.8,
  });
  const rugMesh = new THREE.Mesh(rugGeo, rugMat);
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(cx - 1.8, 0.07, cz);
  group.add(rugMesh);

  // 3-Seater Velvet Sofa (Emerald green)
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.7 });
  const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 1.1), sofaMat);
  sofaSeat.position.set(cx - 1.8, 0.4, cz - 1.1);
  group.add(sofaSeat);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.8, 0.35), sofaMat);
  sofaBack.position.set(cx - 1.8, 0.8, cz - 1.48);
  group.add(sofaBack);

  // Sofa Armrests
  [-1.3, 1.3].forEach((ax) => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, 1.1), sofaMat);
    arm.position.set(cx - 1.8 + ax, 0.55, cz - 1.1);
    group.add(arm);
  });

  furnitureColliders.push({
    id: "furn-sofa",
    minX: cx - 1.8 - 1.5,
    maxX: cx - 1.8 + 1.5,
    minZ: cz - 1.7,
    maxZ: cz - 0.5,
  });

  // Center Glass & Teak Coffee Table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.0), tableMat);
  tableTop.position.set(cx - 1.8, 0.45, cz);
  group.add(tableTop);

  // Table Legs
  [
    { x: -0.7, z: -0.4 },
    { x: 0.7, z: -0.4 },
    { x: -0.7, z: 0.4 },
    { x: 0.7, z: 0.4 },
  ].forEach((lp) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 6), tableMat);
    leg.position.set(cx - 1.8 + lp.x, 0.22, cz + lp.z);
    group.add(leg);
  });

  // Brass Puja Tray with Sweets on Coffee Table
  const brassTray = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.24, 0.04, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
  );
  brassTray.position.set(cx - 1.8, 0.51, cz);
  group.add(brassTray);

  furnitureColliders.push({
    id: "furn-table",
    minX: cx - 1.8 - 0.9,
    maxX: cx - 1.8 + 0.9,
    minZ: cz - 0.6,
    maxZ: cz + 0.6,
  });

  // Wall-Mounted TV Unit & Entertainment Console on North Wall
  const consoleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
  const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.45), consoleMat);
  tvConsole.position.set(cx - 1.8, 0.25, bounds.minZ + 0.3);
  group.add(tvConsole);

  // Ultra-thin Smart OLED TV
  const tvScreen = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 1.15, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x18181b,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.45, // Soft TV screen glow
    })
  );
  tvScreen.position.set(cx - 1.8, 1.6, bounds.minZ + 0.12);
  group.add(tvScreen);

  furnitureColliders.push({
    id: "furn-tv",
    minX: cx - 1.8 - 1.3,
    maxX: cx - 1.8 + 1.3,
    minZ: bounds.minZ,
    maxZ: bounds.minZ + 0.6,
  });

  // ==========================================
  // 4. Memory Photo Frames on Living Room Wall
  // ==========================================
  // Frames celebrating 11 Sep, 26 Sep & 4 Oct
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
  const photoMat1 = new THREE.MeshBasicMaterial({ color: 0xfbcfe8 });
  const photoMat2 = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  const frame1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.05), frameMat);
  frame1.position.set(cx - 3.4, 1.8, bounds.minZ + 0.12);
  group.add(frame1);

  const pic1 = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), photoMat1);
  pic1.position.set(cx - 3.4, 1.8, bounds.minZ + 0.16);
  group.add(pic1);

  const frame2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.05), frameMat);
  frame2.position.set(cx - 0.2, 1.8, bounds.minZ + 0.12);
  group.add(frame2);

  const pic2 = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), photoMat2);
  pic2.position.set(cx - 0.2, 1.8, bounds.minZ + 0.16);
  group.add(pic2);

  // ==========================================
  // 5. Bedroom Section (East Wing)
  // ==========================================
  // Partition Screen / Half-Wall between Living Room and Bedroom
  const partition = new THREE.Mesh(new THREE.BoxGeometry(0.2, height, 4.2), wallMat);
  partition.position.set(cx + 1.2, height / 2, cz - 1.2);
  group.add(partition);

  furnitureColliders.push({
    id: "furn-partition",
    minX: cx + 1.1,
    maxX: cx + 1.3,
    minZ: cz - 3.3,
    maxZ: cz + 0.9,
  });

  // Cozy Double Bed with Embroidered Duvet
  const bedMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.7 }); // Festive crimson duvet
  const bedHeadboardMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });

  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.55, 2.7), bedMat);
  bedBase.position.set(cx + 3.4, 0.35, cz - 1.2);
  group.add(bedBase);

  const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.3, 0.25), bedHeadboardMat);
  headboard.position.set(cx + 3.4, 0.9, bounds.minZ + 0.18);
  group.add(headboard);

  // Bed Pillows
  const pillowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
  [-0.6, 0.6].forEach((px) => {
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.45), pillowMat);
    pillow.position.set(cx + 3.4 + px, 0.7, bounds.minZ + 0.6);
    group.add(pillow);
  });

  // Bedside Tables with Warm Night Lamps
  [-1.5, 1.5].forEach((sideX) => {
    const bTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x3f3f46 })
    );
    bTable.position.set(cx + 3.4 + sideX, 0.3, bounds.minZ + 0.4);
    group.add(bTable);

    // Lamp
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    lamp.position.set(cx + 3.4 + sideX, 0.8, bounds.minZ + 0.4);
    group.add(lamp);
  });

  furnitureColliders.push({
    id: "furn-bed",
    minX: cx + 3.4 - 1.8,
    maxX: cx + 3.4 + 1.8,
    minZ: bounds.minZ,
    maxZ: cz + 0.5,
  });

  // Wardrobe / Almirah
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.5, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.5 })
  );
  wardrobe.position.set(bounds.maxX - 0.45, 1.25, cz + 2.0);
  group.add(wardrobe);

  furnitureColliders.push({
    id: "furn-wardrobe",
    minX: bounds.maxX - 0.8,
    maxX: bounds.maxX,
    minZ: cz + 1.1,
    maxZ: cz + 2.9,
  });

  // ==========================================
  // 6. Indoor Plants & Warm Interior Lighting
  // ==========================================
  // Large Fiddle Leaf Fig / Areca Palm in Corner
  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.22, 0.55, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
  );
  plantPot.position.set(bounds.minX + 0.6, 0.28, bounds.minZ + 0.6);
  group.add(plantPot);

  const plantLeaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 })
  );
  plantLeaves.position.set(bounds.minX + 0.6, 0.8, bounds.minZ + 0.6);
  group.add(plantLeaves);

  furnitureColliders.push({
    id: "furn-plant",
    minX: bounds.minX,
    maxX: bounds.minX + 1.0,
    minZ: bounds.minZ,
    maxZ: bounds.minZ + 1.0,
  });

  // Warm Interior Chandelier Light (Illuminates living room)
  const roomLight = new THREE.PointLight(0xfef08a, 2.2, 14.0, 1.2);
  roomLight.position.set(cx - 1.8, 3.1, cz);
  group.add(roomLight);

  const bedroomLight = new THREE.PointLight(0xfde68a, 1.8, 10.0, 1.3);
  bedroomLight.position.set(cx + 3.4, 2.8, cz - 1.0);
  group.add(bedroomLight);

  // Soft Ambient Glow inside
  const ambientInterior = new THREE.AmbientLight(0xffedd5, 1.0);
  group.add(ambientInterior);

  return {
    group,
    furnitureColliders,
    bounds,
    entranceDoorPos,
    streetExitPos,
  };
}
