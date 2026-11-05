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
  public playerRadius = 0.45; // meters
  public isInsideBuilding = false;
  public isInsideTemple = false;
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

  public buildExteriorColliders() {
    this.exteriorColliders = [];

    // 1. Building Footprint Colliders from LOCALITY_BUILDINGS
    LOCALITY_BUILDINGS.forEach((b: BuildingPlot) => {
      const halfW = b.width / 2 + 0.25;
      const halfD = b.depth / 2 + 0.25;

      this.exteriorColliders.push({
        id: b.id,
        minX: b.x - halfW,
        maxX: b.x + halfW,
        minZ: b.z - halfD,
        maxZ: b.z + halfD,
      });
    });

    // 2. Gateway Pillars Colliders
    this.exteriorColliders.push(
      { id: "gateway-l", minX: -37, maxX: -35, minZ: -5.4, maxZ: -4.2 },
      { id: "gateway-r", minX: -37, maxX: -35, minZ: 4.2, maxZ: 5.4 }
    );
  }

  public setInteriorColliders(
    interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number },
    furniture: BoxCollider[],
    doorwayWidth = 2.4
  ) {
    const doorHalf = doorwayWidth / 2;
    const centerDoorX = (interiorBounds.minX + interiorBounds.maxX) / 2;

    this.interiorColliders = [
      // Outer perimeter walls (colliders blocking walking outside room)
      // North Wall
      {
        id: "int-wall-n",
        minX: interiorBounds.minX - 15,
        maxX: interiorBounds.maxX + 15,
        minZ: interiorBounds.minZ - 6,
        maxZ: interiorBounds.minZ,
      },
      // South Wall with doorway gap in center
      {
        id: "int-wall-sw",
        minX: interiorBounds.minX - 15,
        maxX: centerDoorX - doorHalf,
        minZ: interiorBounds.maxZ,
        maxZ: interiorBounds.maxZ + 6,
      },
      {
        id: "int-wall-se",
        minX: centerDoorX + doorHalf,
        maxX: interiorBounds.maxX + 15,
        minZ: interiorBounds.maxZ,
        maxZ: interiorBounds.maxZ + 6,
      },
      // West Wall
      {
        id: "int-wall-w",
        minX: interiorBounds.minX - 6,
        maxX: interiorBounds.minX,
        minZ: interiorBounds.minZ - 15,
        maxZ: interiorBounds.maxZ + 15,
      },
      // East Wall
      {
        id: "int-wall-e",
        minX: interiorBounds.maxX,
        maxX: interiorBounds.maxX + 6,
        minZ: interiorBounds.minZ - 15,
        maxZ: interiorBounds.maxZ + 15,
      },
      // Furniture / Pillar colliders
      ...furniture,
    ];
  }

  /**
   * Resolves proposed movement (dx, dz) with wall-sliding physics.
   */
  public resolveMovement(posX: number, posZ: number, dx: number, dz: number): { x: number; z: number; hitWall: boolean } {
    const colliders = this.isInsideBuilding || this.isInsideTemple ? this.interiorColliders : this.exteriorColliders;
    const r = this.playerRadius;

    let newX = posX + dx;
    let newZ = posZ + dz;
    let hitWall = false;

    // 1. Check Full Diagonal Movement First
    const collides = this.checkPointCollision(newX, newZ, colliders, r);

    if (collides) {
      hitWall = true;

      // 2. Wall Sliding: Try moving along X axis only
      const safeX = !this.checkPointCollision(posX + dx, posZ, colliders, r);
      // Try moving along Z axis only
      const safeZ = !this.checkPointCollision(posX, posZ + dz, colliders, r);

      if (safeX && !safeZ) {
        newX = posX + dx;
        newZ = posZ;
      } else if (!safeX && safeZ) {
        newX = posX;
        newZ = posZ + dz;
      } else if (safeX && safeZ) {
        if (Math.abs(dx) > Math.abs(dz)) {
          newX = posX + dx;
          newZ = posZ;
        } else {
          newX = posX;
          newZ = posZ + dz;
        }
      } else {
        newX = posX;
        newZ = posZ;
      }
    }

    return { x: newX, z: newZ, hitWall };
  }

  private checkPointCollision(x: number, z: number, colliders: BoxCollider[], radius: number): boolean {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (
        x > c.minX - radius &&
        x < c.maxX + radius &&
        z > c.minZ - radius &&
        z < c.maxZ + radius
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Universal 3D camera obstruction check for exterior AND interior.
   * Pulls camera smoothly in front of walls, ceilings, and obstacles.
   */
  public checkCameraObstruction(
    startX: number,
    startY: number,
    startZ: number,
    targetX: number,
    targetY: number,
    targetZ: number
  ): { hit: boolean; safeDistRatio: number } {
    const colliders = this.isInsideBuilding || this.isInsideTemple ? this.interiorColliders : this.exteriorColliders;
    const steps = 14;
    const padding = 0.35;

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const testX = startX + (targetX - startX) * t;
      const testY = startY + (targetY - startY) * t;
      const testZ = startZ + (targetZ - startZ) * t;

      // Ceiling check for interior rooms
      if ((this.isInsideBuilding || this.isInsideTemple) && testY > 3.9) {
        return { hit: true, safeDistRatio: Math.max(0.35, (s - 1) / steps) };
      }

      for (let i = 0; i < colliders.length; i++) {
        const c = colliders[i];
        if (
          testX >= c.minX - padding &&
          testX <= c.maxX + padding &&
          testZ >= c.minZ - padding &&
          testZ <= c.maxZ + padding
        ) {
          return { hit: true, safeDistRatio: Math.max(0.3, (s - 1) / steps) };
        }
      }
    }

    return { hit: false, safeDistRatio: 1.0 };
  }

  /**
   * Wall Occlusion Fading:
   * Smoothly fades opacity of any wall mesh between character and camera so
   * characters are NEVER blocked by solid geometry.
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
