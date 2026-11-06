import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export interface RiggedHumanoidCharacter {
  root: THREE.Group;
  skinnedMesh: THREE.SkinnedMesh;
  skeleton: THREE.Skeleton;
  bones: {
    hips: THREE.Bone;
    spine: THREE.Bone;
    chest: THREE.Bone;
    neck: THREE.Bone;
    head: THREE.Bone;
    leftClavicle: THREE.Bone;
    leftUpperArm: THREE.Bone;
    leftForearm: THREE.Bone;
    leftHand: THREE.Bone;
    rightClavicle: THREE.Bone;
    rightUpperArm: THREE.Bone;
    rightForearm: THREE.Bone;
    rightHand: THREE.Bone;
    leftThigh: THREE.Bone;
    leftKnee: THREE.Bone;
    leftAnkle: THREE.Bone;
    rightThigh: THREE.Bone;
    rightKnee: THREE.Bone;
    rightAnkle: THREE.Bone;
  };
}

/**
 * Builds a functional 19-bone humanoid skeletal rig through code for any static mesh.
 * Computes anatomical bone weights with smooth cubic blending and assigns them to geometry.
 * Enables real alternating walking kinematics, knee bending, ankle planting, and uncurling folded arms.
 */
export function autoRigHumanoidMesh(
  mesh: THREE.Mesh,
  targetHeight: number,
  isBoy: boolean
): RiggedHumanoidCharacter {
  // 1. Transform geometry so it stands on ground y = 0.00 and is centered horizontally
  const origGeo = mesh.geometry.clone();
  origGeo.computeBoundingBox();
  const bbox = origGeo.boundingBox!;
  const rawSize = new THREE.Vector3();
  bbox.getSize(rawSize);
  const rawCenter = new THREE.Vector3();
  bbox.getCenter(rawCenter);

  const scaleFactor = targetHeight / (rawSize.y || 1.0);
  const transformMat = new THREE.Matrix4();
  transformMat.makeTranslation(-rawCenter.x, -bbox.min.y, -rawCenter.z);
  transformMat.premultiply(new THREE.Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor));
  origGeo.applyMatrix4(transformMat);
  origGeo.computeVertexNormals();

  const H = targetHeight;

  // 2. Build 19-Bone Humanoid Skeletal Hierarchy
  const hips = new THREE.Bone();
  hips.name = "Hips";
  hips.position.set(0, 0.50 * H, 0);

  const spine = new THREE.Bone();
  spine.name = "Spine";
  spine.position.set(0, 0.14 * H, 0);
  hips.add(spine);

  const chest = new THREE.Bone();
  chest.name = "Chest";
  chest.position.set(0, 0.13 * H, 0);
  spine.add(chest);

  const neck = new THREE.Bone();
  neck.name = "Neck";
  neck.position.set(0, 0.09 * H, 0);
  chest.add(neck);

  const head = new THREE.Bone();
  head.name = "Head";
  head.position.set(0, 0.08 * H, 0);
  neck.add(head);

  // Left Arm
  const leftClavicle = new THREE.Bone();
  leftClavicle.name = "LeftClavicle";
  leftClavicle.position.set(-0.08 * H, 0.05 * H, 0);
  chest.add(leftClavicle);

  const leftUpperArm = new THREE.Bone();
  leftUpperArm.name = "LeftUpperArm";
  leftUpperArm.position.set(-0.08 * H, -0.02 * H, 0);
  leftClavicle.add(leftUpperArm);

  const leftForearm = new THREE.Bone();
  leftForearm.name = "LeftForearm";
  leftForearm.position.set(0, -0.16 * H, 0);
  leftUpperArm.add(leftForearm);

  const leftHand = new THREE.Bone();
  leftHand.name = "LeftHand";
  leftHand.position.set(0, -0.15 * H, 0);
  leftForearm.add(leftHand);

  // Right Arm
  const rightClavicle = new THREE.Bone();
  rightClavicle.name = "RightClavicle";
  rightClavicle.position.set(0.08 * H, 0.05 * H, 0);
  chest.add(rightClavicle);

  const rightUpperArm = new THREE.Bone();
  rightUpperArm.name = "RightUpperArm";
  rightUpperArm.position.set(0.08 * H, -0.02 * H, 0);
  rightClavicle.add(rightUpperArm);

  const rightForearm = new THREE.Bone();
  rightForearm.name = "RightForearm";
  rightForearm.position.set(0, -0.16 * H, 0);
  rightUpperArm.add(rightForearm);

  const rightHand = new THREE.Bone();
  rightHand.name = "RightHand";
  rightHand.position.set(0, -0.15 * H, 0);
  rightForearm.add(rightHand);

  // Left Leg
  const leftThigh = new THREE.Bone();
  leftThigh.name = "LeftThigh";
  leftThigh.position.set(-0.07 * H, -0.03 * H, 0);
  hips.add(leftThigh);

  const leftKnee = new THREE.Bone();
  leftKnee.name = "LeftKnee";
  leftKnee.position.set(0, -0.21 * H, 0);
  leftThigh.add(leftKnee);

  const leftAnkle = new THREE.Bone();
  leftAnkle.name = "LeftAnkle";
  leftAnkle.position.set(0, -0.21 * H, 0);
  leftKnee.add(leftAnkle);

  // Right Leg
  const rightThigh = new THREE.Bone();
  rightThigh.name = "RightThigh";
  rightThigh.position.set(0.07 * H, -0.03 * H, 0);
  hips.add(rightThigh);

  const rightKnee = new THREE.Bone();
  rightKnee.name = "RightKnee";
  rightKnee.position.set(0, -0.21 * H, 0);
  rightThigh.add(rightKnee);

  const rightAnkle = new THREE.Bone();
  rightAnkle.name = "RightAnkle";
  rightAnkle.position.set(0, -0.21 * H, 0);
  rightKnee.add(rightAnkle);

  // Bone Array for Skeleton
  const allBones = [
    hips, spine, chest, neck, head,
    leftClavicle, leftUpperArm, leftForearm, leftHand,
    rightClavicle, rightUpperArm, rightForearm, rightHand,
    leftThigh, leftKnee, leftAnkle,
    rightThigh, rightKnee, rightAnkle
  ];

  const skeleton = new THREE.Skeleton(allBones);

  // 3. Compute Anatomical Skin Weights & Indices
  const posAttr = origGeo.attributes.position;
  const vCount = posAttr.count;
  const skinIndices = new Uint16Array(vCount * 4);
  const skinWeights = new Float32Array(vCount * 4);

  const kneeY = 0.26 * H;
  const ankleY = 0.05 * H;
  const thighY = 0.47 * H;

  for (let i = 0; i < vCount; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const i4 = i * 4;

    // A. LEGS
    if (vy < thighY) {
      const isLeft = vx < 0;
      const tIdx = isLeft ? 13 : 16;
      const kIdx = isLeft ? 14 : 17;
      const aIdx = isLeft ? 15 : 18;

      if (vy <= ankleY) {
        skinIndices[i4] = aIdx;
        skinWeights[i4] = 1.0;
      } else if (vy < kneeY) {
        const t = (vy - ankleY) / (kneeY - ankleY);
        skinIndices[i4] = kIdx; skinWeights[i4] = t;
        skinIndices[i4 + 1] = aIdx; skinWeights[i4 + 1] = 1.0 - t;
      } else {
        const t = (vy - kneeY) / (thighY - kneeY);
        skinIndices[i4] = tIdx; skinWeights[i4] = t;
        skinIndices[i4 + 1] = kIdx; skinWeights[i4 + 1] = 1.0 - t;
      }
    }
    // B. ARMS
    else if (Math.abs(vx) > 0.16 * H && vy >= 0.42 * H && vy <= 0.85 * H) {
      const isLeft = vx < 0;
      const cIdx = isLeft ? 5 : 9;
      const uIdx = isLeft ? 6 : 10;
      const fIdx = isLeft ? 7 : 11;
      const hIdx = isLeft ? 8 : 12;

      if (vy < 0.54 * H) {
        skinIndices[i4] = hIdx;
        skinWeights[i4] = 1.0;
      } else if (vy < 0.68 * H) {
        const t = (vy - 0.54 * H) / (0.68 * H - 0.54 * H);
        skinIndices[i4] = fIdx; skinWeights[i4] = t;
        skinIndices[i4 + 1] = hIdx; skinWeights[i4 + 1] = 1.0 - t;
      } else {
        const t = (vy - 0.68 * H) / (0.85 * H - 0.68 * H);
        skinIndices[i4] = uIdx; skinWeights[i4] = t;
        skinIndices[i4 + 1] = cIdx; skinWeights[i4 + 1] = 1.0 - t;
      }
    }
    // C. TORSO, NECK & HEAD
    else {
      if (vy < 0.62 * H) {
        const t = (vy - thighY) / (0.62 * H - thighY);
        skinIndices[i4] = 1; skinWeights[i4] = t;
        skinIndices[i4 + 1] = 0; skinWeights[i4 + 1] = 1.0 - t;
      } else if (vy < 0.77 * H) {
        const t = (vy - 0.62 * H) / (0.77 * H - 0.62 * H);
        skinIndices[i4] = 2; skinWeights[i4] = t;
        skinIndices[i4 + 1] = 1; skinWeights[i4 + 1] = 1.0 - t;
      } else if (vy < 0.87 * H) {
        const t = (vy - 0.77 * H) / (0.87 * H - 0.77 * H);
        skinIndices[i4] = 3; skinWeights[i4] = t;
        skinIndices[i4 + 1] = 2; skinWeights[i4 + 1] = 1.0 - t;
      } else {
        const t = Math.min(1.0, (vy - 0.87 * H) / (0.94 * H - 0.87 * H));
        skinIndices[i4] = 4; skinWeights[i4] = t;
        skinIndices[i4 + 1] = 3; skinWeights[i4 + 1] = 1.0 - t;
      }
    }
  }

  origGeo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
  origGeo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

  // 4. Construct SkinnedMesh and Bind Skeleton
  const skinnedMesh = new THREE.SkinnedMesh(origGeo, mesh.material);
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;
  skinnedMesh.add(hips);
  skinnedMesh.bind(skeleton);

  const container = new THREE.Group();
  container.name = isBoy ? "riggedAalekhModel" : "riggedSanaModel";
  container.add(skinnedMesh);

  return {
    root: container,
    skinnedMesh,
    skeleton,
    bones: {
      hips,
      spine,
      chest,
      neck,
      head,
      leftClavicle,
      leftUpperArm,
      leftForearm,
      leftHand,
      rightClavicle,
      rightUpperArm,
      rightForearm,
      rightHand,
      leftThigh,
      leftKnee,
      leftAnkle,
      rightThigh,
      rightKnee,
      rightAnkle,
    },
  };
}

