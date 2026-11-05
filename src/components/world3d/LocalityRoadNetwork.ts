import * as THREE from "three";
import { LOCALITY_ROADS, RoadSegment } from "./LocalityData";

export function createLocalityRoadNetwork(scene: THREE.Scene): THREE.Group {
  const roadGroup = new THREE.Group();
  roadGroup.name = "roadNetworkGroup";

  // 1. Overall Ground Terrain (warm midnight dark asphalt/earth)
  const terrainGeo = new THREE.PlaneGeometry(240, 240);
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

  scene.add(roadGroup);
  return roadGroup;
}
