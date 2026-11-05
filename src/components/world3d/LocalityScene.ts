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
  public lookVector = new THREE.Vector2(0, 0); // Normalized camera look input from Right Joystick
  public isWalking = false;
  private targetDestination: THREE.Vector3 | null = null;

  // Camera Orbit Rig & State
  public cameraMode: CameraViewMode = "story"; // Default to cinematic story framing
  public orbitYaw = 0; // Horizontal orbit around character (radians)
  public orbitPitch = 0.32; // Vertical orbit inclination (radians)
  public orbitDistance = 9.5; // Distance from character (meters)
  public orbitSensitivity = 1.0;
  public invertPitch = false;

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
  private tempToTarget = new THREE.Vector3();

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07091a);
    this.scene.fog = new THREE.FogExp2(0x07091a, 0.009); // Soft atmospheric fog

    const width = container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
    const height = container.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);

    this.camera = new THREE.PerspectiveCamera(
      48,
      width / (height || 1),
      0.1,
      400
    );
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
    this.setupInputListeners();
  }

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private setupInputListeners() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
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
      }
    });

    window.addEventListener("pointerup", (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      // If it was a clean tap without dragging, navigate to the clicked floor spot!
      if (!hasDragged && (e.target as HTMLElement).tagName === "CANVAS" && this.cameraMode !== "story") {
        const rect = this.container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersection = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          this.navigateTo(
            Math.max(-65, Math.min(65, intersection.x)),
            Math.max(-55, Math.min(50, intersection.z))
          );
        }
      }
    });

    // Mouse wheel zoom
    this.container.addEventListener(
      "wheel",
      (e) => {
        if (this.cameraMode !== "story") {
          this.adjustZoom(e.deltaY * 0.015);
        }
      },
      { passive: true }
    );
  }

  public setCameraMode(mode: CameraViewMode) {
    this.cameraMode = mode;
    if (mode === "closeup") {
      this.orbitDistance = 3.8;
      this.orbitPitch = 0.18;
    } else if (mode === "street") {
      this.orbitDistance = 7.0;
      this.orbitPitch = 0.12;
    } else if (mode === "birdeye") {
      this.orbitDistance = 38.0;
      this.orbitPitch = 1.15;
    } else if (mode === "exploration") {
      this.orbitDistance = 9.5;
      this.orbitPitch = 0.32;
    }
  }

  public setInputVector(x: number, y: number) {
    this.moveVector.set(x, y);
    if (this.moveVector.lengthSq() > 0.01) {
      this.targetDestination = null;
    }
  }

  public setLookVector(x: number, y: number) {
    this.lookVector.set(x, y);
  }

  public adjustCameraOrbit(deltaYaw: number, deltaPitch: number) {
    this.orbitYaw = (this.orbitYaw + deltaYaw) % (Math.PI * 2);
    this.orbitPitch = Math.max(0.08, Math.min(1.18, this.orbitPitch + deltaPitch));
  }

  public adjustZoom(delta: number) {
    this.orbitDistance = Math.max(3.2, Math.min(26.0, this.orbitDistance + delta));
  }

  public resetCamera() {
    this.orbitYaw = 0;
    this.orbitPitch = 0.32;
    this.orbitDistance = 9.5;
  }

  public setCameraSensitivity(sens: number) {
    this.orbitSensitivity = Math.max(0.2, Math.min(3.0, sens));
  }

  public setInvertPitch(invert: boolean) {
    this.invertPitch = invert;
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
    const moveSpeed = 7.0;
    let dx = 0;
    let dz = 0;

    if (this.cameraMode !== "story") {
      if (this.moveVector.lengthSq() > 0.01) {
        // Camera-relative forward & right vectors on the ground plane (X-Z)
        const forwardX = -Math.sin(this.orbitYaw);
        const forwardZ = -Math.cos(this.orbitYaw);

        const rightX = -forwardZ;
        const rightZ = forwardX;

        // Joystick deflection: -Y is forward (push up), +X is strafe right
        const forwardInput = -this.moveVector.y;
        const rightInput = this.moveVector.x;

        const moveDirX = forwardX * forwardInput + rightX * rightInput;
        const moveDirZ = forwardZ * forwardInput + rightZ * rightInput;
        const len = Math.hypot(moveDirX, moveDirZ);

        if (len > 0.01) {
          dx = (moveDirX / len) * moveSpeed * delta;
          dz = (moveDirZ / len) * moveSpeed * delta;
          this.isWalking = true;
          this.charRotation = Math.atan2(moveDirX, moveDirZ);
        }
      } else if (this.targetDestination) {
        const toTarget = this.tempToTarget.subVectors(this.targetDestination, this.charPos);
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

    // Free-roam continuous boundary bounds
    this.charPos.x = Math.max(-65, Math.min(65, this.charPos.x + dx));
    this.charPos.z = Math.max(-55, Math.min(50, this.charPos.z + dz));

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
    // Process Right Joystick camera look / orbit
    if (this.cameraMode !== "story" && this.lookVector.lengthSq() > 0.01) {
      const lookSpeed = 2.4 * this.orbitSensitivity;
      this.orbitYaw -= this.lookVector.x * lookSpeed * delta;
      const pitchFactor = this.invertPitch ? 1 : -1;
      this.orbitPitch = Math.max(
        0.08,
        Math.min(1.18, this.orbitPitch + this.lookVector.y * pitchFactor * lookSpeed * delta)
      );
    }

    const lerpFactor = Math.min(delta * 5.0, 1.0);

    if (this.cameraMode === "story") {
      // Cinematic slow sweeping view across the illuminated Dattawadi neighbourhood
      const sweepX = -10 + Math.sin(time * 0.15) * 6;
      const sweepZ = 24 + Math.cos(time * 0.15) * 4;
      this.targetCameraPos.set(sweepX, 15, sweepZ);
      this.targetLookAt.set(0, 2.5, 0);
    } else if (this.cameraMode === "exploration") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);

      const offsetX = sinYaw * cosPitch * this.orbitDistance;
      const offsetY = Math.max(1.6, sinPitch * this.orbitDistance + 1.4);
      const offsetZ = cosYaw * cosPitch * this.orbitDistance;

      this.targetCameraPos.set(
        this.charPos.x + offsetX,
        offsetY,
        this.charPos.z + offsetZ
      );
      this.targetLookAt.set(this.charPos.x, 1.6, this.charPos.z);
    } else if (this.cameraMode === "closeup") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.min(this.orbitDistance, 4.5);

      this.targetCameraPos.set(
        this.charPos.x + sinYaw * cosPitch * dist,
        Math.max(1.5, sinPitch * dist + 1.2),
        this.charPos.z + cosYaw * cosPitch * dist
      );
      this.targetLookAt.set(this.charPos.x, 1.5, this.charPos.z);
    } else if (this.cameraMode === "street") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.min(this.orbitDistance, 7.5);

      this.targetCameraPos.set(
        this.charPos.x + sinYaw * cosPitch * dist,
        Math.max(1.3, sinPitch * dist + 1.0),
        this.charPos.z + cosYaw * cosPitch * dist
      );
      this.targetLookAt.set(this.charPos.x, 1.4, this.charPos.z);
    } else if (this.cameraMode === "birdeye") {
      const cosPitch = Math.cos(this.orbitPitch);
      const sinPitch = Math.sin(this.orbitPitch);
      const sinYaw = Math.sin(this.orbitYaw);
      const cosYaw = Math.cos(this.orbitYaw);
      const dist = Math.max(this.orbitDistance, 32.0);

      this.targetCameraPos.set(
        this.charPos.x + sinYaw * cosPitch * dist,
        Math.max(26.0, sinPitch * dist),
        this.charPos.z + cosYaw * cosPitch * dist
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
