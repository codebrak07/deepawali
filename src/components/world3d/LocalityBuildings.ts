import * as THREE from "three";
import { LOCALITY_BUILDINGS, BuildingPlot } from "./LocalityData";

export function createLocalityBuildings(scene: THREE.Scene): THREE.Group {
  const buildingsGroup = new THREE.Group();
  buildingsGroup.name = "localityBuildingsGroup";

  // Palette of warm, glowing window emissions
  const windowEmissiveColors = [0xfef08a, 0xfde047, 0xf59e0b, 0xfbcfe8, 0xe0f2fe];

  // Reusable Shared Materials
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, roughness: 0.5 });
  const railingMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });
  const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
  const marigoldMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xd97706, emissiveIntensity: 0.6 });
  const waterTankMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  const streamerMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
  const potMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
  const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
  const diyaFlameMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const cyanMedicalMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
  });
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf97316,
    emissiveIntensity: 1.2,
  });

  // Reusable Window Materials for each emission color (zero per-window allocations)
  const sharedWindowMats = windowEmissiveColors.map(
    (col) =>
      new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: col,
        emissiveIntensity: 1.1,
        roughness: 0.2,
      })
  );

  // Fairy light colors for rooflines & balconies
  const fairyPalette = [0xf59e0b, 0xec4899, 0x10b981, 0x06b6d4, 0xf43f5e, 0xfef08a];
  const sharedFairyMats = fairyPalette.map((col) => new THREE.MeshBasicMaterial({ color: col }));

  // Reusable Shared Geometries (zero per-building duplicate allocations)
  const sharedStepGeo = new THREE.BoxGeometry(2.4, 0.18, 0.8);
  const sharedMumtyGeo = new THREE.BoxGeometry(2.8, 2.4, 3.0);
  const sharedTankGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.5, 10);
  const sharedDoorGeo = new THREE.PlaneGeometry(1.6, 2.3);
  const sharedWinGeo = new THREE.PlaneGeometry(1.25, 1.6);
  const sharedChhajjaGeo = new THREE.BoxGeometry(1.5, 0.12, 0.45);
  const sharedSillGeo = new THREE.BoxGeometry(1.4, 0.08, 0.25);
  const sharedTasselGeo = new THREE.ConeGeometry(0.07, 0.28, 4);
  const sharedBulbGeo = new THREE.SphereGeometry(0.09, 4, 4);
  const sharedOctaGeo = new THREE.OctahedronGeometry(0.42, 0);
  const sharedStreamerGeo = new THREE.ConeGeometry(0.08, 0.6, 4);
  const sharedPotGeo = new THREE.CylinderGeometry(0.25, 0.18, 0.45, 6);
  const sharedFoliageGeo = new THREE.SphereGeometry(0.32, 6, 6);
  const sharedDiyaGeo = new THREE.CylinderGeometry(0.2, 0.1, 0.1, 6);
  const sharedFlameGeo = new THREE.ConeGeometry(0.08, 0.22, 5);

  LOCALITY_BUILDINGS.forEach((plot: BuildingPlot, bIdx: number) => {
    // Shiva Temple and Sana's Home are custom rendered enterable architectural suites
    if (plot.id === "b-shiva-temple" || plot.id === "b-sana-home") return;

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

    // 3. Horizontal String Courses / Floor Dividing Ledges
    for (let f = 1; f < plot.floors; f++) {
      const ledgeY = plinthHeight + f * floorHeight;
      const ledgeGeo = new THREE.BoxGeometry(plot.width + 0.35, 0.18, plot.depth + 0.35);
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

      // Temple Golden Kalash finial
      const kalashGeo = new THREE.SphereGeometry(0.5, 12, 12);
      const kalashMesh = new THREE.Mesh(kalashGeo, shikharaMat);
      kalashMesh.position.set(0, plinthHeight + plot.height + 5.7, 0);
      bldgGroup.add(kalashMesh);

      // Saffron Pataka Flag
      const flagGeo = new THREE.ConeGeometry(0.35, 1.4, 3);
      const flagMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
      const flagMesh = new THREE.Mesh(flagGeo, flagMat);
      flagMesh.position.set(0, plinthHeight + plot.height + 6.6, 0);
      bldgGroup.add(flagMesh);
    }

    // 6. Warmly Glowing Windows with Chhajja Sunshades & Frames
    const windowsPerRow = Math.max(2, Math.floor(plot.width / 3.4));
    for (let f = 0; f < plot.floors; f++) {
      const floorY = plinthHeight + (f + 0.55) * floorHeight;

      for (let w = 0; w < windowsPerRow; w++) {
        // Leave room for ground floor entrance
        if (f === 0 && w === Math.floor(windowsPerRow / 2)) continue;

        const winX = ((w + 0.5) / windowsPerRow - 0.5) * (plot.width * 0.78);
        const winMat = sharedWindowMats[(bIdx + f + w) % sharedWindowMats.length];

        // Window Glass Pane
        const winMesh = new THREE.Mesh(sharedWinGeo, winMat);
        winMesh.position.set(winX, floorY, plot.depth / 2 + 0.02);
        bldgGroup.add(winMesh);

        // Window Sunshade (Chhajja ledge)
        const chhajjaMesh = new THREE.Mesh(sharedChhajjaGeo, trimMat);
        chhajjaMesh.position.set(winX, floorY + 0.9, plot.depth / 2 + 0.23);
        bldgGroup.add(chhajjaMesh);

        // Window Sill
        const sillMesh = new THREE.Mesh(sharedSillGeo, trimMat);
        sillMesh.position.set(winX, floorY - 0.85, plot.depth / 2 + 0.14);
        bldgGroup.add(sillMesh);
      }
    }

    // 7. Overhanging Balconies with Railings on Upper Floors
    if (plot.hasBalcony && plot.floors > 1) {
      for (let f = 1; f < plot.floors; f++) {
        const balconyY = plinthHeight + f * floorHeight;
        const balcWidth = plot.width * 0.6;

        // Balcony Concrete Slab
        const slabGeo = new THREE.BoxGeometry(balcWidth, 0.25, 1.7);
        const slabMesh = new THREE.Mesh(slabGeo, trimMat);
        slabMesh.position.set(0, balconyY, plot.depth / 2 + 0.85);
        bldgGroup.add(slabMesh);

        // Front Railing
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

        // String of Colorful Fairy Lights along the Balcony Railing!
        const fairyBulbCount = 8;
        for (let fb = 0; fb < fairyBulbCount; fb++) {
          const bulbX = ((fb + 0.5) / fairyBulbCount - 0.5) * (balcWidth * 0.9);
          const bulbMat = sharedFairyMats[(bIdx + fb) % sharedFairyMats.length];
          const bulbMesh = new THREE.Mesh(sharedBulbGeo, bulbMat);
          bulbMesh.position.set(bulbX, balconyY + 0.88, plot.depth / 2 + 1.7);
          bldgGroup.add(bulbMesh);
        }
      }
    }

    // 8. Ground Floor Entrance Doorway & Festive Details
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

    // Threshold Entrance Clay Diyas
    [-1.5, 1.5].forEach((dx) => {
      const diya = new THREE.Mesh(sharedDiyaGeo, diyaClayMat);
      diya.position.set(dx, 0.15, plot.depth / 2 + 0.55);
      bldgGroup.add(diya);
      const flame = new THREE.Mesh(sharedFlameGeo, diyaFlameMat);
      flame.position.set(dx, 0.25, plot.depth / 2 + 0.55);
      bldgGroup.add(flame);
    });

    // Decorative Plinth Flower Planters
    [-plot.width * 0.42, plot.width * 0.42].forEach((px) => {
      const pot = new THREE.Mesh(sharedPotGeo, potMat);
      pot.position.set(px, plinthHeight + 0.22, plot.depth / 2 + 0.25);
      bldgGroup.add(pot);
      const foliage = new THREE.Mesh(sharedFoliageGeo, foliageMat);
      foliage.position.set(px, plinthHeight + 0.48, plot.depth / 2 + 0.25);
      bldgGroup.add(foliage);
    });

    // Side Windows (finished architecture visible from courtyards & alleys)
    for (let f = 0; f < plot.floors; f++) {
      const floorY = plinthHeight + (f + 0.55) * floorHeight;
      const sideMat = sharedWindowMats[(bIdx + f + 2) % sharedWindowMats.length];

      const leftWin = new THREE.Mesh(sharedWinGeo, sideMat);
      leftWin.rotation.y = -Math.PI / 2;
      leftWin.position.set(-plot.width / 2 - 0.02, floorY, 0);
      bldgGroup.add(leftWin);

      const rightWin = new THREE.Mesh(sharedWinGeo, sideMat);
      rightWin.rotation.y = Math.PI / 2;
      rightWin.position.set(plot.width / 2 + 0.02, floorY, 0);
      bldgGroup.add(rightWin);
    }

    // Marigold Toran Garland across the doorframe
    if (plot.hasToran) {
      const toranGeo = new THREE.BoxGeometry(2.0, 0.16, 0.1);
      const toranMesh = new THREE.Mesh(toranGeo, marigoldMat);
      toranMesh.position.set(0, plinthHeight + 2.52, plot.depth / 2 + 0.08);
      bldgGroup.add(toranMesh);

      // Hanging Marigold Tassels
      for (let t = -0.8; t <= 0.8; t += 0.4) {
        const tassel = new THREE.Mesh(sharedTasselGeo, marigoldMat);
        tassel.rotation.x = Math.PI;
        tassel.position.set(t, plinthHeight + 2.34, plot.depth / 2 + 0.08);
        bldgGroup.add(tassel);
      }
    }

    // 9. Roof-Edge Fairy Lights along the entire building facade!
    const roofBulbCount = Math.floor(plot.width * 2.2);
    for (let rb = 0; rb < roofBulbCount; rb++) {
      const bulbX = ((rb + 0.5) / roofBulbCount - 0.5) * plot.width;
      const bulbMat = sharedFairyMats[(bIdx * 2 + rb) % sharedFairyMats.length];
      const bulbMesh = new THREE.Mesh(sharedBulbGeo, bulbMat);
      bulbMesh.position.set(bulbX, plinthHeight + plot.height + 0.15, plot.depth / 2 + 0.15);
      bldgGroup.add(bulbMesh);
    }

    // Cascading Golden Waterfall Lights on residential facades
    if (bIdx % 2 === 0 && plot.height > 6) {
      const curtainStrings = 4;
      for (let cs = 0; cs < curtainStrings; cs++) {
        const cx = ((cs + 0.5) / curtainStrings - 0.5) * (plot.width * 0.85);
        const dropCount = Math.floor(plot.height * 1.5);
        for (let d = 0; d < dropCount; d++) {
          const dy = plinthHeight + plot.height - d * 0.7;
          if (dy <= plinthHeight + 0.8) continue;
          const bMat = sharedFairyMats[(bIdx + cs + d) % sharedFairyMats.length];
          const bMesh = new THREE.Mesh(sharedBulbGeo, bMat);
          bMesh.position.set(cx, dy, plot.depth / 2 + 0.1);
          bldgGroup.add(bMesh);
        }
      }
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

    // 10. Hanging Akash Kandil Lantern from Upper Floor / Balcony
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(plot.width * 0.35, plinthHeight + plot.height - 1.2, plot.depth / 2 + 0.6);

    const lCore = new THREE.Mesh(sharedOctaGeo, lanternMat);
    lanternGroup.add(lCore);

    // Lantern tassels
    for (let st = -0.18; st <= 0.18; st += 0.18) {
      const s = new THREE.Mesh(sharedStreamerGeo, streamerMat);
      s.position.set(st, -0.6, 0);
      lanternGroup.add(s);
    }

    bldgGroup.add(lanternGroup);

    // 11. Signboard for Hospital, Temple, Sweet Shop
    if (plot.type === "hospital" || plot.type === "sweet-shop" || plot.type === "temple") {
      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(plot.width * 0.75, 0.85, 0.15),
        new THREE.MeshStandardMaterial({
          color: plot.type === "hospital" ? 0x0284c7 : plot.type === "temple" ? 0xea580c : 0xbe123c,
          emissive: plot.type === "hospital" ? 0x0369a1 : plot.type === "temple" ? 0xc2410c : 0x881337,
          emissiveIntensity: 0.6,
        })
      );
      signBoard.position.set(0, plinthHeight + floorHeight + 0.45, plot.depth / 2 + 0.15);
      bldgGroup.add(signBoard);
    }

    buildingsGroup.add(bldgGroup);
  });

  scene.add(buildingsGroup);
  return buildingsGroup;
}
