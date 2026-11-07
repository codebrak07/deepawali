import * as THREE from "three";
import { LOCALITY_BUILDINGS, BuildingPlot } from "./LocalityData";
import {
  getJaliLatticeTexture,
  createInteractiveHaveliGate,
  InteractiveHaveliGate,
} from "./HaveliGateSystem";

export interface LocalityBuildingsResult {
  group: THREE.Group;
  interactiveGates: InteractiveHaveliGate[];
}

export function createLocalityBuildings(scene: THREE.Scene): LocalityBuildingsResult {
  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = "localityBuildingsGroup";

  const interactiveGates: InteractiveHaveliGate[] = [];

  // Authentic Shared Materials
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.5 }); // Crisp white Indian stucco mouldings
  const railingMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85, roughness: 0.25 }); // Wrought iron black railing
  const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xd97706, emissiveIntensity: 0.65 });
  const waterTankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  const potMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
  const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
  const diyaFlameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // Jali Latticework Window Material (Authentic Glowing Indian Star Fretwork)
  const jaliTex = getJaliLatticeTexture();
  const jaliWindowMat = new THREE.MeshStandardMaterial({
    map: jaliTex,
    emissiveMap: jaliTex,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.35,
    roughness: 0.35,
    metalness: 0.1,
  });

  const cyanMedicalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
  });

  // Fairy light colors for rooflines & balconies
  const fairyPalette = [0xf59e0b, 0xec4899, 0x10b981, 0x06b6d4, 0xf43f5e, 0xfef08a];
  const sharedFairyMats = fairyPalette.map((col) => new THREE.MeshBasicMaterial({ color: col }));

  // Reusable Shared Geometries
  const sharedStepGeo = new THREE.BoxGeometry(2.4, 0.18, 0.8);
  const sharedMumtyGeo = new THREE.BoxGeometry(2.8, 2.4, 3.0);
  const sharedTankGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.5, 10);
  const sharedDoorGeo = new THREE.PlaneGeometry(1.6, 2.3);
  const sharedWinGeo = new THREE.PlaneGeometry(1.25, 1.6);
  const sharedWinFrameGeo = new THREE.BoxGeometry(1.5, 1.85, 0.12);
  const sharedChhajjaGeo = new THREE.BoxGeometry(1.6, 0.14, 0.45);
  const sharedSillGeo = new THREE.BoxGeometry(1.5, 0.10, 0.28);
  const sharedBulbGeo = new THREE.SphereGeometry(0.08, 4, 4);
  const sharedPotGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.45, 6);
  const sharedFoliageGeo = new THREE.SphereGeometry(0.32, 6, 6);
  const sharedDiyaGeo = new THREE.CylinderGeometry(0.12, 0.07, 0.07, 8);
  const sharedFlameGeo = new THREE.ConeGeometry(0.05, 0.15, 6);

  LOCALITY_BUILDINGS.forEach((plot: BuildingPlot, bIdx: number) => {
    // Shiva Temple, Hanuman Temple and Sana's Home are custom rendered enterable architectural suites
    if (plot.id === "b-shiva-temple" || plot.id === "b-sana-home" || plot.id === "b-hanuman-mandir") return;

    const bldgGroup = new THREE.Group();
    bldgGroup.position.set(plot.x, 0, plot.z);
    bldgGroup.rotation.y = plot.rotation;

    const wallColor = new THREE.Color(plot.color);
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.65,
      metalness: 0.08,
    });

    const floorHeight = plot.height / plot.floors;

    // 1. Plinth / Ground Step Base
    const plinthHeight = 0.35;
    const plinthGeo = new THREE.BoxGeometry(plot.width + 0.6, plinthHeight, plot.depth + 0.6);
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = plinthHeight / 2;
    plinthMesh.receiveShadow = true;
    bldgGroup.add(plinthMesh);

    // Entrance Steps
    const stepMesh = new THREE.Mesh(sharedStepGeo, trimMat);
    stepMesh.position.set(0, 0.09, plot.depth / 2 + 0.4);
    bldgGroup.add(stepMesh);

    // 2. Main Building Body
    const bodyGeo = new THREE.BoxGeometry(plot.width, plot.height, plot.depth);
    const bodyMesh = new THREE.Mesh(bodyGeo, wallMat);
    bodyMesh.position.y = plinthHeight + plot.height / 2;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bldgGroup.add(bodyMesh);

    // 3. Bold White Horizontal Stringcourses (Floor dividing ledges matching reference)
    for (let f = 1; f < plot.floors; f++) {
      const ledgeY = plinthHeight + f * floorHeight;
      const ledgeGeo = new THREE.BoxGeometry(plot.width + 0.35, 0.22, plot.depth + 0.35);
      const ledgeMesh = new THREE.Mesh(ledgeGeo, trimMat);
      ledgeMesh.position.y = ledgeY;
      bldgGroup.add(ledgeMesh);
    }

    // 4. Detailed Rooftop Parapet & Cornice
    const corniceGeo = new THREE.BoxGeometry(plot.width + 0.5, 0.28, plot.depth + 0.5);
    const corniceMesh = new THREE.Mesh(corniceGeo, trimMat);
    corniceMesh.position.y = plinthHeight + plot.height;
    bldgGroup.add(corniceMesh);

    const parapetHeight = 0.9;
    const parapetGeo = new THREE.BoxGeometry(plot.width + 0.25, parapetHeight, plot.depth + 0.25);
    const parapetMesh = new THREE.Mesh(parapetGeo, wallMat);
    parapetMesh.position.y = plinthHeight + plot.height + parapetHeight / 2;
    bldgGroup.add(parapetMesh);

    // Rooftop Staircase Mumty Cabin
    const mumtyMesh = new THREE.Mesh(sharedMumtyGeo, wallMat);
    mumtyMesh.position.set(-plot.width / 4, plinthHeight + plot.height + 1.2, plot.depth / 4);
    bldgGroup.add(mumtyMesh);

    // Rooftop Water Storage Tank (Sintex blue cylinder)
    const tankMesh = new THREE.Mesh(sharedTankGeo, waterTankMat);
    tankMesh.position.set(plot.width / 4, plinthHeight + plot.height + 1.0, -plot.depth / 4);
    tankMesh.castShadow = true;
    bldgGroup.add(tankMesh);

    // 5. Special Temple Shikhara Dome if temple
    if (plot.type === "temple") {
      const shikharaGeo = new THREE.ConeGeometry(3.0, 5.5, 4);
      const shikharaMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const shikharaMesh = new THREE.Mesh(shikharaGeo, shikharaMat);
      shikharaMesh.position.set(0, plinthHeight + plot.height + 2.8, 0);
      shikharaMesh.rotation.y = Math.PI / 4;
      bldgGroup.add(shikharaMesh);

      const kalashGeo = new THREE.SphereGeometry(0.5, 12, 12);
      const kalashMesh = new THREE.Mesh(kalashGeo, shikharaMat);
      kalashMesh.position.set(0, plinthHeight + plot.height + 5.7, 0);
      bldgGroup.add(kalashMesh);

      const flagGeo = new THREE.ConeGeometry(0.35, 1.4, 3);
      const flagMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0, plinthHeight + plot.height + 6.6, 0);
      bldgGroup.add(flagMesh);
    }

    // 6. Glowing Latticework Jali Windows with Stone Architraves & Sill Diyas
    const windowsPerRow = Math.max(2, Math.floor(plot.width / 3.4));
    for (let f = 0; f < plot.floors; f++) {
      const floorY = plinthHeight + (f + 0.55) * floorHeight;

      for (let w = 0; w < windowsPerRow; w++) {
        // Leave room for ground floor entrance
        if (f === 0 && w === Math.floor(windowsPerRow / 2)) continue;

        const winX = ((w + 0.5) / windowsPerRow - 0.5) * (plot.width * 0.78);

        // Intricate Jali Window Pane with Radiant Golden Glow
        const winMesh = new THREE.Mesh(sharedWinGeo, jaliWindowMat);
        winMesh.position.set(winX, floorY, plot.depth / 2 + 0.05);
        bldgGroup.add(winMesh);

        // Molded White Architrave Frame
        const frameMesh = new THREE.Mesh(sharedWinFrameGeo, trimMat);
        frameMesh.position.set(winX, floorY, plot.depth / 2 + 0.03);
        bldgGroup.add(frameMesh);

        // Window Sunshade (Chhajja Ledge)
        const chhajjaMesh = new THREE.Mesh(sharedChhajjaGeo, trimMat);
        chhajjaMesh.position.set(winX, floorY + 0.95, plot.depth / 2 + 0.24);
        bldgGroup.add(chhajjaMesh);

        // Window Sill
        const sillMesh = new THREE.Mesh(sharedSillGeo, trimMat);
        sillMesh.position.set(winX, floorY - 0.90, plot.depth / 2 + 0.16);
        bldgGroup.add(sillMesh);

        // Glowing Clay Diya on Window Sill!
        const sillDiya = new THREE.Mesh(sharedDiyaGeo, diyaClayMat);
        sillDiya.position.set(winX, floorY - 0.82, plot.depth / 2 + 0.22);
        bldgGroup.add(sillDiya);

        const sillFlame = new THREE.Mesh(sharedFlameGeo, diyaFlameMat);
        sillFlame.position.set(winX, floorY - 0.72, plot.depth / 2 + 0.22);
        bldgGroup.add(sillFlame);
      }
    }

    // 7. Cantilevered Balconies with Glowing Clay Diyas Along the Railing! (Matches Reference)
    if (plot.hasBalcony && plot.floors > 1) {
      for (let f = 1; f < plot.floors; f++) {
        const balconyY = plinthHeight + f * floorHeight;
        const balcWidth = plot.width * 0.6;

        // Molded White Balcony Slab
        const slabGeo = new THREE.BoxGeometry(balcWidth, 0.25, 1.7);
        const slabMesh = new THREE.Mesh(slabGeo, trimMat);
        slabMesh.position.set(0, balconyY, plot.depth / 2 + 0.85);
        bldgGroup.add(slabMesh);

        // Front Black Wrought-Iron Railing
        const frontRailGeo = new THREE.BoxGeometry(balcWidth, 0.85, 0.06);
        const frontRail = new THREE.Mesh(frontRailGeo, railingMat);
        frontRail.position.set(0, balconyY + 0.45, plot.depth / 2 + 1.67);
        bldgGroup.add(frontRail);

        // Side Railings
        const sideRailGeo = new THREE.BoxGeometry(0.06, 0.85, 1.65);
        const leftRail = new THREE.Mesh(sideRailGeo, railingMat);
        leftRail.position.set(-balcWidth / 2, balconyY + 0.45, plot.depth / 2 + 0.85);
        bldgGroup.add(leftRail);

        const rightRail = new THREE.Mesh(sideRailGeo, railingMat);
        rightRail.position.set(balcWidth / 2, balconyY + 0.45, plot.depth / 2 + 0.85);
        bldgGroup.add(rightRail);

        // Authentic Glowing Balcony Clay Diyas along the top railing!
        const balconyDiyaCount = Math.max(4, Math.floor(balcWidth * 1.5));
        for (let bd = 0; bd < balconyDiyaCount; bd++) {
          const diyaX = ((bd + 0.5) / balconyDiyaCount - 0.5) * (balcWidth * 0.92);

          const diya = new THREE.Mesh(sharedDiyaGeo, diyaClayMat);
          diya.position.set(diyaX, balconyY + 0.92, plot.depth / 2 + 1.67);
          bldgGroup.add(diya);

          const flame = new THREE.Mesh(sharedFlameGeo, diyaFlameMat);
          flame.position.set(diyaX, balconyY + 1.02, plot.depth / 2 + 1.67);
          bldgGroup.add(flame);
        }
      }
    }

    // 8. Ground Floor Entrance: Interactive Haveli Double Gate
    if (plot.type === "residential") {
      const gate = createInteractiveHaveliGate({
        id: `gate-${plot.id}`,
        name: `${plot.name} Haveli Gate`,
        position: new THREE.Vector3(0, plinthHeight, plot.depth / 2 + 0.05),
        rotationY: 0,
        width: 2.6,
        height: 2.7,
        hasToran: true,
      });
      bldgGroup.add(gate.root);
      interactiveGates.push(gate);
    } else {
      // Commercial / Hospital Entrance Door
      const doorMesh = new THREE.Mesh(sharedDoorGeo, doorWoodMat);
      doorMesh.position.set(0, plinthHeight + 1.15, plot.depth / 2 + 0.03);
      bldgGroup.add(doorMesh);

      // Warm Doorway Glowing Sconce
      const sconceMesh = new THREE.Mesh(
        sharedBulbGeo,
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      sconceMesh.position.set(0, plinthHeight + 2.5, plot.depth / 2 + 0.2);
      sconceMesh.scale.set(1.8, 1.8, 1.8);
      bldgGroup.add(sconceMesh);

      // Entrance Diyas
      [-1.5, 1.5].forEach((dx) => {
        const diya = new THREE.Mesh(sharedDiyaGeo, diyaClayMat);
        diya.position.set(dx, 0.15, plot.depth / 2 + 0.55);
        bldgGroup.add(diya);
        const flame = new THREE.Mesh(sharedFlameGeo, diyaFlameMat);
        flame.position.set(dx, 0.25, plot.depth / 2 + 0.55);
        bldgGroup.add(flame);
      });
    }

    // Decorative Plinth Flower Planters
    [-plot.width * 0.42, plot.width * 0.42].forEach((px) => {
      const pot = new THREE.Mesh(sharedPotGeo, potMat);
      pot.position.set(px, plinthHeight + 0.22, plot.depth / 2 + 0.25);
      bldgGroup.add(pot);
      const foliage = new THREE.Mesh(sharedFoliageGeo, foliageMat);
      foliage.position.set(px, plinthHeight + 0.48, plot.depth / 2 + 0.25);
      bldgGroup.add(foliage);
    });

    // Side Jali Windows
    for (let f = 0; f < plot.floors; f++) {
      const floorY = plinthHeight + (f + 0.55) * floorHeight;

      const leftWin = new THREE.Mesh(sharedWinGeo, jaliWindowMat);
      leftWin.rotation.y = -Math.PI / 2;
      leftWin.position.set(-plot.width / 2 - 0.02, floorY, 0);
      bldgGroup.add(leftWin);

      const rightWin = new THREE.Mesh(sharedWinGeo, jaliWindowMat);
      rightWin.rotation.y = Math.PI / 2;
      rightWin.position.set(plot.width / 2 + 0.02, floorY, 0);
      bldgGroup.add(rightWin);
    }

    // Sai Hospital Cyan Medical Cross Glow
    if (plot.type === "hospital") {
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.12), cyanMedicalMat);
      crossH.position.set(0, plinthHeight + plot.height - 1.8, plot.depth / 2 + 0.2);
      bldgGroup.add(crossH);

      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.12), cyanMedicalMat);
      crossV.position.set(0, plinthHeight + plot.height - 1.8, plot.depth / 2 + 0.2);
      bldgGroup.add(crossV);
    }

    buildingsGroup.add(bldgGroup);
  });

  scene.add(buildingsGroup);
  return { group: buildingsGroup, interactiveGates };
}
