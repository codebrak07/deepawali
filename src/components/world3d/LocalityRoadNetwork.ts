import * as THREE from "three";
import { LOCALITY_ROADS, RoadSegment } from "./LocalityData";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface RoadNetworkResult {
  roadGroup: THREE.Group;
  vehicleColliders: BoxCollider[];
}

/**
 * Creates the unified modular locality ground, road, courtyard and vehicle system.
 * Eliminates overlapping coplanar road slabs and z-fighting through:
 * 1. Single continuous ground terrain base at y = 0.000m.
 * 2. Deterministic vertical tiering (Level 0: Ground, Level 1: Road/Courtyard Paving, Level 2: Markings/Inlays, Level 3: Sidewalks).
 * 3. Monolithic intersection junction tiles with clean sidewalk terminations (no sidewalks crossing traffic).
 * 4. Distinct Indian locality zones: Sacred Temple Courtyards, Sana's Villa Forecourt, Festive Bazaar Promenade.
 */
export function createLocalityRoadNetwork(scene: THREE.Scene): RoadNetworkResult {
  const roadGroup = new THREE.Group();
  roadGroup.name = "roadNetworkGroup";
  const vehicleColliders: BoxCollider[] = [];

  // =========================================================================
  // 1. HIGH-PERFORMANCE SHARED PBR MATERIALS (Cached & Reused)
  // =========================================================================
  // Level 0: Continuous Base Ground Earth / Dark Cobble
  const baseTerrainMat = new THREE.MeshStandardMaterial({
    color: 0x090d1a, // Deep midnight locality soil & stone
    roughness: 0.92,
    metalness: 0.04,
  });

  // Level 1: Main Vehicular Asphalt (with polygonOffset to prevent coplanar depth conflicts)
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x1a202c, // Rich dark charcoal Indian road asphalt
    roughness: 0.82,
    metalness: 0.08,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 1: Intersection Junction Tile Material
  const junctionMat = new THREE.MeshStandardMaterial({
    color: 0x222a3a, // Reinforced monolithic intersection asphalt
    roughness: 0.78,
    metalness: 0.10,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 1: Sacred Sandstone Temple Courtyard Tiles (Shiva Temple)
  const sandstoneTileMat = new THREE.MeshStandardMaterial({
    color: 0xb45309, // Warm Rajasthan Dholpur sandstone
    roughness: 0.65,
    metalness: 0.12,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 1: Sacred Saffron-Terracotta Temple Tiles (Hanuman Mandir)
  const terracottaTileMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Sacred saffron terracotta paver
    roughness: 0.70,
    metalness: 0.08,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 1: Sana's Villa Forecourt & Entrance Courtyard (Kota Stone)
  const kotaStoneMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Polished grey-green Kota stone
    roughness: 0.50,
    metalness: 0.15,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 1: Festive Bazaar Promenade (Herringbone Clay Brick)
  const bazaarBrickMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412, // Vibrant festive terracotta pedestrian brick
    roughness: 0.75,
    metalness: 0.05,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
  });

  // Level 2: Surface Markings & Festive Rangoli Inlays (Decal-style rendering with higher polygonOffset priority)
  const goldMarkingMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24, // Radiant turmeric gold lane markings
    transparent: true,
    opacity: 0.90,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2.0,
    polygonOffsetUnits: -2.0,
    side: THREE.DoubleSide,
  });

  const zebraMarkingMat = new THREE.MeshBasicMaterial({
    color: 0xf1f5f9, // Crisp white pedestrian crossing stripes
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2.0,
    polygonOffsetUnits: -2.0,
    side: THREE.DoubleSide,
  });

  const rangoliInlayMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b, // Festive amber rangoli chowk inlay
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2.0,
    polygonOffsetUnits: -2.0,
    side: THREE.DoubleSide,
  });

  // Level 3: Raised Pedestrian Sidewalk Pavers
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Structured interlocking paver blocks
    roughness: 0.78,
    metalness: 0.06,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: 0x64748b, // Chiseled granite curb edge
    roughness: 0.65,
  });

  // =========================================================================
  // 2. LEVEL 0: UNIFIED CONTINUOUS WORLD GROUND (Zero Gaps, Zero Voids)
  // =========================================================================
  const groundGeo = new THREE.PlaneGeometry(360, 300);
  const groundMesh = new THREE.Mesh(groundGeo, baseTerrainMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, 0.000, 0); // Authoritative reference plane
  groundMesh.receiveShadow = true;
  roadGroup.add(groundMesh);

  // =========================================================================
  // 3. LEVEL 1: ZONED LOCALITY COURTYARDS & CIVIC PLAZAS (y = 0.040m)
  // =========================================================================

  // 3A. Lord Shiva Temple Sacred Sandstone Courtyard (x: 5 to 23, z: -35 to -15)
  const shivaCourtyardGeo = new THREE.PlaneGeometry(18, 20);
  const shivaCourtyard = new THREE.Mesh(shivaCourtyardGeo, sandstoneTileMat);
  shivaCourtyard.rotation.x = -Math.PI / 2;
  shivaCourtyard.position.set(14, 0.040, -25);
  shivaCourtyard.receiveShadow = true;
  roadGroup.add(shivaCourtyard);

  // Decorative Lotus Parikrama Inlay at Shiva Courtyard Center
  const shivaRingGeo = new THREE.RingGeometry(3.5, 4.2, 32);
  const shivaRing = new THREE.Mesh(shivaRingGeo, rangoliInlayMat);
  shivaRing.rotation.x = -Math.PI / 2;
  shivaRing.position.set(14, 0.060, -25);
  roadGroup.add(shivaRing);

  // 3B. Shri Hanuman Mandir Terracotta Courtyard (x: -21 to -3, z: -35 to -15)
  const hanumanCourtyardGeo = new THREE.PlaneGeometry(18, 20);
  const hanumanCourtyard = new THREE.Mesh(hanumanCourtyardGeo, terracottaTileMat);
  hanumanCourtyard.rotation.x = -Math.PI / 2;
  hanumanCourtyard.position.set(-12, 0.040, -25);
  hanumanCourtyard.receiveShadow = true;
  roadGroup.add(hanumanCourtyard);

  // 3C. Sana's Residence Forecourt & Frontage (x: -30 to -10, z: -15 to -5)
  const sanaForecourtGeo = new THREE.PlaneGeometry(20, 10);
  const sanaForecourt = new THREE.Mesh(sanaForecourtGeo, kotaStoneMat);
  sanaForecourt.rotation.x = -Math.PI / 2;
  sanaForecourt.position.set(-20, 0.040, -10);
  sanaForecourt.receiveShadow = true;
  roadGroup.add(sanaForecourt);

  // Welcome Rangoli Threshold at Villa Entrance Gate (x: -20, z: -5)
  const sanaRangoliGeo = new THREE.CircleGeometry(2.2, 24);
  const sanaRangoli = new THREE.Mesh(sanaRangoliGeo, rangoliInlayMat);
  sanaRangoli.rotation.x = -Math.PI / 2;
  sanaRangoli.position.set(-20, 0.060, -5.2);
  roadGroup.add(sanaRangoli);

  // 3D. Dattawadi Festive Bazaar Pedestrian Promenade (z: 16 to 24, x: -55 to 55)
  const bazaarPromenadeGeo = new THREE.PlaneGeometry(110, 8);
  const bazaarPromenade = new THREE.Mesh(bazaarPromenadeGeo, bazaarBrickMat);
  bazaarPromenade.rotation.x = -Math.PI / 2;
  bazaarPromenade.position.set(0, 0.040, 20);
  bazaarPromenade.receiveShadow = true;
  roadGroup.add(bazaarPromenade);

  // =========================================================================
  // 4. LEVEL 1: MONOLITHIC INTERSECTION TILES (y = 0.042m)
  // =========================================================================
  interface JunctionNode {
    id: string;
    x: number;
    z: number;
    radius: number;
    hasRangoli?: boolean;
  }

  const JUNCTION_NODES: JunctionNode[] = [
    { id: "j-chowk-central", x: 0, z: 0, radius: 6.2, hasRangoli: true },
    { id: "j-west-kalbhor", x: -65, z: 0, radius: 5.5, hasRangoli: true },
    { id: "j-east-pradhikaran", x: 65, z: 0, radius: 5.5, hasRangoli: true },
    { id: "j-north-sector27a", x: 0, z: -55, radius: 5.0 },
    { id: "j-south-station", x: 0, z: 50, radius: 5.0 },
    { id: "j-bazaar-central", x: 0, z: 20, radius: 4.8 },
    { id: "j-west-cross-n", x: -65, z: -48, radius: 4.5 },
    { id: "j-east-cross-n", x: 65, z: -48, radius: 4.5 },
    { id: "j-west-cross-s", x: -65, z: 42, radius: 4.5 },
    { id: "j-east-cross-s", x: 65, z: 42, radius: 4.5 },
  ];

  JUNCTION_NODES.forEach((jn) => {
    // Monolithic circular intersection paving tile
    const jnGeo = new THREE.CircleGeometry(jn.radius, 32);
    const jnMesh = new THREE.Mesh(jnGeo, junctionMat);
    jnMesh.rotation.x = -Math.PI / 2;
    jnMesh.position.set(jn.x, 0.042, jn.z);
    jnMesh.receiveShadow = true;
    roadGroup.add(jnMesh);

    // Decorative Festive Chowk Rangoli Medallion
    if (jn.hasRangoli) {
      const rRingGeo = new THREE.RingGeometry(jn.radius * 0.72, jn.radius * 0.88, 32);
      const rRing = new THREE.Mesh(rRingGeo, rangoliInlayMat);
      rRing.rotation.x = -Math.PI / 2;
      rRing.position.set(jn.x, 0.062, jn.z);
      roadGroup.add(rRing);
    }
  });

  // =========================================================================
  // 5. LEVEL 1: ROAD CORRIDORS (y = 0.040m, Markings y = 0.060m)
  // =========================================================================
  LOCALITY_ROADS.forEach((road: RoadSegment) => {
    // Skip courtyard-handled paths to avoid duplicate paving
    if (road.id === "r-bazaar-w" || road.id === "r-bazaar-e") {
      return; // Handled by continuous Bazaar Promenade
    }

    const dx = road.endX - road.startX;
    const dz = road.endZ - road.startZ;
    const length = Math.hypot(dx, dz);
    if (length < 1.0) return;

    const angle = Math.atan2(dx, dz);
    const midX = (road.startX + road.endX) / 2;
    const midZ = (road.startZ + road.endZ) / 2;

    // Road Asphalt Ribbon (Level 1: y = 0.040m)
    const roadGeo = new THREE.PlaneGeometry(road.width, length);
    const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.rotation.z = -angle;
    roadMesh.position.set(midX, 0.040, midZ);
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);

    // Level 2: Dashed Golden Festive Centerline (y = 0.060m)
    if (length > 12) {
      const lineCount = Math.floor(length / 4.5);
      for (let i = 0; i < lineCount; i++) {
        const lineGeo = new THREE.PlaneGeometry(0.25, 2.0);
        const lineMesh = new THREE.Mesh(lineGeo, goldMarkingMat);
        lineMesh.rotation.x = -Math.PI / 2;
        lineMesh.rotation.z = -angle;
        const progress = (i + 0.5) / lineCount - 0.5;
        lineMesh.position.set(
          midX + dx * progress,
          0.060,
          midZ + dz * progress
        );
        roadGroup.add(lineMesh);
      }
    }

    // =======================================================================
    // 6. LEVEL 3: SIDEWALKS & CURBS (Clean Endings Before Intersections)
    // =======================================================================
    // Sidewalk length is slightly shortened at ends (by road.width / 2) so sidewalks
    // terminate cleanly at junctions rather than cutting through crossing traffic!
    const clipMargin = Math.min(length * 0.45, road.width * 0.55);
    const swLength = Math.max(1.0, length - clipMargin * 2);
    const swWidth = 2.0;
    const perpAngle = angle + Math.PI / 2;
    const offsetDist = road.width / 2 + swWidth / 2;

    // Left Sidewalk Paver (Level 3: thickness = 0.12m, center y = 0.060m -> top y = 0.120m)
    const leftSwGeo = new THREE.BoxGeometry(swWidth, 0.12, swLength);
    const leftSwMesh = new THREE.Mesh(leftSwGeo, sidewalkMat);
    leftSwMesh.rotation.y = angle;
    leftSwMesh.position.set(
      midX - Math.sin(perpAngle) * offsetDist,
      0.060,
      midZ - Math.cos(perpAngle) * offsetDist
    );
    leftSwMesh.receiveShadow = true;
    roadGroup.add(leftSwMesh);

    // Right Sidewalk Paver
    const rightSwGeo = new THREE.BoxGeometry(swWidth, 0.12, swLength);
    const rightSwMesh = new THREE.Mesh(rightSwGeo, sidewalkMat);
    rightSwMesh.rotation.y = angle;
    rightSwMesh.position.set(
      midX + Math.sin(perpAngle) * offsetDist,
      0.060,
      midZ + Math.cos(perpAngle) * offsetDist
    );
    rightSwMesh.receiveShadow = true;
    roadGroup.add(rightSwMesh);

    // Granite Curb Edges along sidewalk street boundary (thickness = 0.16m, center y = 0.080m -> top y = 0.160m)
    const curbGeo = new THREE.BoxGeometry(0.18, 0.16, swLength);
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.rotation.y = angle;
    leftCurb.position.set(
      midX - Math.sin(perpAngle) * (road.width / 2 + 0.09),
      0.080,
      midZ - Math.cos(perpAngle) * (road.width / 2 + 0.09)
    );
    roadGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.rotation.y = angle;
    rightCurb.position.set(
      midX + Math.sin(perpAngle) * (road.width / 2 + 0.09),
      0.080,
      midZ + Math.cos(perpAngle) * (road.width / 2 + 0.09)
    );
    roadGroup.add(rightCurb);

    // Pedestrian Zebra Crosswalks at Road Ends (Level 2: y = 0.060m)
    if (length > 20) {
      [-1, 1].forEach((endSign) => {
        const crossZ = midZ + (dz / 2) * endSign * 0.88;
        const crossX = midX + (dx / 2) * endSign * 0.88;
        const numBars = 5;
        const barSpacing = road.width / (numBars + 1);
        for (let b = 0; b < numBars; b++) {
          const barGeo = new THREE.PlaneGeometry(0.45, 1.8);
          const bar = new THREE.Mesh(barGeo, zebraMarkingMat);
          bar.rotation.x = -Math.PI / 2;
          bar.rotation.z = -angle;
          const barOffset = (b - (numBars - 1) / 2) * barSpacing;
          bar.position.set(
            crossX + Math.sin(perpAngle) * barOffset,
            0.060,
            crossZ + Math.cos(perpAngle) * barOffset
          );
          roadGroup.add(bar);
        }
      });
    }
  });

  // =========================================================================
  // 7. GROUNDED LOCALITY VEHICLES (SUV, Sedan, Auto-Rickshaw, Scooter, Bullet)
  // =========================================================================
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 });
  const headlampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const taillampMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });

  const createWheel = (radius = 0.35, width = 0.22) => {
    const wGroup = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 14), rubberMat);
    tire.rotation.z = Math.PI / 2;
    wGroup.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width + 0.01, 10), hubMat);
    hub.rotation.z = Math.PI / 2;
    wGroup.add(hub);
    return wGroup;
  };

  // 7A. Rugged Indian SUV (Mahindra Thar 4x4)
  const createSUV = (x: number, z: number, rotY: number, bodyColor: number, id: string) => {
    const car = new THREE.Group();
    car.position.set(x, 0, z);
    car.rotation.y = rotY;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45, metalness: 0.3 });

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.45, 3.8), rubberMat);
    chassis.position.y = 0.42;
    car.add(chassis);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 3.6), bodyMat);
    cabin.position.y = 0.85;
    cabin.castShadow = true;
    car.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.72, 2.2), bodyMat);
    roof.position.set(0, 1.48, -0.3);
    car.add(roof);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.62, 0.05), glassMat);
    windshield.position.set(0, 1.44, 0.82);
    windshield.rotation.x = -0.32;
    car.add(windshield);

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.58, 0.05), glassMat);
    rearGlass.position.set(0, 1.44, -1.42);
    car.add(rearGlass);

    [-0.65, 0.65].forEach((hx) => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), headlampMat);
      hl.position.set(hx, 0.85, 1.82);
      car.add(hl);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.04), taillampMat);
      tl.position.set(hx, 0.85, -1.82);
      car.add(tl);
    });

    [
      { wx: -0.95, wz: 1.1 },
      { wx: 0.95, wz: 1.1 },
      { wx: -0.95, wz: -1.1 },
      { wx: 0.95, wz: -1.1 },
    ].forEach((w) => {
      const wheel = createWheel(0.38, 0.24);
      wheel.position.set(w.wx, 0.38, w.wz);
      car.add(wheel);
    });

    const spare = createWheel(0.38, 0.22);
    spare.rotation.y = Math.PI / 2;
    spare.position.set(0, 1.05, -1.95);
    car.add(spare);

    roadGroup.add(car);

    vehicleColliders.push({
      id: `veh-${id}`,
      minX: x - 1.1,
      maxX: x + 1.1,
      minZ: z - 2.1,
      maxZ: z + 2.1,
    });
  };

  // 7B. Modern Sedan
  const createSedan = (x: number, z: number, rotY: number, bodyColor: number, id: string) => {
    const car = new THREE.Group();
    car.position.set(x, 0, z);
    car.rotation.y = rotY;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.6 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.52, 4.3), bodyMat);
    body.position.y = 0.45;
    body.castShadow = true;
    car.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.58, 2.3), bodyMat);
    cabin.position.set(0, 0.95, -0.15);
    car.add(cabin);

    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 0.05), glassMat);
    frontWindshield.position.set(0, 0.92, 1.02);
    frontWindshield.rotation.x = -0.55;
    car.add(frontWindshield);

    const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.48, 0.05), glassMat);
    rearWindshield.position.set(0, 0.92, -1.32);
    rearWindshield.rotation.x = 0.55;
    car.add(rearWindshield);

    [
      { wx: -0.88, wz: 1.25 },
      { wx: 0.88, wz: 1.25 },
      { wx: -0.88, wz: -1.25 },
      { wx: 0.88, wz: -1.25 },
    ].forEach((w) => {
      const wheel = createWheel(0.32, 0.20);
      wheel.position.set(w.wx, 0.32, w.wz);
      car.add(wheel);
    });

    roadGroup.add(car);

    vehicleColliders.push({
      id: `veh-${id}`,
      minX: x - 1.05,
      maxX: x + 1.05,
      minZ: z - 2.3,
      maxZ: z + 2.3,
    });
  };

  // 7C. Bajaj Auto-Rickshaw
  const createAutoRickshaw = (x: number, z: number, rotY: number, id: string) => {
    const rickshaw = new THREE.Group();
    rickshaw.position.set(x, 0, z);
    rickshaw.rotation.y = rotY;

    const yellowCanopyMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const greenBodyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
    const blackSeatMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

    const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 2.5), greenBodyMat);
    lowerChassis.position.y = 0.45;
    rickshaw.add(lowerChassis);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.12, 2.4), yellowCanopyMat);
    roof.position.set(0, 1.70, -0.05);
    roof.castShadow = true;
    rickshaw.add(roof);

    const roofCurve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 2.4, 12, 1, false, 0, Math.PI),
      yellowCanopyMat
    );
    roofCurve.rotation.z = Math.PI / 2;
    roofCurve.rotation.y = Math.PI / 2;
    roofCurve.position.set(0, 1.70, -0.05);
    rickshaw.add(roofCurve);

    [
      [-0.65, 0.9],
      [0.65, 0.9],
      [-0.65, -1.15],
      [0.65, -1.15],
    ].forEach(([sx, sz]) => {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6), chromeMat);
      strut.position.set(sx, 1.25, sz);
      rickshaw.add(strut);
    });

    const windscreen = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.55, 0.05), glassMat);
    windscreen.position.set(0, 1.25, 0.82);
    rickshaw.add(windscreen);

    const passengerSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.24, 0.65), blackSeatMat);
    passengerSeat.position.set(0, 0.76, -0.72);
    rickshaw.add(passengerSeat);

    const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.45), blackSeatMat);
    driverSeat.position.set(0, 0.76, 0.15);
    rickshaw.add(driverSeat);

    const frontWheel = createWheel(0.26, 0.14);
    frontWheel.position.set(0, 0.26, 1.15);
    rickshaw.add(frontWheel);

    [-0.68, 0.68].forEach((wx) => {
      const rearWheel = createWheel(0.28, 0.16);
      rearWheel.position.set(wx, 0.28, -0.65);
      rickshaw.add(rearWheel);
    });

    vehicleColliders.push({
      id: `vehicle-${id}`,
      minX: x - 0.85,
      maxX: x + 0.85,
      minZ: z - 1.35,
      maxZ: z + 1.35,
    });

    roadGroup.add(rickshaw);
  };

  // 7D. Two-Wheelers: Scooters & Royal Enfield Bullet
  const createScooter = (x: number, z: number, rotY: number, color: number) => {
    const sc = new THREE.Group();
    sc.position.set(x, 0, z);
    sc.rotation.y = rotY;

    const paintMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 });

    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.12), paintMat);
    apron.position.set(0, 0.55, 0.38);
    sc.add(apron);

    const footboard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.55), rubberMat);
    footboard.position.set(0, 0.25, 0.05);
    sc.add(footboard);

    const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.65), paintMat);
    cowl.position.set(0, 0.45, -0.42);
    sc.add(cowl);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.10, 0.62), rubberMat);
    seat.position.set(0, 0.68, -0.42);
    sc.add(seat);

    [0.55, -0.65].forEach((wz) => {
      const wheel = createWheel(0.19, 0.10);
      wheel.position.set(0, 0.19, wz);
      sc.add(wheel);
    });

    roadGroup.add(sc);
  };

  const createBulletBike = (x: number, z: number, rotY: number) => {
    const bike = new THREE.Group();
    bike.position.set(x, 0, z);
    bike.rotation.y = rotY;

    const tankMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.25, metalness: 0.8 });
    const tankGeo = new THREE.SphereGeometry(0.22, 8, 8);
    tankGeo.scale(0.8, 0.85, 1.4);
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 0.72, 0.15);
    bike.add(tank);

    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.38), chromeMat);
    engine.position.set(0, 0.42, 0.05);
    bike.add(engine);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.65), rubberMat);
    seat.position.set(0, 0.68, -0.32);
    bike.add(seat);

    [0.72, -0.72].forEach((wz) => {
      const wheel = createWheel(0.32, 0.12);
      wheel.position.set(0, 0.32, wz);
      bike.add(wheel);
    });

    roadGroup.add(bike);
  };

  // Place Vehicles in Curbside Parking Bays (Clear Haveli & Temple Entrances)
  createSUV(-30.0, -1.8, 0, 0x1f2937, "thar-sana"); // Black Thar parked along west curb
  createScooter(-11.0, -2.0, 0.4, 0x06b6d4); // Teal Activa Scooter parked along east curb
  createSedan(8.5, -18.5, 0, 0xe2e8f0, "sedan-shiva"); // Silver Sedan near Shiva Temple
  createScooter(12.5, -18.5, 0.2, 0xfacc15); // Yellow Vespa
  createBulletBike(-8.5, -18.0, -0.35); // Classic Bullet at Hanuman Mandir
  createAutoRickshaw(4.8, 18.2, -Math.PI / 2, "rickshaw-chowk"); // Bajaj Auto at Chowk
  createSUV(18.5, 4.5, Math.PI / 2, 0xf8fafc, "suv-market"); // Pearl White SUV
  createScooter(28.0, 3.8, 1.2, 0xef4444); // Red Scooter

  scene.add(roadGroup);
  return { roadGroup, vehicleColliders };
}
