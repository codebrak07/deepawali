import * as THREE from "three";

/**
 * Person 2 (Girl / Sana) Complete Anatomical Bone Hierarchy.
 * Explicitly structures all functional joints across:
 * - Legs: Hips, Thighs, Knees, Ankles, Feet/Toes
 * - Arms & Hands: Clavicles, Shoulders/Upper Arms, Elbows/Forearms, Wrists, Hands, Fingers
 * - Spine & Core: Sacrum/Hips, Lumbar/Spine, Thoracic/Chest, Cervical/Neck, Cranium/Head
 */
export interface Person2Bones {
  // Pelvis / Core Foundation
  root: THREE.Bone;
  hips: THREE.Bone;
  spine: THREE.Bone;
  chest: THREE.Bone;
  neck: THREE.Bone;
  head: THREE.Bone;

  // Left Leg Chain
  leftThigh: THREE.Bone;
  leftKnee: THREE.Bone;
  leftAnkle: THREE.Bone;
  leftFoot: THREE.Bone;

  // Right Leg Chain
  rightThigh: THREE.Bone;
  rightKnee: THREE.Bone;
  rightAnkle: THREE.Bone;
  rightFoot: THREE.Bone;

  // Left Arm & Hand Chain (Inner Arm for Couple Hand-Holding with Person 1 / Aalekh)
  leftClavicle: THREE.Bone;
  leftUpperArm: THREE.Bone;
  leftForearm: THREE.Bone;
  leftWrist: THREE.Bone;
  leftHand: THREE.Bone;
  leftFingers: THREE.Bone;

  // Right Arm & Hand Chain (Outer Arm)
  rightClavicle: THREE.Bone;
  rightUpperArm: THREE.Bone;
  rightForearm: THREE.Bone;
  rightWrist: THREE.Bone;
  rightHand: THREE.Bone;
  rightFingers: THREE.Bone;
}

/**
 * Creates the complete articulated humanoid bone hierarchy for Person 2 (Girl).
 * Calibrated to graceful 1.65m height proportions.
 */
