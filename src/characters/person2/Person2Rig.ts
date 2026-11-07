import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import {
  createPerson2Skeleton,
  Person2AnimationController,
} from "./Person2Animations";
import { applyHumanoidSkinning } from "../common/HumanoidSkinning";

export interface Person2RigInstance {
  root: THREE.Group;
  updateAnimation: (isWalking: boolean, time: number, moveSpeed?: number) => void;
  setHoldingHands: (holding: boolean) => void;
  setSitting: (sitting: boolean) => void;
  setPraying: (praying: boolean) => void;
  skinnedMesh?: THREE.SkinnedMesh;
  skeleton?: THREE.Skeleton;
  bones?: any;
  controller?: Person2AnimationController;
}

let cachedRigInstance: Person2RigInstance | null = null;
let loadingPromise: Promise<Person2RigInstance> | null = null;

// Shared Draco Decoder for high-efficiency WebAssembly model decompression
let sharedDracoLoader: DRACOLoader | null = null;
function getSharedDracoLoader(): DRACOLoader {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    if (typeof window !== "undefined") {
      sharedDracoLoader.setDecoderPath("/draco/");
      sharedDracoLoader.preload();
    }
  }
  return sharedDracoLoader;
}

/**
 * Loads Person 2 (Girl / Sana) directly from /streetwear_86_full_body.glb
 * with Google Draco 3D WebAssembly acceleration.
 * Bound to humanoid anatomical skeleton with dynamic walking locomotion,
 * knee bending, pelvic bounce, natural independent arm swings, and seating poses.
 */
export function loadPerson2Rig(targetHeight = 1.65): Promise<Person2RigInstance> {
  if (cachedRigInstance) {
    return Promise.resolve(cachedRigInstance);
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise<Person2RigInstance>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(getSharedDracoLoader());

    gltfLoader.load(
      "/streetwear_86_full_body.glb",
      (gltf) => {
        let foundMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !foundMesh) {
            foundMesh = child as THREE.Mesh;
          }
        });

        if (!foundMesh) {
          reject(new Error("No mesh found in /streetwear_86_full_body.glb"));
          return;
        }

        const origGeo = (foundMesh as THREE.Mesh).geometry.clone();
        origGeo.computeBoundingBox();
        const bbox = origGeo.boundingBox!;
        const rawSize = new THREE.Vector3();
        bbox.getSize(rawSize);
        const rawCenter = new THREE.Vector3();
        bbox.getCenter(rawCenter);

        // Normalize height to targetHeight, center pivot at soles (y = 0), face +Z
        const scaleFactor = targetHeight / (rawSize.y || 1.0);
        const alignMatrix = new THREE.Matrix4();
        alignMatrix.makeTranslation(-rawCenter.x, -bbox.min.y, -rawCenter.z);
        alignMatrix.premultiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
        alignMatrix.premultiply(new THREE.Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor));

        origGeo.applyMatrix4(alignMatrix);
        origGeo.computeBoundingBox();
        origGeo.computeVertexNormals();

        // 1. Build anatomical 26-bone skeleton
        const { skeleton, bones, allBones } = createPerson2Skeleton(targetHeight);

        // 2. Compute smooth vertex skinning weights
        applyHumanoidSkinning(origGeo, bones, allBones, targetHeight);

        // 3. Create GPU SkinnedMesh
        const skinnedMesh = new THREE.SkinnedMesh(origGeo, (foundMesh as THREE.Mesh).material);
        skinnedMesh.castShadow = true;
        skinnedMesh.receiveShadow = true;
        skinnedMesh.add(bones.root);
        skinnedMesh.bind(skeleton);

        const root = new THREE.Group();
        root.name = "Person2_SkinnedModelRoot";
        root.add(skinnedMesh);

        // 4. Biomechanical Kinematic Controller
        const controller = new Person2AnimationController(bones, targetHeight);

        let lastTime = 0;
        const updateAnimation = (isWalking: boolean, time: number, moveSpeed = 6.0) => {
          const delta = lastTime > 0 ? Math.min(0.1, time - lastTime) : 0.016;
          lastTime = time;
          controller.update(isWalking, time, moveSpeed, delta);
        };

        const setHoldingHands = (_holding: boolean) => {
          controller.setHoldingHands(false);
        };

        const setSitting = (sitting: boolean) => {
          controller.setSitting(sitting);
        };

        const setPraying = (praying: boolean) => {
          controller.setPraying(praying);
        };

        const instance: Person2RigInstance = {
          root,
          updateAnimation,
          setHoldingHands,
          setSitting,
          setPraying,
          skinnedMesh,
          skeleton,
          bones,
          controller,
        };

        cachedRigInstance = instance;
        resolve(instance);
      },
      undefined,
      (err) => reject(err)
    );
  });

  return loadingPromise;
}
