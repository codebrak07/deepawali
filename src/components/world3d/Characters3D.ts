import * as THREE from "three";

export interface CharacterRig {
  root: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  head: THREE.Group;
  torso: THREE.Mesh;
  updateAnimation: (isWalking: boolean, time: number) => void;
}

export interface BunnyRig {
  root: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  updateAnimation: (isWalking: boolean, time: number) => void;
}

export function createAalekhCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "aalekhCharacter";

  // Materials
  const kurtaMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // Crimson Kurta
    roughness: 0.6,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
  });

  const pajamaMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.7,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfbd38d,
    roughness: 0.6,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
  });

  const juttiMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.5,
  });

  // Torso (Kurta)
  const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
  const torso = new THREE.Mesh(torsoGeo, kurtaMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  root.add(torso);

  // Golden Placket on Kurta
  const placketGeo = new THREE.BoxGeometry(0.08, 0.7, 0.04);
  const placket = new THREE.Mesh(placketGeo, goldTrimMat);
  placket.position.set(0, 1.1, 0.23);
  root.add(placket);

  // Head Group
  const head = new THREE.Group();
  head.position.set(0, 1.7, 0);

  const faceGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const face = new THREE.Mesh(faceGeo, skinMat);
  head.add(face);

  const hairGeo = new THREE.SphereGeometry(0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 0.05;
  head.add(hair);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.11, 0.02, 0.3);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.11, 0.02, 0.3);
  head.add(rightEye);

  root.add(head);

  // Arms
  const armGeo = new THREE.BoxGeometry(0.18, 0.65, 0.18);
  const leftArm = new THREE.Mesh(armGeo, kurtaMat);
  leftArm.position.set(-0.46, 1.0, 0);
  leftArm.castShadow = true;
  root.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, kurtaMat);
  rightArm.position.set(0.46, 1.0, 0);
  rightArm.castShadow = true;
  root.add(rightArm);

  // Legs
  const legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.22);
  const leftLeg = new THREE.Mesh(legGeo, pajamaMat);
  leftLeg.position.set(-0.18, 0.35, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pajamaMat);
  rightLeg.position.set(0.18, 0.35, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  // Juttis / Shoes
  const shoeGeo = new THREE.BoxGeometry(0.24, 0.1, 0.35);
  const leftShoe = new THREE.Mesh(shoeGeo, juttiMat);
  leftShoe.position.set(-0.18, 0.05, 0.05);
  root.add(leftShoe);

  const rightShoe = new THREE.Mesh(shoeGeo, juttiMat);
  rightShoe.position.set(0.18, 0.05, 0.05);
  root.add(rightShoe);

  let walkPhase = 0;
  const updateAnimation = (isWalking: boolean, time: number) => {
    if (isWalking) {
      walkPhase += 0.22;
      const swing = Math.sin(walkPhase) * 0.45;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      leftArm.rotation.x = -swing;
      rightArm.rotation.x = swing;
      torso.position.y = 1.05 + Math.abs(Math.sin(walkPhase * 2)) * 0.06;
      head.position.y = 1.7 + Math.abs(Math.sin(walkPhase * 2)) * 0.06;
    } else {
      // Idle breathing
      const breath = Math.sin(time * 2.5) * 0.02;
      torso.position.y = 1.05 + breath;
      head.position.y = 1.7 + breath;
      leftLeg.rotation.x = 0;
      rightLeg.rotation.x = 0;
      leftArm.rotation.x = 0;
      rightArm.rotation.x = 0;
    }
  };

  return { root, leftLeg, rightLeg, leftArm, rightArm, head, torso, updateAnimation };
}

