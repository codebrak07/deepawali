import * as THREE from "three";

export interface HaveliGateOptions {
  id: string;
  name: string;
  position: THREE.Vector3;
  rotationY: number;
  width?: number;       // default 2.6m
  height?: number;      // default 2.8m
  hasToran?: boolean;   // lush marigold flower & mango leaf garland
  hasBalconyDiyas?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface InteractiveHaveliGate {
  id: string;
  name: string;
  root: THREE.Group;
  position: THREE.Vector3;
  leftHinge: THREE.Group;
  rightHinge: THREE.Group;
  interiorLight: THREE.PointLight;
  isOpen: boolean;
  currentAngle: number;
  targetAngle: number;
  open: () => void;
  close: () => void;
  toggle: () => boolean;
  update: (delta: number, playerPos: THREE.Vector3) => void;
}

// Cached textures to share across all haveli gates and windows
let cachedJaliTexture: THREE.CanvasTexture | null = null;
let cachedHaveliDoorTexture: THREE.CanvasTexture | null = null;

/**
 * Procedurally generates an authentic Indian Jali (Latticework) Canvas Texture
 * with glowing geometric 8-fold star fretwork, exactly matching traditional Rajasthani / Mughal architecture.
 */
export function getJaliLatticeTexture(): THREE.CanvasTexture {
  if (cachedJaliTexture) return cachedJaliTexture;

  if (typeof document === "undefined") {
    // SSR safe fallback
    const dummyCanvas = { width: 1, height: 1 } as unknown as HTMLCanvasElement;
    return new THREE.CanvasTexture(dummyCanvas);
  }

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 1. Warm Golden Amber Glowing Interior Background
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
  bgGrad.addColorStop(0, "#FEF9C3"); // Radiant warm golden light center
  bgGrad.addColorStop(0.5, "#FDE047");
  bgGrad.addColorStop(0.85, "#F59E0B");
  bgGrad.addColorStop(1, "#D97706");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Intricate 8-Fold Star & Geometric Jali Fretwork Grid
  ctx.strokeStyle = "#451A03"; // Rich dark teak carved lattice
  ctx.fillStyle = "#271202";
  ctx.lineWidth = 6;

  const tileSize = 64;
  for (let y = 0; y < size; y += tileSize) {
    for (let x = 0; x < size; x += tileSize) {
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;
      const r = tileSize * 0.42;

      // Draw 8-pointed star rosette
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        const rad = i % 2 === 0 ? r : r * 0.45;
        const px = cx + Math.cos(angle) * rad;
        const py = cy + Math.sin(angle) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Diamond corner insets
      ctx.beginPath();
      ctx.rect(x + 2, y + 2, 8, 8);
      ctx.stroke();
    }
  }

  // 3. Ornate Outer Architrave Border
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#78350F";
  ctx.strokeRect(7, 7, size - 14, size - 14);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedJaliTexture = texture;
  return texture;
}

/**
 * Procedurally generates an Artisanal Antique Carved Indian Teak Haveli Door Texture
 * with rich vertical grain, floral panel carvings, iron banding, and golden brass studs.
 */
export function getHaveliDoorTexture(): THREE.CanvasTexture {
  if (cachedHaveliDoorTexture) return cachedHaveliDoorTexture;

  if (typeof document === "undefined") {
    const dummyCanvas = { width: 1, height: 1 } as unknown as HTMLCanvasElement;
    return new THREE.CanvasTexture(dummyCanvas);
  }

  const width = 512;
  const height = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // 1. Deep Antique Teak Wood Grain Background
  const woodGrad = ctx.createLinearGradient(0, 0, width, 0);
  woodGrad.addColorStop(0, "#291307");
  woodGrad.addColorStop(0.2, "#3E1E0B");
  woodGrad.addColorStop(0.5, "#2A1307");
  woodGrad.addColorStop(0.8, "#42200C");
  woodGrad.addColorStop(1, "#271105");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle wood planks vertical lines
  ctx.strokeStyle = "#1A0A03";
  ctx.lineWidth = 4;
  const plankW = width / 4;
  for (let p = 1; p < 4; p++) {
    ctx.beginPath();
    ctx.moveTo(p * plankW, 0);
    ctx.lineTo(p * plankW, height);
    ctx.stroke();
  }

  // 2. 6-Panel Carved Haveli Relief Framing
  const panelH = height / 4;
  for (let r = 0; r < 4; r++) {
    const py = r * panelH;
    // Outer panel border
    ctx.strokeStyle = "#5A280E";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, py + 20, width - 40, panelH - 40);

    // Inner relief groove
    ctx.strokeStyle = "#140601";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, py + 30, width - 60, panelH - 60);

