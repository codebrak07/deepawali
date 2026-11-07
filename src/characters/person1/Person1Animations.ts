import * as THREE from "three";

/**
 * Person 1 (Boy / Aalekh) Complete Anatomical Bone Hierarchy.
 * Explicitly structures all functional joints across:
 * - Legs: Hips, Thighs, Knees, Ankles, Feet/Toes
 * - Arms & Hands: Clavicles, Shoulders/Upper Arms, Elbows/Forearms, Wrists, Hands, Fingers
 * - Spine & Core: Sacrum/Hips, Lumbar/Spine, Thoracic/Chest, Cervical/Neck, Cranium/Head
 */
export interface Person1Bones {
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

  // Left Arm & Hand Chain
  leftClavicle: THREE.Bone;
  leftUpperArm: THREE.Bone;
  leftForearm: THREE.Bone;
  leftWrist: THREE.Bone;
  leftHand: THREE.Bone;
  leftFingers: THREE.Bone;

  // Right Arm & Hand Chain (Inner Arm for Couple Hand-Holding)
  rightClavicle: THREE.Bone;
  rightUpperArm: THREE.Bone;
  rightForearm: THREE.Bone;
  rightWrist: THREE.Bone;
  rightHand: THREE.Bone;
  rightFingers: THREE.Bone;
}

/**
 * Creates the complete articulated humanoid bone hierarchy for Person 1 (Boy).
 * Calibrated to confident 1.78m height proportions.
 */