export function createShirjanaCharacter(): CharacterRig {
  const root = new THREE.Group();
  root.name = "shirjanaCharacter";

  // Materials
  const lehengaMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Golden Marigold Lehenga
    roughness: 0.5,
  });

  const choliMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Crimson Choli
    roughness: 0.5,
  });

  const dupattaMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e, // Rose pink dupatta
    roughness: 0.6,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.6,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.7,
  });

  // Torso / Choli
  const torsoGeo = new THREE.BoxGeometry(0.58, 0.6, 0.38);
  const torso = new THREE.Mesh(torsoGeo, choliMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  root.add(torso);

  // Flared Lehenga Skirt (Flared Cone)
  const lehengaGeo = new THREE.ConeGeometry(0.55, 0.85, 16);
  const lehenga = new THREE.Mesh(lehengaGeo, lehengaMat);
  lehenga.position.y = 0.55;
  lehenga.castShadow = true;
  root.add(lehenga);

  // Dupatta draped over shoulder
  const dupattaGeo = new THREE.BoxGeometry(0.25, 0.9, 0.42);
  const dupatta = new THREE.Mesh(dupattaGeo, dupattaMat);
  dupatta.position.set(-0.25, 1.05, 0.05);
  root.add(dupatta);

  // Head Group
  const head = new THREE.Group();
  head.position.set(0, 1.65, 0);

  const faceGeo = new THREE.SphereGeometry(0.28, 16, 16);
  const face = new THREE.Mesh(faceGeo, skinMat);
  head.add(face);

  // Long Hair
  const hairGeo = new THREE.SphereGeometry(0.31, 16, 16);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.05, -0.05);
  head.add(hair);

  // Hair Plait falling down back
  const braidGeo = new THREE.CylinderGeometry(0.08, 0.05, 0.7, 8);
  const braid = new THREE.Mesh(braidGeo, hairMat);
  braid.position.set(0, -0.28, -0.26);
  head.add(braid);

  // Jasmine Flower in Hair
  const flowerGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const flowerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const flower = new THREE.Mesh(flowerGeo, flowerMat);
  flower.position.set(0.24, 0.12, 0.12);
  head.add(flower);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.09, 0.02, 0.26);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.09, 0.02, 0.26);
  head.add(rightEye);

  root.add(head);

  // Arms
  const armGeo = new THREE.BoxGeometry(0.15, 0.55, 0.15);
  const leftArm = new THREE.Mesh(armGeo, choliMat);
  leftArm.position.set(-0.38, 1.1, 0);
  root.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, choliMat);
  rightArm.position.set(0.38, 1.1, 0);
  root.add(rightArm);

  // Legs hidden under lehenga
  const legGeo = new THREE.BoxGeometry(0.16, 0.45, 0.16);
  const leftLeg = new THREE.Mesh(legGeo, skinMat);
  leftLeg.position.set(-0.14, 0.25, 0);
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, skinMat);
  rightLeg.position.set(0.14, 0.25, 0);
  root.add(rightLeg);

  let walkPhase = 0;
  const updateAnimation = (isWalking: boolean, time: number) => {
    if (isWalking) {
      walkPhase += 0.22;
      const swing = Math.sin(walkPhase) * 0.35;
      leftArm.rotation.x = -swing;
      rightArm.rotation.x = swing;
      lehenga.rotation.z = Math.sin(walkPhase * 1.5) * 0.08;
      torso.position.y = 1.15 + Math.abs(Math.sin(walkPhase * 2)) * 0.04;
      head.position.y = 1.65 + Math.abs(Math.sin(walkPhase * 2)) * 0.04;
    } else {
      const breath = Math.sin(time * 2.5 + 0.5) * 0.02;
      torso.position.y = 1.15 + breath;
      head.position.y = 1.65 + breath;
      lehenga.rotation.z = 0;
      leftArm.rotation.x = 0;
      rightArm.rotation.x = 0;
    }
  };

  return { root, leftLeg, rightLeg, leftArm, rightArm, head, torso, updateAnimation };
}

export function createBunnyCompanion(): BunnyRig {
  const root = new THREE.Group();
  root.name = "companionBunny";

  const whiteFurMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
  });

  const pinkEarMat = new THREE.MeshStandardMaterial({
    color: 0xfbcfe8,
    roughness: 0.8,
  });

  // Body (Chubby white ellipsoid)
  const bodyGeo = new THREE.SphereGeometry(0.28, 14, 14);
  const body = new THREE.Mesh(bodyGeo, whiteFurMat);
  body.position.set(0, 0.25, 0);
  body.castShadow = true;
  root.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.2, 12, 12);
  const head = new THREE.Mesh(headGeo, whiteFurMat);
  head.position.set(0, 0.42, 0.16);
  root.add(head);

  // Long Cute Ears
  const earGeo = new THREE.BoxGeometry(0.07, 0.28, 0.04);
  const leftEar = new THREE.Mesh(earGeo, whiteFurMat);
  leftEar.position.set(-0.08, 0.64, 0.12);
  leftEar.rotation.z = -0.15;
  root.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, whiteFurMat);
  rightEar.position.set(0.08, 0.64, 0.12);
  rightEar.rotation.z = 0.15;
  root.add(rightEar);

  // Inner Pink Ears
  const innerEarGeo = new THREE.BoxGeometry(0.04, 0.22, 0.02);
  const innerLeft = new THREE.Mesh(innerEarGeo, pinkEarMat);
  innerLeft.position.set(-0.08, 0.64, 0.14);
  innerLeft.rotation.z = -0.15;
  root.add(innerLeft);

  const innerRight = new THREE.Mesh(innerEarGeo, pinkEarMat);
  innerRight.position.set(0.08, 0.64, 0.14);
  innerRight.rotation.z = 0.15;
  root.add(innerRight);

  // Fluffy Tail
  const tailGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const tail = new THREE.Mesh(tailGeo, whiteFurMat);
  tail.position.set(0, 0.22, -0.26);
  root.add(tail);

  // Cute dark nose
  const noseGeo = new THREE.SphereGeometry(0.03, 6, 6);
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, 0.38, 0.34);
  root.add(nose);

  let hopPhase = 0;
  const updateAnimation = (isWalking: boolean, time: number) => {
    if (isWalking) {
      hopPhase += 0.24;
      const hop = Math.abs(Math.sin(hopPhase)) * 0.22;
      root.position.y = hop;
      leftEar.rotation.x = Math.sin(hopPhase) * 0.2;
      rightEar.rotation.x = Math.sin(hopPhase + 0.2) * 0.2;
    } else {
      root.position.y = 0;
      // Idle twitching ears
      leftEar.rotation.z = -0.15 + Math.sin(time * 4) * 0.05;
      rightEar.rotation.z = 0.15 + Math.cos(time * 3.5) * 0.05;
    }
  };

  return { root, leftEar, rightEar, updateAnimation };
}

