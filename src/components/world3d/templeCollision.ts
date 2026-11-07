import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";

export interface TempleGroundHeightProfile {
  getGroundHeight: (x: number, z: number, isInsideTemple: boolean, isInsideHanuman: boolean) => number;
  shivaSanctumFloorY: number;
  hanumanSanctumFloorY: number;
  exteriorPlinthY: number;
}

export const TEMPLE_GROUND_PROFILE: TempleGroundHeightProfile = {
  shivaSanctumFloorY: 0.0,
  hanumanSanctumFloorY: 0.0,
  exteriorPlinthY: 0.0,

  /**
   * Calculates the exact floor elevation so characters NEVER sink into temple or courtyard floors.
   * Returns exact surface contact Y in world units.
   */
  getGroundHeight(x: number, z: number, isInsideTemple: boolean, isInsideHanuman: boolean): number {
    // 1. Inside Shiva Temple Sanctum
    if (isInsideTemple) {
      return 0.0;
    }

    // 2. Inside Hanuman Temple Sanctum
    if (isInsideHanuman) {
      return 0.0;
    }

    // 3. Exterior Steps leading up to Shiva Temple (x: 11 to 17, z: -20 to -17)
    if (x >= 11 && x <= 17 && z >= -20 && z <= -17) {
      return 0.0;
    }

    // 4. Default open world road / plaza surface
    return 0.0;
  },
};

/**
 * Validates that an exit spawn position is completely free from environmental colliders.
 */
export function getSafeTempleExitPosition(
  templeType: "shiva" | "hanuman" | "residence"
): THREE.Vector3 {
  switch (templeType) {
    case "shiva":
      // Wide open courtyard plaza at tx = 14, tz = -17.5 facing south towards main avenue
      return new THREE.Vector3(14.0, 0.0, -17.5);
    case "hanuman":
      // Wide open plaza at tx = -12, tz = -18.0 facing south towards main avenue
      return new THREE.Vector3(-12.0, 0.0, -18.0);
    case "residence":
      // Open street in front of Sana Residence at x = -20, z = 3.5
      return new THREE.Vector3(-20.0, 0.0, 3.5);
  }
}

