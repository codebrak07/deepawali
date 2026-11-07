import * as THREE from "three";
import { loadPerson1Rig, Person1RigInstance } from "@/characters/person1/Person1Rig";
import { loadPerson2Rig, Person2RigInstance } from "@/characters/person2/Person2Rig";

export { type Person1RigInstance } from "@/characters/person1/Person1Rig";
export { type Person2RigInstance } from "@/characters/person2/Person2Rig";

/**
 * Loads Person 1 (Boy / Aalekh) with GPU-accelerated SkinnedMesh Humanoid Rigging.
 * Calibrated to confident 1.78m proportion with active leg swing, knee bending, and hand-holding.
 */
export function loadBoyCharacterRig(targetHeight = 1.78): Promise<Person1RigInstance> {
  return loadPerson1Rig(targetHeight);
}

/**
 * Loads Person 2 (Girl / Sana) with GPU-accelerated SkinnedMesh Humanoid Rigging.
 * Calibrated to graceful 1.65m proportion with active leg swing, knee bending, and companion clasping.
 */
export function loadGirlCharacterRig(targetHeight = 1.65): Promise<Person2RigInstance> {
  return loadPerson2Rig(targetHeight);
}

/**
 * Backwards-compatible model loaders returning root THREE.Group
 */
export function loadBoyCharacterModel(): Promise<THREE.Group> {
  return loadBoyCharacterRig().then((r) => r.root);
}

export function loadGirlCharacterModel(): Promise<THREE.Group> {
  return loadGirlCharacterRig().then((r) => r.root);
}