export function createPerson2Skeleton(height = 1.65): {
  skeleton: THREE.Skeleton;
  bones: Person2Bones;
  allBones: THREE.Bone[];
} {
  const allBones: THREE.Bone[] = [];

  const makeBone = (name: string): THREE.Bone => {
    const b = new THREE.Bone();
    b.name = name;
    allBones.push(b);
    return b;
  };

  const H = height;

  // 1. Root & Pelvis Foundation (Center of mass at 51% of height)
  const root = makeBone("Person2_Root");
  const hips = makeBone("Person2_Hips");
  hips.position.set(0, 0.51 * H, 0);
  root.add(hips);

  // 2. Spine & Torso Chain
  const spine = makeBone("Person2_Spine");
  spine.position.set(0, 0.11 * H, 0);
  hips.add(spine);

  const chest = makeBone("Person2_Chest");
  chest.position.set(0, 0.13 * H, 0);
  spine.add(chest);

  const neck = makeBone("Person2_Neck");
  neck.position.set(0, 0.09 * H, 0);
  chest.add(neck);

  const head = makeBone("Person2_Head");
  head.position.set(0, 0.08 * H, 0.015 * H);
  neck.add(head);

  // 3. Left Leg Chain (Hips -> Thigh -> Knee -> Ankle -> Foot)
  const leftThigh = makeBone("Person2_LeftThigh");
  leftThigh.position.set(-0.10 * H, -0.04 * H, 0);
  hips.add(leftThigh);

  const leftKnee = makeBone("Person2_LeftKnee");
  leftKnee.position.set(0, -0.24 * H, 0);
  leftThigh.add(leftKnee);

  const leftAnkle = makeBone("Person2_LeftAnkle");
  leftAnkle.position.set(0, -0.22 * H, 0);
  leftKnee.add(leftAnkle);

  const leftFoot = makeBone("Person2_LeftFoot");
  leftFoot.position.set(0, 0, 0.075 * H);
  leftAnkle.add(leftFoot);

  // 4. Right Leg Chain (Hips -> Thigh -> Knee -> Ankle -> Foot)
  const rightThigh = makeBone("Person2_RightThigh");
  rightThigh.position.set(0.10 * H, -0.04 * H, 0);
  hips.add(rightThigh);

  const rightKnee = makeBone("Person2_RightKnee");
  rightKnee.position.set(0, -0.24 * H, 0);
  rightThigh.add(rightKnee);

  const rightAnkle = makeBone("Person2_RightAnkle");
  rightAnkle.position.set(0, -0.22 * H, 0);
  rightKnee.add(rightAnkle);

  const rightFoot = makeBone("Person2_RightFoot");
  rightFoot.position.set(0, 0, 0.075 * H);
  rightAnkle.add(rightFoot);

  // 5. Left Arm Chain (Inner Arm for Couple Hand Clasping with Person 1 / Aalekh)
  const leftClavicle = makeBone("Person2_LeftClavicle");
  leftClavicle.position.set(-0.05 * H, 0.05 * H, 0);
  chest.add(leftClavicle);

  const leftUpperArm = makeBone("Person2_LeftUpperArm");
  leftUpperArm.position.set(-0.12 * H, 0, 0);
  leftClavicle.add(leftUpperArm);

  const leftForearm = makeBone("Person2_LeftForearm");
  leftForearm.position.set(0, -0.15 * H, 0);
  leftUpperArm.add(leftForearm);

  const leftWrist = makeBone("Person2_LeftWrist");
  leftWrist.position.set(0, -0.13 * H, 0);
  leftForearm.add(leftWrist);

  const leftHand = makeBone("Person2_LeftHand");
  leftHand.position.set(0, -0.04 * H, 0);
  leftWrist.add(leftHand);

  const leftFingers = makeBone("Person2_LeftFingers");
  leftFingers.position.set(0, -0.045 * H, 0);
  leftHand.add(leftFingers);

  // 6. Right Arm Chain (Outer Arm)
  const rightClavicle = makeBone("Person2_RightClavicle");
  rightClavicle.position.set(0.05 * H, 0.05 * H, 0);
  chest.add(rightClavicle);

  const rightUpperArm = makeBone("Person2_RightUpperArm");
  rightUpperArm.position.set(0.12 * H, 0, 0);
  rightClavicle.add(rightUpperArm);

  const rightForearm = makeBone("Person2_RightForearm");
  rightForearm.position.set(0, -0.15 * H, 0);
  rightUpperArm.add(rightForearm);

  const rightWrist = makeBone("Person2_RightWrist");
  rightWrist.position.set(0, -0.13 * H, 0);
  rightForearm.add(rightWrist);

  const rightHand = makeBone("Person2_RightHand");
  rightHand.position.set(0, -0.04 * H, 0);
  rightWrist.add(rightHand);

  const rightFingers = makeBone("Person2_RightFingers");
  rightFingers.position.set(0, -0.045 * H, 0);
  rightHand.add(rightFingers);

  const skeleton = new THREE.Skeleton(allBones);

  const bones: Person2Bones = {
    root,
    hips,
    spine,
    chest,
    neck,
    head,
    leftThigh,
    leftKnee,
    leftAnkle,
    leftFoot,
    rightThigh,
    rightKnee,
    rightAnkle,
    rightFoot,
    leftClavicle,
    leftUpperArm,
    leftForearm,
    leftWrist,
    leftHand,
    leftFingers,
    rightClavicle,
    rightUpperArm,
    rightForearm,
    rightWrist,
    rightHand,
    rightFingers,
  };

  return { skeleton, bones, allBones };
}

/**
 * Animation Controller for Person 2 (Girl / Sana).
 * Governs feminine walking locomotion, synchronized hand-holding kinematics, seating, and sanctum prayer.
 */
export class Person2AnimationController {
  public bones: Person2Bones;
  public height: number;

  private walkPhase = 0;
  private walkWeight = 0;
  private isSitting = false;
  private isPraying = false;

  private baseHipsY: number;

  constructor(bones: Person2Bones, height = 1.65) {
    this.bones = bones;
    this.height = height;
    this.baseHipsY = 0.51 * height;
  }

