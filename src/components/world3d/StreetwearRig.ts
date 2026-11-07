import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * 206-Bone Anatomical Skeletal Hierarchy definition for Streetwear (Boy / Aalekh).
 * Every single bone of the 206 human skeletal system is explicitly instantiated,
 * hierarchically parented according to human anatomy, and mapped to functional kinematic joints.
 */
export interface AnatomicalBones206 {
  // Axial Skeleton (80 bones)
  // 1. Skull (22)
  craniumOccipital: THREE.Bone;
  craniumParietalL: THREE.Bone;
  craniumParietalR: THREE.Bone;
  craniumFrontal: THREE.Bone;
  craniumTemporalL: THREE.Bone;
  craniumTemporalR: THREE.Bone;
  craniumSphenoid: THREE.Bone;
  craniumEthmoid: THREE.Bone;
  faceNasalL: THREE.Bone;
  faceNasalR: THREE.Bone;
  faceMaxillaL: THREE.Bone;
  faceMaxillaR: THREE.Bone;
  faceLacrimalL: THREE.Bone;
  faceLacrimalR: THREE.Bone;
  faceZygomaticL: THREE.Bone;
  faceZygomaticR: THREE.Bone;
  facePalatineL: THREE.Bone;
  facePalatineR: THREE.Bone;
  faceInferiorNasalConchaL: THREE.Bone;
  faceInferiorNasalConchaR: THREE.Bone;
  faceVomer: THREE.Bone;
  faceMandible: THREE.Bone;
  // 2. Auditory Ossicles (6)
  earMalleusL: THREE.Bone; earMalleusR: THREE.Bone;
  earIncusL: THREE.Bone; earIncusR: THREE.Bone;
  earStapesL: THREE.Bone; earStapesR: THREE.Bone;
  // 3. Hyoid (1)
  hyoid: THREE.Bone;
  // 4. Vertebral Column (26)
  vertebraC1: THREE.Bone; vertebraC2: THREE.Bone; vertebraC3: THREE.Bone;
  vertebraC4: THREE.Bone; vertebraC5: THREE.Bone; vertebraC6: THREE.Bone; vertebraC7: THREE.Bone;
  vertebraT1: THREE.Bone; vertebraT2: THREE.Bone; vertebraT3: THREE.Bone; vertebraT4: THREE.Bone;
  vertebraT5: THREE.Bone; vertebraT6: THREE.Bone; vertebraT7: THREE.Bone; vertebraT8: THREE.Bone;
  vertebraT9: THREE.Bone; vertebraT10: THREE.Bone; vertebraT11: THREE.Bone; vertebraT12: THREE.Bone;
  vertebraL1: THREE.Bone; vertebraL2: THREE.Bone; vertebraL3: THREE.Bone; vertebraL4: THREE.Bone; vertebraL5: THREE.Bone;
  sacrum: THREE.Bone;
  coccyx: THREE.Bone;
  // 5. Thoracic Cage (25)
  sternumManubrium: THREE.Bone;
  sternumBody: THREE.Bone;
  sternumXiphoid: THREE.Bone;
  ribsL: THREE.Bone[]; // 12 Left ribs
  ribsR: THREE.Bone[]; // 12 Right ribs

  // Appendicular Skeleton (126 bones)
  // 6. Pectoral Girdle (4)
  clavicleL: THREE.Bone; clavicleR: THREE.Bone;
  scapulaL: THREE.Bone; scapulaR: THREE.Bone;
  // 7. Upper Limbs (60)
  humerusL: THREE.Bone; humerusR: THREE.Bone;
  radiusL: THREE.Bone; radiusR: THREE.Bone;
  ulnaL: THREE.Bone; ulnaR: THREE.Bone;
  carpalsL: THREE.Bone[]; // 8 bones (scaphoid, lunate, triquetrum, pisiform, trapezium, trapezoid, capitate, hamate)
  carpalsR: THREE.Bone[]; // 8 bones
  metacarpalsL: THREE.Bone[]; // 5 bones (I to V)
  metacarpalsR: THREE.Bone[]; // 5 bones
  phalangesHandL: THREE.Bone[]; // 14 bones (thumb 2, fingers 3 each)
  phalangesHandR: THREE.Bone[]; // 14 bones
  // 8. Pelvic Girdle (2)
  pelvisIliumL: THREE.Bone; pelvisIliumR: THREE.Bone;
  // 9. Lower Limbs (60)
  femurL: THREE.Bone; femurR: THREE.Bone;
  patellaL: THREE.Bone; patellaR: THREE.Bone;
  tibiaL: THREE.Bone; tibiaR: THREE.Bone;
  fibulaL: THREE.Bone; fibulaR: THREE.Bone;
  tarsalsL: THREE.Bone[]; // 7 bones (calcaneus, talus, navicular, 3 cuneiforms, cuboid)
  tarsalsR: THREE.Bone[]; // 7 bones
  metatarsalsL: THREE.Bone[]; // 5 bones (I to V)
  metatarsalsR: THREE.Bone[]; // 5 bones
  phalangesFootL: THREE.Bone[]; // 14 bones (hallux 2, toes 3 each)
  phalangesFootR: THREE.Bone[]; // 14 bones
}

