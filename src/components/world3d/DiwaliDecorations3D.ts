import * as THREE from "three";

export interface DiyaObject {
  group: THREE.Group;
  light: THREE.PointLight;
  isLit: boolean;
  stationId?: string;
}

export function createDiwaliDecorations(scene: THREE.Scene): {
  decorationsGroup: THREE.Group;
  diyas: DiyaObject[];
  floatingLanterns: THREE.Group[];
  updateDecorations: (time: number) => void;
} {
  const decorationsGroup = new THREE.Group();
  decorationsGroup.name = "diwaliDecorationsGroup";

  const diyas: DiyaObject[] = [];
  const floatingLanterns: THREE.Group[] = [];

  // 1. Grand Diwali Gateway (Swagat Kaman) at Western entrance of Dattawadi Main Road
  const gatewayGroup = new THREE.Group();
  gatewayGroup.position.set(-35, 0, 0);

  // Pillars
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
  const pillarGeo = new THREE.BoxGeometry(0.8, 6.5, 0.8);
  const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
  leftPillar.position.set(0, 3.25, -4.5);
  gatewayGroup.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
  rightPillar.position.set(0, 3.25, 4.5);
  gatewayGroup.add(rightPillar);

  // Arch Beam
  const beamMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
  });
  const archGeo = new THREE.BoxGeometry(1.2, 1.2, 10);
  const archBeam = new THREE.Mesh(archGeo, beamMat);
  archBeam.position.set(0, 6.2, 0);
  gatewayGroup.add(archBeam);

  // Crown Pediment & Toran
  const crownGeo = new THREE.ConeGeometry(1.5, 1.8, 4);
  const crownMesh = new THREE.Mesh(crownGeo, beamMat);
  crownMesh.position.set(0, 7.6, 0);
  crownMesh.rotation.y = Math.PI / 4;
  gatewayGroup.add(crownMesh);

  // Welcome Arch Signboard ("SHUBH DEEPAWALI SANA ❤️")
  const signGeo = new THREE.BoxGeometry(0.2, 0.9, 7.5);
  const signMat = new THREE.MeshStandardMaterial({
    color: 0x7f1d1d,
    emissive: 0x991b1b,
    emissiveIntensity: 0.5,
  });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 5.2, 0);
  gatewayGroup.add(signMesh);

  decorationsGroup.add(gatewayGroup);

  // 2. Physical 3D Clay Diyas along the Streets
  const diyaPositions = [
    // Station A main cluster
    { x: -2, z: 8, isStation: true },
    { x: 0, z: 8, isStation: true },
    { x: 2, z: 8, isStation: true },
    { x: -1, z: 9.5, isStation: true },
    { x: 1, z: 9.5, isStation: true },

    // Dattawadi Main Road curbs
    { x: -20, z: 4.2 },
    { x: -10, z: 4.2 },
    { x: 10, z: 4.2 },
    { x: 20, z: 4.2 },
    { x: 35, z: 4.2 },
    { x: -20, z: -4.2 },
    { x: -10, z: -4.2 },
    { x: 10, z: -4.2 },
    { x: 20, z: -4.2 },
    { x: 35, z: -4.2 },

    // Hanuman Mandir lane
    { x: 3.5, z: -10 },
    { x: 3.5, z: -20 },
    { x: 3.5, z: -30 },
    { x: -3.5, z: -10 },
    { x: -3.5, z: -20 },
    { x: -3.5, z: -30 },
  ];

  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Terracotta clay
    roughness: 0.8,
  });

  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });

  diyaPositions.forEach((pos, idx) => {
    const diyaG = new THREE.Group();
    diyaG.position.set(pos.x, 0.15, pos.z);

    // Clay Bowl (Semi-ellipsoid)
    const bowlGeo = new THREE.CylinderGeometry(0.35, 0.15, 0.18, 12);
    const bowlMesh = new THREE.Mesh(bowlGeo, terracottaMat);
    bowlMesh.position.y = 0.09;
    diyaG.add(bowlMesh);

    // Golden Oil / Ghee layer
    const oilGeo = new THREE.CircleGeometry(0.32, 12);
    const oilMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });
    const oilMesh = new THREE.Mesh(oilGeo, oilMat);
    oilMesh.rotation.x = -Math.PI / 2;
    oilMesh.position.y = 0.18;
    diyaG.add(oilMesh);

    // Teardrop Flame Mesh
    const flameGeo = new THREE.ConeGeometry(0.12, 0.35, 8);
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 0.36;
    diyaG.add(flameMesh);

    // Real Three.js PointLight casting warm illumination on ground and walls
    const light = new THREE.PointLight(0xf59e0b, 1.8, 6.5, 1.5);
    light.position.set(0, 0.45, 0);
    diyaG.add(light);

    decorationsGroup.add(diyaG);
    diyas.push({
      group: diyaG,
      light,
      isLit: true,
      stationId: pos.isStation ? `diya-${idx}` : undefined,
    });
  });

  // 3. Fairy Lights Strung Between Buildings across Dattawadi Main Road
  const fairyColors = [0xf59e0b, 0xec4899, 0x10b981, 0x06b6d4, 0xf43f5e, 0x8b5cf6];
  const wireZPositions = [-25, -15, -5, 5, 15, 25, 40];

  wireZPositions.forEach((wireX) => {
    const wireY = 5.8;
    const bulbCount = 14;

    for (let b = 0; b < bulbCount; b++) {
      const zProgress = (b / (bulbCount - 1)) * 12 - 6;
      // Parabolic catenary sag in wire
      const sag = Math.sin((b / (bulbCount - 1)) * Math.PI) * 0.9;

      const bulbColor = fairyColors[b % fairyColors.length];
      const bulbGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor });
      const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
      bulbMesh.position.set(wireX, wireY - sag, zProgress);
      decorationsGroup.add(bulbMesh);
    }
  });

  // 4. Akash Kandils (Traditional Indian Sky Lanterns) Floating Gently
  const lanternPositions = [
    { x: -18, y: 7.5, z: 2 },
    { x: -5, y: 8.5, z: -3 },
    { x: 8, y: 9.0, z: 3 },
    { x: 22, y: 8.0, z: -2 },
    { x: 0, y: 11.0, z: -18 },
    { x: -15, y: 12.0, z: -25 },
    { x: 18, y: 13.5, z: 12 },
  ];

  lanternPositions.forEach((lPos) => {
    const lGroup = new THREE.Group();
    lGroup.position.set(lPos.x, lPos.y, lPos.z);

    // Faceted Octagonal Lantern Core (Emissive Golden/Crimson)
    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf97316,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    lGroup.add(coreMesh);

    // Hanging Colorful Paper Streamers
    const streamerGeo = new THREE.ConeGeometry(0.15, 0.9, 4);
    const streamerMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    [-0.3, 0, 0.3].forEach((offX) => {
      const streamer = new THREE.Mesh(streamerGeo, streamerMat);
      streamer.position.set(offX, -0.9, 0);
      lGroup.add(streamer);
    });

    // Lantern Glow PointLight
    const lLight = new THREE.PointLight(0xf59e0b, 1.2, 8);
    lLight.position.set(0, 0, 0);
    lGroup.add(lLight);

    decorationsGroup.add(lGroup);
    floatingLanterns.push(lGroup);
  });

  // 5. Deep Maroon / Midnight Navy Atmospheric Sky Dome
  const skyGeo = new THREE.SphereGeometry(150, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({
    color: 0x060818, // Deep midnight indigo
    side: THREE.BackSide,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  decorationsGroup.add(skyDome);

  // Twinkling Starfield in Sky
  const starGeo = new THREE.BufferGeometry();
  const starCount = 350;
  const starPositions = new Float32Array(starCount * 3);
  for (let s = 0; s < starCount; s++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * (Math.PI / 2.2); // upper hemisphere
    const r = 145;
    starPositions[s * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[s * 3 + 1] = r * Math.cos(phi) + 10;
    starPositions[s * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    transparent: true,
    opacity: 0.85,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  decorationsGroup.add(starPoints);

  // Soft Crescent Moon
  const moonGeo = new THREE.SphereGeometry(4.5, 24, 24);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(70, 75, -80);
  decorationsGroup.add(moonMesh);

  scene.add(decorationsGroup);

  // Dynamic animation update (floating lanterns bobbing, diyas flickering)
  const updateDecorations = (time: number) => {
    // Flicker diyas subtly
    diyas.forEach((d, i) => {
      const flicker = 1.6 + Math.sin(time * 8 + i * 2.3) * 0.35 + Math.cos(time * 12 + i) * 0.15;
      d.light.intensity = flicker;
    });

    // Bob floating sky lanterns gently
    floatingLanterns.forEach((l, i) => {
      l.position.y += Math.sin(time * 1.5 + i) * 0.006;
      l.rotation.y = time * 0.3 + i;
    });
  };

  return {
    decorationsGroup,
    diyas,
    floatingLanterns,
    updateDecorations,
  };
}

