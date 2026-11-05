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

  // Reusable Shared Materials & Geometries
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.8 });
  const lanternGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.6,
    roughness: 0.1,
  });
  const clayMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const flameGlowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 });
  const fairyColors = [0xf59e0b, 0xec4899, 0x10b981, 0x06b6d4, 0xf43f5e, 0xfef08a];
  const sharedFairyMats = fairyColors.map((c) => new THREE.MeshBasicMaterial({ color: c }));

  const sharedPoleGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.2, 6);
  const sharedBaseGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.5, 6);
  const sharedHousingGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.65, 6);
  const sharedCapGeo = new THREE.ConeGeometry(0.42, 0.35, 6);
  const sharedDiyaBowlGeo = new THREE.CylinderGeometry(0.35, 0.15, 0.18, 8);
  const sharedDiyaFlameGeo = new THREE.ConeGeometry(0.12, 0.35, 6);
  const sharedBulbGeo = new THREE.SphereGeometry(0.11, 4, 4);

  // 1. Ornate Diwali Swagat Kaman (Gateway) across Dattawadi Main Road
  const gatewayGroup = new THREE.Group();
  gatewayGroup.position.set(-36, 0, 0);

  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.5 });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
  });

  // Left & Right Ornate Pillars
  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.0, 1.0), pillarMat);
  leftPillar.position.set(0, 3.5, -4.8);
  gatewayGroup.add(leftPillar);

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.0, 1.0), pillarMat);
  rightPillar.position.set(0, 3.5, 4.8);
  gatewayGroup.add(rightPillar);

  // Arch Beam spanning across the street
  const archBeam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 10.6), goldMat);
  archBeam.position.set(0, 6.8, 0);
  gatewayGroup.add(archBeam);

  // Crown Pediment
  const crownMesh = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.2, 4), goldMat);
  crownMesh.position.set(0, 8.4, 0);
  crownMesh.rotation.y = Math.PI / 4;
  gatewayGroup.add(crownMesh);

  // Auspicious Signboard ("SHUBH DEEPAWALI SANA ❤️")
  const signMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.0, 8.2),
    new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.6,
    })
  );
  signMesh.position.set(0, 5.6, 0);
  gatewayGroup.add(signMesh);

  // Gateway illumination light
  const gatewayLight = new THREE.PointLight(0xf59e0b, 2.8, 16.0, 1.3);
  gatewayLight.position.set(0, 7.0, 0);
  gatewayGroup.add(gatewayLight);

  decorationsGroup.add(gatewayGroup);

  // 2. Ornate Indian Street Lamps along Dattawadi Main Road and Hanuman Chowk
  const streetLampPositions = [
    { x: -30, z: 4.8 },
    { x: -16, z: 4.8 },
    { x: 0, z: 4.8 },
    { x: 16, z: 4.8 },
    { x: 30, z: 4.8 },
    { x: 44, z: 4.8 },

    { x: -30, z: -4.8 },
    { x: -16, z: -4.8 },
    { x: 16, z: -4.8 },
    { x: 30, z: -4.8 },
    { x: 44, z: -4.8 },

    // Hanuman Mandir lane
    { x: 4.0, z: -15 },
    { x: 4.0, z: -32 },
    { x: -4.0, z: -15 },
    { x: -4.0, z: -32 },
  ];

  streetLampPositions.forEach((pos) => {
    const lampG = new THREE.Group();
    lampG.position.set(pos.x, 0, pos.z);

    // Lamp Post Pole
    const pole = new THREE.Mesh(sharedPoleGeo, poleMat);
    pole.position.y = 2.1;
    lampG.add(pole);

    // Ornate Base
    const base = new THREE.Mesh(sharedBaseGeo, poleMat);
    base.position.y = 0.25;
    lampG.add(base);

    // Glowing Lantern Housing
    const housing = new THREE.Mesh(sharedHousingGeo, lanternGlassMat);
    housing.position.y = 4.3;
    lampG.add(housing);

    // Lamp Cap
    const cap = new THREE.Mesh(sharedCapGeo, poleMat);
    cap.position.y = 4.8;
    lampG.add(cap);

    decorationsGroup.add(lampG);
  });

  // Key Area PointLights (High efficiency, wide coverage)
  const streetLightPositions = [
    { x: -20, y: 5.5, z: 0, range: 22, intensity: 2.6 },
    { x: 14, y: 5.5, z: 0, range: 22, intensity: 2.6 },
    { x: 0, y: 6.0, z: -22, range: 24, intensity: 3.0 },
  ];

  streetLightPositions.forEach((lp) => {
    const sLight = new THREE.PointLight(0xf59e0b, lp.intensity, lp.range, 1.4);
    sLight.position.set(lp.x, lp.y, lp.z);
    decorationsGroup.add(sLight);
  });

  // 3. Physical 3D Clay Diyas along the Streets
  const diyaPositions = [
    // Station A main cluster
    { x: -2, z: 8, isStation: true },
    { x: 0, z: 8, isStation: true },
    { x: 2, z: 8, isStation: true },
    { x: -1, z: 9.5, isStation: true },
    { x: 1, z: 9.5, isStation: true },

    // Road curbs & steps
    { x: -22, z: 4.2 },
    { x: -12, z: 4.2 },
    { x: 8, z: 4.2 },
    { x: 22, z: 4.2 },
    { x: 38, z: 4.2 },
    { x: -22, z: -4.2 },
    { x: -12, z: -4.2 },
    { x: 8, z: -4.2 },
    { x: 22, z: -4.2 },
    { x: 38, z: -4.2 },

    // Hanuman Chowk perimeter
    { x: 3.2, z: -8 },
    { x: 3.2, z: -18 },
    { x: 3.2, z: -28 },
    { x: -3.2, z: -8 },
    { x: -3.2, z: -18 },
    { x: -3.2, z: -28 },
  ];

  // Dedicated light for Station A diya cluster
  const stationADiyaLight = new THREE.PointLight(0xf59e0b, 2.5, 12.0, 1.3);
  stationADiyaLight.position.set(0, 1.2, 8.5);
  decorationsGroup.add(stationADiyaLight);

  diyaPositions.forEach((pos, idx) => {
    const diyaG = new THREE.Group();
    diyaG.position.set(pos.x, 0.15, pos.z);

    const bowlMesh = new THREE.Mesh(sharedDiyaBowlGeo, clayMat);
    bowlMesh.position.y = 0.09;
    diyaG.add(bowlMesh);

    const flameMesh = new THREE.Mesh(sharedDiyaFlameGeo, flameMat);
    flameMesh.position.y = 0.36;
    diyaG.add(flameMesh);

    // Glowing halo mesh
    const glowHalo = new THREE.Mesh(sharedBulbGeo, flameGlowMat);
    glowHalo.position.y = 0.36;
    glowHalo.scale.set(1.5, 1.8, 1.5);
    diyaG.add(glowHalo);

    decorationsGroup.add(diyaG);
    diyas.push({
      group: diyaG,
      light: stationADiyaLight,
      isLit: true,
      stationId: pos.isStation ? `diya-${idx}` : undefined,
    });
  });

  // 4. Multi-color Fairy Lights Crossing Across Dattawadi Main Road
  const wireXPositions = [-28, -18, -8, 6, 18, 28, 42];

  wireXPositions.forEach((wireX) => {
    const wireY = 6.2;
    const bulbCount = 14;

    for (let b = 0; b < bulbCount; b++) {
      const zProgress = (b / (bulbCount - 1)) * 13 - 6.5;
      const sag = Math.sin((b / (bulbCount - 1)) * Math.PI) * 1.1;

      const bulbMat = sharedFairyMats[b % sharedFairyMats.length];
      const bulbMesh = new THREE.Mesh(sharedBulbGeo, bulbMat);
      bulbMesh.position.set(wireX, wireY - sag, zProgress);
      decorationsGroup.add(bulbMesh);
    }
  });

  // 5. Akash Kandils (Sky Lanterns) Floating in the Night Sky
  const lanternPositions = [
    { x: -18, y: 8.5, z: 2 },
    { x: -6, y: 9.5, z: -3 },
    { x: 8, y: 10.0, z: 3 },
    { x: 22, y: 9.2, z: -2 },
    { x: 0, y: 12.0, z: -18 },
    { x: -14, y: 13.5, z: -25 },
    { x: 18, y: 14.5, z: 12 },
    { x: 35, y: 11.5, z: 5 },
  ];

  const sharedOcta = new THREE.OctahedronGeometry(0.85, 0);
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf97316,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  lanternPositions.forEach((lPos) => {
    const lGroup = new THREE.Group();
    lGroup.position.set(lPos.x, lPos.y, lPos.z);

    const body = new THREE.Mesh(sharedOcta, lanternMat);
    lGroup.add(body);

    decorationsGroup.add(lGroup);
    floatingLanterns.push(lGroup);
  });

  // 6. Floating Golden Firefly / Dust Particles drifting through the streets
  const particleCount = 140;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let p = 0; p < particleCount; p++) {
    particlePositions[p * 3] = (Math.random() - 0.5) * 80;
    particlePositions[p * 3 + 1] = Math.random() * 8 + 0.5;
    particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 70;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xfde047,
    size: 0.35,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const floatingParticles = new THREE.Points(particleGeo, particleMat);
  decorationsGroup.add(floatingParticles);

  // 7. Rich Deep Burgundy / Midnight Navy Sky Dome
  const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(160, 32, 16),
    new THREE.MeshBasicMaterial({
      color: 0x090b1e, // Deep festive indigo
      side: THREE.BackSide,
    })
  );
  decorationsGroup.add(skyMesh);

  // Twinkling Starfield
  const starCount = 400;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let s = 0; s < starCount; s++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * (Math.PI / 2.2);
    const r = 155;
    starPositions[s * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[s * 3 + 1] = r * Math.cos(phi) + 10;
    starPositions[s * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starPoints = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.3,
      transparent: true,
      opacity: 0.9,
    })
  );
  decorationsGroup.add(starPoints);

  // Soft Glowing Crescent Moon
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.8, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  moonMesh.position.set(75, 80, -85);
  decorationsGroup.add(moonMesh);

  scene.add(decorationsGroup);

  const updateDecorations = (time: number) => {
    diyas.forEach((d, i) => {
      d.light.intensity = 1.8 + Math.sin(time * 8 + i * 2.3) * 0.4 + Math.cos(time * 12 + i) * 0.15;
    });

    floatingLanterns.forEach((l, i) => {
      l.position.y += Math.sin(time * 1.5 + i) * 0.007;
      l.rotation.y = time * 0.35 + i;
    });

    // Animate golden firefly particles drifting smoothly with 0 GPU buffer stalls
    floatingParticles.rotation.y = time * 0.02;
    floatingParticles.position.y = Math.sin(time * 0.8) * 0.35;
  };

  return {
    decorationsGroup,
    diyas,
    floatingLanterns,
    updateDecorations,
  };
}
