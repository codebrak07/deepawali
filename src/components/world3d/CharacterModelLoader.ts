import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// Cached model instances for instant re-use without re-downloading
let cachedBoyModel: THREE.Group | null = null;
let cachedGirlModel: THREE.Group | null = null;

let boyLoadingPromise: Promise<THREE.Group> | null = null;
let girlLoadingPromise: Promise<THREE.Group> | null = null;

/**
 * Loads the realistic 3D Boy model (Aalekh) from public/streetwear_86_full_body.glb
 * Calibrated to 1.78m proportion, centered, with shoe soles at y = 0.00.
 */
export function loadBoyCharacterModel(): Promise<THREE.Group> {
  if (cachedBoyModel) {
    return Promise.resolve(cachedBoyModel.clone(true));
  }
  if (boyLoadingPromise) {
    return boyLoadingPromise.then((m) => m.clone(true));
  }

  boyLoadingPromise = new Promise<THREE.Group>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      "/streetwear_86_full_body.glb",
      (gltf) => {
        const model = gltf.scene;
        model.name = "aalekhRealisticModel";

        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);
        const rawCenter = new THREE.Vector3();
        rawBox.getCenter(rawCenter);

        const targetHeight = 1.78;
        const scaleFactor = targetHeight / (rawSize.y || 1.0);
        model.scale.setScalar(scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(model);
        model.position.x = -rawCenter.x * scaleFactor;
        model.position.y = -scaledBox.min.y; // Bottom of sneakers at y = 0.00
        model.position.z = -rawCenter.z * scaleFactor;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const stdMat = mat as THREE.MeshStandardMaterial;
                  stdMat.roughness = Math.max(stdMat.roughness ?? 0.6, 0.45);
                  stdMat.metalness = Math.min(stdMat.metalness ?? 0.15, 0.25);
                  stdMat.side = THREE.DoubleSide;
                }
              });
            }
          }
        });

        const container = new THREE.Group();
        container.name = "aalekhRealisticContainer";
        container.add(model);

        cachedBoyModel = container;
        resolve(container.clone(true));
      },
      undefined,
      (err) => {
        console.warn("Could not load /streetwear_86_full_body.glb for Aalekh:", err);
        reject(err);
      }
    );
  });

  return boyLoadingPromise.then((m) => m.clone(true));
}

/**
 * Loads the realistic 3D Girl model (Sana / Shirjana) from public/
 * Uses ac2c5bdf-e0a2-4eaf-87bd-d404d3a6e5b8_0.fbx with high-res Color.jpg texture.
 * Calibrated to graceful 1.65m proportion with shoe soles at y = 0.00.
 */
export function loadGirlCharacterModel(): Promise<THREE.Group> {
  if (cachedGirlModel) {
    return Promise.resolve(cachedGirlModel.clone(true));
  }
  if (girlLoadingPromise) {
    return girlLoadingPromise.then((m) => m.clone(true));
  }

  girlLoadingPromise = new Promise<THREE.Group>((resolve, reject) => {
    const fbxLoader = new FBXLoader();
    const texLoader = new THREE.TextureLoader();
    const colorMap = texLoader.load("/Color.jpg");
    colorMap.colorSpace = THREE.SRGBColorSpace;

    fbxLoader.load(
      "/ac2c5bdf-e0a2-4eaf-87bd-d404d3a6e5b8_0.fbx",
      (fbx) => {
        fbx.name = "sanaRealisticModel";

        const rawBox = new THREE.Box3().setFromObject(fbx);
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);
        const rawCenter = new THREE.Vector3();
        rawBox.getCenter(rawCenter);

        const targetHeight = 1.65;
        const scaleFactor = targetHeight / (rawSize.y || 1.0);
        fbx.scale.setScalar(scaleFactor);

        const scaledBox = new THREE.Box3().setFromObject(fbx);
        fbx.position.x = -rawCenter.x * scaleFactor;
        fbx.position.y = -scaledBox.min.y; // Bottom of heels/shoes at y = 0.00
        fbx.position.z = -rawCenter.z * scaleFactor;

        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.material = new THREE.MeshStandardMaterial({
              map: colorMap,
              roughness: 0.55,
              metalness: 0.1,
              side: THREE.DoubleSide,
            });
          }
        });

        const container = new THREE.Group();
        container.name = "sanaRealisticContainer";
        container.add(fbx);

        cachedGirlModel = container;
        resolve(container.clone(true));
      },
      undefined,
      (err) => {
        console.warn("Could not load girl model from FBX:", err);
        reject(err);
      }
    );
  });

  return girlLoadingPromise.then((m) => m.clone(true));
}

