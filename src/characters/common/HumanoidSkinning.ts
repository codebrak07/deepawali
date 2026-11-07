import * as THREE from "three";

/**
 * Computes deterministic humanoid vertex skin weights for 3D scanned monolithic meshes.
 * Maps vertices smoothly across:
 * - Left/Right Leg Chains: Thigh -> Knee -> Ankle -> Foot
 * - Torso Chain: Hips -> Spine -> Chest -> Neck -> Head
 * - Left/Right Arm Chains: Clavicle -> UpperArm -> Forearm -> Hand
 */
export function applyHumanoidSkinning(
  geo: THREE.BufferGeometry,
  bones: any,
  allBones: THREE.Bone[],
  H: number
): void {
  const pos = geo.attributes.position;
  const count = pos.count;
  const skinIndices = new Uint16Array(count * 4);
  const skinWeights = new Float32Array(count * 4);

  const idxHips = allBones.indexOf(bones.hips);
  const idxSpine = allBones.indexOf(bones.spine);
  const idxChest = allBones.indexOf(bones.chest);
  const idxNeck = allBones.indexOf(bones.neck);
  const idxHead = allBones.indexOf(bones.head);

  const idxLThigh = allBones.indexOf(bones.leftThigh);
  const idxLKnee = allBones.indexOf(bones.leftKnee);
  const idxLAnkle = allBones.indexOf(bones.leftAnkle);
  const idxLFoot = allBones.indexOf(bones.leftFoot);

  const idxRThigh = allBones.indexOf(bones.rightThigh);
  const idxRKnee = allBones.indexOf(bones.rightKnee);
  const idxRAnkle = allBones.indexOf(bones.rightAnkle);
  const idxRFoot = allBones.indexOf(bones.rightFoot);

  const idxLClav = allBones.indexOf(bones.leftClavicle);
  const idxLUA = allBones.indexOf(bones.leftUpperArm);
  const idxLFA = allBones.indexOf(bones.leftForearm);
  const idxLHand = allBones.indexOf(bones.leftHand);

  const idxRClav = allBones.indexOf(bones.rightClavicle);
  const idxRUA = allBones.indexOf(bones.rightUpperArm);
  const idxRFA = allBones.indexOf(bones.rightForearm);
  const idxRHand = allBones.indexOf(bones.rightHand);

  const thighY = 0.48 * H;
  const kneeY = 0.26 * H;
  const ankleY = 0.08 * H;

  for (let i = 0; i < count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const i4 = i * 4;

    const absX = Math.abs(vx);
    const isLeft = vx < 0;

    // 1. LEGS (Below thigh height and not far lateral)
    if (vy < thighY && absX < 0.28 * H) {
      const bThigh = isLeft ? idxLThigh : idxRThigh;
      const bKnee = isLeft ? idxLKnee : idxRKnee;
      const bAnkle = isLeft ? idxLAnkle : idxRAnkle;
      const bFoot = isLeft ? idxLFoot : idxRFoot;

      if (vy < ankleY) {
        const t = Math.max(0, Math.min(1, vy / Math.max(0.01, ankleY)));
        skinIndices[i4] = bFoot; skinWeights[i4] = 1.0 - t * 0.4;
        skinIndices[i4 + 1] = bAnkle; skinWeights[i4 + 1] = t * 0.4;
      } else if (vy < kneeY) {
        const t = Math.max(0, Math.min(1, (vy - ankleY) / Math.max(0.01, kneeY - ankleY)));
        skinIndices[i4] = bKnee; skinWeights[i4] = t;
        skinIndices[i4 + 1] = bAnkle; skinWeights[i4 + 1] = 1.0 - t;
      } else {
        const t = Math.max(0, Math.min(1, (vy - kneeY) / Math.max(0.01, thighY - kneeY)));
        skinIndices[i4] = bThigh; skinWeights[i4] = t;
        skinIndices[i4 + 1] = bKnee; skinWeights[i4 + 1] = 1.0 - t;
      }
    }
    // 2. ARMS & HANDS (Lateral from torso)
    else if (absX > 0.16 * H && vy >= 0.35 * H && vy <= 0.82 * H) {
      const bUA = isLeft ? idxLUA : idxRUA;
      const bFA = isLeft ? idxLFA : idxRFA;
      const bHand = isLeft ? idxLHand : idxRHand;

      if (vy < 0.48 * H) {
        skinIndices[i4] = bHand; skinWeights[i4] = 1.0;
      } else if (vy < 0.64 * H) {
        const t = Math.max(0, Math.min(1, (vy - 0.48 * H) / Math.max(0.01, 0.64 * H - 0.48 * H)));
        skinIndices[i4] = bFA; skinWeights[i4] = 0.8;
        skinIndices[i4 + 1] = t > 0.5 ? bUA : bHand; skinWeights[i4 + 1] = 0.2;
      } else {
        const t = Math.max(0, Math.min(1, (vy - 0.64 * H) / Math.max(0.01, 0.80 * H - 0.64 * H)));
        skinIndices[i4] = bUA; skinWeights[i4] = 1.0 - t * 0.3;
        skinIndices[i4 + 1] = isLeft ? idxLClav : idxRClav; skinWeights[i4 + 1] = t * 0.3;
      }
    }
    // 3. TORSO, SPINE, NECK, HEAD
    else {
      if (vy < 0.58 * H) {
        const t = Math.max(0, Math.min(1, (vy - thighY) / Math.max(0.01, 0.58 * H - thighY)));
        skinIndices[i4] = idxHips; skinWeights[i4] = 1.0 - t * 0.5;
        skinIndices[i4 + 1] = idxSpine; skinWeights[i4 + 1] = t * 0.5;
      } else if (vy < 0.72 * H) {
        const t = Math.max(0, Math.min(1, (vy - 0.58 * H) / Math.max(0.01, 0.72 * H - 0.58 * H)));
        skinIndices[i4] = idxChest; skinWeights[i4] = t;
        skinIndices[i4 + 1] = idxSpine; skinWeights[i4 + 1] = 1.0 - t;
      } else if (vy < 0.84 * H) {
        const t = Math.max(0, Math.min(1, (vy - 0.72 * H) / Math.max(0.01, 0.84 * H - 0.72 * H)));
        skinIndices[i4] = idxNeck; skinWeights[i4] = t;
        skinIndices[i4 + 1] = idxChest; skinWeights[i4 + 1] = 1.0 - t;
      } else {
        const t = Math.max(0, Math.min(1, (vy - 0.84 * H) / Math.max(0.01, 0.92 * H - 0.84 * H)));
        skinIndices[i4] = idxHead; skinWeights[i4] = 0.6 + t * 0.4;
        skinIndices[i4 + 1] = idxNeck; skinWeights[i4 + 1] = 0.4 - t * 0.4;
      }
    }
  }

  geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
  geo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));
}
