import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";
import { buildShivaTempleArchitecture, ShivaTemple3DSystem } from "./templeArchitecture";

export interface TempleSceneObjects {
  exteriorGroup: THREE.Group;
  interiorGroup: THREE.Group;
  exteriorColliders: BoxCollider[];
  interiorColliders: BoxCollider[];
  interiorBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  entranceDoorPos: THREE.Vector3;
  streetExitPos: THREE.Vector3;
  occlusionMeshes: THREE.Mesh[];
  ringBell: () => void;
  offerFlowers: () => void;
  offerBilvaLeaves: () => void;
  performAbhishek: () => void;
  lightTempleDiya: () => void;
  updateAnimation: (time: number) => void;
}

/**
 * Creates the Lord Shiva Temple System with authentic Nagara Shikhara architecture,
 * black granite Shiva Lingam, sacred Yoni peetham, seated Nandi bull, and zero floor sinking.
 */
export function createShivaTempleSystem(): TempleSceneObjects {
  const sys: ShivaTemple3DSystem = buildShivaTempleArchitecture(14.0, -32.0);
  return {
    exteriorGroup: sys.exteriorGroup,
    interiorGroup: sys.interiorGroup,
    exteriorColliders: sys.exteriorColliders,
    interiorColliders: sys.interiorColliders,
    interiorBounds: sys.interiorBounds,
    entranceDoorPos: sys.entranceDoorPos,
    streetExitPos: sys.streetExitPos,
    occlusionMeshes: sys.occlusionMeshes,
    ringBell: sys.ringBell,
    offerFlowers: sys.offerFlowers,
    offerBilvaLeaves: sys.offerBilvaLeaves,
    performAbhishek: sys.performAbhishek,
    lightTempleDiya: sys.lightTempleDiya,
    updateAnimation: sys.updateAnimation,
  };
}
