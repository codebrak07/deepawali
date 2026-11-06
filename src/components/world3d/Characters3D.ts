import * as THREE from "three";
import {
  loadBoyRiggedCharacter,
  loadGirlRiggedCharacter,
  RiggedHumanoidCharacter,
} from "./CharacterModelLoader";

export interface CharacterRig {
  root: THREE.Group;
  pelvis: THREE.Group;
  leftLeg: THREE.Group;
  leftKnee: THREE.Group;
  leftAnkle: THREE.Group;
  rightLeg: THREE.Group;
  rightKnee: THREE.Group;
  rightAnkle: THREE.Group;
  leftArm: THREE.Group;
  leftElbow: THREE.Group;
  rightArm: THREE.Group;
  rightElbow: THREE.Group;
  head: THREE.Group;
  torso: THREE.Group;
  isCustomModelActive: boolean;
  setPraying: (praying: boolean) => void;
  setSitting: (sitting: boolean) => void;
  setHoldingHands: (holding: boolean) => void;
  updateAnimation: (isWalking: boolean, time: number, moveSpeed?: number) => void;
}

export interface BunnyRig {
  root: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  updateAnimation: (isWalking: boolean, time: number) => void;
}

// =========================================================================
// 1. AALEKH (BOY) CHARACTER: Articulated Rig with Biomechanical Walking Kinematics
// =========================================================================
export function createAalekhCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "aalekhCharacterRoot";

  const scale = 1.0; // 1.78m tall confident modern Indian male proportion

  // High-End Materials
  const kurtaMat = new THREE.MeshStandardMaterial({
    color: 0x881337, // Royal Velvet Crimson
    roughness: 0.5,
    metalness: 0.15,
  });

  const goldZariMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Radiant Gold Zari Border
    roughness: 0.28,
    metalness: 0.75,
  });

  const pajamaMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Pure Silk Cream Churidar
    roughness: 0.55,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8, // Warm healthy Indian skin tone
    roughness: 0.52,
    metalness: 0.05,
  });
  skinMat.color.setHex(0xe2a278); // Warm sun-kissed Indian complexion

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x18181b, // Deep espresso / jet black
    roughness: 0.65,
    metalness: 0.2,
  });

  const juttiMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Tan leather festive mojaris
    roughness: 0.4,
    metalness: 0.35,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.18,
  });

  // Groups
  const proceduralGroup = new THREE.Group();
  proceduralGroup.name = "proceduralAalekhRig";
  root.add(proceduralGroup);

  const customModelGroup = new THREE.Group();
  customModelGroup.name = "customModelAalekhGroup";
  customModelGroup.visible = false;
  root.add(customModelGroup);

  // Primary Articulated Rig with Biomechanical Skeletal Kinematics
  proceduralGroup.visible = true;
  customModelGroup.visible = false;
  let isCustomModelActive = false;

  let boyRig: RiggedHumanoidCharacter | null = null;
  loadBoyRiggedCharacter()
    .then((rig) => {
      boyRig = rig;
      customModelGroup.add(rig.root);
      customModelGroup.visible = true;
      proceduralGroup.visible = false;
      isCustomModelActive = true;
    })
    .catch((err) => {
      console.warn("Using procedural Aalekh fallback rig:", err);
      proceduralGroup.visible = true;
      isCustomModelActive = false;
    });

  // -----------------------------------------------------------------------
  // PELVIS / HIPS (Foundation of biomechanical walking)
  // -----------------------------------------------------------------------
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.90 * scale;
  proceduralGroup.add(pelvis);

  // Hip belt / lower sherwani waist
  const hipMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.18, 16), kurtaMat);
  hipMesh.castShadow = true;
  pelvis.add(hipMesh);

  // Gold Zari Waistband Kamarbandh
  const waistBand = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 8, 20), goldZariMat);
  waistBand.rotation.x = Math.PI / 2;
  pelvis.add(waistBand);

  // Lower Sherwani Flares (Split front/back for unhindered leg movement)
  const flapGeo = new THREE.ConeGeometry(0.32, 0.42, 16, 1, true);
  const flap = new THREE.Mesh(flapGeo, kurtaMat);
  flap.rotation.x = Math.PI;
  flap.position.y = -0.22;
  pelvis.add(flap);

  // -----------------------------------------------------------------------
  // SPINE & CHEST (Torso with tailored Bandhgala)
  // -----------------------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.y = 0.15;
  pelvis.add(torso);

  // Chest / upper body
  const chestGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.48, 16);
  const chest = new THREE.Mesh(chestGeo, kurtaMat);
  chest.position.y = 0.24;
  chest.castShadow = true;
  torso.add(chest);

  // Mandarin Bandhgala Collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.08, 16), goldZariMat);
  collar.position.y = 0.50;
  torso.add(collar);

  // Gold Button Placket
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.03), goldZariMat);
  placket.position.set(0, 0.24, 0.27);
  torso.add(placket);

  for (let b = 0; b < 5; b++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), goldAccentMat);
    btn.position.set(0, 0.38 - b * 0.07, 0.29);
    torso.add(btn);
  }

  // -----------------------------------------------------------------------
  // HEAD & EXPRESSIVE FACE
  // -----------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, 0.62 * scale, 0);
  torso.add(head);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.12, 12), skinMat);
  neck.position.y = -0.06;
  head.add(neck);

  // Sculpted Cranium & Jawline
  const craniumGeo = new THREE.SphereGeometry(0.18, 20, 20);
  craniumGeo.scale(0.95, 1.15, 1.05);
  const cranium = new THREE.Mesh(craniumGeo, skinMat);
  cranium.castShadow = true;
  head.add(cranium);

  // Sculpted Modern Layered Quiff Hair
  const hairGroup = new THREE.Group();
  const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7),
    hairMat
  );
  hairCrown.scale.set(0.98, 1.1, 1.05);
  hairCrown.position.set(0, 0.04, -0.01);
  hairGroup.add(hairCrown);

  // Stylized textured hair tufts
  const tuftGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
  const tuftL = new THREE.Mesh(tuftGeo, hairMat);
  tuftL.rotation.set(-0.4, 0.2, -0.7);
  tuftL.position.set(-0.08, 0.16, 0.09);
  hairGroup.add(tuftL);

  const tuftR = new THREE.Mesh(tuftGeo, hairMat);
  tuftR.rotation.set(-0.35, -0.2, 0.6);
  tuftR.position.set(0.06, 0.18, 0.08);
  hairGroup.add(tuftR);
  head.add(hairGroup);

  // Almond-Shaped Expressive Eyes
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const irisMat = new THREE.MeshBasicMaterial({ color: 0x3d2314 });
  const gleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  [-0.055, 0.055].forEach((xEye) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), eyeWhiteMat);
    eyeWhite.scale.set(1.1, 0.75, 0.35);
    eyeWhite.position.set(xEye, 0.02, 0.165);
    head.add(eyeWhite);

    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.018, 10), irisMat);
    iris.position.set(xEye, 0.02, 0.178);
    head.add(iris);

    const gleam = new THREE.Mesh(new THREE.CircleGeometry(0.006, 6), gleamMat);
    gleam.position.set(xEye + 0.005, 0.026, 0.18);
    head.add(gleam);

    // Natural Contoured Eyebrows (NO crude black blocks!)
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.008, 0.01), hairMat);
    brow.position.set(xEye, 0.058, 0.17);
    brow.rotation.z = xEye < 0 ? 0.08 : -0.08;
    head.add(brow);
  });

  // Nose Bridge & Friendly Smile
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 5), skinMat);
  nose.position.set(0, -0.015, 0.19);
  nose.rotation.x = 0.25;
  head.add(nose);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.028, 0.006, 4, 10, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x881337 })
  );
  smile.rotation.set(Math.PI, 0, 0);
  smile.position.set(0, -0.06, 0.17);
  head.add(smile);

  // -----------------------------------------------------------------------
  // ARMS & HANDS (Shoulder -> Bicep -> Elbow -> Forearm -> Articulated Fingers)
  // -----------------------------------------------------------------------
  const createArticulatedArm = (isLeft: boolean) => {
    const side = isLeft ? -1 : 1;
    const shoulderJoint = new THREE.Group();
    shoulderJoint.position.set(side * 0.30, 0.42, 0);

    // Deltoid
    const deltoid = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), kurtaMat);
    shoulderJoint.add(deltoid);

    // Bicep / Upper Arm
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.26, 10), kurtaMat);
    bicep.position.y = -0.13;
    bicep.castShadow = true;
    shoulderJoint.add(bicep);

    // Elbow Joint (crucial for natural arm bend)
    const elbowJoint = new THREE.Group();
    elbowJoint.position.set(0, -0.26, 0);
    shoulderJoint.add(elbowJoint);

    // Forearm
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.24, 10), kurtaMat);
    forearm.position.y = -0.12;
    forearm.castShadow = true;
    elbowJoint.add(forearm);

    // Wrist & Articulated Hand
    const wrist = new THREE.Group();
    wrist.position.set(0, -0.24, 0);
    elbowJoint.add(wrist);

    // Palm
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.07, 0.035), skinMat);
    palm.position.y = -0.035;
    wrist.add(palm);

    // Articulated Fingers
    [-0.02, -0.006, 0.008, 0.022].forEach((xOff, fIdx) => {
      const fingerLen = fIdx === 1 || fIdx === 2 ? 0.045 : 0.038;
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.012, fingerLen, 0.012), skinMat);
      finger.position.set(xOff, -0.07 - fingerLen / 2, 0);
      wrist.add(finger);
    });

    // Thumb
    const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.035, 0.014), skinMat);
    thumb.position.set(side * 0.032, -0.03, 0.015);
    thumb.rotation.z = side * -0.4;
    wrist.add(thumb);

    torso.add(shoulderJoint);
    return { shoulderJoint, elbowJoint, wrist };
  };

  const leftArmData = createArticulatedArm(true);
  const rightArmData = createArticulatedArm(false);

  const leftArm = leftArmData.shoulderJoint;
  const leftElbow = leftArmData.elbowJoint;
  const rightArm = rightArmData.shoulderJoint;
  const rightElbow = rightArmData.elbowJoint;

  // -----------------------------------------------------------------------
  // LEGS WITH ARTICULATED KNEE JOINTS & FOOT-PLANTING ANKLES (THE CORE FIX!)
  // -----------------------------------------------------------------------
  const createArticulatedLeg = (isLeft: boolean) => {
    const side = isLeft ? -1 : 1;

    // Hip Joint Group (Pivots forward & back)
    const hipJoint = new THREE.Group();
    hipJoint.position.set(side * 0.13, -0.08, 0);

    // Upper Thigh
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.38, 12), pajamaMat);
    thigh.position.y = -0.19;
    thigh.castShadow = true;
    hipJoint.add(thigh);

    // Knee Joint Group (Bends backward during swing!)
    const kneeJoint = new THREE.Group();
    kneeJoint.position.set(0, -0.38, 0);
    hipJoint.add(kneeJoint);

    // Knee cap
    const kneeCap = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), pajamaMat);
    kneeJoint.add(kneeCap);

    // Calf & Shin
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.055, 0.38, 12), pajamaMat);
    shin.position.y = -0.19;
    shin.castShadow = true;
    kneeJoint.add(shin);

    // Ankle Joint Group (Pivots to keep foot flat on ground)
    const ankleJoint = new THREE.Group();
    ankleJoint.position.set(0, -0.38, 0);
    kneeJoint.add(ankleJoint);

    // Shoe Group (Mojari / Sneaker perfectly grounded at y = 0.00)
    const shoeGroup = new THREE.Group();
    const shoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.065, 0.24), juttiMat);
    shoeBody.position.set(0, 0.032, 0.04);
    shoeGroup.add(shoeBody);

    const toeCap = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.08, 8), goldAccentMat);
    toeCap.rotation.x = -Math.PI / 2.2;
    toeCap.position.set(0, 0.02, 0.15);
    shoeGroup.add(toeCap);

    ankleJoint.add(shoeGroup);
    pelvis.add(hipJoint);

    return { hipJoint, kneeJoint, ankleJoint, shoeGroup };
  };

  const leftLegData = createArticulatedLeg(true);
  const rightLegData = createArticulatedLeg(false);

  const leftLeg = leftLegData.hipJoint;
  const leftKnee = leftLegData.kneeJoint;
  const leftAnkle = leftLegData.ankleJoint;

  const rightLeg = rightLegData.hipJoint;
  const rightKnee = rightLegData.kneeJoint;
  const rightAnkle = rightLegData.ankleJoint;

  // -----------------------------------------------------------------------
  // BIOMECHANICAL ANIMATION SYSTEM (Walking, Bending Knees, Hand-Holding, Sitting)
  // -----------------------------------------------------------------------
  let walkPhase = 0;
  let isSitting = false;
  let isPraying = false;
  let isHoldingHands = true;

  const setPraying = (praying: boolean) => {
    isPraying = praying;
    if (praying) isSitting = false;
  };

  const setSitting = (sitting: boolean) => {
    isSitting = sitting;
    if (sitting) isPraying = false;
  };

  const setHoldingHands = (holding: boolean) => {
    isHoldingHands = holding;
  };

  const updateAnimation = (isWalking: boolean, time: number, moveSpeed = 6.0) => {
    // 1. Skinned Humanoid 3D Character Model Skeletal Animation (if active)
    if (boyRig && customModelGroup.visible) {
      if (isSitting) {
        boyRig.bones.hips.position.set(0, 0.46, 0.12);
        boyRig.bones.hips.rotation.set(0, 0, 0);
        boyRig.bones.spine.rotation.set(-0.06, 0, 0);
        boyRig.bones.head.rotation.set(0.04, isHoldingHands ? -0.08 : 0, 0);

        boyRig.bones.leftThigh.rotation.set(-Math.PI / 2, 0, 0);
        boyRig.bones.rightThigh.rotation.set(-Math.PI / 2, 0, 0);
        boyRig.bones.leftKnee.rotation.set(Math.PI / 2, 0, 0);
        boyRig.bones.rightKnee.rotation.set(Math.PI / 2, 0, 0);
        boyRig.bones.leftAnkle.rotation.set(0, 0, 0);
        boyRig.bones.rightAnkle.rotation.set(0, 0, 0);

        boyRig.bones.leftUpperArm.rotation.set(0.35, 0.15, 0.2);
        boyRig.bones.leftForearm.rotation.set(0.45, 0, 0);
        if (isHoldingHands) {
          boyRig.bones.rightUpperArm.rotation.set(0.32, -0.25, -0.28);
          boyRig.bones.rightForearm.rotation.set(0.42, 0, -0.15);
        } else {
          boyRig.bones.rightUpperArm.rotation.set(0.35, -0.15, -0.2);
          boyRig.bones.rightForearm.rotation.set(0.45, 0, 0);
        }
      } else if (isPraying) {
        const prayBreath = Math.sin(time * 2.0) * 0.01;
        boyRig.bones.hips.position.set(0, 0.50 * 1.78 + prayBreath, 0);
        boyRig.bones.hips.rotation.set(0, 0, 0);
        boyRig.bones.spine.rotation.set(0.12, 0, 0);
        boyRig.bones.head.rotation.set(0.15, 0, 0);

        boyRig.bones.leftThigh.rotation.set(0, 0, 0);
        boyRig.bones.rightThigh.rotation.set(0, 0, 0);
        boyRig.bones.leftKnee.rotation.set(0, 0, 0);
        boyRig.bones.rightKnee.rotation.set(0, 0, 0);
        boyRig.bones.leftAnkle.rotation.set(0, 0, 0);
        boyRig.bones.rightAnkle.rotation.set(0, 0, 0);

        boyRig.bones.leftUpperArm.rotation.set(0.85, 0.45, 0.35);
        boyRig.bones.leftForearm.rotation.set(0.85, 0, 0);
        boyRig.bones.rightUpperArm.rotation.set(0.85, -0.45, -0.35);
        boyRig.bones.rightForearm.rotation.set(0.85, 0, 0);
      } else if (isWalking) {
        const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
        walkPhase += 0.085 * strideSpeed;

        const thighSwing = Math.sin(walkPhase) * 0.48;
        const leftThighAngle = thighSwing;
        const rightThighAngle = -thighSwing;

        // Biomechanical Knee Flexion (up to 72 degrees / 1.25 rad)
        const leftKneeBend = Math.max(0, -Math.sin(walkPhase + 0.35)) * 0.72;
        const rightKneeBend = Math.max(0, Math.sin(walkPhase + 0.35)) * 0.72;

        boyRig.bones.leftThigh.rotation.x = leftThighAngle;
        boyRig.bones.rightThigh.rotation.x = rightThighAngle;
        boyRig.bones.leftKnee.rotation.x = leftKneeBend;
        boyRig.bones.rightKnee.rotation.x = rightKneeBend;

        // Ankle Counter-Rotation (keeps sole flat on ground)
        boyRig.bones.leftAnkle.rotation.x = -(leftThighAngle + leftKneeBend) * 0.55;
        boyRig.bones.rightAnkle.rotation.x = -(rightThighAngle + rightKneeBend) * 0.55;

        // Pelvic Bounce & Hip Roll
        const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.045;
        boyRig.bones.hips.position.y = 0.50 * 1.78 + bounce;
        boyRig.bones.hips.rotation.z = Math.sin(walkPhase) * 0.025;
        boyRig.bones.spine.rotation.y = -Math.cos(walkPhase) * 0.04;
        boyRig.bones.head.rotation.y = isHoldingHands ? -0.06 + Math.cos(walkPhase) * 0.02 : Math.cos(walkPhase) * 0.02;

        // Outer Left Arm Swings in Opposition to Leg Stride
        boyRig.bones.leftUpperArm.rotation.x = -leftThighAngle * 0.75;
        boyRig.bones.leftForearm.rotation.x = 0.25 + Math.max(0, leftThighAngle) * 0.35;

        // Inner Right Arm Holding Hands with Sana (Folded arms uncurled and extended naturally!)
        if (isHoldingHands) {
          const handSwing = Math.sin(walkPhase) * 0.12;
          boyRig.bones.rightUpperArm.rotation.set(0.14 + handSwing, -0.22, -0.32);
          boyRig.bones.rightForearm.rotation.set(0.24, 0, -0.16);
        } else {
          boyRig.bones.rightUpperArm.rotation.x = leftThighAngle * 0.75;
          boyRig.bones.rightForearm.rotation.x = 0.25 + Math.max(0, -leftThighAngle) * 0.35;
        }
      } else {
        // Natural Idle Breathing
        const breath = Math.sin(time * 2.2) * 0.012;
        boyRig.bones.hips.position.set(0, 0.50 * 1.78 + breath, 0);
        boyRig.bones.hips.rotation.set(0, 0, 0);
        boyRig.bones.spine.rotation.set(0, 0, 0);
        boyRig.bones.head.rotation.set(0, isHoldingHands ? -0.06 : 0, 0);

        boyRig.bones.leftThigh.rotation.set(0, 0, 0);
        boyRig.bones.rightThigh.rotation.set(0, 0, 0);
        boyRig.bones.leftKnee.rotation.set(0, 0, 0);
        boyRig.bones.rightKnee.rotation.set(0, 0, 0);
        boyRig.bones.leftAnkle.rotation.set(0, 0, 0);
        boyRig.bones.rightAnkle.rotation.set(0, 0, 0);

        boyRig.bones.leftUpperArm.rotation.set(0.08, 0, 0.08);
        boyRig.bones.leftForearm.rotation.set(0.12, 0, 0);

        if (isHoldingHands) {
          boyRig.bones.rightUpperArm.rotation.set(0.10, -0.20, -0.30);
          boyRig.bones.rightForearm.rotation.set(0.22, 0, -0.14);
        } else {
          boyRig.bones.rightUpperArm.rotation.set(0.08, 0, -0.08);
          boyRig.bones.rightForearm.rotation.set(0.12, 0, 0);
        }
      }
      return;
    }

    // 2. SOFA / FURNITURE SITTING (No body clipping, thighs flat on cushion, knees bent 90°)
    if (isSitting) {
      const sitBreath = Math.sin(time * 2.0) * 0.008;
      pelvis.position.set(0, 0.46 + sitBreath, 0);
      pelvis.rotation.set(0, 0, 0);

      torso.rotation.set(-0.06, 0, 0); // Gentle resting recline against sofa backrest
      head.rotation.set(0.04, isHoldingHands ? -0.08 : 0, 0); // Watching TV north & gentle glance at Sana

      // Thighs extend horizontally forward across cushion
      leftLeg.position.set(-0.14, -0.04, 0);
      rightLeg.position.set(0.14, -0.04, 0);
      leftLeg.rotation.set(-Math.PI / 2, 0, 0);
      rightLeg.rotation.set(-Math.PI / 2, 0, 0);

      // Knees bend 90 degrees downward over cushion front edge
      leftKnee.rotation.set(Math.PI / 2, 0, 0);
      rightKnee.rotation.set(Math.PI / 2, 0, 0);

      // Feet rest flat on floor
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      // Left Arm: rests comfortably on thigh
      leftArm.rotation.set(0.45, 0.15, 0.2);
      leftElbow.rotation.set(0.65, 0, 0);

      // Right Arm: clasped with Sana on center cushion or resting lovingly
      if (isHoldingHands) {
        rightArm.rotation.set(0.35, -0.25, -0.3);
        rightElbow.rotation.set(0.45, 0, -0.15);
      } else {
        rightArm.rotation.set(0.45, -0.15, -0.2);
        rightElbow.rotation.set(0.65, 0, 0);
      }
      return;
    }

    // 3. SACRED REVERENT PRAYER POSE (At Shiva Lingam & Hanuman Murti)
    if (isPraying) {
      const prayBreathe = Math.sin(time * 2.0) * 0.012;
      pelvis.position.set(0, 0.90 + prayBreathe, 0);
      pelvis.rotation.set(0, 0, 0);
      torso.rotation.set(0.12, 0, 0);
      head.rotation.set(0.15, 0, 0); // Humble head bow

      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      // Anjali Mudra (Hands folded reverently at heart)
      leftArm.rotation.set(0.85, 0.45, 0.35);
      leftElbow.rotation.set(0.85, 0, 0);
      rightArm.rotation.set(0.85, -0.45, -0.35);
      rightElbow.rotation.set(0.85, 0, 0);
      return;
    }

    // 4. BIOMECHANICAL WALKING KINEMATICS (Alternating stride, bending knees, planted feet)
    if (isWalking) {
      const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
      walkPhase += 0.085 * strideSpeed;

      const thighSwing = Math.sin(walkPhase) * 0.48;
      const leftThighAngle = thighSwing;
      const rightThighAngle = -thighSwing;

      // KNEE BENDING: Knee flexes backward when leg swings forward, straightens when planted!
      const leftKneeBend = Math.max(0, -Math.sin(walkPhase + 0.35)) * 0.72;
      const rightKneeBend = Math.max(0, Math.sin(walkPhase + 0.35)) * 0.72;

      leftLeg.rotation.x = leftThighAngle;
      rightLeg.rotation.x = rightThighAngle;

      leftKnee.rotation.x = leftKneeBend;
      rightKnee.rotation.x = rightKneeBend;

      // ANKLE PLANTING: Counter-rotates so foot remains flat with ground
      leftAnkle.rotation.x = -(leftThighAngle + leftKneeBend) * 0.55;
      rightAnkle.rotation.x = -(rightThighAngle + rightKneeBend) * 0.55;

      // Pelvic Bounce & Hip Roll
      const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.045;
      pelvis.position.y = 0.90 + bounce;
      pelvis.rotation.z = Math.sin(walkPhase) * 0.025;
      pelvis.rotation.y = Math.cos(walkPhase) * 0.035;

      // Spine & Torso Counter-Torsion
      torso.rotation.y = -Math.cos(walkPhase) * 0.04;
      head.rotation.y = isHoldingHands ? -0.06 + Math.cos(walkPhase) * 0.02 : Math.cos(walkPhase) * 0.02;

      // Outer Left Arm: Swings naturally in opposition to left leg
      leftArm.rotation.x = -leftThighAngle * 0.75;
      leftElbow.rotation.x = 0.25 + Math.max(0, leftThighAngle) * 0.4;

      // Inner Right Arm: Holding Hands with Sana!
      if (isHoldingHands) {
        // Hand stays clasped with Sana, swinging gently in lovey-dovey unison
        const handSwing = Math.sin(walkPhase) * 0.12;
        rightArm.rotation.set(0.12 + handSwing, -0.16, -0.22);
        rightElbow.rotation.set(0.18, 0, -0.12);
      } else {
        rightArm.rotation.x = leftThighAngle * 0.75;
        rightElbow.rotation.x = 0.25 + Math.max(0, -leftThighAngle) * 0.4;
      }
    } else {
      // 5. NATURAL IDLE BREATHING & GROUNDED STANCE
      const breath = Math.sin(time * 2.2) * 0.012;
      pelvis.position.set(0, 0.90 + breath, 0);
      pelvis.rotation.set(0, 0, 0);

      torso.rotation.set(0, 0, 0);
      head.rotation.set(0, isHoldingHands ? -0.06 : 0, isHoldingHands ? -0.015 : 0);

      // Relaxed feet planted firmly on ground
      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      // Arms: relaxed at sides or holding hands
      leftArm.rotation.set(0.05, 0, 0.06);
      leftElbow.rotation.set(0.12, 0, 0);

      if (isHoldingHands) {
        rightArm.rotation.set(0.08, -0.14, -0.22);
        rightElbow.rotation.set(0.16, 0, -0.10);
      } else {
        rightArm.rotation.set(0.05, 0, -0.06);
        rightElbow.rotation.set(0.12, 0, 0);
      }
    }
  };

  return {
    root,
    pelvis,
    leftLeg,
    leftKnee,
    leftAnkle,
    rightLeg,
    rightKnee,
    rightAnkle,
    leftArm,
    leftElbow,
    rightArm,
    rightElbow,
    head,
    torso,
    isCustomModelActive,
    setPraying,
    setSitting,
    setHoldingHands,
    updateAnimation,
  };
}

