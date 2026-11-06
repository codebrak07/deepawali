import * as THREE from "three";
import { loadBoyCharacterModel, loadGirlCharacterModel } from "./CharacterModelLoader";

export interface CharacterRig {
  root: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  head: THREE.Group;
  torso: THREE.Group;
  setPraying: (praying: boolean) => void;
  setSitting: (sitting: boolean) => void;
  updateAnimation: (isWalking: boolean, time: number) => void;
}

export interface BunnyRig {
  root: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  updateAnimation: (isWalking: boolean, time: number) => void;
}

// =========================================================================
// 1. AALEKH CHARACTER: Detailed stylized 3D model with festive Kurta-Sherwani
// =========================================================================
export function createAalekhCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "aalekhCharacter";

  // Scale calibration: 1.75m realistic stylized proportion
  const scale = 1.0;

  // Materials
  const kurtaMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Royal Crimson Sherwani
    roughness: 0.45,
    metalness: 0.1,
  });

  const goldZariMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Radiant Gold Embroidery
    roughness: 0.3,
    metalness: 0.65,
  });

  const stoleMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Saffron Silk Stole
    roughness: 0.4,
    metalness: 0.2,
  });

  const pajamaMat = new THREE.MeshStandardMaterial({
    color: 0xfdf8f0, // Cream Silk Churidar
    roughness: 0.6,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf94, // Warm glowing skin tone
    roughness: 0.55,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Deep espresso/black stylish styled hair
    roughness: 0.85,
  });

  const juttiMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Tan leather festive mojaris with gold toe
    roughness: 0.4,
    metalness: 0.3,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.8,
    roughness: 0.2,
  });

  const proceduralGroup = new THREE.Group();
  proceduralGroup.name = "proceduralAalekhRig";
  root.add(proceduralGroup);

  const customModelGroup = new THREE.Group();
  customModelGroup.name = "customModelAalekhGroup";
  customModelGroup.visible = false;
  root.add(customModelGroup);

  // Asynchronously load realistic 3D boy model from public/streetwear_86_full_body.glb
  loadBoyCharacterModel()
    .then((customModel) => {
      customModelGroup.add(customModel);
      customModelGroup.visible = true;
      proceduralGroup.visible = false;
    })
    .catch((err) => {
      console.warn("Using procedural Aalekh fallback rig:", err);
    });

  // -----------------------------------------------------------------------
  // TORSO & UPPER BODY (Curved, tailored sherwani)
  // -----------------------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.y = 1.05 * scale;
  proceduralGroup.add(torso);

  // Chest & Midsection (tapered capsule/cylinder)
  const chestGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.65, 16);
  const chest = new THREE.Mesh(chestGeo, kurtaMat);
  chest.castShadow = true;
  chest.receiveShadow = true;
  torso.add(chest);

  // Lower Kurta Flap (A-line flare down to knees)
  const kurtaFlapGeo = new THREE.ConeGeometry(0.38, 0.45, 16, 1, true);
  const kurtaFlap = new THREE.Mesh(kurtaFlapGeo, kurtaMat);
  kurtaFlap.rotation.x = Math.PI;
  kurtaFlap.position.y = -0.42;
  kurtaFlap.castShadow = true;
  torso.add(kurtaFlap);

  // Mandarin Bandhgala Collar
  const collarGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.12, 16);
  const collar = new THREE.Mesh(collarGeo, goldZariMat);
  collar.position.y = 0.36;
  torso.add(collar);

  // Central Gold Zari Button Placket with buttons
  const placketGeo = new THREE.BoxGeometry(0.06, 0.62, 0.04);
  const placket = new THREE.Mesh(placketGeo, goldZariMat);
  placket.position.set(0, 0.02, 0.31);
  torso.add(placket);

  for (let i = 0; i < 5; i++) {
    const btnGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const btn = new THREE.Mesh(btnGeo, goldAccentMat);
    btn.position.set(0, 0.22 - i * 0.1, 0.33);
    torso.add(btn);
  }

  // Silk Stole / Dupatta draped over left shoulder
  const stoleGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.85, 8);
  const stole = new THREE.Mesh(stoleGeo, stoleMat);
  stole.position.set(-0.28, -0.05, 0.08);
  stole.rotation.z = 0.12;
  torso.add(stole);

  // -----------------------------------------------------------------------
  // HEAD & FACIAL FEATURES (Detailed sculpted stylized head)
  // -----------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, 1.62 * scale, 0);
  proceduralGroup.add(head);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.18, 12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = -0.15;
  head.add(neck);

  // Cranium / Face
  const craniumGeo = new THREE.SphereGeometry(0.24, 20, 20);
  craniumGeo.scale(1.0, 1.15, 1.05);
  const cranium = new THREE.Mesh(craniumGeo, skinMat);
  cranium.castShadow = true;
  head.add(cranium);

  // Stylized Hair (Volumetric, swept to side)
  const hairGroup = new THREE.Group();
  const hairBaseGeo = new THREE.SphereGeometry(0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
  hairBaseGeo.scale(1.02, 1.1, 1.08);
  const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
  hairBase.position.set(0, 0.04, -0.02);
  hairGroup.add(hairBase);

  // Side hair sweep tufts
  const tuftGeo = new THREE.ConeGeometry(0.12, 0.28, 8);
  const tuft1 = new THREE.Mesh(tuftGeo, hairMat);
  tuft1.rotation.set(-0.5, 0.2, -0.8);
  tuft1.position.set(-0.15, 0.22, 0.1);
  hairGroup.add(tuft1);

  const tuft2 = new THREE.Mesh(tuftGeo, hairMat);
  tuft2.rotation.set(-0.4, -0.2, 0.7);
  tuft2.position.set(0.12, 0.23, 0.08);
  hairGroup.add(tuft2);
  head.add(hairGroup);

  // Eyes (Almond shaped stylized eyes with dark pupil & white highlight)
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const irisMat = new THREE.MeshBasicMaterial({ color: 0x271810 });
  const pupilGleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  [-0.08, 0.08].forEach((xPos) => {
    // Eye white
    const eyeWhiteGeo = new THREE.SphereGeometry(0.04, 10, 10);
    eyeWhiteGeo.scale(1.2, 0.8, 0.4);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhite.position.set(xPos, 0.02, 0.23);
    head.add(eyeWhite);

    // Iris
    const irisGeo = new THREE.CircleGeometry(0.025, 10);
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.set(xPos, 0.02, 0.25);
    head.add(iris);

    // Highlight
    const gleamGeo = new THREE.CircleGeometry(0.009, 8);
    const gleam = new THREE.Mesh(gleamGeo, pupilGleamMat);
    gleam.position.set(xPos + 0.008, 0.028, 0.252);
    head.add(gleam);

    // Eyebrow
    const browGeo = new THREE.BoxGeometry(0.08, 0.015, 0.02);
    const brow = new THREE.Mesh(browGeo, hairMat);
    brow.position.set(xPos, 0.075, 0.235);
    brow.rotation.z = xPos < 0 ? 0.08 : -0.08;
    head.add(brow);
  });

  // Nose (Subtle contoured bridge)
  const noseGeo = new THREE.ConeGeometry(0.035, 0.08, 6);
  const nose = new THREE.Mesh(noseGeo, skinMat);
  nose.position.set(0, -0.02, 0.26);
  nose.rotation.x = 0.2;
  head.add(nose);

  // Gentle friendly smile
  const mouthGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.015, 8, 1, false, 0, Math.PI);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x9f1239 });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.rotation.set(Math.PI / 2, 0, 0);
  mouth.position.set(0, -0.08, 0.235);
  head.add(mouth);

  // -----------------------------------------------------------------------
  // ARMS & HANDS (Articulated upper & forearm groups)
  // -----------------------------------------------------------------------
  const createArm = (isLeft: boolean) => {
    const armGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    armGroup.position.set(side * 0.38, 1.25 * scale, 0);

    // Shoulder Pauldron / Sleeve
    const shoulderGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const shoulder = new THREE.Mesh(shoulderGeo, kurtaMat);
    armGroup.add(shoulder);

    // Upper Arm
    const upperArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.32, 12);
    const upperArm = new THREE.Mesh(upperArmGeo, kurtaMat);
    upperArm.position.y = -0.16;
    upperArm.castShadow = true;
    armGroup.add(upperArm);

    // Forearm
    const forearmGroup = new THREE.Group();
    forearmGroup.position.set(0, -0.32, 0);
    armGroup.add(forearmGroup);

    const forearmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.28, 12);
    const forearm = new THREE.Mesh(forearmGeo, kurtaMat);
    forearm.position.y = -0.14;
    forearm.castShadow = true;
    forearmGroup.add(forearm);

    // Gold Kada / Cuff on right wrist
    if (!isLeft) {
      const kadaGeo = new THREE.TorusGeometry(0.072, 0.015, 8, 16);
      const kada = new THREE.Mesh(kadaGeo, goldAccentMat);
      kada.rotation.x = Math.PI / 2;
      kada.position.y = -0.27;
      forearmGroup.add(kada);
    }

    // Hand with articulated thumb
    const handGeo = new THREE.SphereGeometry(0.065, 10, 10);
    handGeo.scale(0.8, 1.1, 0.5);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.34, 0);
    forearmGroup.add(hand);

    proceduralGroup.add(armGroup);
    return armGroup;
  };

  const leftArm = createArm(true);
  const rightArm = createArm(false);

  // -----------------------------------------------------------------------
  // LEGS & FESTIVE JUTTIS (Churidar with tailored folds)
  // Perfectly calibrated to ground y = 0.00 (Zero sinking / zero floating)
  // -----------------------------------------------------------------------
  const createLeg = (isLeft: boolean) => {
    const legGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    legGroup.position.set(side * 0.16, 0.85 * scale, 0);

    // Thigh
    const thighGeo = new THREE.CylinderGeometry(0.12, 0.095, 0.42, 12);
    const thigh = new THREE.Mesh(thighGeo, pajamaMat);
    thigh.position.y = -0.21;
    thigh.castShadow = true;
    legGroup.add(thigh);

    // Shin / Calf
    const calfGeo = new THREE.CylinderGeometry(0.095, 0.075, 0.42, 12);
    const calf = new THREE.Mesh(calfGeo, pajamaMat);
    calf.position.y = -0.63;
    calf.castShadow = true;
    legGroup.add(calf);

    // Festive Mojari / Jutti with curved toe (Sole perfectly rests at y = 0.00)
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, -0.805, 0.04);

    const shoeBodyGeo = new THREE.BoxGeometry(0.14, 0.09, 0.28);
    const shoeBody = new THREE.Mesh(shoeBodyGeo, juttiMat);
    shoeGroup.add(shoeBody);

    const toeGeo = new THREE.ConeGeometry(0.07, 0.1, 8);
    const toe = new THREE.Mesh(toeGeo, goldAccentMat);
    toe.rotation.x = -Math.PI / 2.3;
    toe.position.set(0, 0.01, 0.15);
    shoeGroup.add(toe);

    legGroup.add(shoeGroup);
    proceduralGroup.add(legGroup);
    return legGroup;
  };

  const leftLeg = createLeg(true);
  const rightLeg = createLeg(false);

  // -----------------------------------------------------------------------
  // ANIMATION & STATE (Walking, Idle Breathing, Prayer, and Natural Sitting)
  // -----------------------------------------------------------------------
  let walkPhase = 0;
  let isPraying = false;
  let isSitting = false;

  const setPraying = (praying: boolean) => {
    isPraying = praying;
  };

  const setSitting = (sitting: boolean) => {
    isSitting = sitting;
    if (sitting) {
      isPraying = false;
    } else {
      leftLeg.position.set(-0.16, 0.85, 0);
      rightLeg.position.set(0.16, 0.85, 0);
    }
  };

  const updateAnimation = (isWalking: boolean, time: number) => {
    // 1. Realistic 3D Model Procedural Animation
    if (customModelGroup.visible) {
      if (isSitting) {
        // Comfortably seated on sofa/bed with natural recline
        const sitBreath = Math.sin(time * 2.0) * 0.008;
        customModelGroup.position.set(0, -0.42 + sitBreath, 0.12);
        customModelGroup.rotation.set(0.12, 0, 0);
      } else if (isPraying) {
        // Reverent bow before sanctum
        const prayBreath = Math.sin(time * 2.0) * 0.01;
        customModelGroup.position.set(0, prayBreath, 0);
        customModelGroup.rotation.set(0.18, 0, 0);
      } else if (isWalking) {
        walkPhase += 0.18;
        const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.055;
        const tilt = Math.sin(walkPhase) * 0.035;
        const sway = Math.cos(walkPhase) * 0.025;
        customModelGroup.position.set(0, bounce, 0);
        customModelGroup.rotation.set(tilt, sway * 0.5, sway);
      } else {
        const breath = Math.sin(time * 2.2) * 0.012;
        customModelGroup.position.set(0, breath, 0);
        customModelGroup.rotation.set(0, 0, 0);
      }
      return;
    }

    if (isSitting) {
      // Natural Seated Pose on Sofa / Chair
      const sitBreath = Math.sin(time * 2.0) * 0.012;
      torso.position.y = 0.58 + sitBreath;
      head.position.y = 1.15 + sitBreath;
      leftLeg.position.set(-0.2, 0.48, 0.15);
      rightLeg.position.set(0.2, 0.48, 0.15);
      leftLeg.rotation.set(-Math.PI / 2, 0, 0);
      rightLeg.rotation.set(-Math.PI / 2, 0, 0);
      leftArm.rotation.set(0.65, 0.15, 0.2);
      rightArm.rotation.set(0.65, -0.15, -0.2);
      torso.rotation.set(0, 0, 0);
      head.rotation.set(0.04, 0, 0);
      return;
    }

    if (isPraying) {
      // Namaste Prayer Pose
      leftArm.rotation.set(0.9, 0.45, 0.4);
      rightArm.rotation.set(0.9, -0.45, -0.4);
      head.rotation.set(0.12, 0, 0); // Gentle humble bow
      const prayBreathe = Math.sin(time * 2.0) * 0.015;
      torso.position.y = 1.05 + prayBreathe;
      head.position.y = 1.62 + prayBreathe;
      leftLeg.position.set(-0.16, 0.85, 0);
      rightLeg.position.set(0.16, 0.85, 0);
      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      return;
    }

    leftLeg.position.set(-0.16, 0.85, 0);
    rightLeg.position.set(0.16, 0.85, 0);

    if (isWalking) {
      walkPhase += 0.18;
      const legSwing = Math.sin(walkPhase) * 0.48;
      const armSwing = Math.sin(walkPhase) * 0.42;
      const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.06;

      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -legSwing;
      leftArm.rotation.x = -armSwing;
      rightArm.rotation.x = armSwing;

      // Natural spine rotation & body bounce
      torso.rotation.y = Math.sin(walkPhase) * 0.08;
      head.rotation.y = -Math.sin(walkPhase) * 0.05;
      torso.position.y = 1.05 + bounce;
      head.position.y = 1.62 + bounce;
    } else {
      // Idle Breathing
      const breath = Math.sin(time * 2.2) * 0.018;
      torso.position.y = 1.05 + breath;
      head.position.y = 1.62 + breath;

      // Relaxed limbs
      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftArm.rotation.set(0.05, 0, 0.06);
      rightArm.rotation.set(0.05, 0, -0.06);
      torso.rotation.set(0, 0, 0);
      head.rotation.set(0, 0, 0);
    }
  };

  return { root, leftLeg, rightLeg, leftArm, rightArm, head, torso, setPraying, setSitting, updateAnimation };
}