export function createPerson1Skeleton(height = 1.78): {
  skeleton: THREE.Skeleton;
  bones: Person1Bones;
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

  // 1. Root & Pelvis Foundation (Center of mass at 52% of height)
  const root = makeBone("Person1_Root");
  const hips = makeBone("Person1_Hips");
  hips.position.set(0, 0.52 * H, 0);
  root.add(hips);

  // 2. Spine & Torso Chain
  const spine = makeBone("Person1_Spine");
  spine.position.set(0, 0.12 * H, 0);
  hips.add(spine);

  const chest = makeBone("Person1_Chest");
  chest.position.set(0, 0.14 * H, 0);
  spine.add(chest);

  const neck = makeBone("Person1_Neck");
  neck.position.set(0, 0.10 * H, 0);
  chest.add(neck);

  const head = makeBone("Person1_Head");
  head.position.set(0, 0.08 * H, 0.02 * H);
  neck.add(head);

  // 3. Left Leg Chain (Hips -> Thigh -> Knee -> Ankle -> Foot)
  const leftThigh = makeBone("Person1_LeftThigh");
  leftThigh.position.set(-0.11 * H, -0.04 * H, 0);
  hips.add(leftThigh);

  const leftKnee = makeBone("Person1_LeftKnee");
  leftKnee.position.set(0, -0.25 * H, 0);
  leftThigh.add(leftKnee);

  const leftAnkle = makeBone("Person1_LeftAnkle");
  leftAnkle.position.set(0, -0.23 * H, 0);
  leftKnee.add(leftAnkle);

  const leftFoot = makeBone("Person1_LeftFoot");
  leftFoot.position.set(0, 0, 0.08 * H);
  leftAnkle.add(leftFoot);

  // 4. Right Leg Chain (Hips -> Thigh -> Knee -> Ankle -> Foot)
  const rightThigh = makeBone("Person1_RightThigh");
  rightThigh.position.set(0.11 * H, -0.04 * H, 0);
  hips.add(rightThigh);

  const rightKnee = makeBone("Person1_RightKnee");
  rightKnee.position.set(0, -0.25 * H, 0);
  rightThigh.add(rightKnee);

  const rightAnkle = makeBone("Person1_RightAnkle");
  rightAnkle.position.set(0, -0.23 * H, 0);
  rightKnee.add(rightAnkle);

  const rightFoot = makeBone("Person1_RightFoot");
  rightFoot.position.set(0, 0, 0.08 * H);
  rightAnkle.add(rightFoot);

  // 5. Left Arm Chain (Chest -> Clavicle -> UpperArm -> Forearm -> Wrist -> Hand -> Fingers)
  const leftClavicle = makeBone("Person1_LeftClavicle");
  leftClavicle.position.set(-0.06 * H, 0.06 * H, 0);
  chest.add(leftClavicle);

  const leftUpperArm = makeBone("Person1_LeftUpperArm");
  leftUpperArm.position.set(-0.13 * H, 0, 0);
  leftClavicle.add(leftUpperArm);

  const leftForearm = makeBone("Person1_LeftForearm");
  leftForearm.position.set(0, -0.16 * H, 0);
  leftUpperArm.add(leftForearm);

  const leftWrist = makeBone("Person1_LeftWrist");
  leftWrist.position.set(0, -0.14 * H, 0);
  leftForearm.add(leftWrist);

  const leftHand = makeBone("Person1_LeftHand");
  leftHand.position.set(0, -0.04 * H, 0);
  leftWrist.add(leftHand);

  const leftFingers = makeBone("Person1_LeftFingers");
  leftFingers.position.set(0, -0.05 * H, 0);
  leftHand.add(leftFingers);

  // 6. Right Arm Chain (Inner Arm for Couple Hand Clasping with Sana)
  const rightClavicle = makeBone("Person1_RightClavicle");
  rightClavicle.position.set(0.06 * H, 0.06 * H, 0);
  chest.add(rightClavicle);

  const rightUpperArm = makeBone("Person1_RightUpperArm");
  rightUpperArm.position.set(0.13 * H, 0, 0);
  rightClavicle.add(rightUpperArm);

  const rightForearm = makeBone("Person1_RightForearm");
  rightForearm.position.set(0, -0.16 * H, 0);
  rightUpperArm.add(rightForearm);

  const rightWrist = makeBone("Person1_RightWrist");
  rightWrist.position.set(0, -0.14 * H, 0);
  rightForearm.add(rightWrist);

  const rightHand = makeBone("Person1_RightHand");
  rightHand.position.set(0, -0.04 * H, 0);
  rightWrist.add(rightHand);

  const rightFingers = makeBone("Person1_RightFingers");
  rightFingers.position.set(0, -0.05 * H, 0);
  rightHand.add(rightFingers);

  const skeleton = new THREE.Skeleton(allBones);

  const bones: Person1Bones = {
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
 * Animation Controller for Person 1.
 * Governs walking locomotion, hand-holding kinematics, seating, and sanctum prayer.
 */
export class Person1AnimationController {
  public bones: Person1Bones;
  public height: number;

  private walkPhase = 0;
  private walkWeight = 0;
  private isSitting = false;
  private isPraying = false;

  // Base resting elevations
  private baseHipsY: number;

  constructor(bones: Person1Bones, height = 1.78) {
    this.bones = bones;
    this.height = height;
    this.baseHipsY = 0.52 * height;
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

  /**
   * Primary animation update step.
   * Drives anatomical bones with independent natural kinematics:
   * - Alternating leg swing with biomechanical knee flexion and ankle roll
   * - Pelvic center-of-mass vertical bounce and lateral hip roll
   * - Symmetrical natural counter-stride arm swings beside body
   * - Frame-rate independent delta progression with smooth start/stop dampening
   */
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
    // 1. SOFA / LUXURY FURNITURE SITTING POSE
    // -------------------------------------------------------------------------
    if (this.isSitting) {
      const sitBreath = Math.sin(time * 2.0) * 0.005;
      hips.position.set(0, 0.46 + sitBreath, 0.05);
      hips.rotation.set(0, 0, 0);

      spine.rotation.set(-0.06, 0, 0); // Gentle recline against backrest
      chest.rotation.set(0, 0, 0);
      neck.rotation.set(0.02, 0, 0);
      head.rotation.set(0.04, 0, 0);

      // Thighs extend horizontally across cushion
      leftThigh.rotation.set(-Math.PI / 2, 0, 0);
      rightThigh.rotation.set(-Math.PI / 2, 0, 0);

      // Knees bend 90 degrees downward over cushion front edge
      leftKnee.rotation.set(Math.PI / 2, 0, 0);
      rightKnee.rotation.set(Math.PI / 2, 0, 0);

      // Feet rest flat on floor
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);
      leftFoot.rotation.set(0, 0, 0);
      rightFoot.rotation.set(0, 0, 0);

      // Both arms rest naturally on thighs
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
    // 2. SACRED REVERENT PRAYER POSE (At Shiva Lingam & Hanuman Sanctum)
    // -------------------------------------------------------------------------
    if (this.isPraying) {
      const prayBreathe = Math.sin(time * 2.0) * 0.008;
      hips.position.set(0, this.baseHipsY + prayBreathe, 0);
      hips.rotation.set(0, 0, 0);

      spine.rotation.set(0.12, 0, 0);
      chest.rotation.set(0.08, 0, 0);
      neck.rotation.set(0.10, 0, 0);
      head.rotation.set(0.16, 0, 0); // Humble devotional head bow

      leftThigh.rotation.set(0, 0, 0);
      rightThigh.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);
      leftFoot.rotation.set(0, 0, 0);
      rightFoot.rotation.set(0, 0, 0);

      // Anjali Mudra / Namaste: Hands folded reverently at heart center
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
      // Natural cadence: ~1.8 strides/second scaled to speed, independent of frame rate
      const cadence = Math.max(3.2, moveSpeed * 1.5);
      this.walkPhase += cadence * delta;
    }

    const w = this.walkWeight;
    const idleWeight = 1.0 - w;

    // Idle breathing & subtle weight shift
    const breath = Math.sin(time * 2.2) * 0.010;
    const sway = Math.cos(time * 1.4) * 0.005;

    // Primary thigh pitch swing (alternating forward/backward)
    const thighSwing = Math.sin(this.walkPhase) * 0.50 * w;
    leftThigh.rotation.x = thighSwing;
    rightThigh.rotation.x = -thighSwing;
    leftThigh.rotation.z = 0.02 * idleWeight;
    rightThigh.rotation.z = -0.02 * idleWeight;

    // Natural knee flexion on swing phase (straightens on foot-strike)
    const leftKneeBend = Math.max(0, -Math.sin(this.walkPhase + 0.35)) * 0.76 * w;
    const rightKneeBend = Math.max(0, Math.sin(this.walkPhase + 0.35)) * 0.76 * w;
    leftKnee.rotation.x = leftKneeBend;
    rightKnee.rotation.x = rightKneeBend;

    // Dynamic ankle roll and toe spring (prevents foot clipping or sliding)
    leftAnkle.rotation.x = -(thighSwing + leftKneeBend) * 0.55;
    rightAnkle.rotation.x = -(-thighSwing + rightKneeBend) * 0.55;
    leftFoot.rotation.x = -thighSwing * 0.20;
    rightFoot.rotation.x = thighSwing * 0.20;

    // Pelvic vertical bounce (2 peaks per full gait cycle) & lateral sway
    const bounce = Math.abs(Math.sin(this.walkPhase * 2.0)) * 0.040 * w;
    hips.position.set(
      0,
      this.baseHipsY + (bounce * w) + (breath * idleWeight),
      0
    );
    hips.rotation.z = Math.sin(this.walkPhase) * 0.025 * w + sway * 0.5 * idleWeight;
    hips.rotation.y = -Math.sin(this.walkPhase) * 0.035 * w;

    // Spine & chest counter-rotation
    spine.rotation.y = Math.sin(this.walkPhase) * 0.040 * w;
    chest.rotation.y = Math.sin(this.walkPhase) * 0.020 * w;
    chest.rotation.x = 0.040 * w + (0.02 + breath * 0.5) * idleWeight;

    // Head forward looking with gentle stride bob
    head.rotation.y = Math.cos(this.walkPhase) * 0.020 * w + sway * idleWeight;
    neck.rotation.set(0, 0, 0);

    // Left Arm: natural counter-stride swing beside body
    leftClavicle.rotation.set(0, 0, 0);
    leftUpperArm.rotation.x = -thighSwing * 0.70 + 0.06 * idleWeight;
    leftUpperArm.rotation.y = 0;
    leftUpperArm.rotation.z = 0.08;
    leftForearm.rotation.x = (0.22 + Math.max(0, thighSwing) * 0.35) * w + 0.14 * idleWeight;
    leftWrist.rotation.set(0, 0, 0);
    leftHand.rotation.set(0, 0, 0);
    leftFingers.rotation.set(0.15, 0, 0);

    // Right Arm: independent natural counter-stride swing beside body
    rightClavicle.rotation.set(0, 0, 0);
    rightUpperArm.rotation.x = thighSwing * 0.70 + 0.06 * idleWeight;
    rightUpperArm.rotation.y = 0;
    rightUpperArm.rotation.z = -0.08;
    rightForearm.rotation.x = (0.22 + Math.max(0, -thighSwing) * 0.35) * w + 0.14 * idleWeight;
    rightWrist.rotation.set(0, 0, 0);
    rightHand.rotation.set(0, 0, 0);
    rightFingers.rotation.set(0.15, 0, 0);
  }
}