  // Preserved for API compatibility as a no-op
  public setHoldingHands(_holding: boolean) {}

  public setSitting(sitting: boolean) {
    this.isSitting = sitting;
    if (sitting) this.isPraying = false;
  }

  public setPraying(praying: boolean) {
    this.isPraying = praying;
    if (praying) this.isSitting = false;
  }

  public update(isWalking: boolean, time: number, moveSpeed = 6.0, delta = 0.016) {
    const {
      hips,
      spine,
      chest,
      neck,
      head,
      leftThigh,
      leftKnee,
      leftAnkle,
      leftFoot,
      rightThigh,
      rightKnee,
      rightAnkle,
      rightFoot,
      leftClavicle,
      leftUpperArm,
      leftForearm,
      leftWrist,
      leftHand,
      leftFingers,
      rightClavicle,
      rightUpperArm,
      rightForearm,
      rightWrist,
      rightHand,
      rightFingers,
    } = this.bones;

    // -------------------------------------------------------------------------
    // 1. SOFA / FURNITURE SITTING POSE
    // -------------------------------------------------------------------------
    if (this.isSitting) {
      const sitBreath = Math.sin(time * 2.0) * 0.005;
      hips.position.set(0, 0.44 + sitBreath, 0.08);
      hips.rotation.set(0, 0, 0);

      spine.rotation.set(-0.06, 0, 0);
      chest.rotation.set(0, 0, 0);
      neck.rotation.set(0.02, 0, 0);
      head.rotation.set(0.04, 0, 0);

      leftThigh.rotation.set(-Math.PI / 2, 0, 0);
      rightThigh.rotation.set(-Math.PI / 2, 0, 0);

      leftKnee.rotation.set(Math.PI / 2, 0, 0);
      rightKnee.rotation.set(Math.PI / 2, 0, 0);

      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);
      leftFoot.rotation.set(0, 0, 0);
      rightFoot.rotation.set(0, 0, 0);

      // Both arms rest gracefully on lap/thighs
      leftClavicle.rotation.set(0, 0, 0);
      leftUpperArm.rotation.set(0.38, 0.14, 0.18);
      leftForearm.rotation.set(0.55, 0, 0);
      leftWrist.rotation.set(0, 0, 0);
      leftHand.rotation.set(0, 0, 0);
      leftFingers.rotation.set(0.2, 0, 0);

      rightClavicle.rotation.set(0, 0, 0);
      rightUpperArm.rotation.set(0.38, -0.14, -0.18);
      rightForearm.rotation.set(0.55, 0, 0);
      rightWrist.rotation.set(0, 0, 0);
      rightHand.rotation.set(0, 0, 0);
      rightFingers.rotation.set(0.2, 0, 0);
      return;
    }

    // -------------------------------------------------------------------------
    // 2. SACRED REVERENT PRAYER POSE
    // -------------------------------------------------------------------------
    if (this.isPraying) {
      const prayBreathe = Math.sin(time * 2.0) * 0.008;
      hips.position.set(0, this.baseHipsY + prayBreathe, 0);
      hips.rotation.set(0, 0, 0);

      spine.rotation.set(0.12, 0, 0);
      chest.rotation.set(0.08, 0, 0);
      neck.rotation.set(0.10, 0, 0);
      head.rotation.set(0.16, 0, 0);

      leftThigh.rotation.set(0, 0, 0);
      rightThigh.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);
      leftFoot.rotation.set(0, 0, 0);
      rightFoot.rotation.set(0, 0, 0);

      leftClavicle.rotation.set(0.10, 0.08, 0.06);
      rightClavicle.rotation.set(0.10, -0.08, -0.06);

      leftUpperArm.rotation.set(0.85, 0.45, 0.35);
      leftForearm.rotation.set(0.85, 0, 0);
      leftWrist.rotation.set(0.15, 0, 0);
      leftHand.rotation.set(0, 0, 0);
      leftFingers.rotation.set(0, 0, 0);

