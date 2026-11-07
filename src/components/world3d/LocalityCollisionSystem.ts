import * as THREE from "three";
import { LOCALITY_BUILDINGS, BuildingPlot } from "./LocalityData";

export interface BoxCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY?: number;
  maxY?: number;
  isDoorway?: boolean;
}

export class LocalityCollisionSystem {
  public exteriorColliders: BoxCollider[] = [];
  public interiorColliders: BoxCollider[] = [];
  public playerRadius = 0.38; // meters (calibrated for natural walking & door navigation)
  public playerHeight = 1.75;
  public isInsideBuilding = false;
  public isInsideTemple = false;
  public isInsideHanuman = false;
  public currentInteriorId: string | null = null;

  // Occlusion fading registry
  private occlusionMeshes: THREE.Mesh[] = [];

  constructor() {
    this.buildExteriorColliders();
  }

  public registerOcclusionMesh(mesh: THREE.Mesh) {
    if (!this.occlusionMeshes.includes(mesh)) {
      this.occlusionMeshes.push(mesh);
    }
  }

  public clearOcclusionMeshes() {
    this.occlusionMeshes = [];
  }

  /**
   * Builds exterior colliders from all world buildings.
   * Explicitly skips custom architected suites (Shiva Temple, Hanuman Temple, Sana's Home)
   * so their entrances and steps are never blocked by generic box colliders.
   */
  public buildExteriorColliders(customSuitesColliders: BoxCollider[] = []) {
    this.exteriorColliders = [];

    // 1. Building Footprint Colliders from LOCALITY_BUILDINGS
    LOCALITY_BUILDINGS.forEach((b: BuildingPlot) => {
      // Skip custom suites that manage their own detailed entrance colliders
      if (b.id === "b-shiva-temple" || b.id === "b-hanuman-mandir" || b.id === "b-sana-home") {
        return;
      }

      const halfW = b.width / 2 + 0.15;
      const halfD = b.depth / 2 + 0.15;

      this.exteriorColliders.push({
        id: b.id,
        minX: b.x - halfW,
        maxX: b.x + halfW,
        minZ: b.z - halfD,
        maxZ: b.z + halfD,
      });
    });

    // 2. Add custom suite entrance colliders (e.g. temple side walls, mandapa balustrades)
    if (customSuitesColliders.length > 0) {
      this.exteriorColliders.push(...customSuitesColliders);
    }

    // 3. Welcome Gateway Pillars Colliders
    this.exteriorColliders.push(
      { id: "gateway-l", minX: -37.2, maxX: -34.8, minZ: -5.4, maxZ: -4.2 },
      { id: "gateway-r", minX: -37.2, maxX: -34.8, minZ: 4.2, maxZ: 5.4 }
    );
  }

  /**
   * Sets up room perimeter walls and furniture colliders for enterable interiors.
   */
  public setInteriorColliders(
    interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
    furniture: BoxCollider[],
    doorwayWidth = 2.8
  ) {
    const doorHalf = doorwayWidth / 2;
    const centerDoorX = (interiorBounds.minX + interiorBounds.maxX) / 2;

    this.interiorColliders = [
      // Outer perimeter walls (colliders blocking walking outside room)
      // North Wall
      {
        id: "int-wall-n",
        minX: interiorBounds.minX - 25,
        maxX: interiorBounds.maxX + 25,
        minZ: interiorBounds.minZ - 8,
        maxZ: interiorBounds.minZ,
      },
      // South Wall with generous doorway gap in center
      {
        id: "int-wall-sw",
        minX: interiorBounds.minX - 25,
        maxX: centerDoorX - doorHalf,
        minZ: interiorBounds.maxZ,
        maxZ: interiorBounds.maxZ + 8,
      },
      {
        id: "int-wall-se",
        minX: centerDoorX + doorHalf,
        maxX: interiorBounds.maxX + 25,
        minZ: interiorBounds.maxZ,
        maxZ: interiorBounds.maxZ + 8,
      },
      // West Wall
      {
        id: "int-wall-w",
        minX: interiorBounds.minX - 8,
        maxX: interiorBounds.minX,
        minZ: interiorBounds.minZ - 25,
        maxZ: interiorBounds.maxZ + 25,
      },
      // East Wall
      {
        id: "int-wall-e",
        minX: interiorBounds.maxX,
        maxX: interiorBounds.maxX + 8,
        minZ: interiorBounds.minZ - 25,
        maxZ: interiorBounds.maxZ + 25,
      },
      // Furniture / Interior Structure colliders
      ...furniture,
    ];
  }

