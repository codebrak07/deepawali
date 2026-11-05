import * as THREE from "three";
import { INTERACTIVE_STATIONS, StationLocation } from "./LocalityData";

export interface Station3DObjects {
  group: THREE.Group;
  stationA_Diyas: THREE.Group[];
  stationA_Lights: THREE.PointLight[];
  stationB_RangoliMesh: THREE.Mesh;
  stationB_RangoliMaterial: THREE.MeshBasicMaterial;
  stationC_LanternMesh: THREE.Group;
  stationC_LanternLight: THREE.PointLight;
  stationMarkers: { id: string; marker: THREE.Group; position: THREE.Vector3 }[];
  updateStations: (time: number, rangoliProgress: number, lanternRising: boolean) => void;
}

export function createInteractiveStations(scene: THREE.Scene): Station3DObjects {
  const group = new THREE.Group();
  group.name = "interactiveStationsGroup";

  const stationMarkers: { id: string; marker: THREE.Group; position: THREE.Vector3 }[] = [];

  // ==========================================
  // STATION A: Physical Diyas Cluster (0, 8)
  // ==========================================
  const stationA_Diyas: THREE.Group[] = [];
  const stationA_Lights: THREE.PointLight[] = [];

  const diyaClusterPos = [
    { x: -1.2, z: 7.5 },
    { x: 0, z: 8.5 },
    { x: 1.2, z: 7.5 },
    { x: -0.6, z: 9.2 },
    { x: 0.6, z: 9.2 },
  ];

  const clayMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

  diyaClusterPos.forEach((p) => {
    const dGroup = new THREE.Group();
    dGroup.position.set(p.x, 0.08, p.z);

    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.18, 12), clayMat);
    bowl.position.y = 0.09;
    dGroup.add(bowl);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), flameMat);
    flame.position.y = 0.32;
    dGroup.add(flame);

    const pLight = new THREE.PointLight(0xf59e0b, 2.0, 7.5, 1.2);
    pLight.position.set(0, 0.45, 0);
    dGroup.add(pLight);

    group.add(dGroup);
    stationA_Diyas.push(dGroup);
    stationA_Lights.push(pLight);
  });

  // ==========================================
  // STATION B: 3D Rangoli on Street (0, -24)
  // ==========================================
  // In Hanuman Mandir Chowk: A circular floral mandala on the street that reveals progressively
  const rangoliSize = 7.0;
  const rangoliGeo = new THREE.PlaneGeometry(rangoliSize, rangoliSize);

  // Procedural Canvas Texture for High-Def Indian Rangoli Mandala
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    // Outer Petal Ring
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Outer Petals (Turmeric & Vermilion)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? "#EF4444" : "#F59E0B";
      ctx.beginPath();
      ctx.ellipse(0, -170, 32, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Inner Lotus Petals (Peacock Blue & Lotus Pink)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = i % 2 === 0 ? "#06B6D4" : "#EC4899";
      ctx.beginPath();
      ctx.ellipse(0, -90, 24, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Center Sacred Floral Bindu
    ctx.fillStyle = "#FEF08A";
    ctx.beginPath();
    ctx.arc(cx, cy, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#B91C1C";
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  const rangoliTexture = new THREE.CanvasTexture(canvas);
  const stationB_RangoliMaterial = new THREE.MeshBasicMaterial({
    map: rangoliTexture,
    transparent: true,
    opacity: 0.35, // Initial partially drawn state
    depthWrite: false,
  });

  const stationB_RangoliMesh = new THREE.Mesh(rangoliGeo, stationB_RangoliMaterial);
  stationB_RangoliMesh.rotation.x = -Math.PI / 2;
  stationB_RangoliMesh.position.set(0, 0.03, -24);
  group.add(stationB_RangoliMesh);

  // ==========================================
  // STATION C: Akash Kandil Launch Pad (30, 0)
  // ==========================================
  const stationC_LanternMesh = new THREE.Group();
  stationC_LanternMesh.position.set(30, 1.2, 0);

  // Star Akash Kandil Mesh
  const starGeo = new THREE.OctahedronGeometry(1.0, 0);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf97316,
    emissiveIntensity: 0.95,
  });
  const starBody = new THREE.Mesh(starGeo, starMat);
  stationC_LanternMesh.add(starBody);

  // Hanging Streamers
  const streamerGeo = new THREE.ConeGeometry(0.18, 1.2, 4);
  const streamerMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
  [-0.35, 0, 0.35].forEach((sx) => {
    const s = new THREE.Mesh(streamerGeo, streamerMat);
    s.position.set(sx, -1.1, 0);
    stationC_LanternMesh.add(s);
  });

  const stationC_LanternLight = new THREE.PointLight(0xf59e0b, 2.5, 12);
  stationC_LanternLight.position.set(0, 0, 0);
  stationC_LanternMesh.add(stationC_LanternLight);

  group.add(stationC_LanternMesh);

  // ==========================================
  // Station Beacon Markers & Floating Rings
  // ==========================================
  INTERACTIVE_STATIONS.forEach((st: StationLocation) => {
    const marker = new THREE.Group();
    marker.position.set(st.x, 0, st.z);

    // Glowing Ring on Ground
    const ringGeo = new THREE.RingGeometry(2.0, 2.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    marker.add(ring);

    // Floating Golden Diamond / Marker Beacon
    const beaconGeo = new THREE.OctahedronGeometry(0.35, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 2.4;
    marker.add(beacon);

    group.add(marker);
    stationMarkers.push({
      id: st.id,
      marker,
      position: new THREE.Vector3(st.x, 0, st.z),
    });
  });

  scene.add(group);

  let lanternRiseY = 1.2;

  const updateStations = (time: number, rangoliProgress: number, lanternRising: boolean) => {
    // 1. Station A Diyas Subtle Flicker
    stationA_Lights.forEach((l, i) => {
      l.intensity = 1.8 + Math.sin(time * 6 + i * 2) * 0.4;
    });

    // 2. Station B Rangoli Opacity and Scale reflecting user input progress (0 to 1)
    stationB_RangoliMaterial.opacity = 0.35 + (rangoliProgress * 0.65);
    const rangoliScale = 0.85 + (rangoliProgress * 0.15);
    stationB_RangoliMesh.scale.set(rangoliScale, rangoliScale, rangoliScale);

    // 3. Station C Akash Kandil Launch Ascent
    if (lanternRising) {
      lanternRiseY += 0.08;
      stationC_LanternMesh.position.y = lanternRiseY;
      stationC_LanternMesh.position.x += Math.sin(time * 1.5) * 0.03;
      stationC_LanternMesh.position.z += Math.cos(time * 1.5) * 0.03;
      stationC_LanternMesh.rotation.y = time * 0.8;
    } else {
      lanternRiseY = 1.2;
      stationC_LanternMesh.position.y = 1.2 + Math.sin(time * 2) * 0.12;
      stationC_LanternMesh.rotation.y = time * 0.4;
    }

    // 4. Animate floating station beacon markers
    stationMarkers.forEach((sm, i) => {
      const beacon = sm.marker.children[1];
      if (beacon) {
        beacon.position.y = 2.4 + Math.sin(time * 3 + i) * 0.25;
        beacon.rotation.y = time * 1.5;
      }
    });
  };

  return {
    group,
    stationA_Diyas,
    stationA_Lights,
    stationB_RangoliMesh,
    stationB_RangoliMaterial,
    stationC_LanternMesh,
    stationC_LanternLight,
    stationMarkers,
    updateStations,
  };
}