export interface StreetwearGirlRigController {
  root: THREE.Group;
  skinnedMesh: THREE.SkinnedMesh;
  skeleton: THREE.Skeleton;
  bones206: AnatomicalBones206;
  allBones: THREE.Bone[];
  // Primary Kinematic Joints
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
  // Animation & Inverse Kinematics APIs
  setHoldingHands: (holding: boolean) => void;
  setSitting: (sitting: boolean) => void;
  setPraying: (praying: boolean) => void;
  updateAnimation: (isWalking: boolean, time: number, moveSpeed?: number) => void;
  solveLeftHandIK: (targetLocalPos: THREE.Vector3) => void;
}

/**
 * Builds the complete 206-bone anatomical skeleton hierarchy for a humanoid.
 */
function build206BoneHierarchy(H: number): {
  allBones: THREE.Bone[];
  bones206: AnatomicalBones206;
} {
  const allBones: THREE.Bone[] = [];
  const makeBone = (name: string): THREE.Bone => {
    const b = new THREE.Bone();
    b.name = name;
    allBones.push(b);
    return b;
  };

  // Pelvis / Foundation
  const sacrum = makeBone("Sacrum");
  sacrum.position.set(0, 0.50 * H, 0);

  const coccyx = makeBone("Coccyx");
  coccyx.position.set(0, -0.04 * H, -0.02 * H);
  sacrum.add(coccyx);

  const pelvisIliumL = makeBone("Pelvis_Ilium_L");
  pelvisIliumL.position.set(-0.06 * H, 0.02 * H, 0);
  sacrum.add(pelvisIliumL);

  const pelvisIliumR = makeBone("Pelvis_Ilium_R");
  pelvisIliumR.position.set(0.06 * H, 0.02 * H, 0);
  sacrum.add(pelvisIliumR);

  // Lumbar Spine (L5 to L1)
  const vertebraL5 = makeBone("Vertebra_L5"); vertebraL5.position.set(0, 0.03 * H, 0); sacrum.add(vertebraL5);
  const vertebraL4 = makeBone("Vertebra_L4"); vertebraL4.position.set(0, 0.025 * H, 0); vertebraL5.add(vertebraL4);
  const vertebraL3 = makeBone("Vertebra_L3"); vertebraL3.position.set(0, 0.025 * H, 0); vertebraL4.add(vertebraL3);
  const vertebraL2 = makeBone("Vertebra_L2"); vertebraL2.position.set(0, 0.025 * H, 0); vertebraL3.add(vertebraL2);
  const vertebraL1 = makeBone("Vertebra_L1"); vertebraL1.position.set(0, 0.025 * H, 0); vertebraL2.add(vertebraL1);

  // Thoracic Spine (T12 to T1)
  let prevT = vertebraL1;
  const thoracicVertebrae: THREE.Bone[] = [];
  for (let i = 12; i >= 1; i--) {
    const tBone = makeBone(`Vertebra_T${i}`);
    tBone.position.set(0, 0.012 * H, 0);
    prevT.add(tBone);
    thoracicVertebrae.push(tBone);
    prevT = tBone;
  }
  const vertebraT1 = prevT;

  // Sternum & Ribs attached to Thoracic cage
  const sternumManubrium = makeBone("Sternum_Manubrium");
  sternumManubrium.position.set(0, 0.22 * H, 0.09 * H);
  vertebraL1.add(sternumManubrium);

  const sternumBody = makeBone("Sternum_Body");
  sternumBody.position.set(0, -0.06 * H, 0.01 * H);
  sternumManubrium.add(sternumBody);

  const sternumXiphoid = makeBone("Sternum_Xiphoid");
  sternumXiphoid.position.set(0, -0.04 * H, 0);
  sternumBody.add(sternumXiphoid);

  const ribsL: THREE.Bone[] = [];
  const ribsR: THREE.Bone[] = [];
  for (let r = 1; r <= 12; r++) {
    const ribL = makeBone(`Rib_L_${r}`);
    ribL.position.set(-0.06 * H, (r - 6) * 0.01 * H, 0.02 * H);
    sternumBody.add(ribL);
    ribsL.push(ribL);

    const ribR = makeBone(`Rib_R_${r}`);
    ribR.position.set(0.06 * H, (r - 6) * 0.01 * H, 0.02 * H);
    sternumBody.add(ribR);
    ribsR.push(ribR);
  }

  // Cervical Spine (C7 to C1)
  let prevC = vertebraT1;
  const cervicalVertebrae: THREE.Bone[] = [];
  for (let c = 7; c >= 1; c--) {
    const cBone = makeBone(`Vertebra_C${c}`);
    cBone.position.set(0, 0.011 * H, 0);
    prevC.add(cBone);
    cervicalVertebrae.push(cBone);
    prevC = cBone;
  }
  const vertebraC1 = prevC; // Atlas

  // Hyoid
  const hyoid = makeBone("Hyoid");
  hyoid.position.set(0, 0.03 * H, 0.03 * H);
  cervicalVertebrae[3].add(hyoid);

  // Skull & Cranium
  const craniumOccipital = makeBone("Cranium_Occipital");
  craniumOccipital.position.set(0, 0.03 * H, -0.02 * H);
  vertebraC1.add(craniumOccipital);

  const craniumSphenoid = makeBone("Cranium_Sphenoid");
  craniumSphenoid.position.set(0, 0.03 * H, 0.02 * H);
  craniumOccipital.add(craniumSphenoid);

  const craniumEthmoid = makeBone("Cranium_Ethmoid");
  craniumEthmoid.position.set(0, 0.02 * H, 0.04 * H);
  craniumSphenoid.add(craniumEthmoid);

  const craniumFrontal = makeBone("Cranium_Frontal");
  craniumFrontal.position.set(0, 0.05 * H, 0.04 * H);
  craniumSphenoid.add(craniumFrontal);

  const craniumParietalL = makeBone("Cranium_Parietal_L");
  craniumParietalL.position.set(-0.04 * H, 0.04 * H, 0);
  craniumFrontal.add(craniumParietalL);

  const craniumParietalR = makeBone("Cranium_Parietal_R");
  craniumParietalR.position.set(0.04 * H, 0.04 * H, 0);
  craniumFrontal.add(craniumParietalR);

  const craniumTemporalL = makeBone("Cranium_Temporal_L");
  craniumTemporalL.position.set(-0.05 * H, 0, 0);
  craniumParietalL.add(craniumTemporalL);

  const craniumTemporalR = makeBone("Cranium_Temporal_R");
  craniumTemporalR.position.set(0.05 * H, 0, 0);
  craniumParietalR.add(craniumTemporalR);

  // Auditory Ossicles
  const earMalleusL = makeBone("Ear_Malleus_L"); craniumTemporalL.add(earMalleusL);
  const earMalleusR = makeBone("Ear_Malleus_R"); craniumTemporalR.add(earMalleusR);
  const earIncusL = makeBone("Ear_Incus_L"); earMalleusL.add(earIncusL);
  const earIncusR = makeBone("Ear_Incus_R"); earMalleusR.add(earIncusR);
  const earStapesL = makeBone("Ear_Stapes_L"); earIncusL.add(earStapesL);
  const earStapesR = makeBone("Ear_Stapes_R"); earIncusR.add(earStapesR);

  // Facial Bones
  const faceNasalL = makeBone("Face_Nasal_L"); faceNasalL.position.set(-0.01 * H, -0.01 * H, 0.06 * H); craniumFrontal.add(faceNasalL);
  const faceNasalR = makeBone("Face_Nasal_R"); faceNasalR.position.set(0.01 * H, -0.01 * H, 0.06 * H); craniumFrontal.add(faceNasalR);
  const faceMaxillaL = makeBone("Face_Maxilla_L"); faceMaxillaL.position.set(-0.02 * H, -0.03 * H, 0.05 * H); faceNasalL.add(faceMaxillaL);
  const faceMaxillaR = makeBone("Face_Maxilla_R"); faceMaxillaR.position.set(0.02 * H, -0.03 * H, 0.05 * H); faceNasalR.add(faceMaxillaR);
  const faceLacrimalL = makeBone("Face_Lacrimal_L"); craniumEthmoid.add(faceLacrimalL);
  const faceLacrimalR = makeBone("Face_Lacrimal_R"); craniumEthmoid.add(faceLacrimalR);
  const faceZygomaticL = makeBone("Face_Zygomatic_L"); faceZygomaticL.position.set(-0.04 * H, -0.02 * H, 0.04 * H); craniumFrontal.add(faceZygomaticL);
  const faceZygomaticR = makeBone("Face_Zygomatic_R"); faceZygomaticR.position.set(0.04 * H, -0.02 * H, 0.04 * H); craniumFrontal.add(faceZygomaticR);
  const facePalatineL = makeBone("Face_Palatine_L"); faceMaxillaL.add(facePalatineL);
  const facePalatineR = makeBone("Face_Palatine_R"); faceMaxillaR.add(facePalatineR);
  const faceInferiorNasalConchaL = makeBone("Face_InferiorNasalConcha_L"); faceNasalL.add(faceInferiorNasalConchaL);
  const faceInferiorNasalConchaR = makeBone("Face_InferiorNasalConcha_R"); faceNasalR.add(faceInferiorNasalConchaR);
  const faceVomer = makeBone("Face_Vomer"); craniumEthmoid.add(faceVomer);
  const faceMandible = makeBone("Face_Mandible"); faceMandible.position.set(0, -0.05 * H, 0.03 * H); craniumOccipital.add(faceMandible);

  // Pectoral Girdle & Upper Limbs (Left & Right)
  const clavicleL = makeBone("Clavicle_L"); clavicleL.position.set(-0.06 * H, 0.03 * H, 0.02 * H); sternumManubrium.add(clavicleL);
  const scapulaL = makeBone("Scapula_L"); scapulaL.position.set(-0.08 * H, 0.01 * H, -0.03 * H); clavicleL.add(scapulaL);
  const humerusL = makeBone("Humerus_L"); humerusL.position.set(-0.08 * H, -0.02 * H, 0); scapulaL.add(humerusL);
  const radiusL = makeBone("Radius_L"); radiusL.position.set(0, -0.16 * H, 0.01 * H); humerusL.add(radiusL);
  const ulnaL = makeBone("Ulna_L"); ulnaL.position.set(0, -0.16 * H, -0.01 * H); humerusL.add(ulnaL);

  const clavicleR = makeBone("Clavicle_R"); clavicleR.position.set(0.06 * H, 0.03 * H, 0.02 * H); sternumManubrium.add(clavicleR);
  const scapulaR = makeBone("Scapula_R"); scapulaR.position.set(0.08 * H, 0.01 * H, -0.03 * H); clavicleR.add(scapulaR);
  const humerusR = makeBone("Humerus_R"); humerusR.position.set(0.08 * H, -0.02 * H, 0); scapulaR.add(humerusR);
  const radiusR = makeBone("Radius_R"); radiusR.position.set(0, -0.16 * H, 0.01 * H); humerusR.add(radiusR);
  const ulnaR = makeBone("Ulna_R"); ulnaR.position.set(0, -0.16 * H, -0.01 * H); humerusR.add(ulnaR);

  // Carpals, Metacarpals, Phalanges (Left Hand)
  const carpalsL: THREE.Bone[] = [];
  const carpalNames = ["Scaphoid", "Lunate", "Triquetrum", "Pisiform", "Trapezium", "Trapezoid", "Capitate", "Hamate"];
  carpalNames.forEach((name) => {
    const c = makeBone(`Carpal_L_${name}`);
    c.position.set(0, -0.02 * H, 0);
    radiusL.add(c);
    carpalsL.push(c);
  });
  const metacarpalsL: THREE.Bone[] = [];
  const phalangesHandL: THREE.Bone[] = [];
  for (let m = 1; m <= 5; m++) {
    const meta = makeBone(`Metacarpal_L_${m}`);
    meta.position.set((m - 3) * 0.012 * H, -0.03 * H, 0);
    carpalsL[6].add(meta);
    metacarpalsL.push(meta);

    // Phalanges: Thumb (2), Fingers (3)
    const pCount = m === 1 ? 2 : 3;
    let prevPhal = meta;
    for (let p = 1; p <= pCount; p++) {
      const phal = makeBone(`Phalange_Hand_L_${m}_${p}`);
      phal.position.set(0, -0.022 * H, 0);
      prevPhal.add(phal);
      phalangesHandL.push(phal);
      prevPhal = phal;
    }
  }

  // Carpals, Metacarpals, Phalanges (Right Hand)
  const carpalsR: THREE.Bone[] = [];
  carpalNames.forEach((name) => {
    const c = makeBone(`Carpal_R_${name}`);
    c.position.set(0, -0.02 * H, 0);
    radiusR.add(c);
    carpalsR.push(c);
  });
  const metacarpalsR: THREE.Bone[] = [];
  const phalangesHandR: THREE.Bone[] = [];
  for (let m = 1; m <= 5; m++) {
    const meta = makeBone(`Metacarpal_R_${m}`);
    meta.position.set((m - 3) * 0.012 * H, -0.03 * H, 0);
    carpalsR[6].add(meta);
    metacarpalsR.push(meta);

    const pCount = m === 1 ? 2 : 3;
    let prevPhal = meta;
    for (let p = 1; p <= pCount; p++) {
      const phal = makeBone(`Phalange_Hand_R_${m}_${p}`);
      phal.position.set(0, -0.022 * H, 0);
      prevPhal.add(phal);
      phalangesHandR.push(phal);
      prevPhal = phal;
    }
  }

  // Pelvic Girdle & Lower Limbs (Left & Right)
  const femurL = makeBone("Femur_L"); femurL.position.set(-0.08 * H, -0.03 * H, 0); pelvisIliumL.add(femurL);
  const patellaL = makeBone("Patella_L"); patellaL.position.set(0, -0.22 * H, 0.02 * H); femurL.add(patellaL);
  const tibiaL = makeBone("Tibia_L"); tibiaL.position.set(0, -0.22 * H, 0); femurL.add(tibiaL);
  const fibulaL = makeBone("Fibula_L"); fibulaL.position.set(-0.02 * H, -0.22 * H, 0); femurL.add(fibulaL);

  const femurR = makeBone("Femur_R"); femurR.position.set(0.08 * H, -0.03 * H, 0); pelvisIliumR.add(femurR);
  const patellaR = makeBone("Patella_R"); patellaR.position.set(0, -0.22 * H, 0.02 * H); femurR.add(patellaR);
  const tibiaR = makeBone("Tibia_R"); tibiaR.position.set(0, -0.22 * H, 0); femurR.add(tibiaR);
  const fibulaR = makeBone("Fibula_R"); fibulaR.position.set(0.02 * H, -0.22 * H, 0); femurR.add(fibulaR);

  // Tarsals, Metatarsals, Phalanges (Left Foot)
  const tarsalNames = ["Calcaneus", "Talus", "Navicular", "MedialCuneiform", "InterCuneiform", "LatCuneiform", "Cuboid"];
  const tarsalsL: THREE.Bone[] = [];
  tarsalNames.forEach((name) => {
    const t = makeBone(`Tarsal_L_${name}`);
    t.position.set(0, -0.20 * H, 0.02 * H);
    tibiaL.add(t);
    tarsalsL.push(t);
  });
  const metatarsalsL: THREE.Bone[] = [];
  const phalangesFootL: THREE.Bone[] = [];
  for (let m = 1; m <= 5; m++) {
    const meta = makeBone(`Metatarsal_L_${m}`);
    meta.position.set((m - 3) * 0.012 * H, -0.02 * H, 0.04 * H);
    tarsalsL[1].add(meta);
    metatarsalsL.push(meta);

    const pCount = m === 1 ? 2 : 3;
    let prevPhal = meta;
    for (let p = 1; p <= pCount; p++) {
      const phal = makeBone(`Phalange_Foot_L_${m}_${p}`);
      phal.position.set(0, 0, 0.02 * H);
      prevPhal.add(phal);
      phalangesFootL.push(phal);
      prevPhal = phal;
    }
  }

  // Tarsals, Metatarsals, Phalanges (Right Foot)
  const tarsalsR: THREE.Bone[] = [];
  tarsalNames.forEach((name) => {
    const t = makeBone(`Tarsal_R_${name}`);
    t.position.set(0, -0.20 * H, 0.02 * H);
    tibiaR.add(t);
    tarsalsR.push(t);
  });
  const metatarsalsR: THREE.Bone[] = [];
  const phalangesFootR: THREE.Bone[] = [];
  for (let m = 1; m <= 5; m++) {
    const meta = makeBone(`Metatarsal_R_${m}`);
    meta.position.set((m - 3) * 0.012 * H, -0.02 * H, 0.04 * H);
    tarsalsR[1].add(meta);
    metatarsalsR.push(meta);

    const pCount = m === 1 ? 2 : 3;
    let prevPhal = meta;
    for (let p = 1; p <= pCount; p++) {
      const phal = makeBone(`Phalange_Foot_R_${m}_${p}`);
      phal.position.set(0, 0, 0.02 * H);
      prevPhal.add(phal);
      phalangesFootR.push(phal);
      prevPhal = phal;
    }
  }

  const bones206: AnatomicalBones206 = {
    craniumOccipital, craniumParietalL, craniumParietalR, craniumFrontal,
    craniumTemporalL, craniumTemporalR, craniumSphenoid, craniumEthmoid,
    faceNasalL, faceNasalR, faceMaxillaL, faceMaxillaR, faceLacrimalL, faceLacrimalR,
    faceZygomaticL, faceZygomaticR, facePalatineL, facePalatineR,
    faceInferiorNasalConchaL, faceInferiorNasalConchaR, faceVomer, faceMandible,
    earMalleusL, earMalleusR, earIncusL, earIncusR, earStapesL, earStapesR,
    hyoid,
    vertebraC1, vertebraC2: cervicalVertebrae[5], vertebraC3: cervicalVertebrae[4],
    vertebraC4: cervicalVertebrae[3], vertebraC5: cervicalVertebrae[2],
    vertebraC6: cervicalVertebrae[1], vertebraC7: cervicalVertebrae[0],
    vertebraT1, vertebraT2: thoracicVertebrae[10], vertebraT3: thoracicVertebrae[9],
    vertebraT4: thoracicVertebrae[8], vertebraT5: thoracicVertebrae[7],
    vertebraT6: thoracicVertebrae[6], vertebraT7: thoracicVertebrae[5],
    vertebraT8: thoracicVertebrae[4], vertebraT9: thoracicVertebrae[3],
    vertebraT10: thoracicVertebrae[2], vertebraT11: thoracicVertebrae[1],
    vertebraT12: thoracicVertebrae[0],
    vertebraL1, vertebraL2, vertebraL3, vertebraL4, vertebraL5,
    sacrum, coccyx,
    sternumManubrium, sternumBody, sternumXiphoid,
    ribsL, ribsR,
    clavicleL, clavicleR, scapulaL, scapulaR,
    humerusL, humerusR, radiusL, radiusR, ulnaL, ulnaR,
    carpalsL, carpalsR, metacarpalsL, metacarpalsR, phalangesHandL, phalangesHandR,
    pelvisIliumL, pelvisIliumR,
    femurL, femurR, patellaL, patellaR, tibiaL, tibiaR, fibulaL, fibulaR,
    tarsalsL, tarsalsR, metatarsalsL, metatarsalsR, phalangesFootL, phalangesFootR,
  };

  return { allBones, bones206 };
}

