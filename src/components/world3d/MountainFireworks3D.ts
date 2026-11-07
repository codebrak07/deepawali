import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";
import { SeatAnchor } from "./BuildingInteriors3D";

export interface MountainDestination {
  group: THREE.Group;
  colliders: BoxCollider[];
  benchAnchor: SeatAnchor;
  getTrailElevation: (x: number, z: number) => number | null;
  update: (delta: number, time: number) => void;
  triggerFirework: () => void;
  dispose: () => void;
}

interface FireworkParticle {
  active: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  alpha: number;
  decay: number;
  gravity: number;
}

interface Rocket {
  active: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  targetY: number;
  color: THREE.Color;
  type: "chrysanthemum" | "peony" | "willow" | "starburst" | "ring";
  trailTimer: number;
}

// True Pyrotechnic Diwali Palette (Luminous, Rich, Distinct)
const FIREWORK_COLORS = [
  new THREE.Color(0xf59e0b), // Pure Diwali Gold
  new THREE.Color(0xfbbf24), // Brilliant Amber
  new THREE.Color(0xef4444), // Crimson Scarlet
  new THREE.Color(0x10b981), // Emerald Green
  new THREE.Color(0x06b6d4), // Celestial Peacock Cyan
  new THREE.Color(0xa855f7), // Royal Festive Violet
  new THREE.Color(0xec4899), // Lotus Pink
  new THREE.Color(0xf8fafc), // Diamond Sparkle Silver
];

/**
 * Creates the Mountain Fireworks Romantic Viewpoint Destination.
 * Features:
 * - Natural Deccan basalt terraced mountain rising gracefully to summit at Y = 10.2m
 * - Premium polished dark teak observation deck with warm perimeter ambient lanterns
 * - Romantic couple's bench positioned facing Southwest directly towards the fireworks valley
 * - High-performance pooled procedural Diwali fireworks with physical rocket ascent,
 *   crisp pyrotechnic sparks (NO oversized glowing blobs!), varied burst archetypes, and
 *   a 20-second choreographed festival sequence.
 */
