import * as THREE from "three";
import { BoxCollider } from "./LocalityCollisionSystem";
import { buildHanumanTempleArchitecture, HanumanTemple3DSystem } from "./templeArchitecture";

export interface HanumanTempleSceneObjects {
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
  offerPrasad: () => void;
  lightDiya: () => void;
  updateAnimation: (time: number) => void;
}

/**
 * Creates the Lord Hanuman Temple System with authentic stepped Shikhara,
 * sculpted Sindoor Hanuman Murti with Gada, zero floor sinking, and sacred lighting.
 */
export function createHanumanTempleSystem(): HanumanTempleSceneObjects {
  const sys: HanumanTemple3DSystem = buildHanumanTempleArchitecture(-12.0, -32.0);
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
    offerFlowers: sys.offerGarland,
    offerPrasad: sys.seekBlessings,
    lightDiya: sys.lightDiya,
    updateAnimation: sys.updateAnimation,
  };
}
