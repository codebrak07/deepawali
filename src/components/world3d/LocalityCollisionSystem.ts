import { LOCALITY_BUILDINGS, BuildingPlot } from "./LocalityData";

export interface BoxCollider {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  isDoorway?: boolean;
}

export class LocalityCollisionSystem {
  private exteriorColliders: BoxCollider[] = [];
  private interiorColliders: BoxCollider[] = [];
  public playerRadius = 0.45; // meters
  public isInsideBuilding = false;
  public currentInteriorId: string | null = null;

  constructor() {
    this.buildExteriorColliders();
  }

  private buildExteriorColliders() {
    this.exteriorColliders = [];

    // 1. Building Footprint Colliders from LOCALITY_BUILDINGS
    LOCALITY_BUILDINGS.forEach((b: BuildingPlot) => {
      // Half dimensions + plinth padding
      const halfW = b.width / 2 + 0.2;
      const halfD = b.depth / 2 + 0.2;

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

  public setInteriorColliders(interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number }, furniture: BoxCollider[]) {
    this.interiorColliders = [
      // Outer perimeter walls (colliders blocking outside of room)
      // North Wall
      { id: "int-wall-n", minX: interiorBounds.minX - 10, maxX: interiorBounds.maxX + 10, minZ: interiorBounds.minZ - 5, maxZ: interiorBounds.minZ },
      // South Wall (with doorway gap in center)
      { id: "int-wall-sw", minX: interiorBounds.minX - 10, maxX: (interiorBounds.minX + interiorBounds.maxX) / 2 - 1.0, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 5 },
      { id: "int-wall-se", minX: (interiorBounds.minX + interiorBounds.maxX) / 2 + 1.0, maxX: interiorBounds.maxX + 10, minZ: interiorBounds.maxZ, maxZ: interiorBounds.maxZ + 5 },
      // West Wall
      { id: "int-wall-w", minX: interiorBounds.minX - 5, maxX: interiorBounds.minX, minZ: interiorBounds.minZ - 10, maxZ: interiorBounds.maxZ + 10 },
      // East Wall
      { id: "int-wall-e", minX: interiorBounds.maxX, maxX: interiorBounds.maxX + 5, minZ: interiorBounds.minZ - 10, maxZ: interiorBounds.maxZ + 10 },
      // Furniture colliders
      ...furniture,
    ];
  }

  /**
   * Resolves proposed movement (dx, dz) with wall-sliding physics.
   * If diagonal move hits a wall, slides along the wall tangent instead of sticking.
   */
  public resolveMovement(posX: number, posZ: number, dx: number, dz: number): { x: number; z: number; hitWall: boolean } {
    const colliders = this.isInsideBuilding ? this.interiorColliders : this.exteriorColliders;
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
        // Slide horizontally along wall
        newX = posX + dx;
        newZ = posZ;
      } else if (!safeX && safeZ) {
        // Slide vertically along wall
        newX = posX;
        newZ = posZ + dz;
      } else if (safeX && safeZ) {
        // Both single axes are safe, resolve by sliding along dominant component
        if (Math.abs(dx) > Math.abs(dz)) {
          newX = posX + dx;
          newZ = posZ;
        } else {
          newX = posX;
          newZ = posZ + dz;
        }
      } else {
        // Completely cornered: halt movement
        newX = posX;
        newZ = posZ;
      }
    }

    return { x: newX, z: newZ, hitWall };
  }

  private checkPointCollision(x: number, z: number, colliders: BoxCollider[], radius: number): boolean {
    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      // AABB expanded by player radius
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
   * Check if a ray from start to end intersects any obstacle (for camera occlusion avoidance)
   */
  public checkCameraObstruction(startX: number, startY: number, startZ: number, targetX: number, targetY: number, targetZ: number): { hit: boolean; safeDistRatio: number } {
    if (this.isInsideBuilding) {
      return { hit: false, safeDistRatio: 1.0 };
    }

    const colliders = this.exteriorColliders;
    const steps = 10;
    const padding = 0.6;

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const testX = startX + (targetX - startX) * t;
      const testZ = startZ + (targetZ - startZ) * t;

      for (let i = 0; i < colliders.length; i++) {
        const c = colliders[i];
        if (
          testX >= c.minX - padding &&
          testX <= c.maxX + padding &&
          testZ >= c.minZ - padding &&
          testZ <= c.maxZ + padding
        ) {
          // Hit building wall: return safe ratio (pull camera in front of wall)
          return { hit: true, safeDistRatio: Math.max(0.25, (s - 1) / steps) };
        }
      }
    }

    return { hit: false, safeDistRatio: 1.0 };
  }
}