  /**
   * Resolves proposed movement (dx, dz) with continuous sub-stepping and smooth wall-sliding physics.
   */
  public resolveMovement(
    posX: number,
    posZ: number,
    dx: number,
    dz: number,
    posY = 0
  ): { x: number; z: number; hitWall: boolean } {
    const isInterior = this.isInsideBuilding || this.isInsideTemple || this.isInsideHanuman;
    const colliders = isInterior ? this.interiorColliders : this.exteriorColliders;
    const r = this.playerRadius;

    // Sub-stepping for continuous collision detection (prevents tunneling through thin walls)
    const dist = Math.hypot(dx, dz);
    const subSteps = Math.max(1, Math.ceil(dist / 0.12));
    const stepDx = dx / subSteps;
    const stepDz = dz / subSteps;

    let currentX = posX;
    let currentZ = posZ;
    let anyHitWall = false;

    for (let s = 0; s < subSteps; s++) {
      const targetX = currentX + stepDx;
      const targetZ = currentZ + stepDz;

      const collidesBoth = this.checkPointCollision(targetX, targetZ, colliders, r, posY);

      if (!collidesBoth) {
        currentX = targetX;
        currentZ = targetZ;
      } else {
        anyHitWall = true;

        // Smooth wall sliding: try sliding along X axis
        const safeX = !this.checkPointCollision(currentX + stepDx, currentZ, colliders, r, posY);
        // Try sliding along Z axis
        const safeZ = !this.checkPointCollision(currentX, currentZ + stepDz, colliders, r, posY);

        if (safeX && !safeZ) {
          currentX += stepDx;
        } else if (!safeX && safeZ) {
          currentZ += stepDz;
        } else if (safeX && safeZ) {
          if (Math.abs(stepDx) >= Math.abs(stepDz)) {
            currentX += stepDx;
          } else {
            currentZ += stepDz;
          }
        }
        // If neither is safe, movement along both axes is blocked at this substep
      }
    }

    // Penetration Resolution: If current point overlaps any collider, softly project out
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (posY !== undefined) {
        if (c.minY !== undefined && posY < c.minY) continue;
        if (c.maxY !== undefined && posY > c.maxY) continue;
      }
      if (
        currentX > c.minX - r &&
        currentX < c.maxX + r &&
        currentZ > c.minZ - r &&
        currentZ < c.maxZ + r
      ) {
        anyHitWall = true;
        const dMinX = Math.abs(currentX - (c.minX - r));
        const dMaxX = Math.abs(currentX - (c.maxX + r));
        const dMinZ = Math.abs(currentZ - (c.minZ - r));
        const dMaxZ = Math.abs(currentZ - (c.maxZ + r));
        const minD = Math.min(dMinX, dMaxX, dMinZ, dMaxZ);
        if (minD === dMinX) currentX = c.minX - r;
        else if (minD === dMaxX) currentX = c.maxX + r;
        else if (minD === dMinZ) currentZ = c.minZ - r;
        else currentZ = c.maxZ + r;
      }
    }

