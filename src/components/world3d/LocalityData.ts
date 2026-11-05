// Geographical data for Dattawadi, Akurdi (Pune / Pimpri-Chinchwad - 411035)
// Derived from Location Reference 1 (18.6497° N, 73.7791° E - Sai Hospital)
// and Location Reference 2 (18.6498° N, 73.7789° E - Dattawadi residential corridor)

export interface RoadSegment {
  id: string;
  name: string;
  startX: number;
  startZ: number;
  endX: number;
  endZ: number;
  width: number;
}

export interface BuildingPlot {
  id: string;
  name: string;
  type: "hospital" | "temple" | "residential" | "commercial" | "sweet-shop";
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  color: string;
  accentColor: string;
  floors: number;
  hasBalcony: boolean;
  hasToran: boolean;
}

export interface StationLocation {
  id: string;
  name: string;
  type: "diya" | "rangoli" | "lantern" | "landmark";
  x: number;
  z: number;
  label: string;
  description: string;
}

// Coordinate system: X = East-West (meters), Z = North-South (meters)
// Origin (0, 0) = Central Dattawadi Chowk near Sai Hospital & Hanuman Mandir lane
export const LOCALITY_ROADS: RoadSegment[] = [
  // Dattawadi Main Road (East - West corridor)
  { id: "r-main-w", name: "Dattawadi Main Rd (West)", startX: -60, startZ: 0, endX: 0, endZ: 0, width: 8 },
  { id: "r-main-e", name: "Dattawadi Main Rd (East)", startX: 0, startZ: 0, endX: 60, endZ: 0, width: 8 },

  // Hanuman Mandir Chowk & Lane (North toward Sector 27A / Hanuman Colony)
  { id: "r-north", name: "Hanuman Mandir Lane", startX: 0, startZ: 0, endX: 0, endZ: -55, width: 6.5 },

  // Station Link Lane (South toward Akurdi railway corridor)
  { id: "r-south", name: "Akurdi Station Link Rd", startX: 0, startZ: 0, endX: 0, endZ: 50, width: 6.5 },

  // Secondary residential pocket lanes (East Dattawadi alley)
  { id: "r-alley-ne", name: "Ganga Nagar Residential Alley", startX: 25, startZ: 0, endX: 25, endZ: -35, width: 4.5 },
  { id: "r-alley-sw", name: "Kalbhor Building Alley", startX: -28, startZ: 0, endX: -28, endZ: 35, width: 4.5 },
];