// =========================================================================
// 2. SHIRJANA (SANA) CHARACTER: Graceful Diwali Lehenga, Dupatta, & Gajra
// =========================================================================
export function createShirjanaCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "shirjanaCharacter";

  const scale = 0.95; // Harmonious height ratio

  // Materials
  const lehengaMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Radiant Marigold-Golden Silk
    roughness: 0.42,
    metalness: 0.25,
  });

  const choliMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Royal Crimson Velvet Choli
    roughness: 0.5,
    metalness: 0.15,
  });

  const dupattaMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e, // Rose pink sheer festive dupatta
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  const goldZariMat = new THREE.MeshStandardMaterial({
    color: 0xfcd34d, // Ornate Gold Zari Border
    roughness: 0.25,
    metalness: 0.75,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde047, // Glowing fair skin with festive radiance
    roughness: 0.5,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Silky jet-black hair
    roughness: 0.7,
  });

  const flowerMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Jasmine Gajra

  const proceduralGroup = new THREE.Group();
  proceduralGroup.name = "proceduralSanaRig";
  root.add(proceduralGroup);

  const customModelGroup = new THREE.Group();
  customModelGroup.name = "customModelSanaGroup";
  customModelGroup.visible = false;
  root.add(customModelGroup);

  // Asynchronously load realistic 3D girl model (Sana) from public/
  loadGirlCharacterModel()
    .then((customModel) => {
      customModelGroup.add(customModel);
      customModelGroup.visible = true;
      proceduralGroup.visible = false;
    })
    .catch((err) => {
      console.warn("Using procedural Sana fallback rig:", err);
    });

  // -----------------------------------------------------------------------
  // TORSO & CHOLI (Feminine silhouette with sweetheart neckline)
  // -----------------------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.y = 1.05 * scale;
  proceduralGroup.add(torso);

  // Choli (Tailored velvet blouse)
  const choliGeo = new THREE.CylinderGeometry(0.24, 0.21, 0.42, 16);
  const choli = new THREE.Mesh(choliGeo, choliMat);
  choli.castShadow = true;
  torso.add(choli);

  // Sweetheart neckline gold trim
  const neckTrimGeo = new THREE.TorusGeometry(0.18, 0.016, 8, 16, Math.PI);
  const neckTrim = new THREE.Mesh(neckTrimGeo, goldZariMat);
  neckTrim.rotation.set(Math.PI / 2.2, 0, Math.PI);
  neckTrim.position.set(0, 0.18, 0.14);
  torso.add(neckTrim);

  // Elegant Flared Lehenga Skirt (Multi-tier sculpted festive skirt)
  const lehengaGroup = new THREE.Group();
  lehengaGroup.position.set(0, -0.15, 0);

  // Upper hip flare
  const hipGeo = new THREE.CylinderGeometry(0.22, 0.36, 0.35, 18);
  const hip = new THREE.Mesh(hipGeo, lehengaMat);
  hip.castShadow = true;
  lehengaGroup.add(hip);

  // Lower wide flared bell
  const bellGeo = new THREE.ConeGeometry(0.58, 0.65, 20, 1, true);
  const bell = new THREE.Mesh(bellGeo, lehengaMat);
  bell.rotation.x = Math.PI;
  bell.position.y = -0.42;
  bell.castShadow = true;
  lehengaGroup.add(bell);

  // Heavy Gold Zari Hem Border around lehenga base
  const hemGeo = new THREE.TorusGeometry(0.56, 0.035, 8, 24);
  const hem = new THREE.Mesh(hemGeo, goldZariMat);
  hem.rotation.x = Math.PI / 2;
  hem.position.y = -0.74;
  lehengaGroup.add(hem);

  torso.add(lehengaGroup);

  // Sheer Rose Dupatta draped diagonally across torso
  const dupattaDrapeGeo = new THREE.CylinderGeometry(0.18, 0.26, 0.75, 8, 1, true, 0, Math.PI * 1.2);
  const dupattaDrape = new THREE.Mesh(dupattaDrapeGeo, dupattaMat);
  dupattaDrape.position.set(-0.06, 0.02, 0.08);
  dupattaDrape.rotation.set(0.2, 0.3, -0.4);
  torso.add(dupattaDrape);

  // -----------------------------------------------------------------------
  // HEAD, BEAUTIFUL FACE & GAJRA (Expressive, delicate features)
  // -----------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, 1.58 * scale, 0);
  proceduralGroup.add(head);

  // Graceful neck
  const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.18, 12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = -0.14;
  head.add(neck);

  // Gold necklace
  const necklaceGeo = new THREE.TorusGeometry(0.11, 0.015, 8, 16);
  const necklace = new THREE.Mesh(necklaceGeo, goldZariMat);
  necklace.rotation.x = Math.PI / 2;
  necklace.position.y = -0.12;
  head.add(necklace);

  // Head/Face shape (Contoured feminine jawline)
  const faceGeo = new THREE.SphereGeometry(0.22, 20, 20);
  faceGeo.scale(0.95, 1.1, 0.98);
  const face = new THREE.Mesh(faceGeo, skinMat);
  face.castShadow = true;
  head.add(face);

  // Voluminous hairstyle with soft front parting
  const hairBaseGeo = new THREE.SphereGeometry(0.24, 18, 18);
  hairBaseGeo.scale(0.98, 1.12, 1.05);
  const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
  hairBase.position.set(0, 0.04, -0.04);
  head.add(hairBase);

  // Long Traditional Braided Plait cascading down the back
  const braidGroup = new THREE.Group();
  braidGroup.position.set(0, -0.1, -0.2);
  for (let i = 0; i < 7; i++) {
    const segmentRadius = 0.075 - i * 0.007;
    const segGeo = new THREE.SphereGeometry(segmentRadius, 8, 8);
    const seg = new THREE.Mesh(segGeo, hairMat);
    seg.position.y = -i * 0.1;
    braidGroup.add(seg);
  }
  head.add(braidGroup);

  // Fragrant Jasmine Flower Gajra encircling hair bun
  const gajraGeo = new THREE.TorusGeometry(0.16, 0.035, 8, 18);
  const gajra = new THREE.Mesh(gajraGeo, flowerMat);
  gajra.position.set(0, 0.06, -0.16);
  gajra.rotation.x = 0.6;
  head.add(gajra);

  // Expressive Almond Eyes & Long Eyelashes
  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const irisMat = new THREE.MeshBasicMaterial({ color: 0x1c1917 });
  const gleamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  [-0.075, 0.075].forEach((xPos) => {
    // Eye white
    const eyeWhiteGeo = new THREE.SphereGeometry(0.036, 10, 10);
    eyeWhiteGeo.scale(1.2, 0.85, 0.4);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeWhite.position.set(xPos, 0.02, 0.2);
    head.add(eyeWhite);

    // Deep warm brown iris
    const irisGeo = new THREE.CircleGeometry(0.024, 10);
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.set(xPos, 0.02, 0.22);
    head.add(iris);

    // Catchlight highlight
    const gleamGeo = new THREE.CircleGeometry(0.008, 8);
    const gleam = new THREE.Mesh(gleamGeo, gleamMat);
    gleam.position.set(xPos + 0.007, 0.028, 0.222);
    head.add(gleam);

    // Arched Eyebrow
    const browGeo = new THREE.BoxGeometry(0.07, 0.012, 0.02);
    const brow = new THREE.Mesh(browGeo, hairMat);
    brow.position.set(xPos, 0.07, 0.205);
    brow.rotation.z = xPos < 0 ? 0.06 : -0.06;
    head.add(brow);

    // Golden Jhumka Earring
    const jhumkaGroup = new THREE.Group();
    jhumkaGroup.position.set(xPos * 2.8, -0.06, 0);
    const stud = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), goldZariMat);
    jhumkaGroup.add(stud);
    const bellMesh = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.05, 8), goldZariMat);
    bellMesh.position.y = -0.04;
    bellMesh.rotation.x = Math.PI;
    jhumkaGroup.add(bellMesh);
    head.add(jhumkaGroup);
  });

  // Delicate Bindi between eyebrows
  const bindiGeo = new THREE.CircleGeometry(0.012, 8);
  const bindi = new THREE.Mesh(bindiGeo, new THREE.MeshBasicMaterial({ color: 0xbe123c }));
  bindi.position.set(0, 0.065, 0.222);
  head.add(bindi);

  // Soft smiling lips
  const lipsGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.014, 8, 1, false, 0, Math.PI);
  const lips = new THREE.Mesh(lipsGeo, new THREE.MeshBasicMaterial({ color: 0xbe123c }));
  lips.rotation.set(Math.PI / 2, 0, 0);
  lips.position.set(0, -0.07, 0.205);
  head.add(lips);

  // -----------------------------------------------------------------------
  // ARMS & BANGLES
  // -----------------------------------------------------------------------
  const createSanaArm = (isLeft: boolean) => {
    const armGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    armGroup.position.set(side * 0.32, 1.2 * scale, 0);

    // Puffed Choli Sleeve
    const sleeveGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const sleeve = new THREE.Mesh(sleeveGeo, choliMat);
    armGroup.add(sleeve);

    // Bare Upper Arm
    const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.058, 0.28, 10);
    const upperArm = new THREE.Mesh(upperArmGeo, skinMat);
    upperArm.position.y = -0.15;
    upperArm.castShadow = true;
    armGroup.add(upperArm);

    // Forearm with Gold Bangles
    const forearmGroup = new THREE.Group();
    forearmGroup.position.set(0, -0.28, 0);
    armGroup.add(forearmGroup);

    const forearmGeo = new THREE.CylinderGeometry(0.058, 0.05, 0.26, 10);
    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.position.y = -0.13;
    forearm.castShadow = true;
    forearmGroup.add(forearm);

    // Bangles (Choodiyan)
    for (let b = 0; b < 3; b++) {
      const bangle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 6, 12), goldZariMat);
      bangle.rotation.x = Math.PI / 2;
      bangle.position.y = -0.18 - b * 0.022;
      forearmGroup.add(bangle);
    }

    // Hand
    const handGeo = new THREE.SphereGeometry(0.05, 8, 8);
    handGeo.scale(0.8, 1.1, 0.5);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.set(0, -0.3, 0);
    forearmGroup.add(hand);

    proceduralGroup.add(armGroup);
    return armGroup;
  };

  const leftArm = createSanaArm(true);
  const rightArm = createSanaArm(false);

  // -----------------------------------------------------------------------
  // LEGS (Hidden elegantly beneath flared lehenga)
  // -----------------------------------------------------------------------
  const createSanaLeg = (isLeft: boolean) => {
    const legGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    legGroup.position.set(side * 0.14, 0.65 * scale, 0);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.65, 8);
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.position.y = -0.32;
    legGroup.add(leg);

    // Golden Payal (Anklet)
    const payal = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 6, 12), goldZariMat);
    payal.rotation.x = Math.PI / 2;
    payal.position.y = -0.62;
    legGroup.add(payal);

    proceduralGroup.add(legGroup);
    return legGroup;
  };

  const leftLeg = createSanaLeg(true);
  const rightLeg = createSanaLeg(false);

  // -----------------------------------------------------------------------
  // ANIMATION & STATE
  // -----------------------------------------------------------------------
  let walkPhase = 0;
  let isPraying = false;
  let isSitting = false;

  const setPraying = (praying: boolean) => {
    isPraying = praying;
  };

  const setSitting = (sitting: boolean) => {
    isSitting = sitting;
    if (sitting) {
      isPraying = false;
    }
  };

  const updateAnimation = (isWalking: boolean, time: number) => {
    // 1. Realistic 3D Girl Model Procedural Animation
    if (customModelGroup.visible) {
      if (isSitting) {
        const sitBreath = Math.sin(time * 2.0) * 0.008;
        customModelGroup.position.set(0, -0.40 + sitBreath, 0.1);
        customModelGroup.rotation.set(0.12, 0, 0);
      } else if (isPraying) {
        const prayBreath = Math.sin(time * 2.0) * 0.01;
        customModelGroup.position.set(0, prayBreath, 0);
        customModelGroup.rotation.set(0.18, 0, 0);
      } else if (isWalking) {
        walkPhase += 0.18;
        const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.048;
        const tilt = Math.sin(walkPhase) * 0.03;
        const sway = Math.cos(walkPhase) * 0.02;
        customModelGroup.position.set(0, bounce, 0);
        customModelGroup.rotation.set(tilt, sway * 0.5, sway);
      } else {
        const breath = Math.sin(time * 2.4) * 0.012;
        customModelGroup.position.set(0, breath, 0);
        customModelGroup.rotation.set(0, 0, 0);
      }
      return;
    }

    if (isSitting) {
      // Natural Seated Pose for Sana
      const sitBreath = Math.sin(time * 2.0) * 0.01;
      torso.position.y = 0.54 + sitBreath;
      head.position.y = 1.08 + sitBreath;
      lehengaGroup.rotation.set(0.35, 0, 0);
      leftLeg.rotation.set(-Math.PI / 2.2, 0, 0);
      rightLeg.rotation.set(-Math.PI / 2.2, 0, 0);
      leftArm.rotation.set(0.5, 0.2, 0.15);
      rightArm.rotation.set(0.5, -0.2, -0.15);
      torso.rotation.set(0, 0, 0);
      head.rotation.set(0.04, 0, 0);
      return;
    }

    if (isPraying) {
      leftArm.rotation.set(0.85, 0.42, 0.35);
      rightArm.rotation.set(0.85, -0.42, -0.35);
      head.rotation.set(0.12, 0, 0);
      const prayBreathe = Math.sin(time * 2.0) * 0.015;
      torso.position.y = 1.05 + prayBreathe;
      head.position.y = 1.58 + prayBreathe;
      return;
    }

    if (isWalking) {
      walkPhase += 0.18;
      const legSwing = Math.sin(walkPhase) * 0.45;
      const armSwing = Math.sin(walkPhase) * 0.38;
      const lehengaSway = Math.sin(walkPhase) * 0.12;

      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -legSwing;
      leftArm.rotation.x = -armSwing;
      rightArm.rotation.x = armSwing;

      // Graceful lehenga flair sway
      lehengaGroup.rotation.z = lehengaSway;
      torso.rotation.y = Math.sin(walkPhase) * 0.06;
      head.rotation.y = -Math.sin(walkPhase) * 0.04;
      torso.position.y = 1.05 + Math.abs(Math.sin(walkPhase * 2)) * 0.05;
      head.position.y = 1.58 + Math.abs(Math.sin(walkPhase * 2)) * 0.05;
    } else {
      const breath = Math.sin(time * 2.4) * 0.015;
      torso.position.y = 1.05 + breath;
      head.position.y = 1.58 + breath;
      lehengaGroup.rotation.z = 0;
      leftLeg.rotation.set(0, 0, 0);
      rightLeg.rotation.set(0, 0, 0);
      leftArm.rotation.set(0.04, 0, 0.05);
      rightArm.rotation.set(0.04, 0, -0.05);
      torso.rotation.set(0, 0, 0);
      head.rotation.set(0, 0, 0);
    }
  };

  return { root, leftLeg, rightLeg, leftArm, rightArm, head, torso, setPraying, setSitting, updateAnimation };
}

