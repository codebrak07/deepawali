"use client";

import React, { useState } from "react";
import {
  LOCALITY_ROADS,
  LOCALITY_BUILDINGS,
  INTERACTIVE_STATIONS,
  RoadSegment,
  BuildingPlot,
  StationLocation,
} from "@/components/world3d/LocalityData";
import {
  Compass,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

interface MinimapUIProps {
  playerPos: { x: number; z: number };
  playerHeading: number; // In radians
  waypoint: { x: number; z: number } | null;
  onSetWaypoint: (pos: { x: number; z: number } | null) => void;
  isInsideBuilding?: boolean;
  isInsideTemple?: boolean;
  isInsideHanuman?: boolean;
}

export function MinimapUI({
  playerPos,
  playerHeading,
  waypoint,
  onSetWaypoint,
  isInsideBuilding = false,
  isInsideTemple = false,
  isInsideHanuman = false,
}: MinimapUIProps) {
  // Map mode: "rotating" (player faces up) vs "north-up" (geographical north up)
  const [mapMode, setMapMode] = useState<"rotating" | "north-up">("rotating");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // World bounds for mapping (Expanded to match full open-world coverage)
  const worldMinX = -150;
  const worldMaxX = 150;
  const worldMinZ = -130;
  const worldMaxZ = 110;

  const worldWidth = worldMaxX - worldMinX; // 300m
  const worldHeight = worldMaxZ - worldMinZ; // 240m

  // Coordinate transforms (Meters -> SVG Coordinates)
  const toSvgX = (x: number) => ((x - worldMinX) / worldWidth) * 300;
  const toSvgY = (z: number) => ((z - worldMinZ) / worldHeight) * 240;

  const playerSvgX = toSvgX(playerPos.x);
  const playerSvgY = toSvgY(playerPos.z);
  const playerDegrees = (playerHeading * 180) / Math.PI;

  // Circular HUD View Radius (42 SVG units = ~42m radius around player, GTA-style centered tracking)
  const hudRadius = 42;

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    const worldX = worldMinX + normX * worldWidth;
    const worldZ = worldMinZ + normY * worldHeight;

    onSetWaypoint({
      x: Math.round(worldX * 10) / 10,
      z: Math.round(worldZ * 10) / 10,
    });
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. TOP-LEFT LIVE CIRCULAR MINIMAP HUD WIDGET */}
      {/* ======================================================== */}
      <div className="relative group pointer-events-auto">
        {/* Outer Circular Border with Golden Festive Accent */}
        <div
          onClick={() => setIsExpanded(true)}
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-[#08091a]/95 backdrop-blur-md border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.35)] overflow-hidden cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Live Locality GPS Minimap • Tap to expand"
        >
          {/* Inner SVG Rendering with Player-Centric ViewBox (Never Drifts Outside) */}
          <svg
            viewBox={`${playerSvgX - hudRadius} ${playerSvgY - hudRadius} ${hudRadius * 2} ${hudRadius * 2}`}
            className="w-full h-full"
            style={{
              transformOrigin: "center center",
              transform: mapMode === "rotating" ? `rotate(${-playerDegrees}deg)` : "none",
              transition: "transform 0.08s ease-out",
            }}
          >
            {/* Background Ground Terrain */}
            <rect x="0" y="0" width="300" height="240" fill="#070a18" />

            {/* Reconstructed Road Network */}
            {LOCALITY_ROADS.map((r: RoadSegment) => {
              const x1 = toSvgX(r.startX);
              const y1 = toSvgY(r.startZ);
              const x2 = toSvgX(r.endX);
              const y2 = toSvgY(r.endZ);
              const roadWidth = (r.width / worldWidth) * 300;
              return (
                <g key={r.id}>
                  {/* Pavement */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth={Math.max(roadWidth, 8)}
                    strokeLinecap="round"
                  />
                  {/* Sidewalk border */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#334155"
                    strokeWidth={Math.max(roadWidth, 8) + 2}
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                  {/* Yellow Center Divider */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#fde047"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.65"
                  />
                </g>
              );
            })}

            {/* Building Footprints */}
            {LOCALITY_BUILDINGS.map((b: BuildingPlot) => {
              const bx = toSvgX(b.x - b.width / 2);
              const by = toSvgY(b.z - b.depth / 2);
              const bw = (b.width / worldWidth) * 300;
              const bd = (b.depth / worldHeight) * 240;
              const isSpecial =
                b.id === "b-sai-hospital" ||
                b.id === "b-sana-home" ||
                b.id === "b-shiva-temple" ||
                b.id === "b-hanuman-mandir";

              const fillColor =
                b.id === "b-shiva-temple"
                  ? "#d97706"
                  : b.id === "b-sana-home"
                  ? "#f43f5e"
                  : b.id === "b-sai-hospital"
                  ? "#0284c7"
                  : b.id === "b-hanuman-mandir"
                  ? "#ea580c"
                  : "#1e293b";

              return (
                <g key={b.id}>
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bd}
                    fill={fillColor}
                    stroke={isSpecial ? "#f59e0b" : "#475569"}
                    strokeWidth={isSpecial ? "1.5" : "0.75"}
                    rx="1.5"
                    opacity="0.88"
                  />
                  {b.id === "b-shiva-temple" && (
                    <text
                      x={toSvgX(b.x)}
                      y={toSvgY(b.z) + 3}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      SHIVA 🕉️
                    </text>
                  )}
                  {b.id === "b-hanuman-mandir" && (
                    <text
                      x={toSvgX(b.x)}
                      y={toSvgY(b.z) + 3}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      HANUMAN 🚩
                    </text>
                  )}
                  {b.id === "b-sana-home" && (
                    <text
                      x={toSvgX(b.x)}
                      y={toSvgY(b.z) + 3}
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      SANA HOME ❤️
                    </text>
                  )}
                </g>
              );
            })}

            {/* Waypoint Route Line */}
            {waypoint && (
              <line
                x1={playerSvgX}
                y1={playerSvgY}
                x2={toSvgX(waypoint.x)}
                y2={toSvgY(waypoint.z)}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                className="animate-pulse"
              />
            )}

            {/* Interactive Station Icons */}
            {INTERACTIVE_STATIONS.map((st: StationLocation) => {
              const sx = toSvgX(st.x);
              const sy = toSvgY(st.z);
              return (
                <g key={st.id} transform={`translate(${sx}, ${sy})`}>
                  <circle r="6" fill="#f59e0b" opacity="0.4" className="animate-ping" />
                  <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                </g>
              );
            })}

            {/* Live Player Position Marker (Arrow / Heading) */}
            <g
              transform={`translate(${playerSvgX}, ${playerSvgY}) rotate(${
                mapMode === "north-up" ? playerDegrees : 0
              })`}
            >
              {/* Outer Pulse */}
              <circle r="9" fill="#38bdf8" opacity="0.35" className="animate-ping" />
              {/* Directional Heading Cone / Arrow */}
              <polygon
                points="0,-8 -5,5 0,2 5,5"
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth="1.2"
              />
              <circle r="2" fill="#ffffff" />
            </g>
          </svg>

          {/* Compass Rose / Mode Badge */}
          <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-black/60 border border-amber-500/30 text-[9px] font-bold text-amber-300">
            {mapMode === "rotating" ? "ROT" : "N"}
          </div>

          {/* Interior Badge if inside */}
          {isInsideBuilding && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-[9px] font-bold text-rose-200">
              Sana&apos;s Home
            </div>
          )}
          {isInsideTemple && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-[9px] font-bold text-amber-200">
              Shiva Sanctum 🕉️
            </div>
          )}
          {isInsideHanuman && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-orange-950/90 border border-orange-500/50 text-[9px] font-bold text-orange-200">
              Hanuman Mandir 🚩
            </div>
          )}
        </div>

        {/* Map Control Buttons Below Minimap */}
        <div className="flex items-center gap-1 mt-1 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMapMode((prev) => (prev === "rotating" ? "north-up" : "rotating"));
            }}
            className="px-2 py-0.5 rounded-md bg-[#180a26]/85 border border-amber-500/30 text-[10px] text-amber-200 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
            title="Toggle North-Up / Rotating Map Mode"
          >
            <RotateCw className="w-2.5 h-2.5" />
            <span>{mapMode === "rotating" ? "Rot" : "North"}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="p-1 rounded-md bg-[#180a26]/85 border border-amber-500/30 text-amber-200 hover:text-white cursor-pointer"
            title="Expand Full Locality Map"
          >
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. EXPANDED FULL INTERACTIVE LOCALITY MAP MODAL */}
      {/* ======================================================== */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md pointer-events-auto select-none">
          <div className="relative w-full max-w-2xl bg-[#090b1e] border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-amber-500/30 bg-[#150a24]/80">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-amber-100 leading-none">
                    Dattawadi, Akurdi Locality Map
                  </h3>
                  <p className="text-[11px] text-amber-200/70">
                    Tap anywhere on roads to place a Waypoint marker
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom buttons */}
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:text-white border border-rose-500/40 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="relative w-full h-[380px] sm:h-[460px] bg-[#070918] overflow-hidden flex items-center justify-center">
              <svg
                viewBox="0 0 300 240"
                onClick={handleMapClick}
                className="w-full h-full cursor-crosshair transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Roads */}
                {LOCALITY_ROADS.map((r: RoadSegment) => {
                  const x1 = toSvgX(r.startX);
                  const y1 = toSvgY(r.startZ);
                  const x2 = toSvgX(r.endX);
                  const y2 = toSvgY(r.endZ);
                  const roadWidth = (r.width / worldWidth) * 300;
                  return (
                    <g key={r.id}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#1e293b"
                        strokeWidth={Math.max(roadWidth, 8)}
                        strokeLinecap="round"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#fde047"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity="0.6"
                      />
                    </g>
                  );
                })}

                {/* Buildings */}
                {LOCALITY_BUILDINGS.map((b: BuildingPlot) => {
                  const bx = toSvgX(b.x - b.width / 2);
                  const by = toSvgY(b.z - b.depth / 2);
                  const bw = (b.width / worldWidth) * 300;
                  const bd = (b.depth / worldHeight) * 240;
                  const isSanaHome = b.id === "b-sana-home";
                  const isHospital = b.id === "b-sai-hospital";
                  const isHanuman = b.id === "b-hanuman-mandir";
                  const isShiva = b.id === "b-shiva-temple";
                  const isBazaar = b.id.startsWith("b-bazaar-");

                  const fillColor = isShiva
                    ? "#d97706"
                    : isSanaHome
                    ? "#f43f5e"
                    : isHospital
                    ? "#0284c7"
                    : isHanuman
                    ? "#ea580c"
                    : isBazaar
                    ? "#059669"
                    : "#1e293b";

                  const isLandmark = isSanaHome || isHospital || isHanuman || isShiva || isBazaar;

                  return (
                    <g key={b.id}>
                      <rect
                        x={bx}
                        y={by}
                        width={bw}
                        height={bd}
                        fill={fillColor}
                        stroke={isLandmark ? "#f59e0b" : "#475569"}
                        strokeWidth={isLandmark ? "1.5" : "0.75"}
                        rx="1.5"
                      />
                      {/* Building Name Labels for Landmarks */}
                      {isLandmark && (
                        <text
                          x={bx + bw / 2}
                          y={by + bd / 2 + 2.5}
                          fontSize="4.2"
                          fontWeight="bold"
                          fill="#ffffff"
                          textAnchor="middle"
                        >
                          {isShiva
                            ? "Shiva Temple"
                            : isHanuman
                            ? "Hanuman Mandir"
                            : isSanaHome
                            ? "Sana's Home"
                            : isHospital
                            ? "Sai Hospital"
                            : b.name}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Waypoint Route Line */}
                {waypoint && (
                  <line
                    x1={playerSvgX}
                    y1={playerSvgY}
                    x2={toSvgX(waypoint.x)}
                    y2={toSvgY(waypoint.z)}
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    className="animate-pulse"
                  />
                )}

                {/* Interactive Station Icons */}
                {INTERACTIVE_STATIONS.map((st: StationLocation) => {
                  const sx = toSvgX(st.x);
                  const sy = toSvgY(st.z);
                  return (
                    <g key={st.id} transform={`translate(${sx}, ${sy})`}>
                      <circle r="7" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                      <circle r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                      <text
                        x="0"
                        y="10"
                        fontSize="5"
                        fontWeight="bold"
                        fill="#fde68a"
                        textAnchor="middle"
                      >
                        {st.name.split(":")[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Waypoint Marker Pin */}
                {waypoint && (
                  <g transform={`translate(${toSvgX(waypoint.x)}, ${toSvgY(waypoint.z)})`}>
                    <circle r="8" fill="#f59e0b" opacity="0.4" className="animate-ping" />
                    <polygon points="0,-12 -6,-2 0,-5 6,-2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                    <circle r="3" fill="#ffffff" />
                  </g>
                )}

                {/* Live Player Marker */}
                <g transform={`translate(${playerSvgX}, ${playerSvgY}) rotate(${playerDegrees})`}>
                  <circle r="10" fill="#38bdf8" opacity="0.4" className="animate-ping" />
                  <polygon points="0,-9 -6,6 0,2 6,6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                  <circle r="2.5" fill="#ffffff" />
                </g>
              </svg>
            </div>

            {/* Quick Landmark Target Buttons */}
            <div className="px-3 py-2 bg-[#0d0718] border-t border-amber-500/20 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-amber-200/60 mr-1 font-serif">Quick GPS:</span>
              <button
                onClick={() => onSetWaypoint({ x: 14, z: -18 })}
                className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 cursor-pointer"
              >
                🕉️ Shiva Temple
              </button>
              <button
                onClick={() => onSetWaypoint({ x: -12, z: -18 })}
                className="px-2 py-0.5 rounded bg-orange-500/15 hover:bg-orange-500/30 text-orange-200 border border-orange-500/40 cursor-pointer"
              >
                🚩 Hanuman Mandir
              </button>
              <button
                onClick={() => onSetWaypoint({ x: -20, z: 2 })}
                className="px-2 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 cursor-pointer"
              >
                ❤️ Sana Residence
              </button>
              <button
                onClick={() => onSetWaypoint({ x: 0, z: 65 })}
                className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 cursor-pointer"
              >
                🏪 Dattawadi Bazaar
              </button>
            </div>

            {/* Modal Footer with Waypoint Controls & Legend */}
            <div className="p-3 sm:p-4 border-t border-amber-500/30 bg-[#150a24]/90 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" /> You (Aalekh)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /> Sana&apos;s Home
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Stations
                </span>
              </div>

              {waypoint && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-medium">
                    Waypoint: ({waypoint.x}, {waypoint.z})
                  </span>
                  <button
                    onClick={() => onSetWaypoint(null)}
                    className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 hover:text-white border border-rose-500/40 cursor-pointer"
                  >
                    Clear Pin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