export function createMountainFireworksDestination(): MountainDestination {
  const group = new THREE.Group();
  group.name = "mountainFireworksDestination";

  const colliders: BoxCollider[] = [];

  // Mountain Base Center & Dimensions
  const mx = 105;
  const mz = -95;
  const summitY = 10.2;

  // Materials
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917, // Natural Deccan basalt dark stone
    roughness: 0.92,
    metalness: 0.08,
    flatShading: true,
  });

  const teakDeckMat = new THREE.MeshStandardMaterial({
    color: 0x2e1c11, // Rich dark polished Indian teak wood
    roughness: 0.60,
    metalness: 0.15,
  });

  const stonePathMat = new THREE.MeshStandardMaterial({
    color: 0x44403c, // Weathered stone pavers
    roughness: 0.80,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x3e2723, // Handcrafted teak bench wood
    roughness: 0.65,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  });

  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239, // Royal crimson velvet cushion
    roughness: 0.50,
  });

  // =========================================================================
  // 1. MOUNTAIN ROCK TERRACES (Flat plateau top kept strictly below summit deck)
  // =========================================================================
  const mountainBaseGeo = new THREE.CylinderGeometry(13.2, 38, summitY - 0.6, 16);
  const mountainBase = new THREE.Mesh(mountainBaseGeo, rockMat);
  mountainBase.position.set(mx, (summitY - 0.6) / 2, mz);
  mountainBase.receiveShadow = true;
  group.add(mountainBase);

  // Natural terraced rock buttresses flanking the slope
  const terraceOffsets = [
    { x: -9, y: 3.2, z: 7, r: 16 },
    { x: 11, y: 5.5, z: -6, r: 14 },
    { x: -5, y: 7.8, z: -9, r: 12 },
  ];
  terraceOffsets.forEach((t) => {
    const geo = new THREE.CylinderGeometry(t.r * 0.85, t.r, 2.8, 9);
    const m = new THREE.Mesh(geo, rockMat);
    m.position.set(mx + t.x, t.y, mz + t.z);
    m.receiveShadow = true;
    group.add(m);
  });

  // Premium Polished Teak Observation Terrace (Flat finished deck at y = summitY)
  const summitPlatformGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, 24);
  const summitPlatform = new THREE.Mesh(summitPlatformGeo, teakDeckMat);
  summitPlatform.position.set(mx, summitY - 0.2, mz);
  summitPlatform.receiveShadow = true;
  group.add(summitPlatform);

  // Decorative brass rim around deck perimeter
  const deckRimGeo = new THREE.TorusGeometry(8.5, 0.05, 8, 36);
  const deckRim = new THREE.Mesh(deckRimGeo, brassMat);
  deckRim.position.set(mx, summitY + 0.02, mz);
  deckRim.rotation.x = Math.PI / 2;
  group.add(deckRim);

  // =========================================================================
  // 2. WINDING STONE TRAIL FROM ROAD TO SUMMIT
  // =========================================================================
  const pathWaypoints = [
    { x: 78, y: 0.0, z: -68 },
    { x: 84, y: 1.8, z: -76 },
    { x: 92, y: 4.2, z: -82 },
    { x: 98, y: 7.0, z: -88 },
    { x: 105, y: summitY, z: -95 },
  ];

  for (let i = 0; i < pathWaypoints.length - 1; i++) {
    const p1 = pathWaypoints[i];
    const p2 = pathWaypoints[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);

    const rampGeo = new THREE.BoxGeometry(3.6, 0.4, len);
    const ramp = new THREE.Mesh(rampGeo, stonePathMat);
    ramp.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - 0.1, (p1.z + p2.z) / 2);
    ramp.rotation.y = angle;
    ramp.rotation.x = -Math.atan2(dy, len);
    ramp.receiveShadow = true;
    group.add(ramp);

    // Stone Lanterns along trail
    const lanternGeo = new THREE.CylinderGeometry(0.14, 0.20, 1.3, 8);
    const lanternPost = new THREE.Mesh(lanternGeo, brassMat);
    lanternPost.position.set(p1.x - Math.cos(angle) * 2.2, p1.y + 0.65, p1.z + Math.sin(angle) * 2.2);
    group.add(lanternPost);

    const lanternLight = new THREE.PointLight(0xfbbf24, 0.9, 7.0, 1.4);
    lanternLight.position.set(lanternPost.position.x, lanternPost.position.y + 0.7, lanternPost.position.z);
    group.add(lanternLight);
  }

  // Gateway Arch at trail entrance
  const archL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.2, 0.7), stonePathMat);
  archL.position.set(76.2, 2.1, -68);
  group.add(archL);

  const archR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 4.2, 0.7), stonePathMat);
  archR.position.set(79.8, 2.1, -68);
  group.add(archR);

  const archTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 0.8), stonePathMat);
  archTop.position.set(78, 4.2, -68);
  group.add(archTop);

  // =========================================================================
  // 3. OBSERVATION DECK BALUSTRADE (UNOBSTRUCTED PANORAMIC VIEW)
  // Generous opening facing Southwest so neither posts nor bars block camera or couple
  // =========================================================================
  const railRadius = 8.0;
  const numPosts = 16;
  for (let i = 0; i < numPosts; i++) {
    const th = (i / numPosts) * Math.PI * 1.7 - 0.4;
    // Keep viewing corridor between -2.85 rad and -1.55 rad completely clear!
    if (th < -1.55 && th > -2.85) continue;

    const px = mx + Math.sin(th) * railRadius;
    const pz = mz + Math.cos(th) * railRadius;

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.75, 8), woodMat);
    post.position.set(px, summitY + 0.38, pz);
    group.add(post);
  }

  // Low decorative brass rail (height 0.75m, out of sight line)
  const railCapGeo = new THREE.TorusGeometry(railRadius, 0.04, 6, 28, Math.PI * 1.7);
  const railCap = new THREE.Mesh(railCapGeo, brassMat);
  railCap.position.set(mx, summitY + 0.75, mz);
  railCap.rotation.x = Math.PI / 2;
  railCap.rotation.z = -0.4;
  group.add(railCap);

  // =========================================================================
  // 4. HANDCRAFTED TEAK COUPLE BENCH (FACING SOUTHWEST TO FIREWORKS VALLEY)
  // =========================================================================
  const benchX = mx - 1.2;
  const benchZ = mz + 1.5;
  const benchY = summitY;
  const benchRotation = -Math.PI * 0.75; // 135 degrees facing SW

  const benchGroup = new THREE.Group();
  benchGroup.position.set(benchX, benchY, benchZ);
  benchGroup.rotation.y = benchRotation;

  // Solid Teak Seat Base (surface at y = 0.38m, depth 0.42m)
  const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.42), woodMat);
  benchSeat.position.set(0, 0.34, -0.01);
  benchSeat.castShadow = true;
  benchGroup.add(benchSeat);

  // Deep Crimson Velvet Cushion (top sitting surface at y = 0.44m, depth 0.40m)
  const benchCushion = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.40), cushionMat);
  benchCushion.position.set(0, 0.41, -0.01);
  benchGroup.add(benchCushion);

  // Bench Backrest (angled comfortably back at z = -0.22)
  const benchBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.55, 0.08), woodMat);
  benchBack.position.set(0, 0.72, -0.22);
  benchBack.rotation.x = 0.08;
  benchGroup.add(benchBack);

  // Bench Legs
  [-0.95, 0.95].forEach((lx) => {
    const legF = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.38, 8), woodMat);
    legF.position.set(lx, 0.19, 0.16);
    benchGroup.add(legF);

    const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.38, 8), woodMat);
    legB.position.set(lx, 0.19, -0.18);
    benchGroup.add(legB);
  });

  // Dedicated Timber Footrest Deck directly under & in front of bench
  const footDeck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.85), teakDeckMat);
  footDeck.position.set(0, 0.03, 0.28);
  benchGroup.add(footDeck);

  group.add(benchGroup);

  // Warm Brass Hanging Lanterns flanking the bench sides (set back from sight line)
  const perpX = Math.cos(benchRotation);
  const perpZ = -Math.sin(benchRotation);
  [-2.0, 2.0].forEach((side) => {
    const lPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.0, 8), brassMat);
    lPost.position.set(benchX + perpX * side, benchY + 1.0, benchZ + perpZ * side);
    group.add(lPost);

    const pLight = new THREE.PointLight(0xfbbf24, 0.9, 6.0, 1.5);
    pLight.position.set(lPost.position.x, benchY + 1.8, lPost.position.z);
    group.add(pLight);
  });

  // Dedicated Bench Seat Anchor
  const benchAnchor: SeatAnchor = {
    id: "seat-mountain-fireworks-bench",
    label: "Mountain Summit Bench (Fireworks View)",
    position: new THREE.Vector3(benchX, benchY, benchZ),
    rotationY: benchRotation,
    sitHeight: benchY + 0.48,
    cameraOffset: new THREE.Vector3(3.2, 1.8, 3.2),
    cameraLookAt: new THREE.Vector3(benchX - 25.0, benchY + 8.0, benchZ - 30.0),
  };

  // Cliff boundary colliders
  colliders.push(
    {
      id: "mountain-summit-boundary-n",
      minX: mx - 8.5,
      maxX: mx + 8.5,
      minZ: mz - 9.5,
      maxZ: mz - 7.5,
      minY: summitY - 0.5,
      maxY: summitY + 4.0,
    },
    {
      id: "mountain-summit-boundary-e",
      minX: mx + 7.5,
      maxX: mx + 9.5,
      minZ: mz - 8.5,
      maxZ: mz + 8.5,
      minY: summitY - 0.5,
      maxY: summitY + 4.0,
    },
    {
      id: "mountain-summit-boundary-w",
      minX: mx - 9.5,
      maxX: mx - 7.5,
      minZ: mz - 8.5,
      maxZ: mz + 8.5,
      minY: summitY - 0.5,
      maxY: summitY + 4.0,
    }
  );

  // =========================================================================
  // 5. TRUE CINEMATIC DIWALI FIREWORKS ENGINE (CRISP SPARKS — ZERO OVERSIZED BLOBS)
  // =========================================================================
  const MAX_PARTICLES = 4800;
  const MAX_ROCKETS = 24;

  const particles: FireworkParticle[] = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({
      active: false,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      color: new THREE.Color(),
      alpha: 1.0,
      decay: 0.02,
      gravity: -9.8,
    });
  }

  const rockets: Rocket[] = [];
  for (let i = 0; i < MAX_ROCKETS; i++) {
    rockets.push({
      active: false,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      targetY: 25,
      color: new THREE.Color(),
      type: "chrysanthemum",
      trailTimer: 0,
    });
  }

  // Luminous circular radial glow texture for realistic pyrotechnic sparks
  function createSparkTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.2, "rgba(255, 245, 210, 0.95)");
      grad.addColorStop(0.5, "rgba(255, 180, 50, 0.40)");
      grad.addColorStop(0.8, "rgba(255, 100, 20, 0.12)");
      grad.addColorStop(1.0, "rgba(255, 60, 0, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Particle Buffer Geometry for WebGL Draw Calls
  const pPositions = new Float32Array(MAX_PARTICLES * 3);
  const pColors = new Float32Array(MAX_PARTICLES * 3);

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

  // Radiant pyrotechnic spark material with soft circular texture
  const sparkTexture = typeof document !== "undefined" ? createSparkTexture() : null;
  const pMat = new THREE.PointsMaterial({
    size: 2.8,
    map: sparkTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pMesh = new THREE.Points(pGeo, pMat);
  pMesh.name = "fireworksParticleMesh";
  pMesh.frustumCulled = false; // Never cull active dynamic particle buffer
  pMesh.renderOrder = 999;
  group.add(pMesh);

  // Subtle Atmospheric Sky Flash Light (delicate transient flash, no washout!)
  const skyFlashLight = new THREE.PointLight(0xfef08a, 0.0, 120.0, 1.6);
  skyFlashLight.position.set(mx - 20, summitY + 16, mz - 35);
  group.add(skyFlashLight);

  // Launches an ascending physical rocket with trajectory
  function spawnRocket(typeOverride?: Rocket["type"], colorOverride?: THREE.Color, xOff = 0, zOff = 0) {
    const r = rockets.find((rk) => !rk.active);
    if (!r) return;

    // Launch in the viewing valley corridor ahead of the summit observation deck
    const dist = 18 + Math.random() * 14;
    const spread = (Math.random() - 0.5) * 16 + xOff;
    const lx = mx - 1.2 - 0.707 * dist - 0.707 * spread;
    const lz = mz + 1.5 - 0.707 * dist + 0.707 * spread + zOff;

    r.active = true;
    // Launch origin set near summit elevation so ascension trajectory is fully visible!
    r.pos.set(lx, summitY + 1.2, lz);
    // Ascend cleanly with strong upward momentum (16 to 22 m/s)
    r.vel.set((Math.random() - 0.5) * 2.0, 16.0 + Math.random() * 4.0, (Math.random() - 0.5) * 2.0);
    // Detonation apex set directly in prime camera sweet spot (summitY + 9m to summitY + 16m)
    r.targetY = summitY + 9.0 + Math.random() * 7.0;
    r.color.copy(colorOverride || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]);
    r.trailTimer = 0;

    const types: Rocket["type"][] = ["chrysanthemum", "peony", "willow", "starburst", "ring"];
    r.type = typeOverride || types[Math.floor(Math.random() * types.length)];
  }

  // Detonates aerial explosion with varied Diwali pyrotechnic patterns
  function burstFirework(center: THREE.Vector3, baseColor: THREE.Color, type: Rocket["type"]) {
    // Subtle transient sky illumination
    skyFlashLight.color.copy(baseColor);
    skyFlashLight.position.copy(center);
    skyFlashLight.intensity = 1.4;

    let sparkCount = 130;
    let baseSpeed = 11.0;
    let gravity = -5.0;
    let decayRate = 0.016;

    if (type === "willow") {
      sparkCount = 160;
      baseSpeed = 7.0;
      gravity = -2.4; // Gentle downward cascading willow streams
      decayRate = 0.010; // Long hanging time
    } else if (type === "peony") {
      sparkCount = 120;
      baseSpeed = 14.5; // Fast energetic expansion
      gravity = -3.8;
      decayRate = 0.020;
    } else if (type === "ring") {
      sparkCount = 100;
      baseSpeed = 12.0;
      gravity = -3.0;
      decayRate = 0.015;
    }

    let spawned = 0;
    for (let i = 0; i < MAX_PARTICLES && spawned < sparkCount; i++) {
      const p = particles[i];
      if (p.active) continue;

      p.active = true;
      p.pos.copy(center);

      if (type === "ring") {
        // Toroidal horizontal ring distribution
        const theta = (spawned / sparkCount) * Math.PI * 2;
        const spd = baseSpeed + (Math.random() - 0.5) * 1.5;
        p.vel.set(Math.cos(theta) * spd, (Math.random() - 0.5) * 1.5, Math.sin(theta) * spd);
      } else {
        // Natural spherical burst velocity
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const spd = baseSpeed + (Math.random() - 0.5) * 4.0;

        p.vel.set(
          Math.sin(phi) * Math.cos(theta) * spd,
          Math.cos(phi) * spd + 1.0,
          Math.sin(phi) * Math.sin(theta) * spd
        );
      }

      // Pure vibrant color with subtle festive hue shimmer
      p.color.copy(baseColor);
      if (Math.random() > 0.45) {
        p.color.offsetHSL((Math.random() - 0.5) * 0.10, 0, 0.06);
      }

      p.alpha = 1.0;
      p.decay = decayRate;
      p.gravity = gravity;
      spawned++;
    }
  }

  // =========================================================================
  // 6. CHOREOGRAPHED DIWALI CELEBRATION SHOW (CONTINUOUS MASSIVE CELEBRATION)
  // =========================================================================
  let showTime = -1; // -1 = ambient idle mode; >= 0 = choreographed show active
  let showStage = 0;
  let ambientTimer = 1.0;

  const triggerFirework = () => {
    // 1. Immediate visual fireworks detonations right in center of viewer screen!
    const burst1 = new THREE.Vector3(
      mx - 1.2 - 0.707 * 22,
      summitY + 11.0,
      mz + 1.5 - 0.707 * 22
    );
    const burst2 = new THREE.Vector3(
      mx - 1.2 - 0.707 * 26 + 4,
      summitY + 13.5,
      mz + 1.5 - 0.707 * 26 - 4
    );
    burstFirework(burst1, FIREWORK_COLORS[0], "chrysanthemum");
    burstFirework(burst2, FIREWORK_COLORS[1], "willow");

    // 2. Launch 3 simultaneous ascending rockets across the sky
    spawnRocket("peony", FIREWORK_COLORS[2], -8, 0);
    spawnRocket("starburst", FIREWORK_COLORS[3], 0, 0);
    spawnRocket("ring", FIREWORK_COLORS[4], 8, 0);

    // 3. Start or loop choreographed celebration!
    showTime = 0;
    showStage = 0;
  };

  // Trail sampler along mountain trail and summit deck
  const getTrailElevation = (px: number, pz: number): number | null => {
    const dSummit = Math.hypot(px - mx, pz - mz);
    if (dSummit <= 8.5) {
      return summitY;
    }

    for (let i = 0; i < pathWaypoints.length - 1; i++) {
      const p1 = pathWaypoints[i];
      const p2 = pathWaypoints[i + 1];

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const segLenSq = dx * dx + dz * dz;

      const t = Math.max(0, Math.min(1, ((px - p1.x) * dx + (pz - p1.z) * dz) / segLenSq));
      const projX = p1.x + t * dx;
      const projZ = p1.z + t * dz;
      const distToPath = Math.hypot(px - projX, pz - projZ);

      if (distToPath <= 2.2) {
        return p1.y + t * (p2.y - p1.y);
      }
    }

    return null;
  };

  // Main animation update loop
  const update = (delta: number, _time: number) => {
    // 1. Choreographed Show Sequencing
    if (showTime >= 0) {
      showTime += delta;

      // Wave 1 (t=0.0s): Twin Golden Chrysanthemums
      if (showStage === 0 && showTime >= 0.0) {
        spawnRocket("chrysanthemum", FIREWORK_COLORS[0], -8, 0);
        spawnRocket("chrysanthemum", FIREWORK_COLORS[1], 8, 0);
        showStage = 1;
      }
      // Wave 2 (t=2.0s): Emerald & Ruby Peonies
      else if (showStage === 1 && showTime >= 2.0) {
        spawnRocket("peony", FIREWORK_COLORS[2], -12, -4);
        spawnRocket("peony", FIREWORK_COLORS[3], 12, -4);
        showStage = 2;
      }
      // Wave 3 (t=4.2s): Cascading Golden Weeping Willow Centerpiece
      else if (showStage === 2 && showTime >= 4.2) {
        spawnRocket("willow", FIREWORK_COLORS[0], 0, 4);
        spawnRocket("ring", FIREWORK_COLORS[4], -10, 0);
        showStage = 3;
      }
      // Wave 4 (t=6.8s): Celestial Purple & Peacock Cyan Staggered Salvo
      else if (showStage === 3 && showTime >= 6.8) {
        spawnRocket("starburst", FIREWORK_COLORS[5], -7, -2);
        spawnRocket("peony", FIREWORK_COLORS[4], 7, -2);
        spawnRocket("chrysanthemum", FIREWORK_COLORS[6], 0, -6);
        showStage = 4;
      }
      // Wave 5 (t=9.5s): Grand Finale 5-Rocket Festival Barrage
      else if (showStage === 4 && showTime >= 9.5) {
        spawnRocket("chrysanthemum", FIREWORK_COLORS[0], -14, 0);
        spawnRocket("willow", FIREWORK_COLORS[1], -7, 4);
        spawnRocket("starburst", FIREWORK_COLORS[7], 0, 0);
        spawnRocket("peony", FIREWORK_COLORS[3], 7, -4);
        spawnRocket("chrysanthemum", FIREWORK_COLORS[4], 14, 0);
        showStage = 5;
      }
      // Loop show seamlessly so celebratory fireworks continue ("make the firecrackers come alot")
      else if (showStage === 5 && showTime >= 13.0) {
        showTime = 0;
        showStage = 0;
      }
    } else {
      // 2. Ambient Continuous Festive Bursts (frequent dual bursts every 1.5 - 2.5s)
      ambientTimer -= delta;
      if (ambientTimer <= 0) {
        spawnRocket();
        if (Math.random() > 0.35) {
          spawnRocket();
        }
        ambientTimer = 1.4 + Math.random() * 1.2;
      }
    }

    // 3. Sky Flash Decay
    if (skyFlashLight.intensity > 0.05) {
      skyFlashLight.intensity *= Math.max(0, 1.0 - delta * 7.0);
    } else {
      skyFlashLight.intensity = 0;
    }

    // 4. Update Rockets (Trajectory & Sparkling Comet Trail)
    rockets.forEach((r) => {
      if (!r.active) return;
      r.pos.addScaledVector(r.vel, delta);
      r.vel.y -= 7.5 * delta; // Upward deceleration under gravity

      // Sparkling comet trail behind ascending rocket
      r.trailTimer += delta;
      if (r.trailTimer >= 0.025) {
        r.trailTimer = 0;
        for (let i = 0; i < MAX_PARTICLES; i++) {
          const p = particles[i];
          if (!p.active) {
            p.active = true;
            p.pos.set(
              r.pos.x + (Math.random() - 0.5) * 0.25,
              r.pos.y - Math.random() * 0.35,
              r.pos.z + (Math.random() - 0.5) * 0.25
            );
            p.vel.set((Math.random() - 0.5) * 1.2, -2.5 - Math.random() * 1.5, (Math.random() - 0.5) * 1.2);
            p.color.setHex(0xfef08a); // Warm golden trail spark
            p.alpha = 0.9;
            p.decay = 0.055;
            p.gravity = -2.0;
            break;
          }
        }
      }

      // Detonate when rocket reaches apex or velocity turns downwards
      if (r.pos.y >= r.targetY || r.vel.y <= 0.5) {
        r.active = false;
        burstFirework(r.pos, r.color, r.type);
      }
    });

    // 5. Update Particles (Buffer Attribute Sync)
    const posArr = pGeo.attributes.position.array as Float32Array;
    const colArr = pGeo.attributes.color.array as Float32Array;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particles[i];
      const i3 = i * 3;

      if (!p.active) {
        posArr[i3] = 0;
        posArr[i3 + 1] = -999;
        posArr[i3 + 2] = 0;
        colArr[i3] = 0;
        colArr[i3 + 1] = 0;
        colArr[i3 + 2] = 0;
        continue;
      }

      p.vel.y += p.gravity * delta;
      p.vel.multiplyScalar(Math.max(0, 1.0 - delta * 1.2)); // Air resistance drag
      p.pos.addScaledVector(p.vel, delta);
      p.alpha -= p.decay * (delta * 60);

      if (p.alpha <= 0.04 || p.pos.y <= 0) {
        p.active = false;
        posArr[i3 + 1] = -999;
        continue;
      }

      posArr[i3] = p.pos.x;
      posArr[i3 + 1] = p.pos.y;
      posArr[i3 + 2] = p.pos.z;

      colArr[i3] = p.color.r * p.alpha;
      colArr[i3 + 1] = p.color.g * p.alpha;
      colArr[i3 + 2] = p.color.b * p.alpha;
    }

    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
  };

  const dispose = () => {
    pGeo.dispose();
    pMat.dispose();
  };

  return {
    group,
    colliders,
    benchAnchor,
    getTrailElevation,
    update,
    triggerFirework,
    dispose,
  };
}
