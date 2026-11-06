import * as THREE from "three";
import { createLocalityRoadNetwork } from "./LocalityRoadNetwork";
import { createLocalityBuildings } from "./LocalityBuildings";
import { createDiwaliDecorations } from "./DiwaliDecorations3D";
import {
  createAalekhCharacter,
  createShirjanaCharacter,
  createBunnyCompanion,
  CharacterRig,
  BunnyRig,
} from "./Characters3D";
import { createInteractiveStations, Station3DObjects } from "./InteractiveStations3D";
import { INTERACTIVE_STATIONS } from "./LocalityData";
import { LocalityCollisionSystem } from "./LocalityCollisionSystem";
import { createSanaHomeInterior, InteriorSceneObjects, SeatAnchor } from "./BuildingInteriors3D";
import { createShivaTempleSystem, TempleSceneObjects } from "./ShivaTemple3D";
import { createHanumanTempleSystem, HanumanTempleSceneObjects } from "./HanumanTemple3D";

export type CameraViewMode = "exploration" | "closeup" | "street" | "birdeye" | "lanternsky" | "story";

export class LocalitySceneEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;

  // Rigs, Interiors, & Temple Systems
  public aalekh: CharacterRig;
  public shirjana: CharacterRig;
  public bunny: BunnyRig;
  private stations: Station3DObjects;
  private updateDecorations: (time: number) => void;
  public interiorSuite: InteriorSceneObjects;
  public templeSuite: TempleSceneObjects;
  public hanumanSuite: HanumanTempleSceneObjects;
  public collisionSystem: LocalityCollisionSystem;

  // Character Physics & State
  public charPos = new THREE.Vector3(0, 0, 4); // Start near Station A & Chowk
  public charRotation = 0;
  public moveVector = new THREE.Vector2(0, 0); // Left Joystick movement
  public lookVector = new THREE.Vector2(0, 0); // Right Joystick look
  public isWalking = false;
  public isInsideBuilding = false;
  public isInsideTemple = false;
  public isInsideHanuman = false;
  public isSitting = false;
  public activeSeatAnchor: SeatAnchor | null = null;
  public isWatchingTV = false;

  // Camera Orbit Rig & State (GTA-Style calibrated defaults)
  public cameraMode: CameraViewMode = "story";
  public orbitYaw = 0; // Horizontal orbit around character (radians)
  public orbitPitch = 0.28; // Vertical orbit inclination (radians)
  public orbitDistance = 6.0; // Distance from character (5-7 world units)
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

    this.camera = new THREE.PerspectiveCamera(48, width / (height || 1), 0.1, 450);
    this.camera.position.set(-12, 16, 28);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5));
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
    createLocalityRoadNetwork(this.scene);
    createLocalityBuildings(this.scene);

    const deco = createDiwaliDecorations(this.scene);
    this.updateDecorations = deco.updateDecorations;
    this.stations = createInteractiveStations(this.scene);

    // 4. Build Sana's Expansive Home Interior (18m × 15m)
    this.interiorSuite = createSanaHomeInterior();
    this.scene.add(this.interiorSuite.group);
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

    // Set initial exterior colliders
    this.collisionSystem.buildExteriorColliders();

    // 7. Interactive Waypoint 3D Beacon
    this.setupWaypointBeacon();

    // 8. Sculpted 3D Characters (Aalekh, Shirjana, Bunny Companion)
    this.aalekh = createAalekhCharacter();
    this.shirjana = createShirjanaCharacter();
    this.bunny = createBunnyCompanion();

    this.aalekh.root.position.copy(this.charPos);
    this.scene.add(this.aalekh.root);

    this.shirjana.root.position.set(this.charPos.x + 1.2, 0, this.charPos.z + 0.2);
    this.scene.add(this.shirjana.root);

    this.bunny.root.position.set(this.charPos.x - 0.9, 0, this.charPos.z + 0.8);
    this.scene.add(this.bunny.root);

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

    // Hovering Diamond Indicator
    const diamondGeo = new THREE.OctahedronGeometry(0.65, 0);
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.y = 3.5;
    this.waypointBeaconGroup.add(diamond);

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
    if (mode === "closeup") {
      this.orbitDistance = 3.2;
      this.orbitPitch = 0.16;
    } else if (mode === "street") {
      this.orbitDistance = 5.5;
      this.orbitPitch = 0.14;
    } else if (mode === "birdeye") {
      this.orbitDistance = 36.0;
      this.orbitPitch = 1.15;
    } else if (mode === "exploration") {
      this.orbitDistance = this.isInsideBuilding ? 3.8 : this.isInsideTemple ? 4.5 : 6.0;
      this.orbitPitch = 0.28;
    }
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
    this.orbitPitch = Math.max(0.08, Math.min(1.15, this.orbitPitch + deltaPitch));
  }

  public adjustZoom(delta: number) {
    const minDist = this.isInsideBuilding ? 2.5 : this.isInsideTemple ? 2.8 : 3.5;
    const maxDist = this.isInsideBuilding ? 5.5 : this.isInsideTemple ? 7.5 : 18.0;
    this.orbitDistance = Math.max(minDist, Math.min(maxDist, this.orbitDistance + delta));
  }

  public resetCamera() {
    this.orbitYaw = this.charRotation + Math.PI;
    this.orbitPitch = this.isInsideBuilding ? 0.22 : 0.28;
    this.orbitDistance = this.isInsideBuilding ? 3.8 : this.isInsideTemple ? 4.5 : 6.0;
    this.manualLookTimer = 0;
  }

  public setInvertPitch(invert: boolean) {
    this.invertPitch = invert;
  }

  public navigateTo(x: number, z: number) {
    this.setWaypoint(x, z);
  }

  // ==========================================
  // Enter & Exit Building Transitions
  // ==========================================
  public enterBuilding() {
    this.isInsideBuilding = true;
    this.isInsideTemple = false;
    this.collisionSystem.isInsideBuilding = true;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.setInteriorColliders(
      this.interiorSuite.bounds,
      this.interiorSuite.furnitureColliders,
      2.6
    );

    // Place character inside facing north into living room
    this.charPos.set(-20, 0, -8.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.copy(this.charPos);
    this.shirjana.root.position.set(-18.8, 0, -8.3);
    this.bunny.root.position.set(-21.1, 0, -8.1);

    this.orbitYaw = 0; // Camera behind player facing into room
    this.orbitDistance = 3.8;
    this.orbitPitch = 0.22;
    this.manualLookTimer = 0;

    // Immediately snap camera
    this.snapCameraToTarget(3.8, 0.22, 0);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public exitBuilding() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.buildExteriorColliders();

    // Place character out on Dattawadi Main Road facing south
    this.charPos.set(-20, 0, 0.5);
    this.charRotation = 0;

    this.aalekh.root.position.set(-20, 0, 0.5);
    this.shirjana.root.position.set(-18.8, 0, 0.7);
    this.bunny.root.position.set(-21.1, 0, 1.0);

    this.orbitYaw = Math.PI; // Camera behind player looking along the street
    this.orbitDistance = 6.0;
    this.orbitPitch = 0.28;
    this.manualLookTimer = 0;

    // Immediately snap camera to street view so there is zero lerping through walls
    this.snapCameraToTarget(6.0, 0.28, Math.PI);

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

    // Place player inside sanctum facing north towards Shivling
    this.charPos.set(14, 0, -24.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.set(14, 0, -24.5);
    this.shirjana.root.position.set(15.2, 0, -24.3);
    this.bunny.root.position.set(12.9, 0, -24.1);

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
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = false;
    this.collisionSystem.buildExteriorColliders();

    // Place player in temple courtyard / street in front of stone steps
    this.charPos.set(14, 0, -17.5);
    this.charRotation = 0;

    this.aalekh.root.position.set(14, 0, -17.5);
    this.shirjana.root.position.set(15.2, 0, -17.3);
    this.bunny.root.position.set(12.8, 0, -17.0);

    this.orbitYaw = Math.PI;
    this.orbitDistance = 6.0;
    this.orbitPitch = 0.28;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(6.0, 0.28, Math.PI);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  public enterHanuman() {
    this.isInsideBuilding = false;
    this.isInsideTemple = false;
    this.isInsideHanuman = true;
    this.collisionSystem.isInsideBuilding = false;
    this.collisionSystem.isInsideTemple = true;
    this.collisionSystem.setInteriorColliders(
      this.hanumanSuite.interiorBounds,
      this.hanumanSuite.interiorColliders,
      3.2
    );

    // Place player inside Hanuman Mandir sanctum facing north towards idol
    this.charPos.set(-12, 0, -25.5);
    this.charRotation = Math.PI;

    this.aalekh.root.position.set(-12, 0, -25.5);
    this.shirjana.root.position.set(-10.8, 0, -25.3);
    this.bunny.root.position.set(-13.1, 0, -25.1);

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
    this.collisionSystem.buildExteriorColliders();

    // Place player in front of Hanuman Mandir stone steps
    this.charPos.set(-12, 0, -18.5);
    this.charRotation = 0;

    this.aalekh.root.position.set(-12, 0, -18.5);
    this.shirjana.root.position.set(-10.8, 0, -18.3);
    this.bunny.root.position.set(-13.1, 0, -18.1);

    this.orbitYaw = Math.PI;
    this.orbitDistance = 6.0;
    this.orbitPitch = 0.28;
    this.manualLookTimer = 0;

    this.snapCameraToTarget(6.0, 0.28, Math.PI);

    this.nearbyStation = null;
    this.onProximityChange?.(null);
  }

  // Lifestyle & Seating Systems
  public sitDown(anchorId?: string) {
    const anchor =
      this.interiorSuite.seatAnchors.find((a) => a.id === anchorId) ||
      this.interiorSuite.seatAnchors[0];
    if (!anchor) return;

    this.isSitting = true;
    this.activeSeatAnchor = anchor;
    this.charPos.copy(anchor.position);
    this.charRotation = anchor.rotationY;

    this.aalekh.root.position.copy(this.charPos);
    this.aalekh.root.rotation.y = this.charRotation;
    this.aalekh.setSitting(true);

    // Place Sana gracefully seated alongside
    if (anchor.id === "seat-sofa-center") {
      this.shirjana.root.position.set(anchor.position.x + 0.8, 0, anchor.position.z);
      this.shirjana.root.rotation.y = anchor.rotationY;
      this.shirjana.setSitting(true);
    } else {
      this.shirjana.root.position.set(anchor.position.x + 0.9, 0, anchor.position.z);
      this.shirjana.root.rotation.y = anchor.rotationY;
      this.shirjana.setSitting(true);
    }

    // Smooth camera framing for conversation and TV
    this.orbitYaw = anchor.rotationY;
    this.orbitDistance = 3.6;
    this.orbitPitch = 0.22;
    this.snapCameraToTarget(3.6, 0.22, anchor.rotationY);
  }

  public standUp() {
    if (!this.isSitting) return;
    this.isSitting = false;
    this.isWatchingTV = false;
    this.activeSeatAnchor = null;
    this.aalekh.setSitting(false);
    this.shirjana.setSitting(false);

    // Step slightly forward from the seat
    this.charPos.z += 0.8;
    this.aalekh.root.position.copy(this.charPos);
    this.shirjana.root.position.set(this.charPos.x + 1.1, 0, this.charPos.z);
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
    if (this.isSitting && (Math.abs(this.moveVector.x) > 0.05 || Math.abs(this.moveVector.y) > 0.05)) {
      this.standUp();
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
          this.charRotation = Math.atan2(moveDirX, moveDirZ);
        }
      } else {
        this.isWalking = false;
      }
    }

    // Resolve Movement with Wall Sliding Physics
    const resolved = this.collisionSystem.resolveMovement(
      this.charPos.x,
      this.charPos.z,
      proposedDx,
      proposedDz
    );

    if (this.isInsideBuilding) {
      this.charPos.x = Math.max(this.interiorSuite.bounds.minX + 0.4, Math.min(this.interiorSuite.bounds.maxX - 0.4, resolved.x));
      this.charPos.z = Math.max(this.interiorSuite.bounds.minZ + 0.4, Math.min(this.interiorSuite.bounds.maxZ - 0.4, resolved.z));
    } else if (this.isInsideTemple) {
      this.charPos.x = Math.max(this.templeSuite.interiorBounds.minX + 0.4, Math.min(this.templeSuite.interiorBounds.maxX - 0.4, resolved.x));
      this.charPos.z = Math.max(this.templeSuite.interiorBounds.minZ + 0.4, Math.min(this.templeSuite.interiorBounds.maxZ - 0.4, resolved.z));
    } else {
      this.charPos.x = Math.max(-65, Math.min(65, resolved.x));
      this.charPos.z = Math.max(-55, Math.min(50, resolved.z));
    }

    this.aalekh.root.position.set(this.charPos.x, 0, this.charPos.z);
    this.aalekh.root.rotation.y = this.charRotation;
    this.aalekh.updateAnimation(this.isWalking, time);

    // Sana follows beside Aalekh harmoniously
    const sanaTargetX = this.charPos.x + Math.cos(this.charRotation) * 1.15;
    const sanaTargetZ = this.charPos.z - Math.sin(this.charRotation) * 1.15;
    this.shirjana.root.position.x += (sanaTargetX - this.shirjana.root.position.x) * 0.16;
    this.shirjana.root.position.z += (sanaTargetZ - this.shirjana.root.position.z) * 0.16;
    this.shirjana.root.rotation.y = this.charRotation;
    this.shirjana.updateAnimation(this.isWalking, time);

    // Bunny follows Aalekh and Sana joyfully
    const bunnyTargetX = this.charPos.x - Math.sin(this.charRotation) * 1.25;
    const bunnyTargetZ = this.charPos.z - Math.cos(this.charRotation) * 1.25;
    this.bunny.root.position.x += (bunnyTargetX - this.bunny.root.position.x) * 0.18;
    this.bunny.root.position.z += (bunnyTargetZ - this.bunny.root.position.z) * 0.18;
    this.bunny.root.rotation.y = this.charRotation;
    this.bunny.updateAnimation(this.isWalking, time);
  }

  private updateCameraSystem(delta: number, time: number) {
    // 1. Process Right Joystick look input (Manual Orbit)
    if (this.cameraMode !== "story" && this.lookVector.lengthSq() > 0.01) {
      const lookSpeed = 2.4 * this.orbitSensitivity;
      this.orbitYaw -= this.lookVector.x * lookSpeed * delta;
      const pitchFactor = this.invertPitch ? 1 : -1;
      this.orbitPitch = Math.max(
        0.08,
        Math.min(1.15, this.orbitPitch + this.lookVector.y * pitchFactor * lookSpeed * delta)
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

    if (this.cameraMode === "story") {
      const sweepX = -10 + Math.sin(time * 0.15) * 6;
      const sweepZ = 24 + Math.cos(time * 0.15) * 4;
      this.targetCameraPos.set(sweepX, 15, sweepZ);
      this.targetLookAt.set(0, 2.5, 0);
    } else if (this.cameraMode === "exploration") {
      const charHeadY = 1.6;
      const baseDist = this.isInsideBuilding ? 3.8 : this.isInsideTemple ? 4.5 : 6.0;

      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);

      let effectiveDist = baseDist;

      // 3. Camera Collision Obstruction Avoidance (Multi-ray test)
      const candidateX = this.charPos.x + sinYaw * cosPitch * effectiveDist;
      const candidateY = Math.max(1.3, sinPitch * effectiveDist + charHeadY);
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
        effectiveDist = Math.max(1.8, effectiveDist * camCheck.safeDistRatio);
      }

      const offsetX = sinYaw * cosPitch * effectiveDist;
      const maxY = this.isInsideBuilding || this.isInsideTemple ? 3.8 : 25;
      const offsetY = Math.max(1.2, Math.min(maxY, sinPitch * effectiveDist + charHeadY));
      const offsetZ = cosYaw * cosPitch * effectiveDist;

      this.targetCameraPos.set(
        this.charPos.x + offsetX,
        offsetY,
        this.charPos.z + offsetZ
      );

      // Dynamic Look-Ahead: slightly offset look target toward movement direction
      const lookAheadX = this.isWalking ? Math.sin(this.charRotation) * 0.8 : 0;
      const lookAheadZ = this.isWalking ? -Math.cos(this.charRotation) * 0.8 : 0;
      this.targetLookAt.set(this.charPos.x + lookAheadX, charHeadY, this.charPos.z + lookAheadZ);
    } else if (this.cameraMode === "closeup") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.min(this.orbitDistance, 3.2);

      this.targetCameraPos.set(
        this.charPos.x + sinYaw * cosPitch * dist,
        Math.max(1.4, sinPitch * dist + 1.2),
        this.charPos.z + cosYaw * cosPitch * dist
      );
      this.targetLookAt.set(this.charPos.x, 1.5, this.charPos.z);
    } else if (this.cameraMode === "street") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.min(this.orbitDistance, 5.5);

      this.targetCameraPos.set(
        this.charPos.x + sinYaw * cosPitch * dist,
        Math.max(1.3, sinPitch * dist + 1.0),
        this.charPos.z + cosYaw * cosPitch * dist
      );
      this.targetLookAt.set(this.charPos.x, 1.5, this.charPos.z);
    } else if (this.cameraMode === "birdeye") {
      const pitch = 1.15;
      const dist = 36.0;
      this.targetCameraPos.set(
        this.charPos.x + Math.sin(this.orbitYaw) * Math.cos(pitch) * dist,
        34.0,
        this.charPos.z + Math.cos(this.orbitYaw) * Math.cos(pitch) * dist
      );
      this.targetLookAt.set(this.charPos.x, 0, this.charPos.z);
    } else if (this.cameraMode === "lanternsky") {
      const lanternPos = this.stations.stationC_LanternMesh.position;
      this.targetCameraPos.set(lanternPos.x - 8, Math.max(lanternPos.y - 2, 4), lanternPos.z + 10);
      this.targetLookAt.copy(lanternPos);
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
}
