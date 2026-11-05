"use client";

import React, { useState, useEffect, useRef } from "react";
import { LOCALITY_POINTS } from "@/data/locations";
import { LocalityPoint } from "@/data/defaultData";
import { useWonderland } from "@/context/WonderlandContext";
import { AalekhCharacter } from "./AalekhCharacter";
import { BuildingLighting } from "./BuildingLighting";
import { LocationInteractionModal } from "./LocationInteractionModal";
import {
  Sparkles,
  MapPin,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export function LocalityMap() {
  const {
    moveToLocation,
    setCharacterPos,
    setCharacterDir,
    setIsWalking,
    visitedLocations,
  } = useWonderland();

  const [selectedLocation, setSelectedLocation] = useState<LocalityPoint | null>(null);
  const [showControlsHint, setShowControlsHint] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation (WASD or Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const stepSize = 3;
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        setCharacterDir("up");
        setIsWalking(true);
        setCharacterPos((prev) => ({ ...prev, y: Math.max(prev.y - stepSize, 12) }));
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        setCharacterDir("down");
        setIsWalking(true);
        setCharacterPos((prev) => ({ ...prev, y: Math.min(prev.y + stepSize, 88) }));
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        setCharacterDir("left");
        setIsWalking(true);
        setCharacterPos((prev) => ({ ...prev, x: Math.max(prev.x - stepSize, 8) }));
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        setCharacterDir("right");
        setIsWalking(true);
        setCharacterPos((prev) => ({ ...prev, x: Math.min(prev.x + stepSize, 92) }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(e.code)) {
        setIsWalking(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setCharacterDir, setCharacterPos, setIsWalking]);

  // Click on map to move Aalekh there
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    moveToLocation(
      Math.max(8, Math.min(clickX, 92)),
      Math.max(12, Math.min(clickY, 88)),
      "Exploring"
    );
  };

  const handleLocationClick = (e: React.MouseEvent, loc: LocalityPoint) => {
    e.stopPropagation();
    moveToLocation(loc.x, loc.y, loc.name);
    setSelectedLocation(loc);
  };

  // Mobile D-Pad Step Handler
  const handleDPadMove = (dir: "up" | "down" | "left" | "right") => {
    const stepSize = 4;
    setCharacterDir(dir);
    setIsWalking(true);

    setCharacterPos((prev) => {
      let nextX = prev.x;
      let nextY = prev.y;
      if (dir === "up") nextY = Math.max(prev.y - stepSize, 12);
      if (dir === "down") nextY = Math.min(prev.y + stepSize, 88);
      if (dir === "left") nextX = Math.max(prev.x - stepSize, 8);
      if (dir === "right") nextX = Math.min(prev.x + stepSize, 92);
      return { x: nextX, y: nextY };
    });

    setTimeout(() => setIsWalking(false), 200);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] pt-16 pb-20 px-2 sm:px-4 flex flex-col items-center">
      {/* World Header */}
      <div className="text-center max-w-xl mx-auto mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Illustrated Interactive Locality</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
          Our Special Places & Memories ❤️
        </h2>
        <p className="text-xs text-amber-200/70">
          Tap anywhere or click any landmark to walk with Aalekh. Use keyboard (WASD) or on-screen controls.
        </p>
      </div>

      {/* Main Interactive Map Container */}
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full max-w-6xl aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-pointer select-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #0d122b 0%, #060918 70%, #02040b 100%)",
        }}
      >
        {/* Decorative Grid Lines representing streets and paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F59E0B" strokeWidth="0.5" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGrid)" />

          {/* Curving illuminated festival promenade paths */}
          <path
            d="M 150,450 Q 300,320 500,350 T 850,280"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 220,200 Q 420,260 520,500 T 800,680"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.25"
          />
        </svg>

        {/* Buildings with colorful festive lighting as requested */}
        <BuildingLighting />

        {/* Animated Aalekh Character */}
        <AalekhCharacter />

        {/* Interactive Location Points */}
        {LOCALITY_POINTS.map((loc) => {
          const isVisited = visitedLocations.includes(loc.id);
          return (
            <div
              key={loc.id}
              onClick={(e) => handleLocationClick(e, loc)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-300 hover:scale-125"
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
              }}
            >
              {/* Pulsing ring indicator */}
              <div
                className="absolute -inset-2 rounded-full animate-ping opacity-60"
                style={{ backgroundColor: loc.color }}
              />

              {/* Pin Icon Bubble */}
              <div
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/80 transition-shadow"
                style={{
                  backgroundColor: loc.color,
                  boxShadow: `0 0 16px ${loc.color}`,
                }}
              >
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-current" />
                {isVisited && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">✓</span>
                  </div>
                )}
              </div>

              {/* Hover / Always visible Location Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 border border-amber-500/40 shadow-lg pointer-events-none">
                <span className="text-[10px] sm:text-xs font-semibold text-amber-100 flex items-center gap-1">
                  <span>{loc.name}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Touch D-Pad / Floating Navigator */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col items-center p-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-amber-500/40 shadow-xl md:hidden">
        <div className="text-[10px] text-amber-300 font-semibold mb-1">Walk Aalekh</div>
        <button
          onClick={() => handleDPadMove("up")}
          className="p-2 rounded-lg bg-white/10 active:bg-amber-500/40 text-amber-200"
          aria-label="Walk Up"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex gap-2 my-1">
          <button
            onClick={() => handleDPadMove("left")}
            className="p-2 rounded-lg bg-white/10 active:bg-amber-500/40 text-amber-200"
            aria-label="Walk Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDPadMove("down")}
            className="p-2 rounded-lg bg-white/10 active:bg-amber-500/40 text-amber-200"
            aria-label="Walk Down"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDPadMove("right")}
            className="p-2 rounded-lg bg-white/10 active:bg-amber-500/40 text-amber-200"
            aria-label="Walk Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Locality Quick Jump List below map */}
      <div className="w-full max-w-6xl mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Quick Visit Destinations ({visitedLocations.length}/{LOCALITY_POINTS.length} Explored)
          </span>
          {showControlsHint && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              WASD / Arrows to walk freely
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {LOCALITY_POINTS.map((loc) => {
            const isVisited = visitedLocations.includes(loc.id);
            return (
              <button
                key={loc.id}
                onClick={(e) => handleLocationClick(e, loc)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isVisited
                    ? "bg-slate-900/60 border-amber-500/40 hover:border-amber-400"
                    : "bg-slate-950/40 border-slate-800 hover:border-amber-500/30"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-100 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: loc.color }}
                  />
                  <span className="truncate">{loc.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {loc.subtext}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Interaction Modal */}
      <LocationInteractionModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
}

