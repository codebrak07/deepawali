import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface InteriorSceneObjects {
  group: THREE.Group;
  furnitureColliders: BoxCollider[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  occlusionMeshes: THREE.Mesh[]; // Walls & ceiling meshes that can fade when blocking camera
}

export function createSanaHomeInterior(): InteriorSceneObjects {
  const group = new THREE.Group();
  group.name = "sanaHomeInteriorGroup";

  // Position of Sana's Home Interior: centered at (-20, 0.05, -14)
  const cx = -20;
  const cz = -14;
  const width = 18.0; // Spacious 18m width
  const depth = 15.0; // Spacious 15m depth
  const height = 4.2; // Generous 4.2m ceiling clearance

  const bounds = {
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
  };

  // Entrance door at south wall center
  const entranceDoorPos = new THREE.Vector3(cx, 0, bounds.maxZ - 1.8);
  const streetExitPos = new THREE.Vector3(cx, 0, bounds.maxZ + 2.4);

  const furnitureColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];

  // ==========================================
  // 1. Italian Marble Vitrified Floor & Ceiling
  // ==========================================
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xfdfaf6,
    roughness: 0.18,
    metalness: 0.08,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(cx, 0.06, cz);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Ceiling with soft cove recess
  const ceilingGeo = new THREE.PlaneGeometry(width, depth);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xfffdfa,
    roughness: 0.8,
    transparent: true,
    opacity: 1.0,
  });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(cx, height, cz);
  group.add(ceilingMesh);
  occlusionMeshes.push(ceilingMesh);

  // ==========================================
  // 2. Interior Walls (With Occlusion Fade Support)
  // ==========================================
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7, // Warm warm sandstone/ivory
    roughness: 0.7,
    transparent: true,
    opacity: 1.0,
  });

  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0x881337, // Royal Burgundy / Crimson accent wall
    roughness: 0.55,
    transparent: true,
    opacity: 1.0,
  });

  // North Wall (Back wall with TV & memory frames)
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.35), accentWallMat);
  northWall.position.set(cx, height / 2, bounds.minZ);
  group.add(northWall);
  occlusionMeshes.push(northWall);

  // West Wall (With large festive French windows looking out)
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, height, depth), wallMat);
  westWall.position.set(bounds.minX, height / 2, cz);
  group.add(westWall);
  occlusionMeshes.push(westWall);

  // East Wall (Master Bedroom back wall)
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, height, depth), wallMat);
  eastWall.position.set(bounds.maxX, height / 2, cz);
  group.add(eastWall);
  occlusionMeshes.push(eastWall);

  // South Wall (Double doorway opening in center, 2.6m wide)
  const doorSpan = 2.6;
  const sideWallWidth = (width - doorSpan) / 2;

  const southWallW = new THREE.Mesh(new THREE.BoxGeometry(sideWallWidth, height, 0.35), wallMat);
  southWallW.position.set(bounds.minX + sideWallWidth / 2, height / 2, bounds.maxZ);
  group.add(southWallW);
  occlusionMeshes.push(southWallW);

  const southWallE = new THREE.Mesh(new THREE.BoxGeometry(sideWallWidth, height, 0.35), wallMat);
  southWallE.position.set(bounds.maxX - sideWallWidth / 2, height / 2, bounds.maxZ);
  group.add(southWallE);
  occlusionMeshes.push(southWallE);

  // Lintel above wide double door
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorSpan, height - 2.8, 0.35), wallMat);
  lintel.position.set(cx, height - (height - 2.8) / 2, bounds.maxZ);
  group.add(lintel);
  occlusionMeshes.push(lintel);

  // Ornate Mango Leaf & Marigold Toran above the main door
  const toran = new THREE.Mesh(
    new THREE.BoxGeometry(doorSpan + 0.4, 0.22, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xd97706, emissiveIntensity: 0.6 })
  );
  toran.position.set(cx, 2.7, bounds.maxZ - 0.2);
  group.add(toran);

  // Entrance Floor Rangoli (Large welcoming floral mandala)
  const inRangoli = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 24),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95 })
  );
  inRangoli.rotation.x = -Math.PI / 2;
  inRangoli.position.set(cx, 0.07, bounds.maxZ - 1.8);
  group.add(inRangoli);

  // Threshold Brass Urli with floating petals & diyas
  const urli = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.35, 0.2, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
  );
  urli.position.set(cx - 1.6, 0.1, bounds.maxZ - 1.2);
  group.add(urli);

  // ==========================================
  // 3. Spacious Living Room (West & Central Wing)
  // ==========================================
  const livingCx = cx - 3.2;
  const livingCz = cz;

  // Large Kashmiri Carpet (6m × 4.5m)
  const rugMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.0, 4.5),
    new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.8 })
  );
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(livingCx, 0.07, livingCz);
  group.add(rugMesh);

  // Luxurious L-shaped Emerald Velvet Sectional Sofa
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.65 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 }); // Golden silk cushions

  // Main 4-seater Section
  const mainSofa = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 1.2), sofaMat);
  mainSofa.position.set(livingCx, 0.45, livingCz - 1.4);
  group.add(mainSofa);

  const mainSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.85, 0.35), sofaMat);
  mainSofaBack.position.set(livingCx, 0.95, livingCz - 1.85);
  group.add(mainSofaBack);

  // Return Chaise Section (L-Shape on left)
  const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.55, 2.2), sofaMat);
  chaise.position.set(livingCx - 1.8, 0.45, livingCz - 0.2);
  group.add(chaise);

  // Golden accent cushions
  [-1.2, 0, 1.2].forEach((xOff) => {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.2), cushionMat);
    cushion.position.set(livingCx + xOff, 0.85, livingCz - 1.65);
    group.add(cushion);
  });

  furnitureColliders.push({
    id: "furn-sofa-main",
    minX: livingCx - 2.5,
    maxX: livingCx + 2.5,
    minZ: livingCz - 2.2,
    maxZ: livingCz - 0.7,
  });
  furnitureColliders.push({
    id: "furn-sofa-chaise",
    minX: livingCx - 2.5,
    maxX: livingCx - 1.1,
    minZ: livingCz - 0.7,
    maxZ: livingCz + 1.0,
  });

  // Center Teak & White Marble Coffee Table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
  const marbleTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.08, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xfdfaf6, roughness: 0.2, metalness: 0.1 })
  );
  marbleTop.position.set(livingCx + 0.4, 0.48, livingCz);
  group.add(marbleTop);

  // Table Legs
  [
    { x: -0.9, z: -0.45 },
    { x: 0.9, z: -0.45 },
    { x: -0.9, z: 0.45 },
    { x: 0.9, z: 0.45 },
  ].forEach((lp) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.44, 8), tableMat);
    leg.position.set(livingCx + 0.4 + lp.x, 0.24, livingCz + lp.z);
    group.add(leg);
  });

  // Brass Puja Thali with Kaju Katli & Diyas on table
  const thali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.32, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
  );
  thali.position.set(livingCx + 0.4, 0.54, livingCz);
  group.add(thali);

  furnitureColliders.push({
    id: "furn-coffee-table",
    minX: livingCx + 0.4 - 1.2,
    maxX: livingCx + 0.4 + 1.2,
    minZ: livingCz - 0.7,
    maxZ: livingCz + 0.7,
  });

  // ==========================================
  // 4. TV Entertainment Wall & Relationship Photo Frames
  // ==========================================
  const tvConsole = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.45, 0.55),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
  );
  tvConsole.position.set(livingCx, 0.28, bounds.minZ + 0.35);
  group.add(tvConsole);

  // 75-inch 4K Smart OLED Display
  const tvScreen = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.55, 0.06),
    new THREE.MeshStandardMaterial({
      color: 0x09090b,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
    })
  );
  tvScreen.position.set(livingCx, 1.85, bounds.minZ + 0.16);
  group.add(tvScreen);

  // Ambient Backlight Glow around TV
  const tvGlow = new THREE.PointLight(0x38bdf8, 1.2, 5.0, 1.2);
  tvGlow.position.set(livingCx, 1.85, bounds.minZ + 0.4);
  group.add(tvGlow);

  furnitureColliders.push({
    id: "furn-tv-wall",
    minX: livingCx - 2.0,
    maxX: livingCx + 2.0,
    minZ: bounds.minZ,
    maxZ: bounds.minZ + 0.7,
  });

  // Relationship Memory Frames on Wall (11 Sep, 26 Sep & 4 Oct)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
  const picColors = [0xfbcfe8, 0xfde047, 0xfecdd3];

  [-2.2, 2.2, 3.2].forEach((xOff, idx) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.05, 0.05), frameMat);
    frame.position.set(livingCx + xOff, 2.0, bounds.minZ + 0.14);
    group.add(frame);

    const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.92), new THREE.MeshBasicMaterial({ color: picColors[idx % 3] }));
    pic.position.set(livingCx + xOff, 2.0, bounds.minZ + 0.18);
    group.add(pic);
  });

  // ==========================================
  // 5. Sacred Pooja Corner (Mandir Shrine)
  // ==========================================
  const poojaCx = bounds.minX + 2.2;
  const poojaCz = bounds.minZ + 2.2;

  // Elevated White Makrana Marble Mandir Plinth
  const mandirPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.35, 2.0),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  mandirPlinth.position.set(poojaCx, 0.18, poojaCz);
  group.add(mandirPlinth);

  // Carved Mandir Dome / Canopy
  const mandirCanopy = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 })
  );
  mandirCanopy.position.set(poojaCx, 2.2, poojaCz);
  group.add(mandirCanopy);

  // Mandir Pillars
  [-0.9, 0.9].forEach((px) => {
    [-0.7, 0.7].forEach((pz) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      col.position.set(poojaCx + px, 1.1, poojaCz + pz);
      group.add(col);
    });
  });

  // Sacred Glowing Silver & Brass Diyas in Pooja
  const mandirLight = new THREE.PointLight(0xf59e0b, 2.5, 7.0, 1.2);
  mandirLight.position.set(poojaCx, 1.2, poojaCz);
  group.add(mandirLight);

  furnitureColliders.push({
    id: "furn-mandir",
    minX: poojaCx - 1.4,
    maxX: poojaCx + 1.4,
    minZ: poojaCz - 1.2,
    maxZ: poojaCz + 1.2,
  });

  // ==========================================
  // 6. Master Bedroom Suite (East Wing)
  // ==========================================
  const bedCx = cx + 4.5;
  const bedCz = cz - 1.5;

  // Architectural Partition Screen with Arched Jali Cutout (Spacious 3m corridor remains!)
  const partition = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, height, 5.5),
    wallMat
  );
  partition.position.set(cx + 0.8, height / 2, cz - 2.5);
  group.add(partition);
  occlusionMeshes.push(partition);

  furnitureColliders.push({
    id: "furn-partition",
    minX: cx + 0.6,
    maxX: cx + 1.0,
    minZ: cz - 5.3,
    maxZ: cz + 0.3,
  });

  // King-Size Teak Bed with Embroidered Royal Crimson Duvet
  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.55, 3.6),
    new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.65 })
  );
  bedBase.position.set(bedCx, 0.38, bedCz);
  group.add(bedBase);

  // Tufted Velvet Headboard
  const headboard = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 1.6, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
  );
  headboard.position.set(bedCx, 1.15, bounds.minZ + 0.2);
  group.add(headboard);

  // Pillows
  [-0.8, 0.8].forEach((px) => {
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.25, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    );
    pillow.position.set(bedCx + px, 0.78, bounds.minZ + 0.75);
    group.add(pillow);
  });

  // Bedside Tables with Warm Amber Lamps
  [-2.1, 2.1].forEach((sideX) => {
    const bTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.65, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x3f3f46 })
    );
    bTable.position.set(bedCx + sideX, 0.35, bounds.minZ + 0.45);
    group.add(bTable);

    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.24, 0.42, 10),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lamp.position.set(bedCx + sideX, 0.95, bounds.minZ + 0.45);
    group.add(lamp);

    const lampLight = new THREE.PointLight(0xfde68a, 1.2, 4.5);
    lampLight.position.set(bedCx + sideX, 1.1, bounds.minZ + 0.45);
    group.add(lampLight);
  });

  furnitureColliders.push({
    id: "furn-bed-suite",
    minX: bedCx - 2.6,
    maxX: bedCx + 2.6,
    minZ: bounds.minZ,
    maxZ: bedCz + 1.9,
  });

  // Wardrobe / Dressing Unit on East Wall
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 3.2, 2.6),
    new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 })
  );
  wardrobe.position.set(bounds.maxX - 0.5, 1.6, cz + 2.5);
  group.add(wardrobe);

  furnitureColliders.push({
    id: "furn-wardrobe",
    minX: bounds.maxX - 1.0,
    maxX: bounds.maxX,
    minZ: cz + 1.1,
    maxZ: cz + 3.9,
  });

  // ==========================================
  // 7. Ambient & Chandelier Interior Lighting
  // ==========================================
  // Modern Grand Ring Chandelier in Living Room
  const chandelier = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.05, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
  );
  chandelier.rotation.x = Math.PI / 2;
  chandelier.position.set(livingCx, height - 0.6, livingCz);
  group.add(chandelier);

  const mainRoomLight = new THREE.PointLight(0xfef3c7, 2.8, 18.0, 1.1);
  mainRoomLight.position.set(livingCx, height - 0.7, livingCz);
  mainRoomLight.castShadow = true;
  group.add(mainRoomLight);

  const bedroomCeilingLight = new THREE.PointLight(0xfde68a, 2.0, 14.0, 1.2);
  bedroomCeilingLight.position.set(bedCx, height - 0.8, bedCz);
  group.add(bedroomCeilingLight);

  // Soft overall ambient interior fill
  const interiorAmbient = new THREE.AmbientLight(0xffedd5, 1.2);
  group.add(interiorAmbient);

  return {
    group,
    furnitureColliders,
    bounds,
    entranceDoorPos,
    streetExitPos,
    occlusionMeshes,
  };
}