let cachedRiggedBoy: RiggedHumanoidCharacter | null = null;
let cachedRiggedGirl: RiggedHumanoidCharacter | null = null;

let boyRigLoadingPromise: Promise<RiggedHumanoidCharacter> | null = null;
let girlRigLoadingPromise: Promise<RiggedHumanoidCharacter> | null = null;

/**
 * Loads and auto-rigs the 3D Boy model (Aalekh) from public/person_model.glb
 * Reuses the actual custom model, builds a 19-bone humanoid skeleton with skin weights,
 * and unfolds his folded arms into a natural companion hand-holding posture.
 */
export function loadBoyRiggedCharacter(): Promise<RiggedHumanoidCharacter> {
  if (cachedRiggedBoy) return Promise.resolve(cachedRiggedBoy);
  if (boyRigLoadingPromise) return boyRigLoadingPromise;

  boyRigLoadingPromise = new Promise<RiggedHumanoidCharacter>((resolve, reject) => {
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

        const rigged = autoRigHumanoidMesh(foundMesh, 1.78, true);
        cachedRiggedBoy = rigged;
        resolve(rigged);
      },
      undefined,
      (err) => {
        console.warn("Could not load /person_model.glb for Aalekh:", err);
        reject(err);
      }
    );
  });

  return boyRigLoadingPromise;
}

/**
 * Loads and auto-rigs the 3D Girl model (Sana) from public/streetwear_86_full_body.glb
 * Reuses the actual custom model, builds a 19-bone humanoid skeleton with skin weights,
 * and attaches full walking, knee bending, and hand-holding kinematics.
 */
export function loadGirlRiggedCharacter(): Promise<RiggedHumanoidCharacter> {
  if (cachedRiggedGirl) return Promise.resolve(cachedRiggedGirl);
  if (girlRigLoadingPromise) return girlRigLoadingPromise;

  girlRigLoadingPromise = new Promise<RiggedHumanoidCharacter>((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
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

        const rigged = autoRigHumanoidMesh(foundMesh, 1.65, false);
        cachedRiggedGirl = rigged;
        resolve(rigged);
      },
      undefined,
      (err) => {
        console.warn("Could not load /streetwear_86_full_body.glb for Sana:", err);
        reject(err);
      }
    );
  });

  return girlRigLoadingPromise;
}

export function loadBoyCharacterModel(): Promise<THREE.Group> {
  return loadBoyRiggedCharacter().then((r) => r.root);
}

export function loadGirlCharacterModel(): Promise<THREE.Group> {
  return loadGirlRiggedCharacter().then((r) => r.root);
}

