import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

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
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  occlusionMeshes: THREE.Mesh[];
  seatAnchors: SeatAnchor[];
  // Interactive TV
  toggleTV: (power?: boolean) => boolean;
  setTVChannel: (channelIndex: number) => void;
  isTVOn: () => boolean;
  getTVChannelName: () => string;
  // Interactive Lighting
  toggleLamps: () => boolean;
  // Animation update
  updateAnimation: (time: number) => void;
}

export function createSanaHomeInterior(): InteriorSceneObjects {
  const group = new THREE.Group();
  group.name = "sanaHomeInteriorGroup";

  // Position of Sana's Home Interior: centered at (-20, 0.05, -14)
  const cx = -20;
  const cz = -14;
  const width = 20.0; // Spacious 20m width
  const depth = 16.0; // Spacious 16m depth
  const height = 4.4; // Generous 4.4m high ceiling clearance

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
  const seatAnchors: SeatAnchor[] = [];

  // ==========================================
  // 1. Italian Calacatta Marble Vitrified Floor & Cove Ceiling
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
    color: 0xfef3c7, // Warm ivory sandstone
    roughness: 0.7,
    transparent: true,
    opacity: 1.0,
  });

  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0x881337, // Royal Burgundy / Crimson accent wall behind TV
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

  // South Wall (Double doorway opening in center, 2.8m wide)
  const doorSpan = 2.8;
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
  urli.position.set(cx - 1.8, 0.1, bounds.maxZ - 1.2);
  group.add(urli);

  // ==========================================
  // 3. Spacious Luxury Living Room (West & Central Wing)
  // ==========================================
  const livingCx = cx - 3.8;
  const livingCz = cz;

  // Large Hand-knotted Kashmiri Carpet (6.5m × 5.0m)
  const rugMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 5.0),
    new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.8 })
  );
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(livingCx, 0.07, livingCz);
  group.add(rugMesh);

  // Luxurious L-shaped Emerald Velvet Sectional Sofa
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.65 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 }); // Golden silk cushions

  // Main 4-seater Section (Facing North towards TV)
  const mainSofa = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.55, 1.2), sofaMat);
  mainSofa.position.set(livingCx, 0.45, livingCz - 1.4);
  group.add(mainSofa);

  const mainSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.85, 0.35), sofaMat);
  mainSofaBack.position.set(livingCx, 0.95, livingCz - 1.85);
  group.add(mainSofaBack);

  // Return Chaise Section (L-Shape on left)
  const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.55, 2.4), sofaMat);
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
    minX: livingCx - 2.6,
    maxX: livingCx + 2.6,
    minZ: livingCz - 2.2,
    maxZ: livingCz - 0.7,
  });
  furnitureColliders.push({
    id: "furn-sofa-chaise",
    minX: livingCx - 2.6,
    maxX: livingCx - 1.0,
    minZ: livingCz - 0.7,
    maxZ: livingCz + 1.2,
  });

  // Seat Anchor: Sofa Center (Watching TV)
  seatAnchors.push({
    id: "seat-sofa-center",
    label: "Sofa (Center)",
    position: new THREE.Vector3(livingCx, 0, livingCz - 1.3),
    rotationY: 0, // Facing North towards TV
    sitHeight: 0.52,
    cameraOffset: new THREE.Vector3(0, 1.8, -4.2),
    cameraLookAt: new THREE.Vector3(livingCx, 1.6, bounds.minZ + 0.2),
  });

  // Seat Anchor: Sofa Chaise (Relaxed view)
  seatAnchors.push({
    id: "seat-sofa-chaise",
    label: "Sofa (Chaise Lounge)",
    position: new THREE.Vector3(livingCx - 1.8, 0, livingCz - 0.2),
    rotationY: Math.PI / 2, // Facing East toward living room
    sitHeight: 0.52,
    cameraOffset: new THREE.Vector3(-3.2, 1.8, 0),
    cameraLookAt: new THREE.Vector3(livingCx + 1.0, 1.4, livingCz),
  });

  // Designer Accent Armchair in Amber Bouclé
  const armchairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
  const armchair = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.52, 1.1), armchairMat);
  armchair.position.set(livingCx + 2.2, 0.45, livingCz + 0.4);
  armchair.rotation.y = -Math.PI / 4;
  group.add(armchair);

  const armchairBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.25), armchairMat);
  armchairBack.position.set(livingCx + 2.5, 0.9, livingCz + 0.7);
  armchairBack.rotation.y = -Math.PI / 4;
  group.add(armchairBack);

  seatAnchors.push({
    id: "seat-armchair",
    label: "Bouclé Armchair",
    position: new THREE.Vector3(livingCx + 2.2, 0, livingCz + 0.4),
    rotationY: -Math.PI * 0.75, // Facing center of living room & TV
    sitHeight: 0.52,
    cameraOffset: new THREE.Vector3(3.0, 1.6, 2.5),
    cameraLookAt: new THREE.Vector3(livingCx, 1.5, livingCz),
  });

  furnitureColliders.push({
    id: "furn-armchair",
    minX: livingCx + 1.6,
    maxX: livingCx + 3.0,
    minZ: livingCz - 0.2,
    maxZ: livingCz + 1.2,
  });

  // Center Teak & White Marble Coffee Table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
  const marbleTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.08, 1.3),
    new THREE.MeshStandardMaterial({ color: 0xfdfaf6, roughness: 0.2, metalness: 0.1 })
  );
  marbleTop.position.set(livingCx + 0.3, 0.48, livingCz);
  group.add(marbleTop);

  // Table Legs
  [
    { x: -1.0, z: -0.5 },
    { x: 1.0, z: -0.5 },
    { x: -1.0, z: 0.5 },
    { x: 1.0, z: 0.5 },
  ].forEach((lp) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.44, 8), tableMat);
    leg.position.set(livingCx + 0.3 + lp.x, 0.24, livingCz + lp.z);
    group.add(leg);
  });

  // Brass Puja Thali with Kaju Katli & Scented Candle on table
  const thali = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.32, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
  );
  thali.position.set(livingCx + 0.3, 0.54, livingCz);
  group.add(thali);

  furnitureColliders.push({
    id: "furn-coffee-table",
    minX: livingCx + 0.3 - 1.3,
    maxX: livingCx + 0.3 + 1.3,
    minZ: livingCz - 0.75,
    maxZ: livingCz + 0.75,
  });

  // ==========================================
  // 4. Interactive 85" Smart OLED TV & Procedural Display Canvas
  // ==========================================
  const tvConsole = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.48, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
  );
  tvConsole.position.set(livingCx, 0.28, bounds.minZ + 0.38);
  group.add(tvConsole);

  // Procedural Canvas for Animated TV Screen
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
    emissiveIntensity: 0.85,
  });

  const tvScreen = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.8, 0.06),
    tvScreenMat
  );
  tvScreen.position.set(livingCx, 1.95, bounds.minZ + 0.16);
  group.add(tvScreen);

  // Dynamic Backlight Ambient Glow around TV
  const tvGlow = new THREE.PointLight(0x38bdf8, 1.4, 6.0, 1.2);
  tvGlow.position.set(livingCx, 1.95, bounds.minZ + 0.4);
  group.add(tvGlow);

  furnitureColliders.push({
    id: "furn-tv-wall",
    minX: livingCx - 2.3,
    maxX: livingCx + 2.3,
    minZ: bounds.minZ,
    maxZ: bounds.minZ + 0.8,
  });

  // Relationship Memory Frames on Wall (11 Sep, 26 Sep & 4 Oct)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
  const picColors = [0xfbcfe8, 0xfde047, 0xfecdd3];

  [-2.6, 2.6, 3.8].forEach((xOff, idx) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.05, 0.05), frameMat);
    frame.position.set(livingCx + xOff, 2.0, bounds.minZ + 0.14);
    group.add(frame);

    const pic = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.92),
      new THREE.MeshBasicMaterial({ color: picColors[idx % 3] })
    );
    pic.position.set(livingCx + xOff, 2.0, bounds.minZ + 0.18);
    group.add(pic);
  });

  // TV Channel Channels state
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

    const channel = tvChannels[currentChannel];
    const w = 512;
    const h = 288;

    if (channel.id === "diwali") {
      // Midnight sky with animated fireworks
      tvCtx.fillStyle = "#090915";
      tvCtx.fillRect(0, 0, w, h);

      // Fireworks bursts
      const burstX = (Math.sin(time * 1.5) * 0.3 + 0.5) * w;
      const burstY = (Math.cos(time * 1.8) * 0.2 + 0.4) * h;
      for (let p = 0; p < 18; p++) {
        const angle = (p * Math.PI * 2) / 18;
        const dist = ((time * 80) % 70) + 10;
        tvCtx.fillStyle = p % 2 === 0 ? "#facc15" : "#f43f5e";
        tvCtx.beginPath();
        tvCtx.arc(burstX + Math.cos(angle) * dist, burstY + Math.sin(angle) * dist, 3, 0, Math.PI * 2);
        tvCtx.fill();
      }

      // Festive text
      tvCtx.fillStyle = "#fef08a";
      tvCtx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
      tvCtx.textAlign = "center";
      tvCtx.fillText("HAPPY DIWALI SHIRJANA ❤️", w / 2, h - 35);
      tvGlow.color.setHex(0xf59e0b);
      tvGlow.intensity = 1.4 + Math.sin(time * 6) * 0.3;
    } else if (channel.id === "pune") {
      // Sunrise gradient
      const grad = tvCtx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(0.5, "#fdba74");
      grad.addColorStop(1, "#1e293b");
      tvCtx.fillStyle = grad;
      tvCtx.fillRect(0, 0, w, h);

      // Sun
      tvCtx.fillStyle = "#fef08a";
      tvCtx.beginPath();
      tvCtx.arc(w / 2, h * 0.45, 38, 0, Math.PI * 2);
      tvCtx.fill();

      tvCtx.fillStyle = "#ffffff";
      tvCtx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      tvCtx.textAlign = "center";
      tvCtx.fillText("Dattawadi, Akurdi • Peaceful Morning", w / 2, h - 30);
      tvGlow.color.setHex(0x38bdf8);
      tvGlow.intensity = 1.2;
    } else if (channel.id === "memories") {
      // Romantic memory slide
      const bg = tvCtx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 260);
      bg.addColorStop(0, "#881337");
      bg.addColorStop(1, "#1c040d");
      tvCtx.fillStyle = bg;
      tvCtx.fillRect(0, 0, w, h);

      tvCtx.fillStyle = "#fbcfe8";
      tvCtx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
      tvCtx.textAlign = "center";
      tvCtx.fillText("Aalekh & Sana • Milestone Dates", w / 2, 60);

      tvCtx.font = "16px 'Plus Jakarta Sans', sans-serif";
      tvCtx.fillStyle = "#fef08a";
      tvCtx.fillText("11 Sep • The Beginning of Magic", w / 2, 115);
      tvCtx.fillText("26 Sep • Promises & Endless Laughter", w / 2, 155);
      tvCtx.fillText("4 Oct • In My Heart Forever", w / 2, 195);
      tvGlow.color.setHex(0xf43f5e);
      tvGlow.intensity = 1.3;
    } else {
      // Crackling hearth
      tvCtx.fillStyle = "#180a0a";
      tvCtx.fillRect(0, 0, w, h);
      const flameH = 40 + Math.sin(time * 10) * 15;
      const grad = tvCtx.createLinearGradient(w / 2, h, w / 2, h - flameH * 2);
      grad.addColorStop(0, "#ea580c");
      grad.addColorStop(0.5, "#facc15");
      grad.addColorStop(1, "transparent");
      tvCtx.fillStyle = grad;
      tvCtx.beginPath();
      tvCtx.ellipse(w / 2, h - 20, 90, flameH, 0, 0, Math.PI * 2);
      tvCtx.fill();

      tvCtx.fillStyle = "#fed7aa";
      tvCtx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      tvCtx.textAlign = "center";
      tvCtx.fillText("Warm Festive Hearth 🔥", w / 2, 60);
      tvGlow.color.setHex(0xea580c);
      tvGlow.intensity = 1.3 + Math.sin(time * 9) * 0.3;
    }

    tvTexture.needsUpdate = true;
  };

  const toggleTV = (power?: boolean): boolean => {
    tvPowerOn = power !== undefined ? power : !tvPowerOn;
    return tvPowerOn;
  };

  const setTVChannel = (idx: number) => {
    currentChannel = (idx + tvChannels.length) % tvChannels.length;
  };

  const isTVOn = () => tvPowerOn;
  const getTVChannelName = () => tvChannels[currentChannel].title;

  // ==========================================
  // 5. Sacred Pooja Room / Mandir Shrine
  // ==========================================
  const poojaCx = bounds.minX + 2.5;
  const poojaCz = bounds.minZ + 2.5;

  // Elevated White Makrana Marble Mandir Plinth
  const mandirPlinth = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.35, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  mandirPlinth.position.set(poojaCx, 0.18, poojaCz);
  group.add(mandirPlinth);

  // Carved Mandir Shikhara Dome / Canopy
  const mandirCanopy = new THREE.Mesh(
    new THREE.ConeGeometry(0.95, 1.3, 12),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 })
  );
  mandirCanopy.position.set(poojaCx, 2.3, poojaCz);
  group.add(mandirCanopy);

  // Mandir Marble Pillars
  [-0.95, 0.95].forEach((px) => {
    [-0.75, 0.75].forEach((pz) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      col.position.set(poojaCx + px, 1.15, poojaCz + pz);
      group.add(col);
    });
  });

  // Sacred Glowing Silver & Brass Diyas in Pooja
  const mandirLight = new THREE.PointLight(0xf59e0b, 2.6, 7.5, 1.2);
  mandirLight.position.set(poojaCx, 1.2, poojaCz);
  group.add(mandirLight);

  furnitureColliders.push({
    id: "furn-mandir",
    minX: poojaCx - 1.5,
    maxX: poojaCx + 1.5,
    minZ: poojaCz - 1.3,
    maxZ: poojaCz + 1.3,
  });

  // ==========================================
  // 6. Master Bedroom Suite (East Wing)
  // ==========================================
  const bedCx = cx + 5.2;
  const bedCz = cz - 2.0;

  // Architectural Partition Screen with Arched Jali Cutout
  const partition = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, height, 6.0),
    wallMat
  );
  partition.position.set(cx + 1.2, height / 2, cz - 2.8);
  group.add(partition);
  occlusionMeshes.push(partition);

  furnitureColliders.push({
    id: "furn-partition",
    minX: cx + 1.0,
    maxX: cx + 1.4,
    minZ: cz - 5.8,
    maxZ: cz + 0.2,
  });

  // King-Size Teak Bed with Embroidered Royal Crimson Duvet
  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.55, 3.8),
    new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.65 })
  );
  bedBase.position.set(bedCx, 0.38, bedCz);
  group.add(bedBase);

  // Tufted Velvet Headboard
  const headboard = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.7, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5 })
  );
  headboard.position.set(bedCx, 1.2, bounds.minZ + 0.2);
  group.add(headboard);

  // Pillows
  [-0.9, 0.9].forEach((px) => {
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.25, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    );
    pillow.position.set(bedCx + px, 0.78, bounds.minZ + 0.75);
    group.add(pillow);
  });

  // Bedside Tables with Warm Amber Lamps
  const bedroomLamps: THREE.PointLight[] = [];
  [-2.2, 2.2].forEach((sideX) => {
    const bTable = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.65, 0.65),
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

    const lampLight = new THREE.PointLight(0xfde68a, 1.4, 5.0);
    lampLight.position.set(bedCx + sideX, 1.1, bounds.minZ + 0.45);
    group.add(lampLight);
    bedroomLamps.push(lampLight);
  });

  // Seat Anchor: Sit on King Bed
  seatAnchors.push({
    id: "seat-bed",
    label: "Master Bed",
    position: new THREE.Vector3(bedCx, 0, bedCz + 1.2),
    rotationY: Math.PI, // Facing South towards room
    sitHeight: 0.58,
    cameraOffset: new THREE.Vector3(0, 1.8, 3.5),
    cameraLookAt: new THREE.Vector3(bedCx, 1.4, bedCz),
  });

  furnitureColliders.push({
    id: "furn-bed-suite",
    minX: bedCx - 2.8,
    maxX: bedCx + 2.8,
    minZ: bounds.minZ,
    maxZ: bedCz + 2.1,
  });

  // Wardrobe / Dressing Unit on East Wall
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 3.2, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 })
  );
  wardrobe.position.set(bounds.maxX - 0.5, 1.6, cz + 2.5);
  group.add(wardrobe);

  furnitureColliders.push({
    id: "furn-wardrobe",
    minX: bounds.maxX - 1.0,
    maxX: bounds.maxX,
    minZ: cz + 1.0,
    maxZ: cz + 4.0,
  });

  // ==========================================
  // 7. Modern Modular Kitchen & Dining Area (South-East Wing)
  // ==========================================
  const kitchenCx = cx + 5.5;

  // Quartz Countertop
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.9, 1.0),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
  );
  counter.position.set(kitchenCx, 0.45, bounds.maxZ - 1.8);
  group.add(counter);

  // Modern Double-Door Refrigerator
  const fridge = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.2, 1.0),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 })
  );
  fridge.position.set(bounds.maxX - 1.0, 1.1, bounds.maxZ - 1.8);
  group.add(fridge);

  furnitureColliders.push({
    id: "furn-kitchen-counter",
    minX: kitchenCx - 2.2,
    maxX: bounds.maxX,
    minZ: bounds.maxZ - 2.5,
    maxZ: bounds.maxZ,
  });

  // Dining Table with 4 Chairs
  const diningCx = cx - 0.8;
  const diningCz = cz + 3.8;

  const diningTable = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.08, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.35 })
  );
  diningTable.position.set(diningCx, 0.78, diningCz);
  group.add(diningTable);

  // Dining Chairs
  [-0.7, 0.7].forEach((dx) => {
    const chairN = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x064e3b })
    );
    chairN.position.set(diningCx + dx, 0.25, diningCz - 0.9);
    group.add(chairN);

    const chairS = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x064e3b })
    );
    chairS.position.set(diningCx + dx, 0.25, diningCz + 0.9);
    group.add(chairS);
  });

  seatAnchors.push({
    id: "seat-dining",
    label: "Dining Chair",
    position: new THREE.Vector3(diningCx - 0.7, 0, diningCz - 0.9),
    rotationY: 0,
    sitHeight: 0.5,
    cameraOffset: new THREE.Vector3(0, 1.6, -3.2),
    cameraLookAt: new THREE.Vector3(diningCx, 1.2, diningCz),
  });

  furnitureColliders.push({
    id: "furn-dining-table",
    minX: diningCx - 1.4,
    maxX: diningCx + 1.4,
    minZ: diningCz - 1.2,
    maxZ: diningCz + 1.2,
  });

  // ==========================================
  // 8. Scenic Balcony overlooking Dattawadi (West Facade)
  // ==========================================
  const balconyWidth = 6.0;
  const balconyDepth = 2.4;
  const balconyCx = bounds.minX - balconyDepth / 2;
  const balconyCz = cz - 1.5;

  const balconyFloor = new THREE.Mesh(
    new THREE.BoxGeometry(balconyDepth, 0.2, balconyWidth),
    new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.5 })
  );
  balconyFloor.position.set(balconyCx, 0.1, balconyCz);
  group.add(balconyFloor);

  // Glass Railing
  const glassRailing = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.1, balconyWidth),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 })
  );
  glassRailing.position.set(balconyCx - balconyDepth / 2, 0.65, balconyCz);
  group.add(glassRailing);

  furnitureColliders.push({
    id: "furn-balcony-rail",
    minX: balconyCx - balconyDepth / 2 - 0.2,
    maxX: balconyCx - balconyDepth / 2 + 0.2,
    minZ: balconyCz - balconyWidth / 2,
    maxZ: balconyCz + balconyWidth / 2,
  });

  // ==========================================
  // 9. Ambient & Chandelier Lighting
  // ==========================================
  // Modern Grand Ring Chandelier in Living Room
  const chandelier = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.05, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
  );
  chandelier.rotation.x = Math.PI / 2;
  chandelier.position.set(livingCx, height - 0.6, livingCz);
  group.add(chandelier);

  const mainRoomLight = new THREE.PointLight(0xfef3c7, 3.2, 20.0, 1.1);
  mainRoomLight.position.set(livingCx, height - 0.7, livingCz);
  mainRoomLight.castShadow = true;
  group.add(mainRoomLight);

  const bedroomCeilingLight = new THREE.PointLight(0xfde68a, 2.2, 16.0, 1.2);
  bedroomCeilingLight.position.set(bedCx, height - 0.8, bedCz);
  group.add(bedroomCeilingLight);

  // Soft overall ambient interior fill
  const interiorAmbient = new THREE.AmbientLight(0xffedd5, 1.3);
  group.add(interiorAmbient);

  let lampsOn = true;
  const toggleLamps = () => {
    lampsOn = !lampsOn;
    bedroomLamps.forEach((l) => (l.intensity = lampsOn ? 1.4 : 0.0));
    return lampsOn;
  };

  const updateAnimation = (time: number) => {
    drawTVScreen(time);
  };

  return {
    group,
    furnitureColliders,
    bounds,
    entranceDoorPos,
    streetExitPos,
    occlusionMeshes,
    seatAnchors,
    toggleTV,
    setTVChannel,
    isTVOn,
    getTVChannelName,
    toggleLamps,
    updateAnimation,
  };
}