      rightUpperArm.rotation.set(0.85, -0.45, -0.35);
      rightForearm.rotation.set(0.85, 0, 0);
      rightWrist.rotation.set(0.15, 0, 0);
      rightHand.rotation.set(0, 0, 0);
      rightFingers.rotation.set(0, 0, 0);
      return;
    }

    // -------------------------------------------------------------------------
    // 3. SMOOTH KINEMATIC BLENDING (WALK WEIGHT INTERPOLATION)
    // -------------------------------------------------------------------------
    const targetWeight = isWalking ? 1.0 : 0.0;
    this.walkWeight = THREE.MathUtils.damp(this.walkWeight, targetWeight, 10.0, delta);

    if (this.walkWeight > 0.001) {
      const cadence = Math.max(3.2, moveSpeed * 1.5);
      this.walkPhase += cadence * delta;
    }

    const w = this.walkWeight;
    const idleWeight = 1.0 - w;

    const breath = Math.sin(time * 2.4) * 0.010;
    const sway = Math.cos(time * 1.4) * 0.005;

    const thighSwing = Math.sin(this.walkPhase) * 0.46 * w;
    leftThigh.rotation.x = thighSwing;
    rightThigh.rotation.x = -thighSwing;
    leftThigh.rotation.z = -0.02 * idleWeight;
    rightThigh.rotation.z = 0.02 * idleWeight;

    const leftKneeBend = Math.max(0, -Math.sin(this.walkPhase + 0.35)) * 0.72 * w;
    const rightKneeBend = Math.max(0, Math.sin(this.walkPhase + 0.35)) * 0.72 * w;
    leftKnee.rotation.x = leftKneeBend;
    rightKnee.rotation.x = rightKneeBend;

    leftAnkle.rotation.x = -(thighSwing + leftKneeBend) * 0.52;
    rightAnkle.rotation.x = -(-thighSwing + rightKneeBend) * 0.52;
    leftFoot.rotation.x = -thighSwing * 0.18;
    rightFoot.rotation.x = thighSwing * 0.18;

    const bounce = Math.abs(Math.sin(this.walkPhase * 2.0)) * 0.038 * w;
    hips.position.set(
      0,
      this.baseHipsY + (bounce * w) + (breath * idleWeight),
      0
    );

    hips.rotation.z = -Math.sin(this.walkPhase) * 0.022 * w - sway * 0.5 * idleWeight;
    hips.rotation.y = Math.sin(this.walkPhase) * 0.030 * w;

    spine.rotation.y = -Math.sin(this.walkPhase) * 0.035 * w;
    chest.rotation.y = -Math.sin(this.walkPhase) * 0.018 * w;
    chest.rotation.x = 0.036 * w + (0.02 + breath * 0.5) * idleWeight;

    head.rotation.y = -Math.cos(this.walkPhase) * 0.020 * w - sway * idleWeight;
    neck.rotation.set(0, 0, 0);

    // Left Arm: natural counter-stride swing beside body
    leftClavicle.rotation.set(0, 0, 0);
    leftUpperArm.rotation.x = thighSwing * 0.70 + 0.06 * idleWeight;
    leftUpperArm.rotation.y = 0;
    leftUpperArm.rotation.z = 0.08;
    leftForearm.rotation.x = (0.20 + Math.max(0, -thighSwing) * 0.35) * w + 0.14 * idleWeight;
    leftWrist.rotation.set(0, 0, 0);
    leftHand.rotation.set(0, 0, 0);
    leftFingers.rotation.set(0.15, 0, 0);

    // Right Arm: independent natural counter-stride swing beside body
    rightClavicle.rotation.set(0, 0, 0);
    rightUpperArm.rotation.x = -thighSwing * 0.70 + 0.06 * idleWeight;
    rightUpperArm.rotation.y = 0;
    rightUpperArm.rotation.z = -0.08;
    rightForearm.rotation.x = (0.20 + Math.max(0, thighSwing) * 0.35) * w + 0.14 * idleWeight;
    rightWrist.rotation.set(0, 0, 0);
    rightHand.rotation.set(0, 0, 0);
    rightFingers.rotation.set(0.15, 0, 0);
  }
}

