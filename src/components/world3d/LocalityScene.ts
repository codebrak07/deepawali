import * as THREE from "three";
import { createLocalityRoadNetwork } from "./LocalityRoadNetwork";
import { createLocalityBuildings } from "./LocalityBuildings";
import { createDiwaliDecorations } from "./DiwaliDecorations3D";
import {
  createAalekhCharacter,
  createShirjanaCharacter,
  CharacterRig,
} from "./Characters3D";
import { createInteractiveStations, Station3DObjects } from "./InteractiveStations3D";
import { INTERACTIVE_STATIONS } from "./LocalityData";
import { LocalityCollisionSystem, BoxCollider } from "./LocalityCollisionSystem";
import { createSanaHomeInterior, InteriorSceneObjects, SeatAnchor } from "./BuildingInteriors3D";
import { createShivaTempleSystem, TempleSceneObjects } from "./ShivaTemple3D";
import { createHanumanTempleSystem, HanumanTempleSceneObjects } from "./HanumanTemple3D";
import { createMountainFireworksDestination, MountainDestination } from "./MountainFireworks3D";
import { InteractiveHaveliGate } from "./HaveliGateSystem";

export type CameraViewMode = "exploration" | "story";

export class LocalitySceneEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;

  // Rigs, Interiors, & Temple Systems
  public aalekh: CharacterRig;
  public shirjana: CharacterRig;
  public interactiveGates: InteractiveHaveliGate[] = [];
  private stations: Station3DObjects;
  private updateDecorations: (time: number) => void;
  public interiorSuite: InteriorSceneObjects;
  public templeSuite: TempleSceneObjects;
  public hanumanSuite: HanumanTempleSceneObjects;
  public mountainSuite: MountainDestination;
  public collisionSystem: LocalityCollisionSystem;

  // Character Physics & State
  public charPos = new THREE.Vector3(0, 0, 4); // Start near Station A & Chowk
  public charRotation = Math.PI; // Facing North down the street towards the temples, away from default camera
  public moveVector = new THREE.Vector2(0, 0); // Left Joystick movement
  public lookVector = new THREE.Vector2(0, 0); // Right Joystick look
  public isWalking = false;
  public isInsideBuilding = false;
  public isInsideTemple = false;
  public isInsideHanuman = false;
  public isSitting = false;
  public activeSeatAnchor: SeatAnchor | null = null;
  public isWatchingTV = false;
  public isHoldingHands = false;

  // Camera Orbit Rig & State (GTA-Style calibrated defaults)
  public cameraMode: CameraViewMode = "story";
  public orbitYaw = 0; // Horizontal orbit around character (radians)
  public orbitPitch = 0.30; // Vertical orbit inclination (radians - calibrated for over-the-shoulder framing)
  public orbitDistance = 8.5; // Comfortable GTA distance (8.5m in open world, never extreme close-up)
  public orbitSensitivity = 1.0;
  public invertPitch = false;
  public manualLookTimer = 0; // Pause auto-centering after user drags camera

  private targetCameraPos = new THREE.Vector3(-12, 16, 28);
  private targetLookAt = new THREE.Vector3(0, 2, 0);
  private currentCameraPos = new THREE.Vector3(-12, 16, 28);
  private currentLookAt = new THREE.Vector3(0, 2, 0);

  // Stations & Waypoints
  public nearbyStation: string | null = null;
  public rangoliProgress = 0.2;
  public lanternRising = false;
  public waypoint: { x: number; z: number } | null = null;
  private waypointBeaconGroup: THREE.Group | null = null;
  private vehicleColliders: BoxCollider[] = [];

  // Callbacks
  public onProximityChange?: (stationId: string | null) => void;
  public onPlayerTransformChange?: (pos: { x: number; z: number }, heading: number) => void;
  public onWaypointChange?: (waypoint: { x: number; z: number } | null) => void;

  private isRunning = false;
  private animationId: number | null = null;
  private clock = new THREE.Clock();

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07091a);
    this.scene.fog = new THREE.FogExp2(0x07091a, 0.008);

    const width = container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
    const height = container.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);

    this.camera = new THREE.PerspectiveCamera(48, width / (height || 1), 0.40, 450);
    this.camera.position.set(-12, 16, 28);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    this.renderer.setSize(width, height);
    const maxDpr = typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 1.75;
    this.renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, maxDpr));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    container.appendChild(this.renderer.domElement);

    // 2. Atmospheric & Celestial Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x42385c, 1.5);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x4338ca, 0x9a3412, 0.9);
    this.scene.add(hemiLight);

    const moonDirLight = new THREE.DirectionalLight(0xc7d2fe, 1.2);
    moonDirLight.position.set(50, 80, -60);
    moonDirLight.castShadow = true;
    moonDirLight.shadow.mapSize.width = 1024;
    moonDirLight.shadow.mapSize.height = 1024;
    moonDirLight.shadow.camera.near = 10;
    moonDirLight.shadow.camera.far = 220;
    const d = 60;
    moonDirLight.shadow.camera.left = -d;
    moonDirLight.shadow.camera.right = d;
    moonDirLight.shadow.camera.top = d;
    moonDirLight.shadow.camera.bottom = -d;
    this.scene.add(moonDirLight);

    // 3. Locality Environments & Collision Engine
    this.collisionSystem = new LocalityCollisionSystem();
    const roadNetwork = createLocalityRoadNetwork(this.scene);
    this.vehicleColliders = roadNetwork.vehicleColliders || [];
    if (this.vehicleColliders.length > 0) {
      this.collisionSystem.exteriorColliders.push(...this.vehicleColliders);
    }
    const bldgResult = createLocalityBuildings(this.scene);
    this.interactiveGates.push(...bldgResult.interactiveGates);

    const deco = createDiwaliDecorations(this.scene);
    this.updateDecorations = deco.updateDecorations;
    this.stations = createInteractiveStations(this.scene);

    // 4. Build Sana's Expansive Home Interior (18m × 15m)
    this.interiorSuite = createSanaHomeInterior();
    this.scene.add(this.interiorSuite.group);
    if (this.interiorSuite.villaGate) {
      this.interactiveGates.push(this.interiorSuite.villaGate);
    }
    this.interiorSuite.occlusionMeshes.forEach((mesh) =>
      this.collisionSystem.registerOcclusionMesh(mesh)
    );

    // 5. Build Dedicated Explorable Shiva Temple (Exterior & Sanctum Interior)
    this.templeSuite = createShivaTempleSystem();
    this.scene.add(this.templeSuite.exteriorGroup);
    this.scene.add(this.templeSuite.interiorGroup);
    this.templeSuite.occlusionMeshes.forEach((mesh) =>
      this.collisionSystem.registerOcclusionMesh(mesh)
    );

    // 6. Build Dedicated Explorable Hanuman Temple (Exterior & Sanctum Interior)
    this.hanumanSuite = createHanumanTempleSystem();
    this.scene.add(this.hanumanSuite.exteriorGroup);
    this.scene.add(this.hanumanSuite.interiorGroup);
    this.hanumanSuite.occlusionMeshes.forEach((mesh) =>
      this.collisionSystem.registerOcclusionMesh(mesh)
    );

    // 6B. Dedicated Scenic Mountain Fireworks Destination (Summit Romantic Viewpoint)
    this.mountainSuite = createMountainFireworksDestination();
    this.scene.add(this.mountainSuite.group);

    // Set initial exterior colliders (merging custom suites entrance colliders, excluding generic boxes)
    this.collisionSystem.buildExteriorColliders([
      ...this.interiorSuite.exteriorColliders,
      ...this.templeSuite.exteriorColliders,
      ...this.hanumanSuite.exteriorColliders,
      ...this.vehicleColliders,
      ...this.mountainSuite.colliders,
    ]);

    // 7. Interactive Waypoint 3D Beacon
    this.setupWaypointBeacon();

    // 8. Sculpted 3D Couple Characters (Aalekh & Shirjana / Sana)
    this.aalekh = createAalekhCharacter();
    this.shirjana = createShirjanaCharacter();

    this.aalekh.root.position.copy(this.charPos);
    this.scene.add(this.aalekh.root);

    this.shirjana.root.position.set(this.charPos.x + 0.78, 0, this.charPos.z);
    this.scene.add(this.shirjana.root);

    // Both characters stand independently with natural relaxed arm poses
    this.aalekh.setHoldingHands(false);
    this.shirjana.setHoldingHands(false);

    // 8. Event Listeners
    window.addEventListener("resize", this.handleResize);
    this.setupInputListeners();
  }

  private setupWaypointBeacon() {
    this.waypointBeaconGroup = new THREE.Group();
    this.waypointBeaconGroup.visible = false;

    // Glowing vertical light shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.45, 18, 12, 1, true);
    const shaftMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 9;
    this.waypointBeaconGroup.add(shaft);

    // Hovering Waypoint Pin Indicator (pointing down towards target)
    const pinGeo = new THREE.ConeGeometry(0.2, 0.5, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.rotation.x = Math.PI; // point down towards ground
    pin.position.y = 2.8;
    this.waypointBeaconGroup.add(pin);

    // Ground Pulsing Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    this.waypointBeaconGroup.add(ring);

    this.scene.add(this.waypointBeaconGroup);
  }

  public setWaypoint(x: number | null, z?: number) {
    if (x === null || z === undefined) {
      this.waypoint = null;
      if (this.waypointBeaconGroup) this.waypointBeaconGroup.visible = false;
      this.onWaypointChange?.(null);
      return;
    }

    this.waypoint = { x, z };
    if (this.waypointBeaconGroup) {
      this.waypointBeaconGroup.position.set(x, 0, z);
      this.waypointBeaconGroup.visible = true;
    }
    this.onWaypointChange?.(this.waypoint);
  }

  public clearWaypoint() {
    this.setWaypoint(null);
  }

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / (height || 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private setupInputListeners() {
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hasDragged = false;

    this.container.addEventListener("pointerdown", (e) => {
      if ((e.target as HTMLElement).tagName !== "CANVAS") return;
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      hasDragged = false;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasDragged && Math.hypot(dx, dy) > 6) {
        hasDragged = true;
      }

      if (hasDragged && this.cameraMode !== "story") {
        this.adjustCameraOrbit(
          -e.movementX * 0.007 * this.orbitSensitivity,
          (this.invertPitch ? -1 : 1) * -e.movementY * 0.006 * this.orbitSensitivity
        );
        this.manualLookTimer = 1.4; // Pause auto-centering during manual drag
      }
    });

    window.addEventListener("pointerup", (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      // Tap on ground: sets Waypoint Beacon without taking away player control
      if (!hasDragged && (e.target as HTMLElement).tagName === "CANVAS" && this.cameraMode !== "story") {
        const rect = this.container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          this.setWaypoint(
            Math.round(intersection.x * 10) / 10,
            Math.round(intersection.z * 10) / 10
          );
        }
      }
    });

    // Mouse wheel zoom
    this.container.addEventListener(
      "wheel",
      (e) => {
        if (this.cameraMode !== "story") {
          this.adjustZoom(e.deltaY * 0.012);
        }
      },
      { passive: true }
    );
  }

  public setCameraMode(mode: CameraViewMode) {
    this.cameraMode = mode;
    if (mode === "exploration") {
      this.orbitDistance = this.isInsideBuilding ? 4.2 : this.isInsideTemple ? 4.5 : 7.2;
      this.orbitPitch = 0.26;
    }
  }

  public triggerFirework() {
    this.mountainSuite.triggerFirework();
  }

  public triggerMountainFireworks() {
    this.mountainSuite.triggerFirework();
  }

  public setInputVector(x: number, y: number) {
    this.moveVector.set(x, y);
  }

  public setLookVector(x: number, y: number) {
    this.lookVector.set(x, y);
    if (this.lookVector.lengthSq() > 0.01) {
      this.manualLookTimer = 1.4;
    }
  }

  public adjustCameraOrbit(deltaYaw: number, deltaPitch: number) {
    this.orbitYaw = (this.orbitYaw + deltaYaw) % (Math.PI * 2);
    // Allow looking upward (-0.45) directly into the fireworks sky
    this.orbitPitch = Math.max(-0.45, Math.min(1.20, this.orbitPitch + deltaPitch));
  }

  public adjustZoom(delta: number) {
    const minDist = this.isInsideBuilding ? 2.5 : this.isInsideTemple ? 2.8 : 3.5;
    const maxDist = this.isInsideBuilding ? 5.5 : this.isInsideTemple ? 7.5 : 18.0;
    this.orbitDistance = Math.max(minDist, Math.min(maxDist, this.orbitDistance + delta));
  }

  public resetCamera() {
    this.orbitYaw = this.charRotation + Math.PI;
    this.orbitPitch = this.isInsideBuilding ? 0.22 : (this.isInsideTemple || this.isInsideHanuman) ? 0.25 : 0.30;
    this.orbitDistance = this.isInsideBuilding ? 4.6 : (this.isInsideTemple || this.isInsideHanuman) ? 5.2 : 8.5;
    this.manualLookTimer = 0;
  }

  public setInvertPitch(invert: boolean) {
    this.invertPitch = invert;
  }

  public teleportTo(x: number, z: number, rotationY = Math.PI) {
    if (this.isSitting) {
      this.standUp();
    }
    this.aalekh.setPraying(false);
    this.shirjana.setPraying(false);

    // Target checks
    // If target is Sana Home (-20, -1.5) or in home bounds
    const isTargetSanaHome =
      Math.hypot(x - (-20), z - (-1.5)) < 3.5 ||
      (x >= this.interiorSuite.bounds.minX + 0.5 &&
        x <= this.interiorSuite.bounds.maxX - 0.5 &&
        z >= this.interiorSuite.bounds.minZ + 0.5 &&
        z <= this.interiorSuite.bounds.maxZ - 0.5);

    const isTargetShiva =
      Math.hypot(x - 14, z - (-21)) < 4.0 ||
      (x >= this.templeSuite.interiorBounds.minX &&
        x <= this.templeSuite.interiorBounds.maxX &&
        z >= this.templeSuite.interiorBounds.minZ &&
        z <= this.templeSuite.interiorBounds.maxZ);

    const isTargetHanuman =
      Math.hypot(x - (-12), z - (-21)) < 4.0 ||
      (x >= this.hanumanSuite.interiorBounds.minX &&
        x <= this.hanumanSuite.interiorBounds.maxX &&
        z >= this.hanumanSuite.interiorBounds.minZ &&
        z <= this.hanumanSuite.interiorBounds.maxZ);

    if (isTargetSanaHome) {
      this.enterBuilding();
      return;
    } else if (isTargetShiva) {
      this.enterTemple();
      return;
    } else if (isTargetHanuman) {
      this.enterHanuman();
      return;
    }

    // Outdoors teleport
    if (this.isInsideBuilding || this.isInsideTemple || this.isInsideHanuman) {
      this.exitBuilding();
    }

    const isTargetMountain = Math.hypot(x - 105, z - (-95)) < 16;
    let targetY = 0;
    let spawnX = x;
    let spawnZ = z;
    let spawnRotation = rotationY;

    if (isTargetMountain) {
      // Direct summit observation deck positioning facing fireworks valley
      targetY = 26.0;
      spawnX = 104.2;
      spawnZ = -93.8;
      spawnRotation = -Math.PI * 0.75;
    } else {
      if (this.mountainSuite) {
        targetY = this.mountainSuite.getTrailElevation(x, z) ?? 0;
      }
      const safePos = this.collisionSystem.findSafeSpawnPosition(x, z, false);
      spawnX = safePos.x;
      spawnZ = safePos.z;
    }

    this.charPos.set(spawnX, targetY, spawnZ);
    this.charRotation = spawnRotation;

    const spacing = 0.78;
    const perpX = Math.cos(this.charRotation);
    const perpZ = -Math.sin(this.charRotation);

    this.aalekh.root.position.copy(this.charPos);
    this.shirjana.root.position.set(
      this.charPos.x + perpX * spacing,
      targetY,
      this.charPos.z + perpZ * spacing
    );
    this.aalekh.root.rotation.y = this.charRotation;
    this.shirjana.root.rotation.y = this.charRotation;

    this.resetCamera();
    this.snapCameraToTarget(6.5, 0.25, this.charRotation + Math.PI);

    this.clearWaypoint();
    this.onProximityChange?.(null);
  }

  public navigateTo(x: number, z: number) {
    this.teleportTo(x, z);
  }

  // ==========================================
  // Enter & Exit Building Transitions
  // ==========================================
  public enterBuilding() {
    this.isInsideBuilding = true;
    this.isInsideTemple = false;
    this.isInsideHanuman = false;
    this.collisionSystem.isInsideBuilding = true;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.isInsideHanuman = false;
    this.collisionSystem.setInteriorColliders(
      this.interiorSuite.bounds,
      this.interiorSuite.furnitureColliders,
      3.2
    );

    // Place character inside facing north into the 2-storey grand villa
    this.charPos.set(-20, 0, -6.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.copy(this.charPos);
    this.shirjana.root.position.set(-19.22, 0, -6.5);

    this.orbitYaw = 0; // Camera behind player looking north into the living room
    this.orbitDistance = 4.8;
    this.orbitPitch = 0.22;
    this.manualLookTimer = 0;

    // Immediately snap camera
    this.snapCameraToTarget(4.8, 0.22, 0);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public exitBuilding() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.isInsideHanuman = false;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.isInsideHanuman = false;
    this.collisionSystem.buildExteriorColliders([
      ...this.interiorSuite.exteriorColliders,
      ...this.templeSuite.exteriorColliders,
      ...this.hanumanSuite.exteriorColliders,
      ...this.vehicleColliders,
      ...this.mountainSuite.colliders,
    ]);

    // Place character out in the open street in front of Sana Residence facing north towards temples
    const safePos = this.collisionSystem.findSafeSpawnPosition(-20, -1.5, false);
    this.charPos.set(safePos.x, 0, safePos.z);
    this.charRotation = Math.PI;

    this.aalekh.root.position.set(safePos.x, 0, safePos.z);
    this.shirjana.root.position.set(safePos.x + 0.78, 0, safePos.z);

    this.orbitYaw = 0; // Camera behind player looking north down the street
    this.orbitDistance = 8.5;
    this.orbitPitch = 0.30;
    this.manualLookTimer = 0;

    // Immediately snap camera to street view so there is zero lerping through walls
    this.snapCameraToTarget(8.5, 0.30, 0);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public enterTemple() {
    this.isInsideBuilding = false;
    this.isInsideTemple = true;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = true;
    this.collisionSystem.setInteriorColliders(
      this.templeSuite.interiorBounds,
      this.templeSuite.interiorColliders,
      3.6
    );

    // Place player inside sanctum on elevated plinth (y = 0.40m) facing north towards Shivling
    this.charPos.set(14, 0.40, -24.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.set(14, 0.40, -24.5);
    this.shirjana.root.position.set(14.78, 0.40, -24.5);

    this.orbitYaw = 0;
    this.orbitDistance = 4.5;
    this.orbitPitch = 0.25;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(4.5, 0.25, 0);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public exitTemple() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.isInsideHanuman = false;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.isInsideHanuman = false;
    this.collisionSystem.buildExteriorColliders([
      ...this.interiorSuite.exteriorColliders,
      ...this.templeSuite.exteriorColliders,
      ...this.hanumanSuite.exteriorColliders,
      ...this.vehicleColliders,
      ...this.mountainSuite.colliders,
    ]);

    // Place player in the open temple courtyard plaza (clear from steps and nearby buildings)
    const safePos = this.collisionSystem.findSafeSpawnPosition(14, -18.5, false);
    this.charPos.set(safePos.x, 0, safePos.z);
    this.charRotation = 0;

    this.aalekh.root.position.set(safePos.x, 0, safePos.z);
    this.shirjana.root.position.set(safePos.x + 0.78, 0, safePos.z);

    this.orbitYaw = Math.PI;
    this.orbitDistance = 8.5;
    this.orbitPitch = 0.30;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(8.5, 0.30, Math.PI);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public enterHanuman() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.isInsideHanuman = true;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.isInsideHanuman = true;
    this.collisionSystem.setInteriorColliders(
      this.hanumanSuite.interiorBounds,
      this.hanumanSuite.interiorColliders,
      3.2
    );

    // Place player inside Hanuman Mandir sanctum on elevated plinth (y = 0.40m) facing north towards idol
    this.charPos.set(-12, 0.40, -25.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.set(-12, 0.40, -25.5);
    this.shirjana.root.position.set(-11.22, 0.40, -25.5);

    this.orbitYaw = 0;
    this.orbitDistance = 4.2;
    this.orbitPitch = 0.24;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(4.2, 0.24, 0);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public exitHanuman() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.isInsideHanuman = false;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.isInsideHanuman = false;
    this.collisionSystem.buildExteriorColliders([
      ...this.interiorSuite.exteriorColliders,
      ...this.templeSuite.exteriorColliders,
      ...this.hanumanSuite.exteriorColliders,
      ...this.vehicleColliders,
      ...this.mountainSuite.colliders,
    ]);

    // Place player in the open Hanuman Mandir plaza (free from collisions)
    const safePos = this.collisionSystem.findSafeSpawnPosition(-12, -19.5, false);
    this.charPos.set(safePos.x, 0, safePos.z);
    this.charRotation = 0;

    this.aalekh.root.position.set(safePos.x, 0, safePos.z);
    this.shirjana.root.position.set(safePos.x + 0.78, 0, safePos.z);

    this.orbitYaw = Math.PI;
    this.orbitDistance = 8.5;
    this.orbitPitch = 0.30;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(8.5, 0.30, Math.PI);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  // Lifestyle & Seating Systems
  public sitDown(anchorId?: string) {
    const anchor =
      anchorId === "seat-mountain-fireworks-bench"
        ? this.mountainSuite.benchAnchor
        : this.interiorSuite.seatAnchors.find((a) => a.id === anchorId) ||
          this.interiorSuite.seatAnchors[0];
    if (!anchor) return;

    this.isSitting = true;
    this.activeSeatAnchor = anchor;

    if (anchor.id === "seat-mountain-fireworks-bench") {
      const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), anchor.rotationY);
      const fwdVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), anchor.rotationY);

      // Aalekh seated on left side of bench, resting squarely on the velvet cushion
      const aalekhPos = anchor.position.clone()
        .addScaledVector(rightVec, -0.36)
        .addScaledVector(fwdVec, 0.05);
      aalekhPos.y = anchor.position.y;
      this.charPos.copy(aalekhPos);
      this.charRotation = anchor.rotationY;

      this.aalekh.root.position.copy(aalekhPos);
      this.aalekh.root.rotation.y = anchor.rotationY;
      this.aalekh.setSitting(true);

      // Sana seated on right side of bench, resting squarely on the velvet cushion
      const sanaPos = anchor.position.clone()
        .addScaledVector(rightVec, +0.36)
        .addScaledVector(fwdVec, 0.05);
      sanaPos.y = anchor.position.y;
      this.shirjana.root.position.copy(sanaPos);
      this.shirjana.root.rotation.y = anchor.rotationY;
      this.shirjana.setSitting(true);

      // Third-person scenic camera framing: behind couple looking over shoulders at fireworks
      this.orbitYaw = anchor.rotationY + Math.PI;
      this.orbitPitch = 0.14;
      this.orbitDistance = 4.0;
    } else if (anchor.id === "seat-sofa-center") {
      this.charPos.set(anchor.position.x, anchor.position.y, anchor.position.z);
      this.charRotation = anchor.rotationY;
      this.aalekh.root.position.copy(this.charPos);
      this.aalekh.root.rotation.y = this.charRotation;
      this.aalekh.setSitting(true);

      this.shirjana.root.position.set(anchor.position.x + 0.8, anchor.position.y, anchor.position.z);
      this.shirjana.root.rotation.y = anchor.rotationY;
      this.shirjana.setSitting(true);

      this.orbitYaw = anchor.rotationY + Math.PI;
      this.orbitPitch = 0.20;
      this.orbitDistance = 4.0;
    } else {
      this.charPos.set(anchor.position.x, anchor.position.y, anchor.position.z);
      this.charRotation = anchor.rotationY;
      this.aalekh.root.position.copy(this.charPos);
      this.aalekh.root.rotation.y = this.charRotation;
      this.aalekh.setSitting(true);

      this.shirjana.root.position.set(anchor.position.x + 0.9, anchor.position.y, anchor.position.z);
      this.shirjana.root.rotation.y = anchor.rotationY;
      this.shirjana.setSitting(true);

      this.orbitYaw = anchor.rotationY + Math.PI;
      this.orbitPitch = 0.20;
      this.orbitDistance = 4.0;
    }

    this.manualLookTimer = 0;
  }

  public standUp() {
    if (!this.isSitting) return;
    const wasMountain = this.activeSeatAnchor?.id === "seat-mountain-fireworks-bench";
    this.isSitting = false;
    this.isWatchingTV = false;
    this.activeSeatAnchor = null;
    this.aalekh.setSitting(false);
    this.shirjana.setSitting(false);

    // Step slightly forward from the seat
    if (wasMountain) {
      const fwd = new THREE.Vector3(0, 0, 1.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.charRotation);
      this.charPos.add(fwd);
      this.orbitDistance = 7.5;
      this.orbitPitch = 0.28;
    } else {
      this.charPos.z += 0.8;
      this.orbitDistance = this.isInsideBuilding ? 4.8 : 7.5;
      this.orbitPitch = 0.24;
    }
    this.aalekh.root.position.copy(this.charPos);
    this.shirjana.root.position.set(this.charPos.x + 0.52, this.charPos.y, this.charPos.z);
  }

  public watchTV() {
    if (!this.isSitting) {
      this.sitDown("seat-sofa-center");
    }
    this.interiorSuite.toggleTV(true);
    this.isWatchingTV = true;
  }

  public stopWatchingTV() {
    this.isWatchingTV = false;
  }

  public nextTVChannel() {
    this.interiorSuite.setTVChannel(1);
  }

  public toggleHomeLamps() {
    return this.interiorSuite.toggleLamps();
  }

  public toggleHoldingHands(): boolean {
    return false;
  }

  // Sacred Temple Actions
  public performAbhishek() {
    this.templeSuite.performAbhishek();
  }

  public ringHanumanBell() {
    this.hanumanSuite.ringBell();
  }

  public offerHanumanFlowers() {
    this.hanumanSuite.offerFlowers();
  }

  public offerHanumanPrasad() {
    this.hanumanSuite.offerPrasad();
  }

  public lightHanumanDiya() {
    this.hanumanSuite.lightDiya();
  }

  private snapCameraToTarget(dist: number, pitch: number, yaw: number) {
    const charHeadY = 1.6;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const sinYaw = Math.sin(yaw);
    const cosYaw = Math.cos(yaw);

    this.currentCameraPos.set(
      this.charPos.x + sinYaw * cosPitch * dist,
      Math.max(1.3, sinPitch * dist + charHeadY),
      this.charPos.z + cosYaw * cosPitch * dist
    );
    this.targetCameraPos.copy(this.currentCameraPos);

    this.currentLookAt.set(this.charPos.x, charHeadY, this.charPos.z);
    this.targetLookAt.copy(this.currentLookAt);

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);
  }

  // Temple Sacred Actions
  public ringTempleBell() {
    this.templeSuite.ringBell();
  }

  public offerTempleFlowers() {
    this.templeSuite.offerFlowers();
  }

  public offerTempleBilvaLeaves() {
    this.templeSuite.offerBilvaLeaves();
  }

  public lightTempleDiya() {
    this.templeSuite.lightTempleDiya();
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public dispose() {
    this.stop();
    window.removeEventListener("resize", this.handleResize);
    this.mountainSuite.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }

  private loop = () => {
    if (!this.isRunning) return;
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    this.updateCharacterPhysics(delta, time);
    this.updateCameraSystem(delta, time);
    this.checkStationProximity();

    // Occlusion Wall Fading
    this.collisionSystem.updateOcclusionFading(this.charPos, this.camera.position, delta);

    this.updateDecorations(time);
    this.stations.updateStations(time, this.rangoliProgress, this.lanternRising);
    this.templeSuite.updateAnimation(time);
    this.hanumanSuite.updateAnimation(time);
    this.interiorSuite.updateAnimation(time);
    this.mountainSuite.update(delta, time);

    // Update Interactive Indian Haveli Gates (Smooth Swinging Physics)
    this.interactiveGates.forEach((gate) => {
      gate.update(delta, this.charPos);
    });

    // Animate Waypoint Beacon
    if (this.waypointBeaconGroup && this.waypointBeaconGroup.visible) {
      const diamond = this.waypointBeaconGroup.children[1];
      if (diamond) {
        diamond.rotation.y = time * 2;
        diamond.position.y = 3.5 + Math.sin(time * 3) * 0.35;
      }
    }

    // Report transform to Minimap
    this.onPlayerTransformChange?.({ x: this.charPos.x, z: this.charPos.z }, this.charRotation);

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.loop);
  };

  private updateCharacterPhysics(delta: number, time: number) {
    if (this.isSitting) {
      if (Math.abs(this.moveVector.x) > 0.05 || Math.abs(this.moveVector.y) > 0.05) {
        this.standUp();
      } else {
        // Firmly maintain established seated positions with zero walking follow drift!
        return;
      }
    }

    const moveSpeed = this.isInsideBuilding ? 5.2 : this.isInsideTemple || this.isInsideHanuman ? 5.5 : 6.8;
    let proposedDx = 0;
    let proposedDz = 0;

    if (this.cameraMode !== "story") {
      if (this.moveVector.lengthSq() > 0.01) {
        const forwardX = -Math.sin(this.orbitYaw);
        const forwardZ = -Math.cos(this.orbitYaw);
        const rightX = -forwardZ;
        const rightZ = forwardX;

        const forwardInput = -this.moveVector.y;
        const rightInput = this.moveVector.x;

        const moveDirX = forwardX * forwardInput + rightX * rightInput;
        const moveDirZ = forwardZ * forwardInput + rightZ * rightInput;
        const len = Math.hypot(moveDirX, moveDirZ);

        if (len > 0.01) {
          proposedDx = (moveDirX / len) * moveSpeed * delta;
          proposedDz = (moveDirZ / len) * moveSpeed * delta;
          this.isWalking = true;

          // Smooth Angular Interpolation (No instantaneous snapping or face flips)
          const targetAngle = Math.atan2(moveDirX, moveDirZ);
          let diff = (targetAngle - this.charRotation) % (Math.PI * 2);
          if (diff < -Math.PI) diff += Math.PI * 2;
          if (diff > Math.PI) diff -= Math.PI * 2;
          this.charRotation += diff * Math.min(1.0, delta * 12.0);
        }
      } else {
        this.isWalking = false;
      }
    }

    // Resolve Movement with Wall Sliding Physics & 3D Floor Awareness
    const resolved = this.collisionSystem.resolveMovement(
      this.charPos.x,
      this.charPos.z,
      proposedDx,
      proposedDz,
      this.charPos.y
    );

    // 1. Sana's Home Seamless Auto-Doorway Transition
    if (!this.isInsideBuilding) {
      if (
        this.charPos.x >= -21.8 &&
        this.charPos.x <= -18.2 &&
        this.charPos.z <= -3.6 &&
        this.charPos.z >= -4.6
      ) {
        this.enterBuilding();
        return;
      }
    } else {
      if (
        this.charPos.x >= -21.8 &&
        this.charPos.x <= -18.2 &&
        this.charPos.z >= -4.4 &&
        this.charPos.z <= -3.2
      ) {
        this.exitBuilding();
        return;
      }
    }

    // 2. Shiva Temple Seamless Auto-Doorway Transition & Step Elevation
    if (!this.isInsideTemple) {
      if (
        this.charPos.x >= 11.0 &&
        this.charPos.x <= 17.0 &&
        this.charPos.z <= -21.4 &&
        this.charPos.z >= -23.4
      ) {
        const stepProgress = Math.min(1.0, Math.max(0.0, (-21.4 - this.charPos.z) / 1.8));
        this.charPos.y = stepProgress * 0.40;
      }
      if (
        this.charPos.x >= 11.5 &&
        this.charPos.x <= 16.5 &&
        this.charPos.z <= -23.5 &&
        this.charPos.z >= -24.8
      ) {
        this.enterTemple();
        return;
      }
    } else {
      if (
        this.charPos.x >= 11.5 &&
        this.charPos.x <= 16.5 &&
        this.charPos.z >= -23.8
      ) {
        this.exitTemple();
        return;
      }
    }

    // 3. Hanuman Temple Seamless Auto-Doorway Transition & Step Elevation
    if (!this.isInsideHanuman) {
      if (
        this.charPos.x >= -15.0 &&
        this.charPos.x <= -9.0 &&
        this.charPos.z <= -22.4 &&
        this.charPos.z >= -24.4
      ) {
        const stepProgress = Math.min(1.0, Math.max(0.0, (-22.4 - this.charPos.z) / 1.8));
        this.charPos.y = stepProgress * 0.40;
      }
      if (
        this.charPos.x >= -14.5 &&
        this.charPos.x <= -9.5 &&
        this.charPos.z <= -24.5 &&
        this.charPos.z >= -25.8
      ) {
        this.enterHanuman();
        return;
      }
    } else {
      if (
        this.charPos.x >= -14.5 &&
        this.charPos.x <= -9.5 &&
        this.charPos.z >= -24.8
      ) {
        this.exitHanuman();
        return;
      }
    }

    if (this.isInsideBuilding) {
      this.charPos.x = Math.max(this.interiorSuite.bounds.minX + 0.5, Math.min(this.interiorSuite.bounds.maxX - 0.5, resolved.x));
      this.charPos.z = Math.max(this.interiorSuite.bounds.minZ + 0.5, Math.min(this.interiorSuite.bounds.maxZ - 0.5, resolved.z));

      // Dynamic 2-Storey Floor Elevation: ground floor (0m), stairs (0->3.4m), upper floor (3.4m)
      if (!this.isSitting) {
        const targetElev = this.interiorSuite.getFloorElevation(this.charPos.x, this.charPos.z, this.charPos.y);
        this.charPos.y += (targetElev - this.charPos.y) * Math.min(1.0, delta * 12.0);
      }
    } else if (this.isInsideTemple) {
      this.charPos.x = Math.max(this.templeSuite.interiorBounds.minX + 0.45, Math.min(this.templeSuite.interiorBounds.maxX - 0.45, resolved.x));
      this.charPos.z = Math.max(this.templeSuite.interiorBounds.minZ + 0.45, Math.min(this.templeSuite.interiorBounds.maxZ - 0.45, resolved.z));
      this.charPos.y = 0.40; // Standing atop sanctum sandstone plinth
    } else if (this.isInsideHanuman) {
      this.charPos.x = Math.max(this.hanumanSuite.interiorBounds.minX + 0.45, Math.min(this.hanumanSuite.interiorBounds.maxX - 0.45, resolved.x));
      this.charPos.z = Math.max(this.hanumanSuite.interiorBounds.minZ + 0.45, Math.min(this.hanumanSuite.interiorBounds.maxZ - 0.45, resolved.z));
      this.charPos.y = 0.40; // Standing atop sanctum sandstone plinth
    } else {
      this.charPos.x = Math.max(-145, Math.min(145, resolved.x));
      this.charPos.z = Math.max(-125, Math.min(105, resolved.z));

      // Sample Scenic Mountain trail & summit elevation
      const mountainElev = this.mountainSuite.getTrailElevation(this.charPos.x, this.charPos.z);
      if (mountainElev !== null) {
        this.charPos.y += (mountainElev - this.charPos.y) * Math.min(1.0, delta * 14.0);
      } else if (
        !(this.charPos.x >= 11.0 && this.charPos.x <= 17.0 && this.charPos.z <= -21.4 && this.charPos.z >= -23.4) &&
        !(this.charPos.x >= -15.0 && this.charPos.x <= -9.0 && this.charPos.z <= -22.4 && this.charPos.z >= -24.4)
      ) {
        this.charPos.y = 0;
      }
    }

    this.aalekh.root.position.set(this.charPos.x, this.charPos.y, this.charPos.z);
    this.aalekh.root.rotation.y = this.charRotation;
    this.aalekh.updateAnimation(this.isWalking, time);

    // Sana walks gracefully beside Aalekh as independent companion
    // Spaced at 0.78m on his right side (+X in local coordinates) so their natural arm swings never intersect
    const spacing = 0.78;
    const offset = new THREE.Vector3(spacing, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.charRotation);
    const sanaTargetX = this.charPos.x + offset.x;
    const sanaTargetZ = this.charPos.z + offset.z;

    const followRate = 0.65;
    this.shirjana.root.position.x += (sanaTargetX - this.shirjana.root.position.x) * followRate;
    this.shirjana.root.position.y += (this.charPos.y - this.shirjana.root.position.y) * 0.70;
    this.shirjana.root.position.z += (sanaTargetZ - this.shirjana.root.position.z) * followRate;
    this.shirjana.root.rotation.y = this.charRotation;
    this.shirjana.updateAnimation(this.isWalking, time);
  }

  private updateCameraSystem(delta: number, time: number) {
    // 1. Process Right Joystick / Mouse / Touch look input (Manual Orbit)
    if (this.cameraMode !== "story" && this.lookVector.lengthSq() > 0.01) {
      const lookSpeed = 2.4 * this.orbitSensitivity;
      this.orbitYaw -= this.lookVector.x * lookSpeed * delta;
      const pitchFactor = this.invertPitch ? 1 : -1;
      this.orbitPitch = Math.max(
        -0.45,
        Math.min(1.20, this.orbitPitch + this.lookVector.y * pitchFactor * lookSpeed * delta)
      );
      this.manualLookTimer = 1.4;
    } else if (this.manualLookTimer > 0) {
      this.manualLookTimer -= delta;
    } else if (this.isWalking && this.cameraMode === "exploration") {
      // 2. GTA-STYLE SMOOTH AUTO-CENTERING BEHIND CHARACTER WHILE WALKING
      const targetYaw = this.charRotation + Math.PI;
      let diff = (targetYaw - this.orbitYaw) % (Math.PI * 2);
      if (diff < -Math.PI) diff += Math.PI * 2;
      if (diff > Math.PI) diff -= Math.PI * 2;
      this.orbitYaw += diff * delta * 2.4;
    }

    const lerpFactor = Math.min(delta * 5.5, 1.0);

    // SITTING THIRD-PERSON CAMERA (Automatic Cinematic Vista framing when seated, full 360 orbit)
    if (this.isSitting && this.activeSeatAnchor) {
      const anchor = this.activeSeatAnchor;
      const isMountain = anchor.id === "seat-mountain-fireworks-bench";
      const targetY = anchor.position.y + 1.1;

      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.max(2.8, Math.min(8.0, this.orbitDistance));

      this.targetCameraPos.set(
        anchor.position.x + sinYaw * cosPitch * dist,
        Math.max(anchor.position.y + 0.6, targetY + sinPitch * dist + (isMountain ? 0.35 : 0)),
        anchor.position.z + cosYaw * cosPitch * dist
      );

      if (isMountain) {
        // Look ahead past couple towards the fireworks in the valley sky
        this.targetLookAt.set(
          anchor.position.x - sinYaw * 12.0,
          targetY + 2.5 - sinPitch * 6.0,
          anchor.position.z - cosYaw * 12.0
        );
      } else {
        this.targetLookAt.set(anchor.position.x, targetY, anchor.position.z);
      }

      this.camera.position.lerp(this.targetCameraPos, Math.min(1.0, delta * 7.0));
      this.currentLookAt.lerp(this.targetLookAt, Math.min(1.0, delta * 7.0));
      this.camera.lookAt(this.currentLookAt);
      return;
    }

    if (this.cameraMode === "story") {
      const sweepX = -10 + Math.sin(time * 0.15) * 6;
      const sweepZ = 24 + Math.cos(time * 0.15) * 4;
      this.targetCameraPos.set(sweepX, 15, sweepZ);
      this.targetLookAt.set(0, 2.5, 0);
    } else {
      // EXCLUSIVELY THIRD PERSON EXPLORATION CAMERA
      const isInterior = this.isInsideBuilding || this.isInsideTemple || this.isInsideHanuman;
      const charHeadY = this.charPos.y + 1.6;
      const baseDist = this.isInsideBuilding ? 4.5 : (this.isInsideTemple || this.isInsideHanuman) ? 5.2 : 7.5;

      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);

      let effectiveDist = baseDist;

      // Obstruction avoidance raycast
      const candidateX = this.charPos.x + sinYaw * cosPitch * effectiveDist;
      const candidateY = Math.max(this.charPos.y + 1.3, sinPitch * effectiveDist + charHeadY);
      const candidateZ = this.charPos.z + cosYaw * cosPitch * effectiveDist;

      const camCheck = this.collisionSystem.checkCameraObstruction(
        this.charPos.x,
        charHeadY,
        this.charPos.z,
        candidateX,
        candidateY,
        candidateZ
      );

      if (camCheck.hit) {
        const minSafeDist = isInterior ? 2.8 : 3.8;
        effectiveDist = Math.max(minSafeDist, effectiveDist * camCheck.safeDistRatio);
      }

      const offsetX = sinYaw * cosPitch * effectiveDist;
      const maxY = isInterior ? this.charPos.y + 5.5 : 25;
      const offsetY = Math.max(this.charPos.y + 1.2, Math.min(maxY, sinPitch * effectiveDist + charHeadY));
      const offsetZ = cosYaw * cosPitch * effectiveDist;

      this.targetCameraPos.set(
        this.charPos.x + offsetX,
        offsetY,
        this.charPos.z + offsetZ
      );

      const lookAheadX = this.isWalking ? Math.sin(this.charRotation) * 0.8 : 0;
      const lookAheadZ = this.isWalking ? Math.cos(this.charRotation) * 0.8 : 0;
      this.targetLookAt.set(this.charPos.x + lookAheadX, charHeadY, this.charPos.z + lookAheadZ);
    }

    this.currentCameraPos.lerp(this.targetCameraPos, lerpFactor);
    this.currentLookAt.lerp(this.targetLookAt, lerpFactor);

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.currentLookAt);
  }

  private checkStationProximity() {
    let nearest: string | null = null;
    const threshold = 4.2;

    if (this.isInsideBuilding) {
      const distToExit = Math.hypot(this.charPos.x - (-20), this.charPos.z - (-8.5));
      const distToSofa = Math.hypot(this.charPos.x - (-23.8), this.charPos.z - (-15.3));
      const distToTV = Math.hypot(this.charPos.x - (-23.8), this.charPos.z - (-20.2));
      const distToBed = Math.hypot(this.charPos.x - (-14.8), this.charPos.z - (-16.0));
      const distToPuja = Math.hypot(this.charPos.x - (-27.5), this.charPos.z - (-19.5));
      const distToLamps = Math.hypot(this.charPos.x - (-12.6), this.charPos.z - (-21.0));

      if (distToExit < 3.8 || this.charPos.z > -9.5) {
        nearest = "station-exit-home";
      } else if (distToSofa < 2.5) {
        nearest = "station-home-sofa";
      } else if (distToTV < 3.2) {
        nearest = "station-home-tv";
      } else if (distToBed < 2.5) {
        nearest = "station-home-bed";
      } else if (distToPuja < 2.5) {
        nearest = "station-home-puja";
      } else if (distToLamps < 2.2) {
        nearest = "station-home-lamps";
      }
    } else if (this.isInsideHanuman) {
      const distToExit = Math.hypot(this.charPos.x - (-12), this.charPos.z - (-25.5));
      const distToBell = Math.hypot(this.charPos.x - (-12), this.charPos.z - (-29.0));
      const distToFlowers = Math.hypot(this.charPos.x - (-13.5), this.charPos.z - (-33.0));
      const distToPrasad = Math.hypot(this.charPos.x - (-10.5), this.charPos.z - (-33.0));
      const distToMurti = Math.hypot(this.charPos.x - (-12), this.charPos.z - (-33.2));

      if (distToExit < 3.5 || this.charPos.z > -26.0) {
        nearest = "station-exit-hanuman";
      } else if (distToBell < 2.2) {
        nearest = "station-hanuman-bell";
      } else if (distToFlowers < 2.2) {
        nearest = "station-hanuman-flowers";
      } else if (distToPrasad < 2.2) {
        nearest = "station-hanuman-prasad";
      } else if (distToMurti < 3.2) {
        nearest = "station-hanuman-pray";
      }
    } else if (this.isInsideTemple) {
      const distToExit = Math.hypot(this.charPos.x - 14, this.charPos.z - (-24.5));
      const distToShivling = Math.hypot(this.charPos.x - 14, this.charPos.z - (-32.0));
      const distToFlowers = Math.hypot(this.charPos.x - 12.4, this.charPos.z - (-32.0));
      const distToBilva = Math.hypot(this.charPos.x - 15.6, this.charPos.z - (-32.0));
      const distToAbhishek = Math.hypot(this.charPos.x - 14, this.charPos.z - (-30.8));
      const distToBell = Math.hypot(this.charPos.x - 14, this.charPos.z - (-27.8));

      if (distToExit < 3.8 || this.charPos.z > -25.5) {
        nearest = "station-exit-temple";
      } else if (distToBell < 2.2) {
        nearest = "station-temple-bell";
      } else if (distToFlowers < 2.0) {
        nearest = "station-temple-flowers";
      } else if (distToBilva < 2.0) {
        nearest = "station-temple-bilva";
      } else if (distToAbhishek < 2.2) {
        nearest = "station-temple-abhishek";
      } else if (distToShivling < 3.2) {
        nearest = "station-temple-pray";
      }
    } else {
      INTERACTIVE_STATIONS.forEach((st) => {
        if (
          st.id.startsWith("station-exit-") ||
          (st.id.startsWith("station-temple-") && st.id !== "station-enter-temple") ||
          (st.id.startsWith("station-hanuman-") && st.id !== "station-enter-hanuman") ||
          (st.id.startsWith("station-home-") && st.id !== "station-enter-home")
        ) {
          return;
        }
        const dist = Math.hypot(this.charPos.x - st.x, this.charPos.z - st.z);
        if (dist < threshold) {
          nearest = st.id;
        }
      });
    }

    if (nearest !== this.nearbyStation) {
      this.nearbyStation = nearest;
      this.onProximityChange?.(this.nearbyStation);

      // Trigger reverent prayer pose when in front of sacred altars
      const isPraying =
        nearest === "station-temple-pray" ||
        nearest === "station-hanuman-pray" ||
        nearest === "station-home-puja";
      this.aalekh.setPraying(isPraying);
      this.shirjana.setPraying(isPraying);
    }

    // Auto-infuse colors when near Station B Rangoli
    if (nearest === "station-b" && this.rangoliProgress < 1) {
      this.rangoliProgress = Math.min(1, this.rangoliProgress + 0.01);
    }
  }

  public toggleGate(gateId: string): boolean {
    const cleanId = gateId.replace(/^station-/, "").replace(/^gate-/, "");
    const gate = this.interactiveGates.find(
      (g) => g.id === cleanId || g.id === `gate-${cleanId}` || `station-${g.id}` === gateId
    );
    if (gate) {
      return gate.toggle();
    }
    return false;
  }
}
