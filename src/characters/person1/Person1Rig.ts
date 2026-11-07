import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface Person1RigInstance {
  root: THREE.Group;
  updateAnimation: (isWalking: boolean, time: number, moveSpeed?: number) => void;
  setHoldingHands: (holding: boolean) => void;
  setSitting: (sitting: boolean) => void;
  setPraying: (praying: boolean) => void;
  skinnedMesh?: any;
  skeleton?: any;
  bones?: any;
  controller?: any;
}

let cachedRigInstance: Person1RigInstance | null = null;
let loadingPromise: Promise<Person1RigInstance> | null = null;

/**
 * Loads Person 1 (Boy / Aalekh) directly from /person_model.glb
 * in pristine original geometry without synthetic bone rigging or mesh distortion.
 */
export function loadPerson1Rig(targetHeight = 1.78): Promise<Person1RigInstance> {
  if (cachedRigInstance) {
    return Promise.resolve(cachedRigInstance);
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise<Person1RigInstance>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/person_model.glb",
      (gltf) => {
        let foundMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !foundMesh) {
            foundMesh = child as THREE.Mesh;
          }
        });

        if (!foundMesh) {
          reject(new Error("No mesh found in /person_model.glb"));
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

        const modelMesh = new THREE.Mesh(origGeo, (foundMesh as THREE.Mesh).material);
        modelMesh.castShadow = true;
        modelMesh.receiveShadow = true;

        const root = new THREE.Group();
        root.name = "Person1_CleanModelRoot";
        root.add(modelMesh);

        let walkPhase = 0;
        let isSitting = false;
        let isPraying = false;

        const setHoldingHands = (_holding: boolean) => {};
        const setSitting = (sitting: boolean) => {
          isSitting = sitting;
          if (sitting) isPraying = false;
        };
        const setPraying = (praying: boolean) => {
          isPraying = praying;
          if (praying) isSitting = false;
        };

        const updateAnimation = (isWalking: boolean, time: number, moveSpeed = 6.0) => {
          if (isSitting) {
            modelMesh.position.set(0, -0.40, 0.04);
            modelMesh.rotation.set(-0.04, 0, 0);
            return;
          }
          if (isPraying) {
            modelMesh.position.set(0, 0, 0);
            modelMesh.rotation.set(0.08, 0, 0);
            return;
          }
          if (isWalking) {
            const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
            walkPhase += 0.085 * strideSpeed;

            // Natural step bounce & subtle stride hip sway
            modelMesh.position.y = Math.abs(Math.sin(walkPhase * 2.0)) * 0.038;
            modelMesh.rotation.z = Math.sin(walkPhase) * 0.020;
            modelMesh.rotation.x = 0.035; // Forward kinetic lean
            modelMesh.rotation.y = -Math.sin(walkPhase) * 0.025;
          } else {
            // Natural idle breathing
            modelMesh.position.set(0, Math.sin(time * 2.2) * 0.007, 0);
            modelMesh.rotation.set(0, 0, 0);
          }
        };

        const instance: Person1RigInstance = {
          root,
          updateAnimation,
          setHoldingHands,
          setSitting,
          setPraying,
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
