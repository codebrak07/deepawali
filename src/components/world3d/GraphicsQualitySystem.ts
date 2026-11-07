import * as THREE from "three";

export type GraphicsQualityPreset = "auto" | "low" | "medium" | "high";

export interface QualityProfile {
  preset: GraphicsQualityPreset;
  pixelRatio: number;
  shadowsEnabled: boolean;
  shadowMapSize: number;
  maxParticles: number;
  viewDistance: number;
}

export class GraphicsQualitySystem {
  private currentPreset: GraphicsQualityPreset = "auto";
  private activeTier: "low" | "medium" | "high" = "medium";
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private shadowLight: THREE.DirectionalLight | null = null;

  // FPS Profiling Window
  private frameCount = 0;
  private frameTimer = 0;
  private fpsHistory: number[] = [];
  private lowFpsCounter = 0;
  private highFpsCounter = 0;

  constructor(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    shadowLight?: THREE.DirectionalLight
  ) {
    this.renderer = renderer;
    this.camera = camera;
    if (shadowLight) this.shadowLight = shadowLight;

    // Load persisted preset preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("diwali_graphics_preset") as GraphicsQualityPreset | null;
      if (saved && ["auto", "low", "medium", "high"].includes(saved)) {
        this.currentPreset = saved;
      }
    }

    this.applyProfile(this.resolvePresetTier(this.currentPreset));
  }

  public setShadowLight(light: THREE.DirectionalLight) {
    this.shadowLight = light;
    this.applyShadowSettings();
  }

  public setPreset(preset: GraphicsQualityPreset) {
    this.currentPreset = preset;
    if (typeof window !== "undefined") {
      localStorage.setItem("diwali_graphics_preset", preset);
    }
    this.applyProfile(this.resolvePresetTier(preset));
  }

  public getPreset(): GraphicsQualityPreset {
    return this.currentPreset;
  }

  public getActiveTier(): "low" | "medium" | "high" {
    return this.activeTier;
  }

  private resolvePresetTier(preset: GraphicsQualityPreset): "low" | "medium" | "high" {
    if (preset !== "auto") return preset;
    // Default mobile to medium or low depending on hardware
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 1;
      const cores = navigator.hardwareConcurrency || 4;
      if (isMobile && cores <= 4) return "low";
      if (isMobile) return "medium";
    }
    return "high";
  }

  private applyProfile(tier: "low" | "medium" | "high") {
    this.activeTier = tier;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    let targetDpr = 1.0;
    if (tier === "low") {
      targetDpr = 1.0;
    } else if (tier === "medium") {
      targetDpr = isMobile ? 1.25 : 1.35;
    } else {
      targetDpr = isMobile ? 1.5 : 1.75;
    }

    const maxDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    this.renderer.setPixelRatio(Math.min(maxDpr, targetDpr));

    this.applyShadowSettings();

    // Adjust camera far plane for distance-based clipping
    const farDistance = tier === "low" ? 280 : tier === "medium" ? 380 : 450;
    if (this.camera.far !== farDistance) {
      this.camera.far = farDistance;
      this.camera.updateProjectionMatrix();
    }
  }

  private applyShadowSettings() {
    if (!this.shadowLight) return;

    if (this.activeTier === "low") {
      this.shadowLight.castShadow = false;
      this.renderer.shadowMap.enabled = false;
    } else {
      this.shadowLight.castShadow = true;
      this.renderer.shadowMap.enabled = true;
      const mapSize = this.activeTier === "medium" ? 1024 : 1024;
      this.shadowLight.shadow.mapSize.set(mapSize, mapSize);
    }
  }

  /**
   * Called every frame to measure performance and adaptively adjust quality when set to 'auto'.
   */
  public update(delta: number) {
    if (this.currentPreset !== "auto") return;

    this.frameCount++;
    this.frameTimer += delta;

    if (this.frameTimer >= 1.5) {
      const currentFps = this.frameCount / this.frameTimer;
      this.frameCount = 0;
      this.frameTimer = 0;

      this.fpsHistory.push(currentFps);
      if (this.fpsHistory.length > 5) this.fpsHistory.shift();

      const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

      // Drop quality if struggling below 28 FPS
      if (avgFps < 28) {
        this.lowFpsCounter++;
        this.highFpsCounter = 0;
        if (this.lowFpsCounter >= 2) {
          if (this.activeTier === "high") {
            this.applyProfile("medium");
            this.lowFpsCounter = 0;
          } else if (this.activeTier === "medium") {
            this.applyProfile("low");
            this.lowFpsCounter = 0;
          }
        }
      }
      // Upgrade quality if solid 55+ FPS
      else if (avgFps >= 55) {
        this.highFpsCounter++;
        this.lowFpsCounter = 0;
        if (this.highFpsCounter >= 5) {
          if (this.activeTier === "low") {
            this.applyProfile("medium");
            this.highFpsCounter = 0;
          } else if (this.activeTier === "medium" && window.innerWidth >= 768) {
            this.applyProfile("high");
            this.highFpsCounter = 0;
          }
        }
      } else {
        this.lowFpsCounter = 0;
        this.highFpsCounter = 0;
      }
    }
  }
}