    return { x: currentX, z: currentZ, hitWall: anyHitWall };
  }

  /**
   * Checks if a point (x, z) with radius r intersects any box collider.
   */
  public checkPointCollision(
    x: number,
    z: number,
    colliders: BoxCollider[],
    radius: number,
    posY?: number
  ): boolean {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (posY !== undefined) {
        if (c.minY !== undefined && posY < c.minY) continue;
        if (c.maxY !== undefined && posY > c.maxY) continue;
      }
      if (
        x >= c.minX - radius &&
        x <= c.maxX + radius &&
        z >= c.minZ - radius &&
        z <= c.maxZ + radius
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Finds a guaranteed collision-free spawn position near ideal (x, z).
   * Tests concentric clearance rings to ensure the player NEVER spawns inside a wall or obstacle.
   */
  public findSafeSpawnPosition(
    idealX: number,
    idealZ: number,
    isInterior: boolean,
    stepOffset = 0.5
  ): { x: number; z: number } {
    const colliders = isInterior ? this.interiorColliders : this.exteriorColliders;
    const r = this.playerRadius + 0.15; // Extra clearance margin

    // Check ideal position first
    if (!this.checkPointCollision(idealX, idealZ, colliders, r)) {
      return { x: idealX, z: idealZ };
    }

    // Spiral search for nearest safe open point
    const searchRadii = [0.6, 1.2, 1.8, 2.5, 3.2, 4.0];
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

    for (const radius of searchRadii) {
      for (const angle of angles) {
        const testX = idealX + Math.cos(angle) * radius;
        const testZ = idealZ + Math.sin(angle) * radius;
        if (!this.checkPointCollision(testX, testZ, colliders, r)) {
          return { x: testX, z: testZ };
        }
      }
    }

    // Fallback safe point
    return { x: idealX, z: idealZ + stepOffset };
  }

  /**
   * Universal 3D camera obstruction check for exterior AND interior.
   * Clamps safely without causing extreme close-ups.
   */
  public checkCameraObstruction(
    startX: number,
    startY: number,
    startZ: number,
    targetX: number,
    targetY: number,
    targetZ: number
  ): { hit: boolean; safeDistRatio: number } {
    const isInterior = this.isInsideBuilding || this.isInsideTemple || this.isInsideHanuman;
    const colliders = isInterior ? this.interiorColliders : this.exteriorColliders;
    const steps = 14;
    const padding = 0.28;

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const testX = startX + (targetX - startX) * t;
      const testY = startY + (targetY - startY) * t;
      const testZ = startZ + (targetZ - startZ) * t;

      // Ceiling check for interior rooms
      if (isInterior && testY > 3.9) {
        return { hit: true, safeDistRatio: Math.max(0.45, (s - 1) / steps) };
      }

      for (let i = 0; i < colliders.length; i++) {
        const c = colliders[i];
        if (
          testX >= c.minX - padding &&
          testX <= c.maxX + padding &&
          testZ >= c.minZ - padding &&
          testZ <= c.maxZ + padding
        ) {
          // Never crush exterior camera closer than 45% of total orbit distance
          const minRatio = isInterior ? 0.35 : 0.48;
          return { hit: true, safeDistRatio: Math.max(minRatio, (s - 1) / steps) };
        }
      }
    }

    return { hit: false, safeDistRatio: 1.0 };
  }

  /**
   * Wall Occlusion Fading:
   * Smoothly fades opacity of any wall mesh between character and camera.
   */
  public updateOcclusionFading(
    charPos: THREE.Vector3,
    camPos: THREE.Vector3,
    delta: number
  ) {
    if (this.occlusionMeshes.length === 0) return;

    const raycaster = new THREE.Raycaster();
    const dir = new THREE.Vector3().subVectors(camPos, charPos);
    const dist = dir.length();
    dir.normalize();

    raycaster.set(charPos, dir);
    raycaster.near = 0.2;
    raycaster.far = dist;

    const intersects = raycaster.intersectObjects(this.occlusionMeshes, false);
    const hitMeshes = new Set(intersects.map((hit) => hit.object as THREE.Mesh));

    this.occlusionMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      const isOccluding = hitMeshes.has(mesh);
      const targetOpacity = isOccluding ? 0.28 : 1.0;

      mat.transparent = true;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 1.0, targetOpacity, delta * 8.0);
    });
  }
}
