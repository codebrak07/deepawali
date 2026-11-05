import * as THREE from "three";
import { createLocalityRoadNetwork } from "./LocalityRoadNetwork";
import { createLocalityBuildings } from "./LocalityBuildings";
import { createDiwaliDecorations } from "./DiwaliDecorations3D";
import { createAalekhCharacter, createShirjanaCharacter, createBunnyCompanion, CharacterRig, BunnyRig } from "./Characters3D";
import { createInteractiveStations, Station3DObjects } from "./InteractiveStations3D";
import { INTERACTIVE_STATIONS } from "./LocalityData";

export type CameraViewMode = "exploration" | "closeup" | "street" | "birdeye" | "lanternsky" | "story";

export class LocalitySceneEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;

  // Rigs
  public aalekh: CharacterRig;
  public shirjana: CharacterRig;
  public bunny: BunnyRig;
  private stations: Station3DObjects;
  private updateDecorations: (time: number) => void;

  // Character Physics & State
  public charPos = new THREE.Vector3(0, 0, 4); // Start near Station A & Chowk
  public charRotation = 0;
  public moveVector = new THREE.Vector2(0, 0); // Normalized movement input
  public isWalking = false;
  private targetDestination: THREE.Vector3 | null = null;

  // Camera Rig & State
  public cameraMode: CameraViewMode = "story"; // Default to cinematic story framing
  private targetCameraPos = new THREE.Vector3(-12, 16, 28);
  private targetLookAt = new THREE.Vector3(0, 2, 0);
  private currentCameraPos = new THREE.Vector3(-12, 16, 28);
  private currentLookAt = new THREE.Vector3(0, 2, 0);

  // Stations State
  public nearbyStation: string | null = null;
  public rangoliProgress = 0.2; // 0 to 1
  public lanternRising = false;

  // Callbacks
  public onProximityChange?: (stationId: string | null) => void;

  private isRunning = false;
  private animationId: number | null = null;
  private clock = new THREE.Clock();

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07091a);
    this.scene.fog = new THREE.FogExp2(0x07091a, 0.009); // Soft atmospheric fog

    this.camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    this.camera.position.set(-12, 16, 28);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35; // Bright, vibrant festive exposure!
    container.appendChild(this.renderer.domElement);

    // 2. Lighting Setup (Bright, warm, vibrant Diwali atmosphere)
    const ambientLight = new THREE.AmbientLight(0x42385c, 1.4);
    this.scene.add(ambientLight);

    // Soft Festive Ground-Bounce Hemispherical Light
    const hemiLight = new THREE.HemisphereLight(0x4338ca, 0x9a3412, 0.85);
    this.scene.add(hemiLight);

    // Directional Moonlight
    const moonDirLight = new THREE.DirectionalLight(0xc7d2fe, 1.1);
    moonDirLight.position.set(50, 75, -60);
    moonDirLight.castShadow = true;
    moonDirLight.shadow.mapSize.width = 1024;
    moonDirLight.shadow.mapSize.height = 1024;
    moonDirLight.shadow.camera.near = 10;
    moonDirLight.shadow.camera.far = 220;
    const d = 55;
    moonDirLight.shadow.camera.left = -d;
    moonDirLight.shadow.camera.right = d;
    moonDirLight.shadow.camera.top = d;
    moonDirLight.shadow.camera.bottom = -d;
    this.scene.add(moonDirLight);

    // 3. Build Locality Environments
    createLocalityRoadNetwork(this.scene);
    createLocalityBuildings(this.scene);
    const deco = createDiwaliDecorations(this.scene);
    this.updateDecorations = deco.updateDecorations;
    this.stations = createInteractiveStations(this.scene);

    // 4. Create Characters (Aalekh, Shirjana, Bunny)
    this.aalekh = createAalekhCharacter();
    this.shirjana = createShirjanaCharacter();
    this.bunny = createBunnyCompanion();

    this.aalekh.root.position.copy(this.charPos);
    this.scene.add(this.aalekh.root);

    this.shirjana.root.position.set(this.charPos.x + 1.2, 0, this.charPos.z + 0.2);
    this.scene.add(this.shirjana.root);

    this.bunny.root.position.set(this.charPos.x - 0.9, 0, this.charPos.z + 0.8);
    this.scene.add(this.bunny.root);

    // 5. Event Listeners
    window.addEventListener("resize", this.handleResize);
    this.setupFloorRaycaster();
  }

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private setupFloorRaycaster() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener("pointerdown", (e) => {
      if ((e.target as HTMLElement).tagName !== "CANVAS") return;
      if (this.cameraMode === "story") return; // In story mode, canvas clicks don't move character

      const rect = this.container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        this.targetDestination = new THREE.Vector3(
          Math.max(-50, Math.min(50, intersection.x)),
          0,
          Math.max(-45, Math.min(40, intersection.z))
        );
      }
    });
  }

  public setCameraMode(mode: CameraViewMode) {
    this.cameraMode = mode;
  }

  public setInputVector(x: number, y: number) {
    this.moveVector.set(x, y);
    if (this.moveVector.lengthSq() > 0.01) {
      this.targetDestination = null;
    }
  }

  public navigateTo(x: number, z: number) {
    this.targetDestination = new THREE.Vector3(x, 0, z);
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

    this.updateDecorations(time);
    this.stations.updateStations(time, this.rangoliProgress, this.lanternRising);

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.loop);
  };

  private updateCharacterPhysics(delta: number, time: number) {
    const moveSpeed = 6.5;
    let dx = 0;
    let dz = 0;

    if (this.cameraMode !== "story") {
      if (this.moveVector.lengthSq() > 0.01) {
        dx = this.moveVector.x * moveSpeed * delta;
        dz = this.moveVector.y * moveSpeed * delta;
        this.isWalking = true;
        this.charRotation = Math.atan2(dx, dz);
      } else if (this.targetDestination) {
        const toTarget = new THREE.Vector3().subVectors(this.targetDestination, this.charPos);
        toTarget.y = 0;
        const dist = toTarget.length();

        if (dist > 0.4) {
          toTarget.normalize();
          dx = toTarget.x * moveSpeed * delta;
          dz = toTarget.z * moveSpeed * delta;
          this.isWalking = true;
          this.charRotation = Math.atan2(toTarget.x, toTarget.z);
        } else {
          this.targetDestination = null;
          this.isWalking = false;
        }
      } else {
        this.isWalking = false;
      }
    } else {
      this.isWalking = false;
    }

    this.charPos.x = Math.max(-52, Math.min(52, this.charPos.x + dx));
    this.charPos.z = Math.max(-48, Math.min(42, this.charPos.z + dz));

    this.aalekh.root.position.set(this.charPos.x, 0, this.charPos.z);
    this.aalekh.root.rotation.y = this.charRotation;
    this.aalekh.updateAnimation(this.isWalking, time);

    const sanaTargetX = this.charPos.x + Math.cos(this.charRotation) * 1.2;
    const sanaTargetZ = this.charPos.z - Math.sin(this.charRotation) * 1.2;
    this.shirjana.root.position.x += (sanaTargetX - this.shirjana.root.position.x) * 0.15;
    this.shirjana.root.position.z += (sanaTargetZ - this.shirjana.root.position.z) * 0.15;
    this.shirjana.root.rotation.y = this.charRotation;
    this.shirjana.updateAnimation(this.isWalking, time);

    const bunnyTargetX = this.charPos.x - Math.sin(this.charRotation) * 1.4;
    const bunnyTargetZ = this.charPos.z - Math.cos(this.charRotation) * 1.4;
    this.bunny.root.position.x += (bunnyTargetX - this.bunny.root.position.x) * 0.18;
    this.bunny.root.position.z += (bunnyTargetZ - this.bunny.root.position.z) * 0.18;
    this.bunny.root.rotation.y = this.charRotation;
    this.bunny.updateAnimation(this.isWalking, time);
  }

  private updateCameraSystem(delta: number, time: number) {
    const lerpFactor = Math.min(delta * 4.2, 1.0);

    if (this.cameraMode === "story") {
      // Cinematic slow sweeping view across the illuminated Dattawadi neighbourhood
      const sweepX = -10 + Math.sin(time * 0.15) * 6;
      const sweepZ = 24 + Math.cos(time * 0.15) * 4;
      this.targetCameraPos.set(sweepX, 15, sweepZ);
      this.targetLookAt.set(0, 2.5, 0);
    } else if (this.cameraMode === "exploration") {
      const camDist = 9.5;
      const camHeight = 5.2;
      this.targetCameraPos.set(
        this.charPos.x - Math.sin(this.charRotation) * camDist * 0.5,
        camHeight,
        this.charPos.z + camDist * 0.85
      );
      this.targetLookAt.set(this.charPos.x, 1.6, this.charPos.z);
    } else if (this.cameraMode === "closeup") {
      this.targetCameraPos.set(
        this.charPos.x + 0.5,
        1.7,
        this.charPos.z + 3.2
      );
      this.targetLookAt.set(this.charPos.x + 0.6, 1.6, this.charPos.z);
    } else if (this.cameraMode === "street") {
      this.targetCameraPos.set(this.charPos.x - 6, 1.3, this.charPos.z + 4);
      this.targetLookAt.set(this.charPos.x + 10, 2.6, this.charPos.z - 5);
    } else if (this.cameraMode === "birdeye") {
      this.targetCameraPos.set(0, 48, 25);
      this.targetLookAt.set(0, 0, 0);
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

    INTERACTIVE_STATIONS.forEach((st) => {
      const dist = Math.sqrt(
        Math.pow(this.charPos.x - st.x, 2) + Math.pow(this.charPos.z - st.z, 2)
      );
      if (dist < threshold) {
        nearest = st.id;
      }
    });

    if (nearest !== this.nearbyStation) {
      this.nearbyStation = nearest;
      this.onProximityChange?.(this.nearbyStation);
    }

    // When near Station B, automatically flow color into the 3D street Rangoli
    if (nearest === "station-b" && this.rangoliProgress < 1) {
      this.rangoliProgress = Math.min(1, this.rangoliProgress + 0.01);
    }
  }
}