// =========================================================================
// 2. SANA (GIRL) CHARACTER: Graceful Articulated Rig with Bending Knees & Flared Lehenga
// =========================================================================
export function createShirjanaCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "shirjanaCharacterRoot";

  const scale = 0.94; // 1.65m graceful feminine proportion

  // High-End Materials
  const lehengaMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Radiant Amber Marigold Silk
    roughness: 0.45,
    metalness: 0.22,
  });

  const choliMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239, // Royal Velvet Crimson Choli
    roughness: 0.48,
    metalness: 0.18,
  });

  const dupattaMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e, // Sheer Rose Pink Festive Dupatta
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  const goldZariMat = new THREE.MeshStandardMaterial({
    color: 0xfcd34d, // Heavy Gold Zari Embroidery
    roughness: 0.25,
    metalness: 0.8,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe8ad88, // Glowing delicate Indian complexion
    roughness: 0.5,
    metalness: 0.05,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Silky jet-black hair
    roughness: 0.6,
    metalness: 0.25,
  });

  const flowerMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Fresh Jasmine Gajra

  // Groups
  const proceduralGroup = new THREE.Group();
  proceduralGroup.name = "proceduralSanaRig";
  root.add(proceduralGroup);

  const customModelGroup = new THREE.Group();
  customModelGroup.name = "customModelSanaGroup";
  customModelGroup.visible = false;
  root.add(customModelGroup);

  // Primary Articulated Rig with Biomechanical Skeletal Kinematics & Flared Lehenga
  proceduralGroup.visible = true;
  customModelGroup.visible = false;
  let isCustomModelActive = false;

  let girlRig: RiggedHumanoidCharacter | null = null;
  loadGirlRiggedCharacter()
    .then((rig) => {
      girlRig = rig;
      customModelGroup.add(rig.root);
      customModelGroup.visible = true;
      proceduralGroup.visible = false;
      isCustomModelActive = true;
    })
    .catch((err) => {
      console.warn("Using procedural Sana fallback rig:", err);
      proceduralGroup.visible = true;
      isCustomModelActive = false;
    });

  // -----------------------------------------------------------------------
  // PELVIS / HIPS & DYNAMIC LEHENGA SKIRT
  // -----------------------------------------------------------------------
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.85 * scale;
  proceduralGroup.add(pelvis);

  // Feminine Waistband Kamarbandh
  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.14, 16), choliMat);
  pelvis.add(waist);

  const goldWaistBand = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.016, 8, 20), goldZariMat);
  goldWaistBand.rotation.x = Math.PI / 2;
  pelvis.add(goldWaistBand);

  // Flared Tiered Lehenga Skirt (Articulated with leg movement!)
  const lehengaGroup = new THREE.Group();
  lehengaGroup.position.set(0, -0.06, 0);

  const hipTier = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.32, 0.30, 18), lehengaMat);
  hipTier.position.y = -0.15;
  hipTier.castShadow = true;
  lehengaGroup.add(hipTier);

  // Wide Flared Bell
  const bellGeo = new THREE.ConeGeometry(0.52, 0.55, 22, 1, true);
  const bell = new THREE.Mesh(bellGeo, lehengaMat);
  bell.rotation.x = Math.PI;
  bell.position.y = -0.38;
  bell.castShadow = true;
  lehengaGroup.add(bell);

  // Heavy Gold Zari Hem Border
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.03, 8, 24), goldZariMat);
  hem.rotation.x = Math.PI / 2;
  hem.position.y = -0.66;
  lehengaGroup.add(hem);

  pelvis.add(lehengaGroup);

  // -----------------------------------------------------------------------
  // TORSO & CHOLI (Feminine silhouette with sweetheart neckline & sheer dupatta)
  // -----------------------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.y = 0.12;
  pelvis.add(torso);

  const choli = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.18, 0.36, 16), choliMat);
  choli.position.y = 0.18;
  choli.castShadow = true;
  torso.add(choli);

  // Gold neckline trim
  const neckTrim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 6, 16, Math.PI), goldZariMat);
  neckTrim.rotation.set(Math.PI / 2.2, 0, Math.PI);
  neckTrim.position.set(0, 0.34, 0.11);
  torso.add(neckTrim);

  // Sheer Rose Dupatta draped gracefully across torso
  const dupatta = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.24, 0.65, 8, 1, true, 0, Math.PI * 1.2),
    dupattaMat
  );
  dupatta.position.set(-0.04, 0.16, 0.06);
  dupatta.rotation.set(0.15, 0.25, -0.35);
  torso.add(dupatta);

  // -----------------------------------------------------------------------
  // HEAD, BEAUTIFUL FACE, JEWELRY & JASMINE GAJRA
  // -----------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, 0.54 * scale, 0);
  torso.add(head);

  // Graceful neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.14, 12), skinMat);
  neck.position.y = -0.07;
  head.add(neck);

  // Gold Necklace
  const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 6, 16), goldZariMat);
  necklace.rotation.x = Math.PI / 2;
  necklace.position.y = -0.05;
  head.add(necklace);

  // Sculpted Feminine Head
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), skinMat);
  headMesh.scale.set(0.92, 1.12, 1.0);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Silky Long Dark Flowing Hair
  const hairGroup = new THREE.Group();
  const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.175, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.6),
    hairMat
  );
  hairCrown.scale.set(0.96, 1.08, 1.04);
  hairCrown.position.set(0, 0.03, -0.01);
  hairGroup.add(hairCrown);

  // Flowing hair strands cascading past shoulders
  [-0.12, 0.12].forEach((xSide) => {
    const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.45, 8), hairMat);
    strand.position.set(xSide, -0.16, 0.02);
    strand.rotation.z = xSide < 0 ? -0.15 : 0.15;
    hairGroup.add(strand);
  });

  // Fragrant Jasmine Gajra Flowers wrapped in hair
  for (let f = 0; f < 8; f++) {
    const angle = (f / 8) * Math.PI * 1.4 - Math.PI * 0.7;
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), flowerMat);
    flower.position.set(Math.sin(angle) * 0.15, 0.08, -Math.cos(angle) * 0.14);
    hairGroup.add(flower);
  }
  head.add(hairGroup);

  // Expressive Hazel Almond Eyes
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const irisMat = new THREE.MeshBasicMaterial({ color: 0x452310 }); // Warm hazel iris
  const gleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  [-0.048, 0.048].forEach((xEye) => {
    const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), eyeWhiteMat);
    eyeWhite.scale.set(1.15, 0.75, 0.35);
    eyeWhite.position.set(xEye, 0.02, 0.152);
    head.add(eyeWhite);

    const iris = new THREE.Mesh(new THREE.CircleGeometry(0.016, 10), irisMat);
    iris.position.set(xEye, 0.02, 0.164);
    head.add(iris);

    const gleam = new THREE.Mesh(new THREE.CircleGeometry(0.005, 6), gleamMat);
    gleam.position.set(xEye + 0.004, 0.025, 0.166);
    head.add(gleam);

    // Delicate Arch Eyebrows
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.006, 0.008), hairMat);
    brow.position.set(xEye, 0.052, 0.155);
    brow.rotation.z = xEye < 0 ? 0.06 : -0.06;
    head.add(brow);

    // Sparkling Gold Jhumka Earrings
    const earring = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.045, 6), goldZariMat);
    earring.position.set(xEye < 0 ? -0.16 : 0.16, -0.04, 0.01);
    head.add(earring);
  });

  // Sparkling Red Bindi & Rosy Lips
  const bindi = new THREE.Mesh(
    new THREE.CircleGeometry(0.008, 8),
    new THREE.MeshBasicMaterial({ color: 0xbe123c })
  );
  bindi.position.set(0, 0.045, 0.166);
  head.add(bindi);

  const lips = new THREE.Mesh(
    new THREE.TorusGeometry(0.024, 0.006, 4, 10, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0xbe123c })
  );
  lips.rotation.set(Math.PI, 0, 0);
  lips.position.set(0, -0.055, 0.155);
  head.add(lips);

  // -----------------------------------------------------------------------
  // ARMS & HANDS (Articulated Shoulders -> Elbows -> Wrists with Gold Bangles)
  // -----------------------------------------------------------------------
  const createArticulatedSanaArm = (isLeft: boolean) => {
    const side = isLeft ? -1 : 1;
    const shoulderJoint = new THREE.Group();
    shoulderJoint.position.set(side * 0.24, 0.34, 0);

    const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), choliMat);
    shoulderJoint.add(shoulderCap);

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.044, 0.24, 10), skinMat);
    bicep.position.y = -0.12;
    bicep.castShadow = true;
    shoulderJoint.add(bicep);

    const elbowJoint = new THREE.Group();
    elbowJoint.position.set(0, -0.24, 0);
    shoulderJoint.add(elbowJoint);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.038, 0.22, 10), skinMat);
    forearm.position.y = -0.11;
    forearm.castShadow = true;
    elbowJoint.add(forearm);

    // Traditional Gold Glass Bangles (Choodiyan)
    for (let b = 0; b < 3; b++) {
      const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.006, 4, 12), goldZariMat);
      bangle.rotation.x = Math.PI / 2;
      bangle.position.y = -0.14 - b * 0.018;
      elbowJoint.add(bangle);
    }

    const wrist = new THREE.Group();
    wrist.position.set(0, -0.22, 0);
    elbowJoint.add(wrist);

    // Delicate Feminine Palm & Fingers
    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.055, 0.028), skinMat);
    palm.position.y = -0.028;
    wrist.add(palm);

    [-0.016, -0.005, 0.006, 0.017].forEach((xOff, fIdx) => {
      const fingerLen = fIdx === 1 || fIdx === 2 ? 0.036 : 0.030;
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.009, fingerLen, 0.009), skinMat);
      finger.position.set(xOff, -0.055 - fingerLen / 2, 0);
      wrist.add(finger);
    });

    torso.add(shoulderJoint);
    return { shoulderJoint, elbowJoint, wrist };
  };

  const leftArmData = createArticulatedSanaArm(true);
  const rightArmData = createArticulatedSanaArm(false);

  const leftArm = leftArmData.shoulderJoint;
  const leftElbow = leftArmData.elbowJoint;
  const rightArm = rightArmData.shoulderJoint;
  const rightElbow = rightArmData.elbowJoint;

  // -----------------------------------------------------------------------
  // LEGS WITH ARTICULATED KNEE JOINTS & FOOT ANKLES (Beneath flared lehenga)
  // -----------------------------------------------------------------------
  const createArticulatedSanaLeg = (isLeft: boolean) => {
    const side = isLeft ? -1 : 1;
    const hipJoint = new THREE.Group();
    hipJoint.position.set(side * 0.11, -0.08, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.35, 10), skinMat);
    thigh.position.y = -0.175;
    thigh.castShadow = true;
    hipJoint.add(thigh);

    const kneeJoint = new THREE.Group();
    kneeJoint.position.set(0, -0.35, 0);
    hipJoint.add(kneeJoint);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.35, 10), skinMat);
    shin.position.y = -0.175;
    shin.castShadow = true;
    kneeJoint.add(shin);

    // Delicate Golden Payal (Anklet)
    const payal = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 12), goldZariMat);
    payal.rotation.x = Math.PI / 2;
    payal.position.y = -0.32;
    kneeJoint.add(payal);

    const ankleJoint = new THREE.Group();
    ankleJoint.position.set(0, -0.35, 0);
    kneeJoint.add(ankleJoint);

    // Graceful festive mojari shoe
    const shoeGroup = new THREE.Group();
    const shoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.20), goldZariMat);
    shoeBody.position.set(0, 0.027, 0.03);
    shoeGroup.add(shoeBody);

    ankleJoint.add(shoeGroup);
    pelvis.add(hipJoint);

    return { hipJoint, kneeJoint, ankleJoint, shoeGroup };
  };

  const leftLegData = createArticulatedSanaLeg(true);
  const rightLegData = createArticulatedSanaLeg(false);

  const leftLeg = leftLegData.hipJoint;
  const leftKnee = leftLegData.kneeJoint;
  const leftAnkle = leftLegData.ankleJoint;

  const rightLeg = rightLegData.hipJoint;
  const rightKnee = rightLegData.kneeJoint;
  const rightAnkle = rightLegData.ankleJoint;

  // -----------------------------------------------------------------------
  // BIOMECHANICAL ANIMATION SYSTEM (Walking, Bending Knees, Hand-Holding, Sitting)
  // -----------------------------------------------------------------------
  let walkPhase = 0;
  let isSitting = false;
  let isPraying = false;
  let isHoldingHands = true;

  const setPraying = (praying: boolean) => {
    isPraying = praying;
    if (praying) isSitting = false;
  };

  const setSitting = (sitting: boolean) => {
    isSitting = sitting;
    if (sitting) isPraying = false;
  };

  const setHoldingHands = (holding: boolean) => {
    isHoldingHands = holding;
  };

  const updateAnimation = (isWalking: boolean, time: number, moveSpeed = 6.0) => {
    // 1. Skinned Humanoid 3D Girl Model Skeletal Animation (if active)
    if (girlRig && customModelGroup.visible) {
      if (isSitting) {
        girlRig.bones.hips.position.set(0, 0.46, 0.12);
        girlRig.bones.hips.rotation.set(0, 0, 0);
        girlRig.bones.spine.rotation.set(-0.06, 0, 0);
        girlRig.bones.head.rotation.set(0.04, isHoldingHands ? 0.08 : 0, 0);

        girlRig.bones.leftThigh.rotation.set(-Math.PI / 2, 0, 0);
        girlRig.bones.rightThigh.rotation.set(-Math.PI / 2, 0, 0);
        girlRig.bones.leftKnee.rotation.set(Math.PI / 2, 0, 0);
        girlRig.bones.rightKnee.rotation.set(Math.PI / 2, 0, 0);
        girlRig.bones.leftAnkle.rotation.set(0, 0, 0);
        girlRig.bones.rightAnkle.rotation.set(0, 0, 0);

        if (isHoldingHands) {
          girlRig.bones.leftUpperArm.rotation.set(0.32, 0.25, 0.28);
          girlRig.bones.leftForearm.rotation.set(0.42, 0, 0.15);
        } else {
          girlRig.bones.leftUpperArm.rotation.set(0.35, 0.15, 0.2);
          girlRig.bones.leftForearm.rotation.set(0.45, 0, 0);
        }
        girlRig.bones.rightUpperArm.rotation.set(0.35, -0.15, -0.2);
        girlRig.bones.rightForearm.rotation.set(0.45, 0, 0);
      } else if (isPraying) {
        const prayBreath = Math.sin(time * 2.0) * 0.01;
        girlRig.bones.hips.position.set(0, 0.50 * 1.65 + prayBreath, 0);
        girlRig.bones.hips.rotation.set(0, 0, 0);
        girlRig.bones.spine.rotation.set(0.12, 0, 0);
        girlRig.bones.head.rotation.set(0.15, 0, 0);

        girlRig.bones.leftThigh.rotation.set(0, 0, 0);
        girlRig.bones.rightThigh.rotation.set(0, 0, 0);
        girlRig.bones.leftKnee.rotation.set(0, 0, 0);
        girlRig.bones.rightKnee.rotation.set(0, 0, 0);
        girlRig.bones.leftAnkle.rotation.set(0, 0, 0);
        girlRig.bones.rightAnkle.rotation.set(0, 0, 0);

        girlRig.bones.leftUpperArm.rotation.set(0.85, 0.45, 0.35);
        girlRig.bones.leftForearm.rotation.set(0.85, 0, 0);
        girlRig.bones.rightUpperArm.rotation.set(0.85, -0.45, -0.35);
        girlRig.bones.rightForearm.rotation.set(0.85, 0, 0);
      } else if (isWalking) {
        const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
        walkPhase += 0.085 * strideSpeed;

        const thighSwing = Math.sin(walkPhase) * 0.45;
        const leftThighAngle = thighSwing;
        const rightThighAngle = -thighSwing;

        // Biomechanical Knee Flexion (Knees bend backwards dynamically!)
        const leftKneeBend = Math.max(0, -Math.sin(walkPhase + 0.35)) * 0.68;
        const rightKneeBend = Math.max(0, Math.sin(walkPhase + 0.35)) * 0.68;

        girlRig.bones.leftThigh.rotation.x = leftThighAngle;
        girlRig.bones.rightThigh.rotation.x = rightThighAngle;
        girlRig.bones.leftKnee.rotation.x = leftKneeBend;
        girlRig.bones.rightKnee.rotation.x = rightKneeBend;

        girlRig.bones.leftAnkle.rotation.x = -(leftThighAngle + leftKneeBend) * 0.55;
        girlRig.bones.rightAnkle.rotation.x = -(rightThighAngle + rightKneeBend) * 0.55;

        const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.040;
        girlRig.bones.hips.position.y = 0.50 * 1.65 + bounce;
        girlRig.bones.hips.rotation.z = Math.sin(walkPhase) * 0.022;
        girlRig.bones.spine.rotation.y = -Math.cos(walkPhase) * 0.035;
        girlRig.bones.head.rotation.y = isHoldingHands ? 0.06 - Math.cos(walkPhase) * 0.02 : -Math.cos(walkPhase) * 0.02;

        // Inner Left Arm Holding Hands with Aalekh!
        if (isHoldingHands) {
          const handSwing = Math.sin(walkPhase) * 0.12;
          girlRig.bones.leftUpperArm.rotation.set(0.14 + handSwing, 0.22, 0.32);
          girlRig.bones.leftForearm.rotation.set(0.24, 0, 0.16);
        } else {
          girlRig.bones.leftUpperArm.rotation.x = -leftThighAngle * 0.70;
          girlRig.bones.leftForearm.rotation.x = 0.22 + Math.max(0, leftThighAngle) * 0.35;
        }

        // Outer Right Arm Swings with Graceful Momentum
        girlRig.bones.rightUpperArm.rotation.x = leftThighAngle * 0.70;
        girlRig.bones.rightForearm.rotation.x = 0.22 + Math.max(0, -leftThighAngle) * 0.35;
      } else {
        // Natural Idle
        const breath = Math.sin(time * 2.4) * 0.012;
        girlRig.bones.hips.position.set(0, 0.50 * 1.65 + breath, 0);
        girlRig.bones.hips.rotation.set(0, 0, 0);
        girlRig.bones.spine.rotation.set(0, 0, 0);
        girlRig.bones.head.rotation.set(0, isHoldingHands ? 0.06 : 0, 0);

        girlRig.bones.leftThigh.rotation.set(0, 0, 0);
        girlRig.bones.rightThigh.rotation.set(0, 0, 0);
        girlRig.bones.leftKnee.rotation.set(0, 0, 0);
        girlRig.bones.rightKnee.rotation.set(0, 0, 0);
        girlRig.bones.leftAnkle.rotation.set(0, 0, 0);
        girlRig.bones.rightAnkle.rotation.set(0, 0, 0);

        if (isHoldingHands) {
          girlRig.bones.leftUpperArm.rotation.set(0.10, 0.20, 0.30);
          girlRig.bones.leftForearm.rotation.set(0.22, 0, 0.14);
        } else {
          girlRig.bones.leftUpperArm.rotation.set(0.08, 0, 0.08);
          girlRig.bones.leftForearm.rotation.set(0.12, 0, 0);
        }

        girlRig.bones.rightUpperArm.rotation.set(0.08, 0, -0.08);
        girlRig.bones.rightForearm.rotation.set(0.12, 0, 0);
      }
      return;
    }

    // 2. SOFA / FURNITURE SITTING (Beside Aalekh on the luxury sofa)
    if (isSitting) {
      const sitBreath = Math.sin(time * 2.0) * 0.008;
      pelvis.position.set(0, 0.46 + sitBreath, 0);
      pelvis.rotation.set(0, 0, 0);

      torso.rotation.set(-0.06, 0, 0);
      head.rotation.set(0.04, isHoldingHands ? 0.08 : 0, 0); // Watching TV north & gentle glance at Aalekh

      lehengaGroup.rotation.set(0.35, 0, 0); // Flared lehenga settles gracefully on sofa seat

      leftLeg.position.set(-0.12, -0.04, 0);
      rightLeg.position.set(0.12, -0.04, 0);
      leftLeg.rotation.set(-Math.PI / 2, 0, 0);
      rightLeg.rotation.set(-Math.PI / 2, 0, 0);

      leftKnee.rotation.set(Math.PI / 2, 0, 0);
      rightKnee.rotation.set(Math.PI / 2, 0, 0);

      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      // Inner Left Arm: clasped with Aalekh on center cushion
      if (isHoldingHands) {
        leftArm.rotation.set(0.35, 0.25, 0.3);
        leftElbow.rotation.set(0.45, 0, 0.15);
      } else {
        leftArm.rotation.set(0.45, 0.15, 0.2);
        leftElbow.rotation.set(0.65, 0, 0);
      }

      // Outer Right Arm: rests gracefully on lap/thigh
      rightArm.rotation.set(0.45, -0.15, -0.2);
      rightElbow.rotation.set(0.65, 0, 0);
      return;
    }

    // 3. SACRED REVERENT PRAYER POSE
    if (isPraying) {
      const prayBreathe = Math.sin(time * 2.0) * 0.012;
      pelvis.position.set(0, 0.85 + prayBreathe, 0);
      pelvis.rotation.set(0, 0, 0);
      torso.rotation.set(0.12, 0, 0);
      head.rotation.set(0.15, 0, 0);

      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      leftArm.rotation.set(0.85, 0.45, 0.35);
      leftElbow.rotation.set(0.85, 0, 0);
      rightArm.rotation.set(0.85, -0.45, -0.35);
      rightElbow.rotation.set(0.85, 0, 0);
      return;
    }

    // 4. BIOMECHANICAL WALKING KINEMATICS (Alternating stride, bending knees, planted feet)
    if (isWalking) {
      const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
      walkPhase += 0.085 * strideSpeed;

      const thighSwing = Math.sin(walkPhase) * 0.45;
      const leftThighAngle = thighSwing;
      const rightThighAngle = -thighSwing;

      // KNEE BENDING: Knee flexes backward when leg swings forward!
      const leftKneeBend = Math.max(0, -Math.sin(walkPhase + 0.35)) * 0.68;
      const rightKneeBend = Math.max(0, Math.sin(walkPhase + 0.35)) * 0.68;

      leftLeg.rotation.x = leftThighAngle;
      rightLeg.rotation.x = rightThighAngle;

      leftKnee.rotation.x = leftKneeBend;
      rightKnee.rotation.x = rightKneeBend;

      leftAnkle.rotation.x = -(leftThighAngle + leftKneeBend) * 0.55;
      rightAnkle.rotation.x = -(rightThighAngle + rightKneeBend) * 0.55;

      // Graceful lehenga flair dynamic sway
      lehengaGroup.rotation.z = Math.sin(walkPhase) * 0.12;

      // Pelvic Bounce & Hip Roll
      const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.040;
      pelvis.position.y = 0.85 + bounce;
      pelvis.rotation.z = Math.sin(walkPhase) * 0.022;
      pelvis.rotation.y = Math.cos(walkPhase) * 0.030;

      torso.rotation.y = -Math.cos(walkPhase) * 0.035;
      head.rotation.y = isHoldingHands ? 0.06 - Math.cos(walkPhase) * 0.02 : -Math.cos(walkPhase) * 0.02;

      // Inner Left Arm: Holding Hands with Aalekh!
      if (isHoldingHands) {
        const handSwing = Math.sin(walkPhase) * 0.12;
        leftArm.rotation.set(0.12 + handSwing, 0.16, 0.22);
        leftElbow.rotation.set(0.18, 0, 0.12);
      } else {
        leftArm.rotation.x = -leftThighAngle * 0.70;
        leftElbow.rotation.x = 0.22 + Math.max(0, leftThighAngle) * 0.35;
      }

      // Outer Right Arm: Swings naturally in opposition to leg
      rightArm.rotation.x = leftThighAngle * 0.70;
      rightElbow.rotation.x = 0.22 + Math.max(0, -leftThighAngle) * 0.35;
    } else {
      // 5. NATURAL IDLE BREATHING & GROUNDED STANCE
      const breath = Math.sin(time * 2.4) * 0.012;
      pelvis.position.set(0, 0.85 + breath, 0);
      pelvis.rotation.set(0, 0, 0);
      lehengaGroup.rotation.z = 0;

      torso.rotation.set(0, 0, 0);
      head.rotation.set(0, isHoldingHands ? 0.06 : 0, isHoldingHands ? 0.015 : 0);

      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftKnee.rotation.set(0, 0, 0);
      rightKnee.rotation.set(0, 0, 0);
      leftAnkle.rotation.set(0, 0, 0);
      rightAnkle.rotation.set(0, 0, 0);

      if (isHoldingHands) {
        leftArm.rotation.set(0.08, 0.14, 0.22);
        leftElbow.rotation.set(0.16, 0, 0.10);
      } else {
        leftArm.rotation.set(0.04, 0, 0.05);
        leftElbow.rotation.set(0.12, 0, 0);
      }

      rightArm.rotation.set(0.04, 0, -0.05);
      rightElbow.rotation.set(0.12, 0, 0);
    }
  };

  return {
    root,
    pelvis,
    leftLeg,
    leftKnee,
    leftAnkle,
    rightLeg,
    rightKnee,
    rightAnkle,
    leftArm,
    leftElbow,
    rightArm,
    rightElbow,
    head,
    torso,
    isCustomModelActive,
    setPraying,
    setSitting,
    setHoldingHands,
    updateAnimation,
  };
}

