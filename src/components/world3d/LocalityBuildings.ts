import * as THREE from "three";
import { LOCALITY_BUILDINGS, BuildingPlot } from "./LocalityData";

export function createLocalityBuildings(scene: THREE.Scene): THREE.Group {
  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = "localityBuildingsGroup";

  // Reusable Materials
  const windowEmissiveMat = new THREE.MeshStandardMaterial({
    color: 0xffedd5,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });

  const doorWoodMat = new THREE.MeshStandardMaterial({
    color: 0x5a2d0c,
    roughness: 0.7,
  });

  const marigoldToranMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
  });

  const roofTrimsMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    roughness: 0.6,
  });

  const waterTankMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Sintex black/blue tank
    roughness: 0.5,
  });

  LOCALITY_BUILDINGS.forEach((plot: BuildingPlot) => {
    const bldgGroup = new THREE.Group();
    bldgGroup.position.set(plot.x, 0, plot.z);
    bldgGroup.rotation.y = plot.rotation;

    // 1. Main Facade Block
    const wallColor = new THREE.Color(plot.color);
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.75,
      metalness: 0.1,
    });

    const bodyGeo = new THREE.BoxGeometry(plot.width, plot.height, plot.depth);
    const bodyMesh = new THREE.Mesh(bodyGeo, wallMat);
    bodyMesh.position.y = plot.height / 2;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bldgGroup.add(bodyMesh);

    // 2. Rooftop Parapet
    const parapetHeight = 0.8;
    const parapetThick = 0.3;
    const parapetGeo = new THREE.BoxGeometry(plot.width + 0.2, parapetHeight, plot.depth + 0.2);
    const parapetMesh = new THREE.Mesh(parapetGeo, roofTrimsMat);
    parapetMesh.position.y = plot.height + (parapetHeight / 2) - 0.1;
    bldgGroup.add(parapetMesh);

    // 3. Rooftop Water Tank (classic Indian rooftop feature)
    const tankGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.4, 16);
    const tankMesh = new THREE.Mesh(tankGeo, waterTankMat);
    tankMesh.position.set(plot.width / 4, plot.height + 0.9, -plot.depth / 4);
    tankMesh.castShadow = true;
    bldgGroup.add(tankMesh);

    // Rooftop Staircase Mumty / Cabin
    const mumtyGeo = new THREE.BoxGeometry(2.5, 2.2, 2.8);
    const mumtyMesh = new THREE.Mesh(mumtyGeo, wallMat);
    mumtyMesh.position.set(-plot.width / 4, plot.height + 1.1, plot.depth / 4);
    bldgGroup.add(mumtyMesh);

    // 4. Temple Special Shikhara Dome if temple
    if (plot.type === "temple") {
      const shikharaGeo = new THREE.ConeGeometry(2.5, 5, 4);
      const shikharaMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      });
      const shikharaMesh = new THREE.Mesh(shikharaGeo, shikharaMat);
      shikharaMesh.position.set(0, plot.height + 2.5, 0);
      shikharaMesh.rotation.y = Math.PI / 4;
      bldgGroup.add(shikharaMesh);

      // Temple Flag (Saffron Pataka)
      const flagGeo = new THREE.ConeGeometry(0.3, 1.2, 3);
      const flagMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0, plot.height + 5.5, 0);
      bldgGroup.add(flagMesh);
    }

    // 5. Windows on Front & Sides
    const floorHeight = plot.height / plot.floors;
    const windowsPerRow = Math.max(2, Math.floor(plot.width / 3.5));

    for (let f = 0; f < plot.floors; f++) {
      const floorY = (f + 0.55) * floorHeight;

      // Front facing windows (facing Z direction toward street)
      for (let w = 0; w < windowsPerRow; w++) {
        // Leave room for door on ground floor
        if (f === 0 && w === Math.floor(windowsPerRow / 2)) continue;

        const winX = ((w + 0.5) / windowsPerRow - 0.5) * (plot.width * 0.75);

        // Window Glass (Warm glowing emissive light)
        const winGeo = new THREE.PlaneGeometry(1.2, 1.5);
        const winMesh = new THREE.Mesh(winGeo, windowEmissiveMat);
        winMesh.position.set(winX, floorY, plot.depth / 2 + 0.02);
        bldgGroup.add(winMesh);

        // Window Frame & Sunshade (Chhajja)
        const frameGeo = new THREE.BoxGeometry(1.4, 0.15, 0.4);
        const frameMesh = new THREE.Mesh(frameGeo, roofTrimsMat);
        frameMesh.position.set(winX, floorY + 0.85, plot.depth / 2 + 0.2);
        bldgGroup.add(frameMesh);
      }
    }

    // 6. Overhanging Balconies (Floors 1 & 2)
    if (plot.hasBalcony && plot.floors > 1) {
      for (let f = 1; f < plot.floors; f++) {
        const balconyY = f * floorHeight;
        const balconyWidth = plot.width * 0.55;

        // Balcony Slab
        const balcSlabGeo = new THREE.BoxGeometry(balconyWidth, 0.25, 1.6);
        const balcSlab = new THREE.Mesh(balcSlabGeo, roofTrimsMat);
        balcSlab.position.set(0, balconyY, plot.depth / 2 + 0.8);
        bldgGroup.add(balcSlab);

        // Balcony Railing (Railing frame)
        const railingGeo = new THREE.BoxGeometry(balconyWidth, 0.9, 0.08);
        const railingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const railing = new THREE.Mesh(railingGeo, railingMat);
        railing.position.set(0, balconyY + 0.5, plot.depth / 2 + 1.55);
        bldgGroup.add(railing);
      }
    }

    // 7. Ground Floor Entrance Door
    const doorGeo = new THREE.PlaneGeometry(1.6, 2.4);
    const doorMesh = new THREE.Mesh(doorGeo, doorWoodMat);
    doorMesh.position.set(0, 1.2, plot.depth / 2 + 0.03);
    bldgGroup.add(doorMesh);

    // 8. Marigold Toran Garland across the door lintel
    if (plot.hasToran) {
      const toranGeo = new THREE.BoxGeometry(1.9, 0.18, 0.12);
      const toranMesh = new THREE.Mesh(toranGeo, marigoldToranMat);
      toranMesh.position.set(0, 2.45, plot.depth / 2 + 0.08);
      bldgGroup.add(toranMesh);

      // Hanging little marigold tassels
      for (let t = -0.8; t <= 0.8; t += 0.4) {
        const tasselGeo = new THREE.ConeGeometry(0.08, 0.25, 5);
        const tasselMesh = new THREE.Mesh(tasselGeo, marigoldToranMat);
        tasselMesh.rotation.x = Math.PI;
        tasselMesh.position.set(t, 2.25, plot.depth / 2 + 0.08);
        bldgGroup.add(tasselMesh);
      }
    }

    // 9. Signboard Banner for key landmarks
    if (plot.type === "hospital" || plot.type === "sweet-shop" || plot.type === "temple") {
      const bannerGeo = new THREE.BoxGeometry(plot.width * 0.7, 0.9, 0.15);
      const bannerMat = new THREE.MeshStandardMaterial({
        color: plot.type === "hospital" ? 0x0284c7 : 0xbe123c,
        emissive: plot.type === "hospital" ? 0x0369a1 : 0x881337,
        emissiveIntensity: 0.5,
      });
      const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
      bannerMesh.position.set(0, floorHeight + 0.5, plot.depth / 2 + 0.15);
      bldgGroup.add(bannerMesh);
    }

    buildingsGroup.add(bldgGroup);
  });

  scene.add(buildingsGroup);
  return buildingsGroup;
}

