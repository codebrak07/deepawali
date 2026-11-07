import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";
import {
  createInteractiveHaveliGate,
  InteractiveHaveliGate,
  getJaliLatticeTexture,
} from "./HaveliGateSystem";

export interface SeatAnchor {
  id: string;
  label: string;
  position: THREE.Vector3;
  rotationY: number;
  sitHeight: number;
  cameraOffset: THREE.Vector3;
  cameraLookAt: THREE.Vector3;
}

export interface InteriorSceneObjects {
  group: THREE.Group;
  furnitureColliders: BoxCollider[];
  exteriorColliders: BoxCollider[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  occlusionMeshes: THREE.Mesh[];
  seatAnchors: SeatAnchor[];
  villaGate: InteractiveHaveliGate;
  // Interactive TV
  toggleTV: (power?: boolean) => boolean;
  setTVChannel: (channelIndex: number) => void;
  isTVOn: () => boolean;
  getTVChannelName: () => string;
  // Interactive Lighting
  toggleLamps: () => boolean;
  // Dynamic Floor Elevation (Ground vs Stairs vs Upper Floor)
  getFloorElevation: (x: number, z: number, currentY?: number) => number;
  // Animation update
  updateAnimation: (time: number) => void;
}

/**
 * Creates the Grand 2-Storey Luxury Villa for Sana's Residence.
 * Features:
 * - Expansive 26m x 20m footprint with 7.2m double-height clearance
 * - Ground Floor: Italian Calacatta marble living room, 85" OLED TV, designer seating,
 *   Pooja mandir, open-concept gourmet kitchen & formal dining suite (zero furniture overlaps!)
 * - Grand Central Architectural Staircase with warm LED risers & brass handrails
 * - Upper Floor (y = 3.4m): Full Master Bedroom suite, romantic couple lounge & library,
 *   panoramic stargazing terrace overlooking Akurdi streetscape
 * - Full interior and exterior wall colliders preventing any wall tunneling
 */
export function createSanaHomeInterior(): InteriorSceneObjects {
  const group = new THREE.Group();
  group.name = "sanaHomeInteriorGroup";

  // Position of Sana's Home Villa: centered at (-20, 0, -14)
  const cx = -20;
  const cz = -14;
  const width = 26.0; // Grand 26m width (East-West: -33 to -7)
  const depth = 20.0; // Grand 20m depth (North-South: -24 to -4)
  const height = 7.2; // 7.2m double-height ceiling clearance

  const bounds = {
    minX: cx - width / 2, // -33.0
    maxX: cx + width / 2, // -7.0
    minZ: cz - depth / 2, // -24.0
    maxZ: cz + depth / 2, // -4.0
  };

  // Entrance door at South wall center (x: -20, z: -4.0)
  const entranceDoorPos = new THREE.Vector3(cx, 0, bounds.maxZ - 1.8);
  const streetExitPos = new THREE.Vector3(cx, 0, bounds.maxZ + 2.4);

  const furnitureColliders: BoxCollider[] = [];
  const exteriorColliders: BoxCollider[] = [];
  const occlusionMeshes: THREE.Mesh[] = [];
  const seatAnchors: SeatAnchor[] = [];

  // =========================================================================
  // 1. EXTERIOR COLLIDERS (Prevent any passing through exterior villa walls)
  // =========================================================================
  const doorWidth = 3.6;
  const doorLeft = cx - doorWidth / 2;  // -21.8
  const doorRight = cx + doorWidth / 2; // -18.2

  // North Exterior Wall
  exteriorColliders.push({
    id: "sana-ext-wall-n",
    minX: bounds.minX - 0.5,
    maxX: bounds.maxX + 0.5,
    minZ: bounds.minZ - 0.8,
    maxZ: bounds.minZ + 0.4,
  });
  // West Exterior Wall
  exteriorColliders.push({
    id: "sana-ext-wall-w",
    minX: bounds.minX - 0.8,
    maxX: bounds.minX + 0.4,
    minZ: bounds.minZ - 0.5,
    maxZ: bounds.maxZ + 0.5,
  });
  // East Exterior Wall
  exteriorColliders.push({
    id: "sana-ext-wall-e",
    minX: bounds.maxX - 0.4,
    maxX: bounds.maxX + 0.8,
    minZ: bounds.minZ - 0.5,
    maxZ: bounds.maxZ + 0.5,
  });
  // South Exterior Wall (West of door)
  exteriorColliders.push({
    id: "sana-ext-wall-sw",
    minX: bounds.minX - 0.5,
    maxX: doorLeft,
    minZ: bounds.maxZ - 0.4,
    maxZ: bounds.maxZ + 0.8,
  });
  // South Exterior Wall (East of door)
  exteriorColliders.push({
    id: "sana-ext-wall-se",
    minX: doorRight,
    maxX: bounds.maxX + 0.5,
    minZ: bounds.maxZ - 0.4,
    maxZ: bounds.maxZ + 0.8,
  });

  // =========================================================================
  // 2. GROUND FLOOR & CEILING
  // =========================================================================
  // Ground Floor: Polished Calacatta Gold Marble Vitrified Slab
  const floorGeo = new THREE.PlaneGeometry(width, depth);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xfbfbfb,
    roughness: 0.16,
    metalness: 0.08,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(cx, 0.06, cz);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Villa Grand Roof / Ceiling at y = 7.2m
  const ceilingGeo = new THREE.PlaneGeometry(width, depth);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xfffdfa,
    roughness: 0.85,
    transparent: true,
    opacity: 1.0,
  });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(cx, height, cz);
  group.add(ceilingMesh);
  occlusionMeshes.push(ceilingMesh);

  // =========================================================================
  // 3. ARCHITECTURAL WALLS & PERIMETER ENCLOSURE
  // =========================================================================
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xfef9e7, // Warm ivory sandstone finish
    roughness: 0.65,
    transparent: true,
    opacity: 1.0,
  });

  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0x4c0519, // Royal Burgundy & Rosewood Accent Panel
    roughness: 0.45,
    transparent: true,
    opacity: 1.0,
  });

  // North Wall (Back Feature Wall)
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.45), accentWallMat);
  northWall.position.set(cx, height / 2, bounds.minZ);
  group.add(northWall);
  occlusionMeshes.push(northWall);

  // West Wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.45, height, depth), wallMat);
  westWall.position.set(bounds.minX, height / 2, cz);
  group.add(westWall);
  occlusionMeshes.push(westWall);

  // East Wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.45, height, depth), wallMat);
  eastWall.position.set(bounds.maxX, height / 2, cz);
  group.add(eastWall);
  occlusionMeshes.push(eastWall);

  // =========================================================================
  // AUTHENTIC INDIAN HAVELI FACADE (Dual-Tone Terracotta & Royal Blue - Reference Match)
  // =========================================================================
  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Rich Terracotta Coral (West Wing)
    roughness: 0.68,
    metalness: 0.05,
  });

  const royalBlueMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Majestic Cerulean / Royal Blue (East Wing)
    roughness: 0.65,
    metalness: 0.08,
  });

  const whiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xfafaf9,
    roughness: 0.45,
  });

  const ironRailingMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.88,
    roughness: 0.25,
  });

  const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
  const diyaFlameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  const jaliTex = getJaliLatticeTexture();
  const jaliWindowMat = new THREE.MeshStandardMaterial({
    map: jaliTex,
    emissiveMap: jaliTex,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.35,
    roughness: 0.35,
    metalness: 0.1,
  });

  const sideWallW = bounds.maxX - doorRight; // ~11.2m
  const westWingCx = bounds.minX + sideWallW / 2; // -27.4m
  const eastWingCx = doorRight + sideWallW / 2;   // -12.6m

  // West Wing Facade (Terracotta Peach / Coral)
  const sideWallWMesh2 = new THREE.Mesh(new THREE.BoxGeometry(sideWallW, height, 0.45), terracottaMat);
  sideWallWMesh2.position.set(westWingCx, height / 2, bounds.maxZ);
  sideWallWMesh2.castShadow = true;
  sideWallWMesh2.receiveShadow = true;
  group.add(sideWallWMesh2);
  occlusionMeshes.push(sideWallWMesh2);

  // East Wing Facade (Royal Indian Cerulean Blue)
  const sideWallWMesh = new THREE.Mesh(new THREE.BoxGeometry(sideWallW, height, 0.45), royalBlueMat);
  sideWallWMesh.position.set(eastWingCx, height / 2, bounds.maxZ);
  sideWallWMesh.castShadow = true;
  sideWallWMesh.receiveShadow = true;
  group.add(sideWallWMesh);
  occlusionMeshes.push(sideWallWMesh);

  // Central Portal Lintel Archway above Entrance Door
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth + 0.5, height - 3.2, 0.50), whiteTrimMat);
  lintel.position.set(cx, height - (height - 3.2) / 2, bounds.maxZ + 0.02);
  group.add(lintel);
  occlusionMeshes.push(lintel);

  // Bold White Horizontal Stringcourses & Cornices across both wings
  [westWingCx, eastWingCx].forEach((wingX) => {
    // Floor-dividing stringcourse ledge at y = 3.6m
    const midLedge = new THREE.Mesh(new THREE.BoxGeometry(sideWallW + 0.3, 0.24, 0.65), whiteTrimMat);
    midLedge.position.set(wingX, 3.6, bounds.maxZ + 0.10);
    group.add(midLedge);

    // Roofline cornice moulding at y = 7.2m
    const roofCornice = new THREE.Mesh(new THREE.BoxGeometry(sideWallW + 0.4, 0.32, 0.75), whiteTrimMat);
    roofCornice.position.set(wingX, height, bounds.maxZ + 0.12);
    group.add(roofCornice);

    // Roof parapet wall
    const parapet = new THREE.Mesh(
      new THREE.BoxGeometry(sideWallW + 0.2, 0.85, 0.45),
      wingX === westWingCx ? terracottaMat : royalBlueMat
    );
    parapet.position.set(wingX, height + 0.85 / 2, bounds.maxZ);
    group.add(parapet);
  });

  // Reusable Balcony & Jharokha Window Builder for each wing
  const buildHaveliBalconyAndWindows = (wingX: number) => {
    // 1. Upper Level Cantilevered Balcony Slab at y = 3.65m
    const balcW = 4.8;
    const balcD = 1.6;
    const balcY = 3.65;
    const balcZ = bounds.maxZ + balcD / 2;

    const slab = new THREE.Mesh(new THREE.BoxGeometry(balcW, 0.28, balcD), whiteTrimMat);
    slab.position.set(wingX, balcY, balcZ);
    group.add(slab);

    // Stone brackets supporting balcony slab
    [-1.6, 0, 1.6].forEach((bx) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.65, balcD - 0.2), whiteTrimMat);
      bracket.position.set(wingX + bx, balcY - 0.45, bounds.maxZ + (balcD - 0.2) / 2);
      group.add(bracket);
    });

    // 2. Front & Side Black Wrought-Iron Railings
    const railH = 0.95;
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(balcW, railH, 0.06), ironRailingMat);
    frontRail.position.set(wingX, balcY + railH / 2 + 0.14, balcZ + balcD / 2 - 0.03);
    group.add(frontRail);

    [-1, 1].forEach((dir) => {
      const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, railH, balcD), ironRailingMat);
      sideRail.position.set(wingX + dir * (balcW / 2 - 0.03), balcY + railH / 2 + 0.14, balcZ);
      group.add(sideRail);
    });

    // 3. Lit Clay Diyas Lined Along Balcony Railing (Matches Image 3 Reference!)
    const diyaCount = 7;
    for (let d = 0; d < diyaCount; d++) {
      const dx = ((d / (diyaCount - 1)) - 0.5) * (balcW - 0.5);
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.06, 0.07, 8), diyaClayMat);
      diya.position.set(wingX + dx, balcY + railH + 0.18, balcZ + balcD / 2 - 0.03);
      group.add(diya);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), diyaFlameMat);
      flame.position.set(wingX + dx, balcY + railH + 0.27, balcZ + balcD / 2 - 0.03);
      group.add(flame);
    }

    // 4. Upper Floor Glowing Jali Window (behind balcony)
    const winGeo = new THREE.PlaneGeometry(1.5, 2.0);
    const winUpper = new THREE.Mesh(winGeo, jaliWindowMat);
    winUpper.position.set(wingX, balcY + 1.45, bounds.maxZ + 0.24);
    group.add(winUpper);

    const winUpperFrame = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.3, 0.14), whiteTrimMat);
    winUpperFrame.position.set(wingX, balcY + 1.45, bounds.maxZ + 0.22);
    group.add(winUpperFrame);

    const chhajjaUpper = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.16, 0.55), whiteTrimMat);
    chhajjaUpper.position.set(wingX, balcY + 2.65, bounds.maxZ + 0.45);
    group.add(chhajjaUpper);

    // 5. Ground Floor Glowing Jali Window with Sill Diya
    const winLower = new THREE.Mesh(winGeo, jaliWindowMat);
    winLower.position.set(wingX, 1.85, bounds.maxZ + 0.24);
    group.add(winLower);

    const winLowerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.3, 0.14), whiteTrimMat);
    winLowerFrame.position.set(wingX, 1.85, bounds.maxZ + 0.22);
    group.add(winLowerFrame);

    const chhajjaLower = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.16, 0.55), whiteTrimMat);
    chhajjaLower.position.set(wingX, 3.05, bounds.maxZ + 0.45);
    group.add(chhajjaLower);

    const sillLower = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 0.35), whiteTrimMat);
    sillLower.position.set(wingX, 0.75, bounds.maxZ + 0.35);
    group.add(sillLower);

    const sillDiya = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.07, 8), diyaClayMat);
    sillDiya.position.set(wingX, 0.85, bounds.maxZ + 0.40);
    group.add(sillDiya);

    const sillFlame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), diyaFlameMat);
    sillFlame.position.set(wingX, 0.96, bounds.maxZ + 0.40);
    group.add(sillFlame);
  };

  buildHaveliBalconyAndWindows(westWingCx);
  buildHaveliBalconyAndWindows(eastWingCx);

  // Majestic Artisanal Carved Indian Haveli Double Gate (Interactive)
  const villaGate = createInteractiveHaveliGate({
    id: "gate-sana-villa",
    name: "Sana & Aalekh Villa Grand Gate",
    position: new THREE.Vector3(cx, 0, bounds.maxZ),
    rotationY: 0,
    width: doorWidth,
    height: 3.2,
    hasToran: true,
  });
  group.add(villaGate.root);

  // Grand Marigold & Mango Leaf Toran Cascade
  const toran = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.8, 0.32, 0.20),
    new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xd97706, emissiveIntensity: 0.8 })
  );
  toran.position.set(cx, 3.15, bounds.maxZ + 0.05);
  group.add(toran);

  // Warm Golden Lantern Sconces Flanking Entrance Portal
  [-doorWidth / 2 - 0.4, doorWidth / 2 + 0.4].forEach((sx) => {
    const sconce = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.42, 8),
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.5,
        roughness: 0.2,
      })
    );
    sconce.position.set(cx + sx, 2.4, bounds.maxZ + 0.28);
    group.add(sconce);

    const sconceLight = new THREE.PointLight(0xfef08a, 1.2, 5.0, 1.5);
    sconceLight.position.set(cx + sx, 2.4, bounds.maxZ + 0.35);
    group.add(sconceLight);
  });

  // Welcoming Floor Rangoli Mandala
  const inRangoli = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 32),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95 })
  );
  inRangoli.rotation.x = -Math.PI / 2;
  inRangoli.position.set(cx, 0.07, bounds.maxZ - 1.8);
  group.add(inRangoli);

  // Traditional Brass Urli with Floating Marigolds & Rose Petals
  const urli = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.4, 0.22, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
  );
  urli.position.set(cx - 2.4, 0.11, bounds.maxZ - 1.2);
  group.add(urli);

  // =========================================================================
  // 4. GROUND FLOOR — GRAND LIVING ROOM (West Wing: x: -28 to -18)
  // =========================================================================
  const livingCx = cx - 5.0; // -25.0
  const livingCz = cz;       // -14.0

  // Luxury Hand-knotted Kashmiri Silk Rug (7.2m x 5.5m)
  const rugMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 5.5),
    new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.75 })
  );
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(livingCx, 0.07, livingCz);
  group.add(rugMesh);

  // Premium L-Shaped Emerald Velvet Sectional Sofa
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.6 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.45 });

  const sofaHeight = 0.45;
  // Main Section facing North towards 85" OLED TV
  const mainSofa = new THREE.Mesh(new THREE.BoxGeometry(4.8, sofaHeight, 1.1), sofaMat);
  mainSofa.position.set(livingCx, sofaHeight / 2, livingCz - 1.5);
  mainSofa.receiveShadow = true;
  group.add(mainSofa);

  const mainSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 0.3), sofaMat);
  mainSofaBack.position.set(livingCx, sofaHeight + 0.28, livingCz - 1.95);
  group.add(mainSofaBack);

  // Chaise Section on Left (-X)
  const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.2, sofaHeight, 2.2), sofaMat);
  chaise.position.set(livingCx - 2.1, sofaHeight / 2, livingCz - 0.4);
  group.add(chaise);

  // Plush Golden Cushions
  [-1.4, 0, 1.4].forEach((xOff) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.18), cushionMat);
    c.position.set(livingCx + xOff, sofaHeight + 0.2, livingCz - 1.75);
    c.rotation.x = 0.14;
    group.add(c);
  });

  furnitureColliders.push(
    {
      id: "furn-sofa-backrest",
      minX: livingCx - 2.5,
      maxX: livingCx + 2.5,
      minZ: livingCz - 2.2,
      maxZ: livingCz - 1.75,
      minY: 0,
      maxY: 2.2,
    },
    {
      id: "furn-sofa-chaise",
      minX: livingCx - 2.8,
      maxX: livingCx - 1.4,
      minZ: livingCz - 0.9,
      maxZ: livingCz + 0.8,
      minY: 0,
      maxY: 2.2,
    }
  );

  // Seat Anchor: Main Sofa (Couple TV Watching)
  // Positioned cleanly on cushions with zero collision penetration
  seatAnchors.push({
    id: "seat-sofa-center",
    label: "Sofa (Couple TV Watching)",
    position: new THREE.Vector3(livingCx - 0.3, 0.0, livingCz - 1.35),
    rotationY: Math.PI, // Facing North (-Z) directly towards the 85" OLED TV
    sitHeight: 0.48,
    cameraOffset: new THREE.Vector3(1.8, 1.3, 2.2), // Cinematic couple & TV framing
    cameraLookAt: new THREE.Vector3(livingCx - 0.3, 1.6, livingCz - 4.5),
  });

  // Seat Anchor: Chaise Lounge
  seatAnchors.push({
    id: "seat-sofa-chaise",
    label: "Sofa (Chaise Lounge)",
    position: new THREE.Vector3(livingCx - 2.1, 0, livingCz - 0.4),
    rotationY: Math.PI / 2, // Facing East into room
    sitHeight: 0.48,
    cameraOffset: new THREE.Vector3(-3.2, 1.7, 0),
    cameraLookAt: new THREE.Vector3(livingCx + 1.2, 1.4, livingCz),
  });

  // Marble & Walnut Center Coffee Table (Positioned safely in front of sofa, non-overlapping!)
  const coffeeTable = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.42, 1.3),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 })
  );
  coffeeTable.position.set(livingCx + 0.2, 0.21, livingCz + 0.1);
  group.add(coffeeTable);

  // Brass Puja Thali with Kaju Katli
  const thali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.34, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
  );
  thali.position.set(livingCx + 0.2, 0.45, livingCz + 0.1);
  group.add(thali);

  furnitureColliders.push({
    id: "furn-coffee-table",
    minX: livingCx - 1.2,
    maxX: livingCx + 1.6,
    minZ: livingCz - 0.65,
    maxZ: livingCz + 0.85,
    minY: 0,
    maxY: 2.2,
  });

  // Designer Bouclé Armchair (Placed on right side of living room, clear of table and sofa)
  const armchairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const armchair = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), armchairMat);
  armchair.position.set(livingCx + 2.5, 0.35, livingCz + 0.8);
  armchair.rotation.y = -Math.PI / 4;
  group.add(armchair);

  const armchairBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.25), armchairMat);
  armchairBack.position.set(livingCx + 2.8, 0.8, livingCz + 1.1);
  armchairBack.rotation.y = -Math.PI / 4;
  group.add(armchairBack);

  seatAnchors.push({
    id: "seat-armchair",
    label: "Bouclé Armchair",
    position: new THREE.Vector3(livingCx + 2.5, 0, livingCz + 0.8),
    rotationY: -Math.PI * 0.75,
    sitHeight: 0.52,
    cameraOffset: new THREE.Vector3(3.0, 1.6, 2.5),
    cameraLookAt: new THREE.Vector3(livingCx, 1.5, livingCz),
  });

  furnitureColliders.push({
    id: "furn-armchair",
    minX: livingCx + 1.8,
    maxX: livingCx + 3.4,
    minZ: livingCz + 0.2,
    maxZ: livingCz + 1.7,
    minY: 0,
    maxY: 2.2,
  });

  // =========================================================================
  // 5. INTERACTIVE 85" SMART OLED TV & PROCEDURAL SCREEN
  // =========================================================================
  const tvConsole = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.5, 0.65),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
  );
  tvConsole.position.set(livingCx, 0.28, bounds.minZ + 0.42);
  group.add(tvConsole);

  // Procedural Canvas for Dynamic TV Animation
  const tvCanvas = document.createElement("canvas");
  tvCanvas.width = 512;
  tvCanvas.height = 288;
  const tvCtx = tvCanvas.getContext("2d")!;

  const tvTexture = new THREE.CanvasTexture(tvCanvas);
  tvTexture.generateMipmaps = false;
  tvTexture.minFilter = THREE.LinearFilter;

  const tvScreenMat = new THREE.MeshStandardMaterial({
    map: tvTexture,
    roughness: 0.2,
    metalness: 0.0,
    emissiveMap: tvTexture,
    emissive: 0xffffff,
    emissiveIntensity: 0.88,
  });

  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 0.08), tvScreenMat);
  tvScreen.position.set(livingCx, 2.1, bounds.minZ + 0.22);
  group.add(tvScreen);

  const tvGlow = new THREE.PointLight(0x38bdf8, 1.6, 7.0, 1.2);
  tvGlow.position.set(livingCx, 2.1, bounds.minZ + 0.5);
  group.add(tvGlow);

  furnitureColliders.push({
    id: "furn-tv-wall",
    minX: livingCx - 2.5,
    maxX: livingCx + 2.5,
    minZ: bounds.minZ,
    maxZ: bounds.minZ + 0.9,
    minY: 0,
    maxY: 2.2,
  });

  // Relationship Memory Frames on Wall
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.25 });
  [-2.8, 2.8].forEach((xOff) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.05), frameMat);
    frame.position.set(livingCx + xOff, 2.2, bounds.minZ + 0.16);
    group.add(frame);
  });

  const tvChannels = [
    { id: "diwali", title: "Diwali Fireworks Live 🎆", color: "#f59e0b" },
    { id: "pune", title: "Pune Western Ghats Sunrise 🌅", color: "#38bdf8" },
    { id: "memories", title: "Aalekh & Sana Memories ❤️", color: "#f43f5e" },
    { id: "hearth", title: "Cozy Ambient Hearth 🔥", color: "#ea580c" },
  ];
  let currentChannel = 0;
  let tvPowerOn = true;

  const drawTVScreen = (time: number) => {
    if (!tvCtx) return;
    if (!tvPowerOn) {
      tvCtx.fillStyle = "#050508";
      tvCtx.fillRect(0, 0, 512, 288);
      tvTexture.needsUpdate = true;
      tvGlow.intensity = 0.05;
      return;
    }

    tvCtx.fillStyle = "#09090b";
    tvCtx.fillRect(0, 0, 512, 288);

    const ch = tvChannels[currentChannel];
    if (ch.id === "diwali") {
      tvCtx.fillStyle = "#030712";
      tvCtx.fillRect(0, 0, 512, 288);
      for (let i = 0; i < 9; i++) {
        const ph = time * 2.2 + i * 0.9;
        const fx = 256 + Math.cos(ph) * 140;
        const fy = 144 + Math.sin(ph * 1.3) * 65;
        const rad = Math.abs(Math.sin(ph * 3.5)) * 28 + 6;
        const grad = tvCtx.createRadialGradient(fx, fy, 0, fx, fy, rad);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.35, "#f59e0b");
        grad.addColorStop(0.7, "#ef4444");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        tvCtx.fillStyle = grad;
        tvCtx.beginPath();
        tvCtx.arc(fx, fy, rad, 0, Math.PI * 2);
        tvCtx.fill();
      }
      tvGlow.color.setHex(0xf59e0b);
      tvGlow.intensity = 1.6 + Math.sin(time * 8.0) * 0.35;
    } else if (ch.id === "memories") {
      const grad = tvCtx.createLinearGradient(0, 0, 512, 288);
      grad.addColorStop(0, "#881337");
      grad.addColorStop(1, "#4c0519");
      tvCtx.fillStyle = grad;
      tvCtx.fillRect(0, 0, 512, 288);

      const pulse = 1.0 + Math.sin(time * 3.0) * 0.12;
      tvCtx.fillStyle = "#fb7185";
      tvCtx.font = "bold 44px sans-serif";
      tvCtx.textAlign = "center";
      tvCtx.fillText("❤️ Aalekh & Sana ❤️", 256, 120);

      tvCtx.fillStyle = "#fef08a";
      tvCtx.font = "20px sans-serif";
      tvCtx.fillText("Akurdi Diwali 2026 • Forever Together", 256, 175);
      tvGlow.color.setHex(0xf43f5e);
      tvGlow.intensity = 1.5 * pulse;
    } else {
      const grad = tvCtx.createLinearGradient(0, 0, 512, 288);
      grad.addColorStop(0, "#1e3a8a");
      grad.addColorStop(1, "#f97316");
      tvCtx.fillStyle = grad;
      tvCtx.fillRect(0, 0, 512, 288);
      tvGlow.color.setHex(0x38bdf8);
      tvGlow.intensity = 1.4;
    }

    tvCtx.fillStyle = "rgba(0, 0, 0, 0.65)";
    tvCtx.fillRect(16, 238, 480, 36);
    tvCtx.fillStyle = "#ffffff";
    tvCtx.font = "bold 16px sans-serif";
    tvCtx.textAlign = "left";
    tvCtx.fillText(`CH 0${currentChannel + 1} • ${ch.title}`, 28, 262);

    tvTexture.needsUpdate = true;
  };

  const toggleTV = (power?: boolean) => {
    tvPowerOn = power !== undefined ? power : !tvPowerOn;
    return tvPowerOn;
  };
  const setTVChannel = (idx: number) => {
    currentChannel = (idx + tvChannels.length) % tvChannels.length;
  };
  const isTVOn = () => tvPowerOn;
  const getTVChannelName = () => tvChannels[currentChannel].title;

  // =========================================================================
  // 6. SACRED POOJA MANDIR (North-West Corner: x: -30.0, z: -20.5)
  // =========================================================================
  const poojaCx = bounds.minX + 3.2; // -29.8
  const poojaCz = bounds.minZ + 3.5; // -20.5

  const mandirPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.38, 2.6),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18 })
  );
  mandirPlinth.position.set(poojaCx, 0.19, poojaCz);
  group.add(mandirPlinth);

  const mandirCanopy = new THREE.Mesh(
    new THREE.ConeGeometry(1.1, 1.5, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.25 })
  );
  mandirCanopy.position.set(poojaCx, 2.5, poojaCz);
  group.add(mandirCanopy);

  // Pillars
  [-1.1, 1.1].forEach((px) => {
    [-0.9, 0.9].forEach((pz) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.09, 2.0, 10),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      col.position.set(poojaCx + px, 1.2, poojaCz + pz);
      group.add(col);
    });
  });

  const mandirLight = new THREE.PointLight(0xf59e0b, 2.8, 8.0, 1.2);
  mandirLight.position.set(poojaCx, 1.4, poojaCz);
  group.add(mandirLight);

  furnitureColliders.push({
    id: "furn-mandir",
    minX: poojaCx - 1.7,
    maxX: poojaCx + 1.7,
    minZ: poojaCz - 1.5,
    maxZ: poojaCz + 1.5,
    minY: 0,
    maxY: 2.2,
  });

  // =========================================================================
  // 7. GOURMET OPEN-CONCEPT KITCHEN & DINING SUITE (East Wing)
  // =========================================================================
  const kitchenCx = bounds.maxX - 3.5; // -10.5
  const kitchenCz = bounds.maxZ - 3.5; // -7.5

  // Kitchen Quartz Island Counter
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.92, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 })
  );
  counter.position.set(kitchenCx - 1.0, 0.46, kitchenCz);
  group.add(counter);

  // Refrigerator
  const fridge = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.4, 1.1),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.75, roughness: 0.25 })
  );
  fridge.position.set(bounds.maxX - 1.0, 1.2, kitchenCz);
  group.add(fridge);

  furnitureColliders.push({
    id: "furn-kitchen",
    minX: kitchenCx - 3.6,
    maxX: bounds.maxX,
    minZ: kitchenCz - 0.8,
    maxZ: bounds.maxZ,
    minY: 0,
    maxY: 2.2,
  });

  // Formal 6-Seater Solid Teak Dining Table (Placed safely at x: -12.0, z: -15.0, zero overlap!)
  const diningCx = bounds.maxX - 5.0; // -12.0
  const diningCz = cz;               // -14.0

  const diningTable = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.08, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.35 })
  );
  diningTable.position.set(diningCx, 0.78, diningCz);
  group.add(diningTable);

  // Table Legs
  [-1.2, 1.2].forEach((lx) => {
    [-0.55, 0.55].forEach((lz) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.74, 8),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      leg.position.set(diningCx + lx, 0.37, diningCz + lz);
      group.add(leg);
    });
  });

  // Dining Chairs
  [-0.8, 0, 0.8].forEach((dx) => {
    const chN = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.5, 0.52), sofaMat);
    chN.position.set(diningCx + dx, 0.25, diningCz - 1.0);
    group.add(chN);

    const chS = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.5, 0.52), sofaMat);
    chS.position.set(diningCx + dx, 0.25, diningCz + 1.0);
    group.add(chS);
  });

  seatAnchors.push({
    id: "seat-dining",
    label: "Dining Table Suite",
    position: new THREE.Vector3(diningCx - 0.8, 0, diningCz - 1.0),
    rotationY: 0,
    sitHeight: 0.5,
    cameraOffset: new THREE.Vector3(0, 1.6, -3.2),
    cameraLookAt: new THREE.Vector3(diningCx, 1.2, diningCz),
  });

  furnitureColliders.push({
    id: "furn-dining-table",
    minX: diningCx - 1.6,
    maxX: diningCx + 1.6,
    minZ: diningCz - 1.3,
    maxZ: diningCz + 1.3,
    minY: 0,
    maxY: 2.2,
  });

  // =========================================================================
  // 8. GRAND CENTRAL ARCHITECTURAL STAIRCASE (x: -17.5 to -15.0, rising from z: -7.0 to -14.0)
  // =========================================================================
  // Clean, non-overlapping design:
  // Starts at Ground Floor (z: -7.0, y: 0) and climbs straight North to Upper Floor (z: -14.0, y: 3.4m)
  const stairWidth = 2.4;
  const numSteps = 16;
  const stairStartY = 0.0;
  const stairEndY = 3.4;
  const stairStartZ = bounds.maxZ - 3.0; // -7.0
  const stairEndZ = cz;                  // -14.0
  const totalRise = stairEndY - stairStartY;
  const totalRun = stairStartZ - stairEndZ; // 7.0m
  const stepRise = totalRise / numSteps;   // 0.2125m per step
  const stepTread = totalRun / numSteps;   // 0.4375m per step
  const stairX = cx + 3.0;                 // -17.0

  const stepMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.05,
  });
  const stepLedMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const brassRailMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  for (let s = 0; s < numSteps; s++) {
    const sY = stairStartY + s * stepRise + stepRise / 2;
    const sZ = stairStartZ - s * stepTread - stepTread / 2;

    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(stairWidth, stepRise, stepTread),
      stepMat
    );
    stepMesh.position.set(stairX, sY, sZ);
    stepMesh.receiveShadow = true;
    stepMesh.castShadow = true;
    group.add(stepMesh);

    // Warm Underside LED Riser Strip
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(stairWidth - 0.2, 0.03, 0.03),
      stepLedMat
    );
    led.position.set(stairX, sY - stepRise / 2 + 0.02, sZ + stepTread / 2);
    group.add(led);
  }

  // Brass Safety Handrail along the open West edge of the staircase
  const railLen = Math.hypot(totalRise, totalRun);
  const railAngle = Math.atan2(totalRise, totalRun);
  const railCenterY = (stairStartY + stairEndY) / 2 + 1.0;
  const railCenterZ = (stairStartZ + stairEndZ) / 2;

  const handrail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, railLen, 12),
    brassRailMat
  );
  handrail.rotation.x = railAngle;
  handrail.position.set(stairX - stairWidth / 2, railCenterY, railCenterZ);
  group.add(handrail);

  // Progressive Stair Colliders: keep player on stairs, prevent walking off sides
  // Left side railing collider
  furnitureColliders.push({
    id: "furn-stair-rail-w",
    minX: stairX - stairWidth / 2 - 0.35,
    maxX: stairX - stairWidth / 2,
    minZ: stairEndZ,
    maxZ: stairStartZ,
    minY: 0,
    maxY: 3.8,
  });
  // Right side wall collider
  furnitureColliders.push({
    id: "furn-stair-wall-e",
    minX: stairX + stairWidth / 2,
    maxX: stairX + stairWidth / 2 + 0.35,
    minZ: stairEndZ,
    maxZ: stairStartZ,
    minY: 0,
    maxY: 3.8,
  });

  // =========================================================================
  // 9. UPPER FLOOR / SECOND FLOOR (y = 3.4m, Expansive 26m x 11m Suite)
  // =========================================================================
  const upperFloorY = 3.4;
  const upperFloorWidth = width; // 26.0m
  const upperFloorDepth = 11.5;  // North half of villa from z: -24.0 to -12.5
  const upperFloorCz = bounds.minZ + upperFloorDepth / 2; // -18.25

  // Hardwood Oak Parquet Flooring for the Upper Floor
  const upperFloorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(upperFloorWidth, 0.28, upperFloorDepth),
    new THREE.MeshStandardMaterial({
      color: 0x78350f, // Warm honey oak parquet
      roughness: 0.3,
      metalness: 0.05,
    })
  );
  upperFloorMesh.position.set(cx, upperFloorY - 0.14, upperFloorCz);
  upperFloorMesh.receiveShadow = true;
  group.add(upperFloorMesh);

  // Mezzanine Glass Balustrade overlooking the 2-storey living room below
  const mezzBalustrade = new THREE.Mesh(
    new THREE.BoxGeometry(upperFloorWidth - 2.0, 1.1, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
    })
  );
  mezzBalustrade.position.set(cx, upperFloorY + 0.55, bounds.minZ + upperFloorDepth);
  group.add(mezzBalustrade);

  const mezzBrassCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, upperFloorWidth - 2.0, 12),
    brassRailMat
  );
  mezzBrassCap.rotation.z = Math.PI / 2;
  mezzBrassCap.position.set(cx, upperFloorY + 1.1, bounds.minZ + upperFloorDepth);
  group.add(mezzBrassCap);

  // Railing colliders blocking falling off the upper floor edge
  // Leaves a generous 2.9m central opening for the staircase entry/exit
  furnitureColliders.push(
    {
      id: "furn-upper-mezz-rail-west",
      minX: bounds.minX + 0.5,
      maxX: stairX - stairWidth / 2 - 0.25,
      minZ: bounds.minZ + upperFloorDepth - 0.25,
      maxZ: bounds.minZ + upperFloorDepth + 0.25,
      minY: 2.2,
      maxY: 7.2,
    },
    {
      id: "furn-upper-mezz-rail-east",
      minX: stairX + stairWidth / 2 + 0.25,
      maxX: bounds.maxX - 0.5,
      minZ: bounds.minZ + upperFloorDepth - 0.25,
      maxZ: bounds.minZ + upperFloorDepth + 0.25,
      minY: 2.2,
      maxY: 7.2,
    }
  );

  // -------------------------------------------------------------------------
  // 9A. UPPER FLOOR: MASTER BEDROOM SUITE (West Wing, x: -25.5, z: -19.5)
  // -------------------------------------------------------------------------
  const bedCx = bounds.minX + 7.5; // -25.5
  const bedCz = bounds.minZ + 4.5; // -19.5

  // King-Size Teak Bed with Embroidered Royal Crimson Duvet
  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.6, 4.0),
    new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.65 })
  );
  bedBase.position.set(bedCx, upperFloorY + 0.3, bedCz);
  group.add(bedBase);

  // Tufted Velvet Headboard on North Wall
  const headboard = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 1.8, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
  );
  headboard.position.set(bedCx, upperFloorY + 1.3, bounds.minZ + 0.2);
  group.add(headboard);

  // Pillows
  [-0.95, 0.95].forEach((px) => {
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.28, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    );
    pillow.position.set(bedCx + px, upperFloorY + 0.74, bounds.minZ + 0.8);
    group.add(pillow);
  });

  // Bedside Pedestals with Interactive Amber Touch Lamps
  const bedroomLamps: THREE.PointLight[] = [];
  [-2.3, 2.3].forEach((sideX) => {
    const bTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.65, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x27272a })
    );
    bTable.position.set(bedCx + sideX, upperFloorY + 0.32, bounds.minZ + 0.5);
    group.add(bTable);

    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.26, 0.45, 12),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lamp.position.set(bedCx + sideX, upperFloorY + 0.95, bounds.minZ + 0.5);
    group.add(lamp);

    const lampLight = new THREE.PointLight(0xfde68a, 1.5, 6.0);
    lampLight.position.set(bedCx + sideX, upperFloorY + 1.1, bounds.minZ + 0.5);
    group.add(lampLight);
    bedroomLamps.push(lampLight);
  });

  // Walk-In Wardrobe along West Wall
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 3.2, 3.5),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35 })
  );
  wardrobe.position.set(bounds.minX + 0.6, upperFloorY + 1.6, bedCz);
  group.add(wardrobe);

  seatAnchors.push({
    id: "seat-bed",
    label: "Master Bed Suite",
    position: new THREE.Vector3(bedCx, 0, bedCz + 1.4),
    rotationY: Math.PI,
    sitHeight: upperFloorY + 0.6,
    cameraOffset: new THREE.Vector3(0, 1.8, 3.6),
    cameraLookAt: new THREE.Vector3(bedCx, upperFloorY + 1.4, bedCz),
  });

  furnitureColliders.push(
    {
      id: "furn-upper-bed",
      minX: bedCx - 2.8,
      maxX: bedCx + 2.8,
      minZ: bounds.minZ,
      maxZ: bedCz + 2.2,
      minY: 2.2,
      maxY: 7.2,
    },
    {
      id: "furn-upper-wardrobe",
      minX: bounds.minX,
      maxX: bounds.minX + 1.2,
      minZ: bedCz - 1.9,
      maxZ: bedCz + 1.9,
      minY: 2.2,
      maxY: 7.2,
    }
  );

  // -------------------------------------------------------------------------
  // 9B. UPPER FLOOR: ROMANTIC COUPLE LOUNGE & LIBRARY (Center Wing)
  // -------------------------------------------------------------------------
  const loungeCx = cx + 2.0;       // -18.0
  const loungeCz = bounds.minZ + 4.5; // -19.5

  // Cozy Velvet Love Seat
  const loveSeat = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.48, 1.1),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 })
  );
  loveSeat.position.set(loungeCx, upperFloorY + 0.24, loungeCz);
  group.add(loveSeat);

  const loveSeatBack = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.6, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 })
  );
  loveSeatBack.position.set(loungeCx, upperFloorY + 0.65, bounds.minZ + 0.2);
  group.add(loveSeatBack);

  // Solid Teak Bookshelf
  const bookshelf = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 2.6, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 })
  );
  bookshelf.position.set(loungeCx, upperFloorY + 1.3, bounds.minZ + 0.25);
  group.add(bookshelf);

  // -------------------------------------------------------------------------
  // 9C. UPPER FLOOR: PANORAMIC STARGAZING TERRACE / BALCONY (East Wing)
  // -------------------------------------------------------------------------
  const terraceCx = bounds.maxX - 4.5; // -11.5
  const terraceCz = bounds.minZ + 5.0; // -19.0

  // Couple Stargazing Bench overlooking Akurdi
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const terraceBench = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.44, 0.8),
    benchMat
  );
  terraceBench.position.set(terraceCx, upperFloorY + 0.22, terraceCz - 1.2);
  group.add(terraceBench);

  seatAnchors.push({
    id: "seat-mezzanine-terrace",
    label: "Panoramic Stargazing Terrace",
    position: new THREE.Vector3(terraceCx, 0, terraceCz - 1.2),
    rotationY: Math.PI,
    sitHeight: upperFloorY + 0.46,
    cameraOffset: new THREE.Vector3(0, 1.6, 3.6),
    cameraLookAt: new THREE.Vector3(terraceCx, upperFloorY + 1.2, terraceCz),
  });

  furnitureColliders.push({
    id: "furn-terrace-bench",
    minX: terraceCx - 1.5,
    maxX: terraceCx + 1.5,
    minZ: terraceCz - 1.8,
    maxZ: terraceCz - 0.6,
    minY: 2.2,
    maxY: 7.2,
  });

  // =========================================================================
  // 10. LIGHTING & CHANDELIERS
  // =========================================================================
  // Grand Triple-Ring Brass Chandelier in Double-Height Living Room
  const chandelierGroup = new THREE.Group();
  [1.6, 1.1, 0.6].forEach((rad, rIdx) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rad, 0.05, 8, 32),
      brassRailMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -rIdx * 0.45;
    chandelierGroup.add(ring);
  });
  chandelierGroup.position.set(livingCx, height - 1.2, livingCz);
  group.add(chandelierGroup);

  const chandelierLight = new THREE.PointLight(0xfef3c7, 3.8, 24.0, 1.1);
  chandelierLight.position.set(livingCx, height - 1.4, livingCz);
  chandelierLight.castShadow = false;
  group.add(chandelierLight);

  // Upper Floor Chandelier Light
  const upperSuiteLight = new THREE.PointLight(0xfde68a, 2.6, 18.0, 1.2);
  upperSuiteLight.position.set(cx, height - 1.0, upperFloorCz);
  group.add(upperSuiteLight);

  // Ambient Fill Light
  const interiorAmbient = new THREE.AmbientLight(0xffedd5, 1.4);
  group.add(interiorAmbient);

  let lampsOn = true;
  const toggleLamps = () => {
    lampsOn = !lampsOn;
    bedroomLamps.forEach((l) => (l.intensity = lampsOn ? 1.5 : 0.0));
    return lampsOn;
  };

  // =========================================================================
  // 11. DYNAMIC FLOOR ELEVATION FUNCTION
  // =========================================================================
  const getFloorElevation = (px: number, pz: number, currentY = 0): number => {
    // 1. Is player on the staircase?
    // Staircase extends from stairStartZ (z = -7.0, ground floor) to stairEndZ (z = -14.0, upper floor)
    if (
      px >= stairX - stairWidth / 2 - 0.35 &&
      px <= stairX + stairWidth / 2 + 0.35 &&
      pz >= stairEndZ - 0.25 &&
      pz <= stairStartZ + 0.25
    ) {
      // Progress along staircase from south to north (0 at startZ, 1 at endZ)
      const u = Math.min(1.0, Math.max(0.0, (stairStartZ - pz) / totalRun));
      return stairStartY + u * totalRise;
    }

    // 2. Is player on the Upper Floor slab?
    // CRITICAL FIX: Player can ONLY be on the upper floor if they have ascended past height > 1.8m!
    // If player is on the ground floor (currentY <= 1.8), they are UNDER the upper floor ceiling
    // in the living room or kitchen (e.g. living room sofa at z = -15.5m), so elevation MUST be 0.0m!
    if (
      currentY > 1.8 &&
      px >= bounds.minX + 0.4 &&
      px <= bounds.maxX - 0.4 &&
      pz >= bounds.minZ + 0.4 &&
      pz <= bounds.minZ + upperFloorDepth + 0.3
    ) {
      return upperFloorY;
    }

    // 3. Otherwise strictly on Ground Floor
    return 0.0;
  };

  const updateAnimation = (time: number) => {
    drawTVScreen(time);
  };

  return {
    group,
    furnitureColliders,
    exteriorColliders,
    bounds,
    entranceDoorPos,
    streetExitPos,
    occlusionMeshes,
    seatAnchors,
    villaGate,
    toggleTV,
    setTVChannel,
    isTVOn,
    getTVChannelName,
    toggleLamps,
    getFloorElevation,
    updateAnimation,
  };
}
