import * as THREE from "three";
import { LOCALITY_ROADS, RoadSegment } from "./LocalityData";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface RoadNetworkResult {
  roadGroup: THREE.Group;
  vehicleColliders: BoxCollider[];
}

export function createLocalityRoadNetwork(scene: THREE.Scene): RoadNetworkResult {
  const roadGroup = new THREE.Group();
  roadGroup.name = "roadNetworkGroup";
  const vehicleColliders: BoxCollider[] = [];

  // 1. Overall Ground Terrain (warm midnight dark asphalt/earth across expanded 320m x 280m open world)
  const terrainGeo = new THREE.PlaneGeometry(380, 320);
  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x070b18,
    roughness: 0.95,
    metalness: 0.05,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.position.y = -0.05;
  terrainMesh.receiveShadow = true;
  roadGroup.add(terrainMesh);

  // 2. Road Materials
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x1e2433,
    roughness: 0.85,
    metalness: 0.1,
  });

  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.05,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.7,
  });

  const markingMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.75,
  });

  // 3. Build each road segment
  LOCALITY_ROADS.forEach((road: RoadSegment) => {
    const dx = road.endX - road.startX;
    const dz = road.endZ - road.startZ;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    const midX = (road.startX + road.endX) / 2;
    const midZ = (road.startZ + road.endZ) / 2;

    // Road Pavement Mesh
    const roadGeo = new THREE.PlaneGeometry(road.width, length);
    const roadMesh = new THREE.Mesh(roadGeo, asphaltMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.rotation.z = -angle;
    roadMesh.position.set(midX, 0.02, midZ);
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);

    // Left Sidewalk
    const swWidth = 2.2;
    const leftSwGeo = new THREE.BoxGeometry(swWidth, 0.15, length);
    const leftSwMesh = new THREE.Mesh(leftSwGeo, sidewalkMat);
    const perpAngle = angle + Math.PI / 2;
    const offsetDist = (road.width / 2) + (swWidth / 2);
    leftSwMesh.rotation.y = angle;
    leftSwMesh.position.set(
      midX - Math.sin(perpAngle) * offsetDist,
      0.075,
      midZ - Math.cos(perpAngle) * offsetDist
    );
    leftSwMesh.receiveShadow = true;
    roadGroup.add(leftSwMesh);

    // Right Sidewalk
    const rightSwGeo = new THREE.BoxGeometry(swWidth, 0.15, length);
    const rightSwMesh = new THREE.Mesh(rightSwGeo, sidewalkMat);
    rightSwMesh.rotation.y = angle;
    rightSwMesh.position.set(
      midX + Math.sin(perpAngle) * offsetDist,
      0.075,
      midZ + Math.cos(perpAngle) * offsetDist
    );
    rightSwMesh.receiveShadow = true;
    roadGroup.add(rightSwMesh);

    // Curbs along sidewalks
    const curbGeo = new THREE.BoxGeometry(0.2, 0.22, length);
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.rotation.y = angle;
    leftCurb.position.set(
      midX - Math.sin(perpAngle) * (road.width / 2),
      0.11,
      midZ - Math.cos(perpAngle) * (road.width / 2)
    );
    roadGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.rotation.y = angle;
    rightCurb.position.set(
      midX + Math.sin(perpAngle) * (road.width / 2),
      0.11,
      midZ + Math.cos(perpAngle) * (road.width / 2)
    );
    roadGroup.add(rightCurb);

    // Road Center Line (Golden festive dashed stripe)
    if (length > 10) {
      const lineCount = Math.floor(length / 4);
      for (let i = 0; i < lineCount; i++) {
        const lineGeo = new THREE.PlaneGeometry(0.25, 1.8);
        const lineMesh = new THREE.Mesh(lineGeo, markingMat);
        lineMesh.rotation.x = -Math.PI / 2;
        lineMesh.rotation.z = -angle;
        const progress = (i + 0.5) / lineCount - 0.5;
        lineMesh.position.set(
          midX + dx * progress,
          0.025,
          midZ + dz * progress
        );
        roadGroup.add(lineMesh);
      }
    }
  });

  // 4. Central Dattawadi Chowk Junction Circle (Paved round intersection)
  const junctionGeo = new THREE.CircleGeometry(6.5, 32);
  const junctionMat = new THREE.MeshStandardMaterial({
    color: 0x242c3d,
    roughness: 0.8,
  });
  const junctionMesh = new THREE.Mesh(junctionGeo, junctionMat);
  junctionMesh.rotation.x = -Math.PI / 2;
  junctionMesh.position.set(0, 0.022, 0);
  junctionMesh.receiveShadow = true;
  roadGroup.add(junctionMesh);

  // Decorative Rangoli Ring around central chowk
  const ringGeo = new THREE.RingGeometry(5.8, 6.2, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.set(0, 0.028, 0);
  roadGroup.add(ringMesh);

  // ========================================================
  // 5. Grounded Parked Indian Locality Vehicles (SUVs, Sedans, Scooters, Bullet)
  // ========================================================
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 });
  const headlampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const taillampMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });

  const createWheel = (radius = 0.35, width = 0.22) => {
    const wGroup = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 16), rubberMat);
    tire.rotation.z = Math.PI / 2;
    wGroup.add(tire);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width + 0.01, 12), hubMat);
    hub.rotation.z = Math.PI / 2;
    wGroup.add(hub);
    return wGroup;
  };

  // 5A. Rugged Indian SUV (Mahindra Thar 4x4)
  const createSUV = (x: number, z: number, rotY: number, bodyColor: number, id: string) => {
    const car = new THREE.Group();
    car.position.set(x, 0, z);
    car.rotation.y = rotY;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45, metalness: 0.3 });

    // Lower Chassis & Bumper
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.45, 3.8), rubberMat);
    chassis.position.y = 0.42;
    car.add(chassis);

    // Main Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 3.6), bodyMat);
    cabin.position.y = 0.85;
    cabin.castShadow = true;
    car.add(cabin);

    // Hardtop Roof & Windshield
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.72, 2.2), bodyMat);
    roof.position.set(0, 1.48, -0.3);
    car.add(roof);

    // Windshield & Windows
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.62, 0.05), glassMat);
    windshield.position.set(0, 1.44, 0.82);
    windshield.rotation.x = -0.32;
    car.add(windshield);

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.58, 0.05), glassMat);
    rearGlass.position.set(0, 1.44, -1.42);
    car.add(rearGlass);

    // Headlights & Tail Lights
    [-0.65, 0.65].forEach((hx) => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), headlampMat);
      hl.position.set(hx, 0.85, 1.82);
      car.add(hl);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.04), taillampMat);
      tl.position.set(hx, 0.85, -1.82);
      car.add(tl);
    });

    // 4 Wheels
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

    // Spare Tailgate Tire
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

  // 5B. Indian Modern Compact Sedan
  const createSedan = (x: number, z: number, rotY: number, bodyColor: number, id: string) => {
    const car = new THREE.Group();
    car.position.set(x, 0, z);
    car.rotation.y = rotY;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.6 });

    // Streamlined lower body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.52, 4.3), bodyMat);
    body.position.y = 0.45;
    body.castShadow = true;
    car.add(body);

    // Cabin Greenhouse
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.58, 2.3), bodyMat);
    cabin.position.set(0, 0.95, -0.15);
    car.add(cabin);

    // Front/Rear Glass
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 0.05), glassMat);
    frontWindshield.position.set(0, 0.92, 1.02);
    frontWindshield.rotation.x = -0.55;
    car.add(frontWindshield);

    const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.48, 0.05), glassMat);
    rearWindshield.position.set(0, 0.92, -1.32);
    rearWindshield.rotation.x = 0.55;
    car.add(rearWindshield);

    // Wheels
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

  // 5C. Indian Two-Wheeler: Vespa / Activa Scooter
  const createScooter = (x: number, z: number, rotY: number, color: number) => {
    const sc = new THREE.Group();
    sc.position.set(x, 0, z);
    sc.rotation.y = rotY;

    const paintMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 });

    // Front Apron Shield
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.12), paintMat);
    apron.position.set(0, 0.55, 0.38);
    sc.add(apron);

    // Footboard
    const footboard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.55), rubberMat);
    footboard.position.set(0, 0.25, 0.05);
    sc.add(footboard);

    // Rear engine cowl & seat
    const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.65), paintMat);
    cowl.position.set(0, 0.45, -0.42);
    sc.add(cowl);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.10, 0.62), rubberMat);
    seat.position.set(0, 0.68, -0.42);
    sc.add(seat);

    // Handlebars & Headlamp
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.58, 8), chromeMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.92, 0.36);
    sc.add(handle);

    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), headlampMat);
    hl.position.set(0, 0.92, 0.45);
    sc.add(hl);

    // Front & Back Scooter Wheels
    [0.55, -0.65].forEach((wz) => {
      const wheel = createWheel(0.19, 0.10);
      wheel.position.set(0, 0.19, wz);
      sc.add(wheel);
    });

    roadGroup.add(sc);
  };

  // 5D. Royal Enfield Bullet 350 Motorcycle
  const createBulletBike = (x: number, z: number, rotY: number) => {
    const bike = new THREE.Group();
    bike.position.set(x, 0, z);
    bike.rotation.y = rotY;

    const tankMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.25, metalness: 0.8 });

    // Teardrop Fuel Tank
    const tankGeo = new THREE.SphereGeometry(0.22, 10, 10);
    tankGeo.scale(0.8, 0.85, 1.4);
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 0.72, 0.15);
    bike.add(tank);

    // Chrome Engine Block
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.38), chromeMat);
    engine.position.set(0, 0.42, 0.05);
    bike.add(engine);

    // Curved Chrome Exhaust Pipe
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8), chromeMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(0.16, 0.24, -0.45);
    bike.add(exhaust);

    // Split Leather Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.65), rubberMat);
    seat.position.set(0, 0.68, -0.32);
    bike.add(seat);

    // Front & Rear Spoked Wheels
    [0.72, -0.72].forEach((wz) => {
      const wheel = createWheel(0.32, 0.12);
      wheel.position.set(0, 0.32, wz);
      bike.add(wheel);
    });

    roadGroup.add(bike);
  };

  // ==========================================
  // Place Vehicles in Authentic Locality Context
  // ==========================================
  // Near Sana's Residence:
  createSUV(-24.5, -4.5, Math.PI / 2, 0x1f2937, "thar-sana"); // Rugged Black Thar
  createScooter(-16.0, -5.2, 0.4, 0x06b6d4); // Teal Activa Scooter

  // Near Shiva Temple Plaza:
  createSedan(8.5, -18.5, 0, 0xe2e8f0, "sedan-shiva"); // Silver Metallic Sedan
  createScooter(12.5, -18.5, 0.2, 0xfacc15); // Yellow Vespa

  // Near Hanuman Mandir Plaza:
  createBulletBike(-8.5, -18.0, -0.35); // Classic Black Royal Enfield Bullet

  // Commercial & Shopping Lane:
  createSUV(18.5, 4.5, Math.PI / 2, 0xf8fafc, "suv-market"); // Pearl White SUV
  createScooter(28.0, 3.8, 1.2, 0xef4444); // Red Scooter near Station C

  scene.add(roadGroup);
  return { roadGroup, vehicleColliders };
}