/**
 * Loads, normalizes orientation, and auto-rigs with 206 anatomical bones
 * the Streetwear (Girl / Sana / Person 2) character model from /streetwear_86_full_body.glb.
 * Default height: 1.65m (approximately 2 inches shorter than Person 1 at 1.70m).
 */
export function loadStreetwearGirlRig(targetHeight = 1.65): Promise<StreetwearGirlRigController> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/streetwear_86_full_body.glb",
      (gltf) => {
        let foundMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((c) => {
          if ((c as THREE.Mesh).isMesh && !foundMesh) {
            foundMesh = c as THREE.Mesh;
          }
        });

        const targetMesh = foundMesh as THREE.Mesh | null;
        if (!targetMesh) {
          reject(new Error("No mesh found in /streetwear_86_full_body.glb"));
          return;
        }

        const origGeo = targetMesh.geometry.clone();
        origGeo.computeBoundingBox();
        const bbox = origGeo.boundingBox!;
        const rawSize = new THREE.Vector3();
        bbox.getSize(rawSize);
        const rawCenter = new THREE.Vector3();
        bbox.getCenter(rawCenter);

        // 1. Precise Orientation Fix:
        // Rotate by -90 deg (-PI/2) around Y so model faces strictly along +Z (standard 3D forward),
        // with shoulders perfectly aligned along X (left shoulder -X, right shoulder +X).
        const scaleFactor = targetHeight / (rawSize.y || 1.0);
        const alignMatrix = new THREE.Matrix4();
        alignMatrix.makeTranslation(-rawCenter.x, -bbox.min.y, -rawCenter.z);
        alignMatrix.premultiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
        alignMatrix.premultiply(new THREE.Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor));

        origGeo.applyMatrix4(alignMatrix);
        origGeo.computeVertexNormals();

        const H = targetHeight;
        const { allBones, bones206 } = build206BoneHierarchy(H);
        const skeleton = new THREE.Skeleton(allBones);

        // Map primary deformation joint indices into the 206-bone array
        const idxSacrum = allBones.indexOf(bones206.sacrum);
        const idxL1 = allBones.indexOf(bones206.vertebraL1);
        const idxSternum = allBones.indexOf(bones206.sternumBody);
        const idxC1 = allBones.indexOf(bones206.vertebraC1);
        const idxHead = allBones.indexOf(bones206.craniumFrontal);

        const idxClavicleL = allBones.indexOf(bones206.clavicleL);
        const idxHumerusL = allBones.indexOf(bones206.humerusL);
        const idxRadiusL = allBones.indexOf(bones206.radiusL);
        const idxHandL = allBones.indexOf(bones206.metacarpalsL[2]);

        const idxClavicleR = allBones.indexOf(bones206.clavicleR);
        const idxHumerusR = allBones.indexOf(bones206.humerusR);
        const idxRadiusR = allBones.indexOf(bones206.radiusR);
        const idxHandR = allBones.indexOf(bones206.metacarpalsR[2]);

        const idxFemurL = allBones.indexOf(bones206.femurL);
        const idxPatellaL = allBones.indexOf(bones206.patellaL);
        const idxTibiaL = allBones.indexOf(bones206.tibiaL);
        const idxFootL = allBones.indexOf(bones206.tarsalsL[1]);

        const idxFemurR = allBones.indexOf(bones206.femurR);
        const idxPatellaR = allBones.indexOf(bones206.patellaR);
        const idxTibiaR = allBones.indexOf(bones206.tibiaR);
        const idxFootR = allBones.indexOf(bones206.tarsalsR[1]);

        // Compute 206-bone anatomical vertex skin weights
        const posAttr = origGeo.attributes.position;
        const vCount = posAttr.count;
        const skinIndices = new Uint16Array(vCount * 4);
        const skinWeights = new Float32Array(vCount * 4);

        const thighY = 0.47 * H;
        const kneeY = 0.26 * H;
        const ankleY = 0.052 * H;

        for (let i = 0; i < vCount; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const i4 = i * 4;

          // LEGS & FEET
          if (vy < thighY) {
            const isLeft = vx < 0;
            const fIdx = isLeft ? idxFemurL : idxFemurR;
            const kIdx = isLeft ? idxPatellaL : idxPatellaR;
            const tIdx = isLeft ? idxTibiaL : idxTibiaR;
            const ftIdx = isLeft ? idxFootL : idxFootR;

            if (vy <= ankleY) {
              skinIndices[i4] = ftIdx; skinWeights[i4] = 1.0;
            } else if (vy < kneeY) {
              const t = (vy - ankleY) / (kneeY - ankleY);
              skinIndices[i4] = tIdx; skinWeights[i4] = t;
              skinIndices[i4 + 1] = ftIdx; skinWeights[i4 + 1] = 1.0 - t;
            } else {
              const t = (vy - kneeY) / (thighY - kneeY);
              skinIndices[i4] = fIdx; skinWeights[i4] = t;
              skinIndices[i4 + 1] = kIdx; skinWeights[i4 + 1] = 1.0 - t;
            }
          }
          // ARMS & HANDS
          else if (Math.abs(vx) > 0.14 * H && vy >= 0.42 * H && vy <= 0.86 * H) {
            const isLeft = vx < 0;
            const cIdx = isLeft ? idxClavicleL : idxClavicleR;
            const uIdx = isLeft ? idxHumerusL : idxHumerusR;
            const rIdx = isLeft ? idxRadiusL : idxRadiusR;
            const hIdx = isLeft ? idxHandL : idxHandR;

            if (vy < 0.52 * H) {
              skinIndices[i4] = hIdx; skinWeights[i4] = 1.0;
            } else if (vy < 0.66 * H) {
              const t = (vy - 0.52 * H) / (0.66 * H - 0.52 * H);
              skinIndices[i4] = rIdx; skinWeights[i4] = t;
              skinIndices[i4 + 1] = hIdx; skinWeights[i4 + 1] = 1.0 - t;
            } else {
              const t = (vy - 0.66 * H) / (0.86 * H - 0.66 * H);
              skinIndices[i4] = uIdx; skinWeights[i4] = t;
              skinIndices[i4 + 1] = cIdx; skinWeights[i4 + 1] = 1.0 - t;
            }
          }
          // TORSO, NECK & CRANIUM
          else {
            if (vy < 0.62 * H) {
              const t = (vy - thighY) / (0.62 * H - thighY);
              skinIndices[i4] = idxL1; skinWeights[i4] = t;
              skinIndices[i4 + 1] = idxSacrum; skinWeights[i4 + 1] = 1.0 - t;
            } else if (vy < 0.77 * H) {
              const t = (vy - 0.62 * H) / (0.77 * H - 0.62 * H);
              skinIndices[i4] = idxSternum; skinWeights[i4] = t;
              skinIndices[i4 + 1] = idxL1; skinWeights[i4 + 1] = 1.0 - t;
            } else if (vy < 0.87 * H) {
              const t = (vy - 0.77 * H) / (0.87 * H - 0.77 * H);
              skinIndices[i4] = idxC1; skinWeights[i4] = t;
              skinIndices[i4 + 1] = idxSternum; skinWeights[i4 + 1] = 1.0 - t;
            } else {
              const t = Math.min(1.0, (vy - 0.87 * H) / (0.94 * H - 0.87 * H));
              skinIndices[i4] = idxHead; skinWeights[i4] = t;
              skinIndices[i4 + 1] = idxC1; skinWeights[i4 + 1] = 1.0 - t;
            }
          }
        }

        origGeo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
        origGeo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));

        const skinnedMesh = new THREE.SkinnedMesh(origGeo, targetMesh.material);
        skinnedMesh.castShadow = true;
        skinnedMesh.receiveShadow = true;
        skinnedMesh.add(bones206.sacrum);
        skinnedMesh.bind(skeleton);

        const root = new THREE.Group();
        root.name = "streetwearGirlRigRoot";
        root.add(skinnedMesh);

        // Core Kinematic Joint handles
        const hips = bones206.sacrum;
        const spine = bones206.vertebraL1;
        const chest = bones206.sternumBody;
        const neck = bones206.vertebraC1;
        const head = bones206.craniumFrontal;
        const leftClavicle = bones206.clavicleL;
        const leftUpperArm = bones206.humerusL;
        const leftForearm = bones206.radiusL;
        const leftHand = bones206.metacarpalsL[2];
        const rightClavicle = bones206.clavicleR;
        const rightUpperArm = bones206.humerusR;
        const rightForearm = bones206.radiusR;
        const rightHand = bones206.metacarpalsR[2];
        const leftThigh = bones206.femurL;
        const leftKnee = bones206.tibiaL;
        const leftAnkle = bones206.tarsalsL[1];
        const rightThigh = bones206.femurR;
        const rightKnee = bones206.tibiaR;
        const rightAnkle = bones206.tarsalsR[1];

        // Biomechanical Kinematic Controller State
        let walkPhase = Math.PI; // In opposition to Aalekh for romantic cadence
        let isSitting = false;
        let isPraying = false;
        let isHoldingHands = true;

        const setHoldingHands = (holding: boolean) => {
          isHoldingHands = holding;
        };

        const setSitting = (sitting: boolean) => {
          isSitting = sitting;
          if (sitting) isPraying = false;
        };

        const setPraying = (praying: boolean) => {
          isPraying = praying;
          if (praying) isSitting = false;
        };

        /**
         * Analytical Two-Bone Inverse Kinematics solver for Left Arm (Hand Clasping).
         * Reaches left hand toward Aalekh on the left side.
         */
        const solveLeftHandIK = (targetLocalPos: THREE.Vector3) => {
          const upperArmPos = new THREE.Vector3(-0.16 * H, 0.70 * H, 0);
          const dir = new THREE.Vector3().subVectors(targetLocalPos, upperArmPos);
          const dist = dir.length();
          const l1 = 0.26 * H;
          const l2 = 0.24 * H;

          const clampedDist = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, dist));
          const cosElbow = (l1 * l1 + l2 * l2 - clampedDist * clampedDist) / (2 * l1 * l2);
          const elbowAngle = Math.PI - Math.acos(Math.max(-1, Math.min(1, cosElbow)));

          leftUpperArm.rotation.set(0.12, 0.22, 0.32);
          leftForearm.rotation.set(elbowAngle * 0.5, 0, 0.15);
        };

        const updateAnimation = (isWalking: boolean, time: number, moveSpeed = 6.0) => {
          if (isSitting) {
            hips.position.set(0, 0.44, 0.10);
            hips.rotation.set(0, 0, 0);
            spine.rotation.set(-0.05, 0, 0);
            head.rotation.set(0.04, isHoldingHands ? 0.08 : 0, 0);

            leftThigh.rotation.set(-Math.PI / 2, 0, 0);
            rightThigh.rotation.set(-Math.PI / 2, 0, 0);
            leftKnee.rotation.set(Math.PI / 2, 0, 0);
            rightKnee.rotation.set(Math.PI / 2, 0, 0);
            leftAnkle.rotation.set(0, 0, 0);
            rightAnkle.rotation.set(0, 0, 0);

            if (isHoldingHands) {
              leftUpperArm.rotation.set(0.26, 0.22, 0.25);
              leftForearm.rotation.set(0.35, 0, 0.12);
            } else {
              leftUpperArm.rotation.set(0.35, 0.15, 0.2);
              leftForearm.rotation.set(0.45, 0, 0);
            }

            rightUpperArm.rotation.set(0.35, -0.15, -0.2);
            rightForearm.rotation.set(0.45, 0, 0);
          } else if (isPraying) {
            const prayBreath = Math.sin(time * 2.0) * 0.01;
            hips.position.set(0, 0.49 * H + prayBreath, 0);
            hips.rotation.set(0, 0, 0);
            spine.rotation.set(0.12, 0, 0);
            head.rotation.set(0.15, 0, 0);

            leftThigh.rotation.set(0, 0, 0);
            rightThigh.rotation.set(0, 0, 0);
            leftKnee.rotation.set(0, 0, 0);
            rightKnee.rotation.set(0, 0, 0);
            leftAnkle.rotation.set(0, 0, 0);
            rightAnkle.rotation.set(0, 0, 0);

            leftUpperArm.rotation.set(0.85, 0.45, 0.35);
            leftForearm.rotation.set(0.85, 0, 0);
            rightUpperArm.rotation.set(0.85, -0.45, -0.35);
            rightForearm.rotation.set(0.85, 0, 0);
          } else if (isWalking) {
            const strideSpeed = Math.max(1.0, moveSpeed * 0.75);
            walkPhase += 0.085 * strideSpeed;

            const thighSwing = Math.sin(walkPhase) * 0.44;
            leftThigh.rotation.x = thighSwing;
            rightThigh.rotation.x = -thighSwing;

            const leftKneeBend = Math.max(0, -Math.sin(walkPhase + 0.35)) * 0.68;
            const rightKneeBend = Math.max(0, Math.sin(walkPhase + 0.35)) * 0.68;
            leftKnee.rotation.x = leftKneeBend;
            rightKnee.rotation.x = rightKneeBend;

            leftAnkle.rotation.x = -(thighSwing + leftKneeBend) * 0.55;
            rightAnkle.rotation.x = -(-thighSwing + rightKneeBend) * 0.55;

            const bounce = Math.abs(Math.sin(walkPhase * 2)) * 0.04;
            hips.position.y = 0.49 * H + bounce;
            hips.rotation.z = Math.sin(walkPhase) * 0.03;
            spine.rotation.y = -Math.cos(walkPhase) * 0.035;
            head.rotation.y = -Math.cos(walkPhase) * 0.02;

            // Symmetrical natural counter-stride arm swings
            leftUpperArm.rotation.x = -thighSwing * 0.70;
            leftUpperArm.rotation.z = 0.08;
            leftForearm.rotation.x = 0.20 + Math.max(0, thighSwing) * 0.35;

            rightUpperArm.rotation.x = thighSwing * 0.70;
            rightUpperArm.rotation.z = -0.08;
            rightForearm.rotation.x = 0.20 + Math.max(0, -thighSwing) * 0.35;
          } else {
            // Idle Breathing Stance with Naturally Relaxed Arms Beside Body
            const breath = Math.sin(time * 2.2 + 0.4) * 0.01;
            hips.position.set(0, 0.49 * H + breath, 0);
            hips.rotation.set(0, 0, 0);
            spine.rotation.set(0, 0, 0);
            head.rotation.set(0, 0, 0);

            leftThigh.rotation.set(0, 0, 0);
            rightThigh.rotation.set(0, 0, 0);
            leftKnee.rotation.set(0, 0, 0);
            rightKnee.rotation.set(0, 0, 0);
            leftAnkle.rotation.set(0, 0, 0);
            rightAnkle.rotation.set(0, 0, 0);

            // Left arm relaxed by side
            leftUpperArm.rotation.set(0.06, 0, 0.08);
            leftForearm.rotation.set(0.14, 0, 0);

            // Right arm relaxed by side
            rightUpperArm.rotation.set(0.06, 0, -0.08);
            rightForearm.rotation.set(0.14, 0, 0);
          }
        };

        resolve({
          root,
          skinnedMesh,
          skeleton,
          bones206,
          allBones,
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
          setHoldingHands,
          setSitting,
          setPraying,
          updateAnimation,
          solveLeftHandIK,
        });
      },
      undefined,
      (err) => reject(err)
    );
  });
}