export const LOCALITY_BUILDINGS: BuildingPlot[] = [
  // Landmark 1: Sai Hospital / Gangai Chambers (Corner of Main Rd & South Lane)
  {
    id: "b-sai-hospital",
    name: "Sai Hospital (Gangai Chambers)",
    type: "hospital",
    x: 10,
    z: 14,
    width: 14,
    depth: 12,
    height: 11,
    rotation: 0,
    color: "#E2E8F0", // Clean clinical sandstone
    accentColor: "#0284C7", // Cyan/Sky blue hospital trim
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },

  // Landmark 2: Hanuman Mandir Courtyard Shrine (North Lane)
  {
    id: "b-hanuman-mandir",
    name: "Hanuman Mandir & Sabha",
    type: "temple",
    x: -12,
    z: -32,
    width: 10,
    depth: 10,
    height: 8,
    rotation: 0,
    color: "#EA580C", // Saffron temple color
    accentColor: "#FDE047", // Golden temple dome/shikhara
    floors: 1,
    hasBalcony: false,
    hasToran: true,
  },

  // Sweet Shop & Bakery (Near main chowk)
  {
    id: "b-mithai",
    name: "Kasturi Sweets & Mithai",
    type: "sweet-shop",
    x: -12,
    z: 12,
    width: 9,
    depth: 9,
    height: 7,
    rotation: 0,
    color: "#BE123C", // Festive crimson
    accentColor: "#FDE68A",
    floors: 2,
    hasBalcony: true,
    hasToran: true,
  },

  // North-West Residential Buildings (Pink & Coral Indian flats)
  {
    id: "b-res-nw1",
    name: "Om Sai Niwas",
    type: "residential",
    x: -15,
    z: -12,
    width: 11,
    depth: 10,
    height: 9.5,
    rotation: 0,
    color: "#F472B6", // Indian Rose Pink
    accentColor: "#FBCFE8",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-nw2",
    name: "Datta Krupa Apartments",
    type: "residential",
    x: -32,
    z: -12,
    width: 12,
    depth: 11,
    height: 10,
    rotation: 0,
    color: "#38BDF8", // Peacock Blue
    accentColor: "#E0F2FE",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-nw3",
    name: "Ganesh Kunj",
    type: "residential",
    x: -48,
    z: -12,
    width: 11,
    depth: 10,
    height: 8.5,
    rotation: 0,
    color: "#F59E0B", // Marigold Amber
    accentColor: "#FEF3C7",
    floors: 2,
    hasBalcony: true,
    hasToran: true,
  },

  // North-East Residential Buildings (Teal, Purple, Coral)
  {
    id: "b-res-ne1",
    name: "Shivneri Villa",
    type: "residential",
    x: 12,
    z: -12,
    width: 10,
    depth: 10,
    height: 9,
    rotation: 0,
    color: "#2DD4BF", // Mint Teal
    accentColor: "#CCFBF1",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-ne2",
    name: "Sana's Dream Manor",
    type: "residential",
    x: 38,
    z: -14,
    width: 13,
    depth: 12,
    height: 11.5,
    rotation: 0,
    color: "#FB7185", // Coral Pink
    accentColor: "#FFE4E6",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-ne3",
    name: "Pradhikaran Heights",
    type: "residential",
    x: 52,
    z: -13,
    width: 12,
    depth: 11,
    height: 10.5,
    rotation: 0,
    color: "#A78BFA", // Royal Lavender
    accentColor: "#EDE9FE",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },

  // South-West Buildings (Kalbhor enclave)
  {
    id: "b-res-sw1",
    name: "Kalbhor Sadan",
    type: "residential",
    x: -30,
    z: 14,
    width: 12,
    depth: 11,
    height: 9,
    rotation: 0,
    color: "#F97316", // Terracotta
    accentColor: "#FFEDD5",
    floors: 2,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-sw2",
    name: "Vrindavan Housing",
    type: "residential",
    x: -46,
    z: 14,
    width: 12,
    depth: 10,
    height: 10,
    rotation: 0,
    color: "#34D399", // Emerald Green
    accentColor: "#D1FAE5",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },

  // South-East Buildings (Bijali Nagar Link)
  {
    id: "b-res-se1",
    name: "Anand Nilayam",
    type: "residential",
    x: 32,
    z: 14,
    width: 11,
    depth: 10,
    height: 9,
    rotation: 0,
    color: "#F43F5E", // Rose Red
    accentColor: "#FFE4E6",
    floors: 2,
    hasBalcony: true,
    hasToran: true,
  },
  {
    id: "b-res-se2",
    name: "Shanti Sadan",
    type: "residential",
    x: 48,
    z: 14,
    width: 12,
    depth: 11,
    height: 10,
    rotation: 0,
    color: "#818CF8", // Periwinkle Blue
    accentColor: "#EEF2FF",
    floors: 3,
    hasBalcony: true,
    hasToran: true,
  },
];

export const INTERACTIVE_STATIONS: StationLocation[] = [
  {
    id: "station-a",
    name: "Station A: Light the Sacred Diyas",
    type: "diya",
    x: 0,
    z: 8,
    label: "STATION A: LIGHT THE DIYAS 🪔",
    description: "Light the row of terracotta diyas along Dattawadi Main Road to spread golden festive light and reveal cherished memories.",
  },
  {
    id: "station-b",
    name: "Station B: Draw the 3D Rangoli",
    type: "rangoli",
    x: 0,
    z: -24,
    label: "STATION B: DRAW THE RANGOLI 🎨",
    description: "In the Hanuman Mandir Chowk, hold or drag to pour turmeric and vermilion powders into an intricate street mandala.",
  },
  {
    id: "station-c",
    name: "Station C: Release the Akash Kandil",
    type: "lantern",
    x: 30,
    z: 0,
    label: "STATION C: RELEASE THE LANTERN 🏮",
    description: "Type a personal wish and launch a glowing 3D star lantern into the midnight sky above Akurdi.",
  },
];