    // Carved center floral rosette
    const cx = width / 2;
    const cy = py + panelH / 2;
    ctx.fillStyle = "#4E210A";
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#78350F";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // 3. Heavy Iron Strap Hinges & Reinforcement Bands
  [80, height / 2, height - 120].forEach((by) => {
    ctx.fillStyle = "#18181B"; // Wrought iron strap
    ctx.fillRect(0, by - 12, width, 24);
    ctx.strokeStyle = "#27272A";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, by - 12, width, 24);
  });

  // 4. Solid Brass Stud Bosses (Arranged in authentic grid)
  ctx.fillStyle = "#F59E0B";
  ctx.strokeStyle = "#78350F";
  ctx.lineWidth = 3;

  for (let gy = 40; gy < height; gy += 90) {
    [45, width / 2, width - 45].forEach((gx) => {
      ctx.beginPath();
      ctx.arc(gx, gy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Brass highlight gleam
      ctx.fillStyle = "#FEF08A";
      ctx.beginPath();
      ctx.arc(gx - 2, gy - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#F59E0B";
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedHaveliDoorTexture = texture;
  return texture;
}

/**
 * Builds a fully articulated, interactive Indian Haveli Double Gate
 * with carved teak doors, brass studs, scalloped marigold torans, and smooth swinging hinges.
 */
export function createInteractiveHaveliGate(options: HaveliGateOptions): InteractiveHaveliGate {
  const {
    id,
    name,
    position,
    rotationY,
    width = 2.6,
    height = 2.8,
    hasToran = true,
  } = options;

  const root = new THREE.Group();
  root.name = `haveliGateRoot_${id}`;
  root.position.copy(position);
  root.rotation.y = rotationY;

  const doorTex = getHaveliDoorTexture();

  // Materials
  const teakDoorMat = new THREE.MeshStandardMaterial({
    map: doorTex,
    roughness: 0.55,
    metalness: 0.15,
  });

  const stoneArchMat = new THREE.MeshStandardMaterial({
    color: 0xfafaf9, // Polished white sandstone architrave
    roughness: 0.7,
    metalness: 0.05,
  });

  const brassKnockerMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });

  const marigoldOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xd97706,
    emissiveIntensity: 0.65,
    roughness: 0.5,
  });

  const marigoldYellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.65,
    roughness: 0.5,
  });

  const mangoLeafMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Dark emerald green mango leaves
    roughness: 0.6,
  });

  // =========================================================================
  // 1. ARCHITECTURAL ARCHITRAVE FRAME
  // =========================================================================
  const postWidth = 0.28;
  const postDepth = 0.35;
  const clearW = width;
  const clearH = height;

  // Left & Right Stone Doorposts
  [-1, 1].forEach((dir) => {
    const postMesh = new THREE.Mesh(
      new THREE.BoxGeometry(postWidth, clearH + 0.3, postDepth),
      stoneArchMat
    );
    postMesh.position.set(dir * (clearW / 2 + postWidth / 2), (clearH + 0.3) / 2, 0);
    postMesh.castShadow = true;
    root.add(postMesh);

    // Decorative Post Crown Capital
    const capMesh = new THREE.Mesh(
      new THREE.BoxGeometry(postWidth + 0.1, 0.14, postDepth + 0.1),
      stoneArchMat
    );
    capMesh.position.set(dir * (clearW / 2 + postWidth / 2), clearH + 0.28, 0);
    root.add(capMesh);
  });

  // Top Lintel Beam
  const lintelMesh = new THREE.Mesh(
    new THREE.BoxGeometry(clearW + postWidth * 2 + 0.2, 0.32, postDepth + 0.08),
    stoneArchMat
  );
  lintelMesh.position.set(0, clearH + 0.3 + 0.16, 0);
  root.add(lintelMesh);

  // Carved Cornice Crown Moulding above Lintel
  const crownMesh = new THREE.Mesh(
    new THREE.BoxGeometry(clearW + postWidth * 2 + 0.36, 0.14, postDepth + 0.14),
    stoneArchMat
  );
  crownMesh.position.set(0, clearH + 0.52, 0);
  root.add(crownMesh);

  // Stone Step Threshold on Ground
  const thresholdMesh = new THREE.Mesh(
    new THREE.BoxGeometry(clearW + postWidth * 2, 0.14, 0.65),
    stoneArchMat
  );
  thresholdMesh.position.set(0, 0.07, 0);
  thresholdMesh.receiveShadow = true;
  root.add(thresholdMesh);

  // =========================================================================
  // 2. LUSH MULTI-TIER MARIGOLD & MANGO LEAF TORAN (GARLAND SWAGS)
  // =========================================================================
  if (hasToran) {
    const toranGroup = new THREE.Group();
    toranGroup.position.set(0, clearH + 0.24, 0.12);

    // Main Horizontal Marigold Rope
    const mainRope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, clearW + 0.2, 8),
      marigoldOrangeMat
    );
    mainRope.rotation.z = Math.PI / 2;
    toranGroup.add(mainRope);

    // Scalloped Marigold Swag Arches (3 hanging arches across the door)
    const archCount = 3;
    const archW = (clearW * 0.95) / archCount;
    for (let a = 0; a < archCount; a++) {
      const archCenterX = ((a + 0.5) / archCount - 0.5) * (clearW * 0.95);
      const points = 9;

      for (let p = 0; p < points; p++) {
        const u = p / (points - 1);
        const swagX = archCenterX + (u - 0.5) * archW;
        const swagY = -Math.sin(u * Math.PI) * 0.28;

        // Alternate orange & yellow marigold blooms
        const isYellow = (a + p) % 2 === 0;
        const bloomGeo = new THREE.SphereGeometry(0.042, 6, 6);
        const bloomMesh = new THREE.Mesh(bloomGeo, isYellow ? marigoldYellowMat : marigoldOrangeMat);
        bloomMesh.position.set(swagX, swagY, 0.02);
        toranGroup.add(bloomMesh);

        // Hanging Mango Leaves at arch cusps
        if (p === Math.floor(points / 2) || p === 0 || p === points - 1) {
          const leafGeo = new THREE.ConeGeometry(0.04, 0.18, 4);
          const leafMesh = new THREE.Mesh(leafGeo, mangoLeafMat);
          leafMesh.rotation.x = Math.PI;
          leafMesh.position.set(swagX, swagY - 0.11, 0.01);
          toranGroup.add(leafMesh);
        }
      }
    }

    root.add(toranGroup);
  }

  // =========================================================================
  // 3. ARTISANAL DOUBLE WOODEN HAVELI DOORS (WITH HINGED PIVOTS)
  // =========================================================================
  const leafW = clearW / 2;
  const leafH = clearH;
  const leafThick = 0.09;

  // Left Hinge Pivot (located at left doorpost)
  const leftHinge = new THREE.Group();
  leftHinge.position.set(-clearW / 2, 0, 0);
  root.add(leftHinge);

  const leftDoor = new THREE.Mesh(
    new THREE.BoxGeometry(leafW, leafH, leafThick),
    teakDoorMat
  );
  leftDoor.position.set(leafW / 2, leafH / 2, 0);
  leftDoor.castShadow = true;
  leftHinge.add(leftDoor);

  // Right Hinge Pivot (located at right doorpost)
  const rightHinge = new THREE.Group();
  rightHinge.position.set(clearW / 2, 0, 0);
  root.add(rightHinge);

  const rightDoor = new THREE.Mesh(
    new THREE.BoxGeometry(leafW, leafH, leafThick),
    teakDoorMat
  );
  rightDoor.position.set(-leafW / 2, leafH / 2, 0);
  rightDoor.castShadow = true;
  rightHinge.add(rightDoor);

  // Ornamental Brass Lion-Head Ring Knockers on each door leaf
  [-1, 1].forEach((dir) => {
    const parentHinge = dir < 0 ? leftHinge : rightHinge;
    const knockerX = dir < 0 ? leafW * 0.72 : -leafW * 0.72;

    const knockerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.03, 12),
      brassKnockerMat
    );
    knockerBase.rotation.x = Math.PI / 2;
    knockerBase.position.set(knockerX, leafH * 0.52, leafThick / 2 + 0.02);
    parentHinge.add(knockerBase);

    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.014, 8, 16),
      brassKnockerMat
    );
    ringMesh.position.set(knockerX, leafH * 0.52 - 0.04, leafThick / 2 + 0.03);
    parentHinge.add(ringMesh);
  });

  // Threshold Floor Rangoli (Welcoming mandala in front of gate)
  const rangoliMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const rangoliMesh = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.85, 24), rangoliMat);
  rangoliMesh.rotation.x = -Math.PI / 2;
  rangoliMesh.position.set(0, 0.08, 0.65);
  root.add(rangoliMesh);

  // Guarding Clay Diyas on Left and Right of Threshold
  const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
  const diyaFlameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  [-1, 1].forEach((dir) => {
    const diyaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.08, 8), diyaClayMat);
    diyaBase.position.set(dir * (clearW / 2 + 0.35), 0.12, 0.3);
    root.add(diyaBase);

    const diyaFlame = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), diyaFlameMat);
    diyaFlame.position.set(dir * (clearW / 2 + 0.35), 0.21, 0.3);
    root.add(diyaFlame);
  });

  // Warm Interior Light Spill (fades up when gate swings open)
  const interiorLight = new THREE.PointLight(0xfef08a, 0.0, 6.0, 1.2);
  interiorLight.position.set(0, clearH * 0.55, -0.6);
  root.add(interiorLight);

  // =========================================================================
  // 4. INTERACTION STATE & ANIMATION LOGIC
  // =========================================================================
  let isOpen = false;
  let currentAngle = 0;
  let targetAngle = 0;

  const open = () => {
    isOpen = true;
    targetAngle = Math.PI * 0.48; // Swing 86 deg inwards
    options.onOpen?.();
  };

  const close = () => {
    isOpen = false;
    targetAngle = 0;
    options.onClose?.();
  };

  const toggle = (): boolean => {
    if (isOpen) close();
    else open();
    return isOpen;
  };

  const update = (delta: number, playerPos: THREE.Vector3) => {
    // Smooth door swing animation
    const swingSpeed = 4.2;
    currentAngle += (targetAngle - currentAngle) * Math.min(1.0, delta * swingSpeed);

    // Left door swings inward (-angle around Y), right door swings inward (+angle around Y)
    leftHinge.rotation.y = -currentAngle;
    rightHinge.rotation.y = currentAngle;

    // Interior warm glow matches open state
    const openProgress = currentAngle / (Math.PI * 0.48);
    interiorLight.intensity = openProgress * 2.2;

    // Automatic Proximity Trigger:
    // If player approaches within 2.2m of gate front, automatically swing open!
    // When player leaves, smoothly swing closed!
    const worldGatePos = new THREE.Vector3();
    root.getWorldPosition(worldGatePos);
    const dist = Math.hypot(playerPos.x - worldGatePos.x, playerPos.z - worldGatePos.z);

    if (dist < 2.6 && !isOpen) {
      open();
    } else if (dist > 3.8 && isOpen) {
      close();
    }
  };

  return {
    id,
    name,
    root,
    position,
    leftHinge,
    rightHinge,
    interiorLight,
    get isOpen() {
      return isOpen;
    },
    get currentAngle() {
      return currentAngle;
    },
    get targetAngle() {
      return targetAngle;
    },
    open,
    close,
    toggle,
    update,
  };
}