// =========================================================================
// 3. UPGRADED BUNNY COMPANION: Chubby rounded body, floppy ears & hopping dynamics
// =========================================================================
export function createBunnyCompanion(): BunnyRig {
  const root = new THREE.Group();
  root.name = "bunnyCompanion";

  const furMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.05,
  });

  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8, // Soft pink inner ear
    roughness: 0.6,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x831843 }); // Deep ruby eyes
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

  // Body: chubby rounded teardrop shape
  const bodyGeo = new THREE.SphereGeometry(0.32, 16, 16);
  bodyGeo.scale(0.85, 0.9, 1.15);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.28;
  body.castShadow = true;
  root.add(body);

  // Head: cute rounded cranium
  const headGeo = new THREE.SphereGeometry(0.22, 14, 14);
  headGeo.scale(1.0, 1.05, 1.0);
  const head = new THREE.Mesh(headGeo, furMat);
  head.position.set(0, 0.44, 0.22);
  head.castShadow = true;
  root.add(head);

  // Left & Right Floppy Ears
  const earGeo = new THREE.CylinderGeometry(0.055, 0.035, 0.38, 8);
  earGeo.scale(1.0, 1.0, 0.5);

  const leftEar = new THREE.Mesh(earGeo, furMat);
  leftEar.position.set(-0.11, 0.62, 0.16);
  leftEar.rotation.set(-0.35, 0, -0.25);
  root.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, furMat);
  rightEar.position.set(0.11, 0.62, 0.16);
  rightEar.rotation.set(-0.35, 0, 0.25);
  root.add(rightEar);

  // Inner pink ear insets
  const inEarGeo = new THREE.CylinderGeometry(0.035, 0.02, 0.32, 6);
  inEarGeo.scale(1.0, 1.0, 0.4);
  const inEarL = new THREE.Mesh(inEarGeo, innerEarMat);
  inEarL.position.set(0, 0, 0.02);
  leftEar.add(inEarL);

  const inEarR = new THREE.Mesh(inEarGeo, innerEarMat);
  inEarR.position.set(0, 0, 0.02);
  rightEar.add(inEarR);

  // Eyes
  [-0.09, 0.09].forEach((ex) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), eyeMat);
    eye.position.set(ex, 0.48, 0.38);
    root.add(eye);
  });

  // Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), noseMat);
  nose.position.set(0, 0.42, 0.44);
  root.add(nose);

  // Puffy Tail
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), furMat);
  tail.position.set(0, 0.32, -0.32);
  root.add(tail);

  // Front Paws
  [-0.1, 0.1].forEach((px) => {
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), furMat);
    paw.scale.set(0.8, 0.6, 1.2);
    paw.position.set(px, 0.05, 0.22);
    root.add(paw);
  });

  // Back Feet
  [-0.16, 0.16].forEach((bx) => {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), furMat);
    foot.scale.set(0.85, 0.5, 1.4);
    foot.position.set(bx, 0.05, -0.06);
    root.add(foot);
  });

  let hopPhase = 0;

  const updateAnimation = (isWalking: boolean, time: number) => {
    if (isWalking) {
      hopPhase += 0.22;
      const hop = Math.abs(Math.sin(hopPhase)) * 0.18;
      root.position.y = hop;
      root.rotation.x = -Math.sin(hopPhase) * 0.18;

      // Floppy ear bounce
      leftEar.rotation.x = -0.35 + Math.sin(hopPhase) * 0.25;
      rightEar.rotation.x = -0.35 + Math.sin(hopPhase) * 0.25;
    } else {
      // Idle twitching & breathing
      const breath = Math.sin(time * 3.5) * 0.015;
      root.position.y = breath;
      root.rotation.x = 0;
      leftEar.rotation.x = -0.35 + Math.sin(time * 4) * 0.08;
      rightEar.rotation.x = -0.35 + Math.cos(time * 3.5) * 0.08;
    }
  };

  return { root, leftEar, rightEar, updateAnimation };
}