// =========================================================================
// 3. UPGRADED BUNNY COMPANION: Chubby rounded body, floppy ears & hopping dynamics
// =========================================================================
export function createBunnyCompanion(): BunnyRig {
  const root = new THREE.Group();
  root.name = "bunnyCompanion";

  // Materials
  const furMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Fluffy white fur
    roughness: 0.85,
  });

  const innerEarMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8, // Soft rosy pink inner ear
    roughness: 0.6,
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

  // Pear-shaped rounded body
  const bodyGeo = new THREE.SphereGeometry(0.24, 16, 16);
  bodyGeo.scale(0.9, 1.1, 1.25);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.22;
  body.castShadow = true;
  root.add(body);

  // Chubby Cheeks Head
  const headGeo = new THREE.SphereGeometry(0.18, 14, 14);
  headGeo.scale(1.15, 1.0, 1.05);
  const head = new THREE.Mesh(headGeo, furMat);
  head.position.set(0, 0.38, 0.18);
  head.castShadow = true;
  root.add(head);

  // Big Shiny Eyes with reflections
  [-0.09, 0.09].forEach((xPos) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    eye.position.set(xPos, 0.4, 0.32);
    root.add(eye);

    const gleam = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    gleam.position.set(xPos + 0.01, 0.415, 0.345);
    root.add(gleam);
  });

  // Pink Twitchy Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.03, 6), noseMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.36, 0.36);
  root.add(nose);

  // Expressive Floppy Ears with Inner Pink
  const createEar = (isLeft: boolean) => {
    const earGroup = new THREE.Group();
    const side = isLeft ? -1 : 1;
    earGroup.position.set(side * 0.08, 0.52, 0.12);

    const earGeo = new THREE.ConeGeometry(0.065, 0.34, 10);
    earGeo.scale(0.8, 1.0, 0.35);
    const ear = new THREE.Mesh(earGeo, furMat);
    ear.position.y = 0.14;
    earGroup.add(ear);

    const innerGeo = new THREE.ConeGeometry(0.045, 0.26, 8);
    innerGeo.scale(0.7, 1.0, 0.2);
    const inner = new THREE.Mesh(innerGeo, innerEarMat);
    inner.position.set(0, 0.12, 0.015);
    earGroup.add(inner);

    earGroup.rotation.z = side * 0.25;
    earGroup.rotation.x = -0.2;
    root.add(earGroup);
    return ear;
  };

  const leftEar = createEar(true);
  const rightEar = createEar(false);

  // Fluffy Tail
  const tailGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const tail = new THREE.Mesh(tailGeo, furMat);
  tail.position.set(0, 0.22, -0.28);
  root.add(tail);

  // Paws
  [-0.09, 0.09].forEach((px) => {
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), furMat);
    paw.scale.set(0.8, 0.5, 1.2);
    paw.position.set(px, 0.04, 0.12);
    root.add(paw);
  });

  let hopPhase = 0;
  const updateAnimation = (isWalking: boolean, time: number) => {
    if (isWalking) {
      hopPhase += 0.26;
      // Joyful rhythmic hopping motion
      const hop = Math.abs(Math.sin(hopPhase)) * 0.18;
      root.position.y = hop;
      root.rotation.x = Math.sin(hopPhase) * 0.18;

      // Ear spring dynamic bounce
      leftEar.rotation.z = -0.25 + Math.sin(hopPhase * 1.5) * 0.25;
      rightEar.rotation.z = 0.25 - Math.sin(hopPhase * 1.5) * 0.25;
    } else {
      // Idle sniffing & ear twitching
      root.position.y = 0;
      root.rotation.x = 0;
      const noseTwitch = Math.sin(time * 6.0) * 0.005;
      nose.position.y = 0.36 + noseTwitch;
      leftEar.rotation.z = -0.25 + Math.sin(time * 3.0) * 0.08;
      rightEar.rotation.z = 0.25 + Math.cos(time * 3.0) * 0.08;
    }
  };

  return { root, leftEar, rightEar, updateAnimation };
}
