"use client";

import React from "react";
import { CameraViewMode } from "@/components/world3d/LocalityScene";
import { VirtualJoystick } from "./VirtualJoystick";
import { MinimapUI } from "./MinimapUI";
import { INTERACTIVE_STATIONS } from "@/components/world3d/LocalityData";
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Compass,
  Eye,
  MapPin,
  Flame,
  Palette,
  Send,
  BookOpen,
  Gamepad2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  DoorOpen,
  Tv,
  Armchair,
  Droplets,
  Bell,
  Sun,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

interface GameOverlayUIProps {
  cameraMode: CameraViewMode;
  onCameraModeChange: (mode: CameraViewMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  nearbyStation: string | null;
  onInteractStation: (id: string) => void;
  onTeleport: (x: number, z: number) => void;
  onJoystickMove: (x: number, y: number) => void;
  onLookJoystickMove: (x: number, y: number) => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onOpenSurprise: () => void;
  isExploreMode: boolean;
  onToggleMode: () => void;
  // Live Minimap & Spatial Props
  playerPos: { x: number; z: number };
  playerHeading: number;
  waypoint: { x: number; z: number } | null;
  onSetWaypoint: (pos: { x: number; z: number } | null) => void;
  isInsideBuilding?: boolean;
  isInsideTemple?: boolean;
  isInsideHanuman?: boolean;
  // Lifestyle simulation state
  isSitting?: boolean;
  isWatchingTV?: boolean;
  tvChannelName?: string;
  onSitDown?: (anchor?: string) => void;
  onStandUp?: () => void;
  onWatchTV?: () => void;
  onStopWatchingTV?: () => void;
  onNextTVChannel?: () => void;
  onToggleLamps?: () => void;
}

export function GameOverlayUI({
  cameraMode,
  onCameraModeChange,
  soundEnabled,
  onToggleSound,
  nearbyStation,
  onInteractStation,
  onTeleport,
  onJoystickMove,
  onLookJoystickMove,
  onResetCamera,
  onZoomIn,
  onZoomOut,
  onOpenSurprise,
  isExploreMode,
  onToggleMode,
  playerPos,
  playerHeading,
  waypoint,
  onSetWaypoint,
  isInsideBuilding = false,
  isInsideTemple = false,
  isInsideHanuman = false,
  isSitting = false,
  isWatchingTV = false,
  tvChannelName = "Diwali Live",
  onSitDown,
  onStandUp,
  onWatchTV,
  onStopWatchingTV,
  onNextTVChannel,
  onToggleLamps,
}: GameOverlayUIProps) {
  const cameraPresets = [
    { id: "exploration", label: "Third Person", icon: Eye, tip: "Free Orbit Follow" },
    { id: "closeup", label: "Close-up", icon: Heart, tip: "Intimate View" },
    { id: "street", label: "Street Eye", icon: MapPin, tip: "Dattawadi Perspective" },
    { id: "birdeye", label: "Bird's-eye", icon: Compass, tip: "Locality Overview" },
  ];

  const fastTravelSpots = [
    { id: "station-shiva", name: "Shiva Temple", icon: Flame, x: 14, z: -21 },
    { id: "station-hanuman", name: "Hanuman Mandir", icon: Sun, x: -12, z: -21 },
    { id: "station-home", name: "Sana Home", icon: DoorOpen, x: -20, z: -7 },
    { id: "station-a", name: "Diyas", icon: Flame, x: 0, z: 8 },
    { id: "station-b", name: "Rangoli", icon: Palette, x: 0, z: -24 },
    { id: "station-c", name: "Lantern", icon: Send, x: 30, z: 0 },
  ];

  // Active contextual station info
  const activeStationInfo = INTERACTIVE_STATIONS.find((s) => s.id === nearbyStation);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-2.5 sm:p-5">
      {/* ======================================================== */}
      {/* TOP ROW: LIVE MINIMAP (TOP-LEFT) + BRAND & CONTROLS (TOP-RIGHT) */}
      {/* ======================================================== */}
      <div className="w-full flex items-start justify-between gap-3 pointer-events-auto">
        {/* TOP-LEFT: LIVE MINIMAP */}
        <div className="flex flex-col items-start gap-1">
          <MinimapUI
            playerPos={playerPos}
            playerHeading={playerHeading}
            waypoint={waypoint}
            onSetWaypoint={onSetWaypoint}
            isInsideBuilding={isInsideBuilding}
            isInsideTemple={isInsideTemple}
            isInsideHanuman={isInsideHanuman}
          />
        </div>

        {/* TOP-RIGHT: BRAND PILL + ACTION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {/* Brand / Locality Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#180a26]/85 backdrop-blur-md border border-amber-500/40 shadow-xl">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-current animate-pulse" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 leading-none">
                <span>
                  {isInsideTemple
                    ? "Shiva Temple Sanctum"
                    : isInsideHanuman
                    ? "Hanuman Mandir Sanctum"
                    : isInsideBuilding
                    ? "Sana's Luxury Residence"
                    : "Sana's Open World"}
                </span>
                <span className="text-[10px] text-amber-300 font-normal hidden md:inline">
                  •{" "}
                  {isInsideTemple
                    ? "Consecrated Shivling & Abhishek"
                    : isInsideHanuman
                    ? "Heroic Murti & Sacred Gada"
                    : isInsideBuilding
                    ? "Living Suite & OLED TV"
                    : "Dattawadi, Akurdi (Pune)"}
                </span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Exit to Street Button when inside any interior */}
            {(isInsideBuilding || isInsideTemple || isInsideHanuman) && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onInteractStation(
                    isInsideTemple
                      ? "station-exit-temple"
                      : isInsideHanuman
                      ? "station-exit-hanuman"
                      : "station-exit-home"
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs border border-rose-300 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                title="Exit to Dattawadi Main Road"
              >
                <DoorOpen className="w-3.5 h-3.5 text-white" />
                <span>Exit to Street</span>
              </button>
            )}

            {/* Mode Switcher: Storybook <-> Explore 3D */}
            <button
              onClick={onToggleMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isExploreMode
                  ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20"
                  : "bg-[#180a26]/85 text-amber-200 border-amber-500/40 hover:border-amber-300"
              }`}
            >
              {isExploreMode ? (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Storybook</span>
                  <span className="sm:hidden">Story</span>
                </>
              ) : (
                <>
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Explore 3D</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mute audio" : "Turn on festive sound"}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-amber-500/30 text-amber-200 border-amber-400 shadow-md shadow-amber-500/20"
                  : "bg-[#180a26]/85 text-slate-400 border-slate-700 hover:text-white"
              }`}
              title="Atmospheric Diwali Audio"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Secret Final Surprise Button */}
            <button
              onClick={onOpenSurprise}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white border border-amber-300 text-xs font-bold shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span className="hidden sm:inline">Surprise</span>
              <span className="sm:hidden">🎁</span>
            </button>

            {/* Admin console link */}
            <Link
              href="/admin"
              className="px-2.5 py-1.5 rounded-full bg-[#180a26]/85 text-slate-400 border border-slate-700 hover:text-amber-300 text-xs transition-colors"
              title="Admin Console"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPLORE MODE: DOCKED CONTEXTUAL ACTION BAR + DUAL JOYSTICKS */}
      {/* ======================================================== */}
      {isExploreMode && (
        <div className="flex flex-col gap-2.5 pointer-events-none mt-auto">
          {/* ======================================================== */}
          {/* DOCKED CONTEXTUAL ACTION BAR (AGENCY-GRADE COMPACT HUD) */}
          {/* ======================================================== */}
          <div className="self-center flex flex-wrap items-center justify-center gap-2 pointer-events-auto max-w-[95vw]">
            {/* 1. SEATED CONTROLS (WHEN SITTING) */}
            {isSitting && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#130624]/95 backdrop-blur-md border border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-fadeIn">
                <button
                  onClick={onStandUp}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span>Stand Up</span>
                </button>

                {isWatchingTV ? (
                  <>
                    <button
                      onClick={onNextTVChannel}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                      title="Next Channel"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Channel: {tvChannelName}</span>
                    </button>
                    <button
                      onClick={onStopWatchingTV}
                      className="px-2.5 py-1 rounded-full bg-rose-600/80 text-white font-semibold text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      Turn Off
                    </button>
                  </>
                ) : (
                  <button
                    onClick={onWatchTV}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Watch TV</span>
                  </button>
                )}
              </div>
            )}

            {/* 2. LIVING ROOM LIFESTYLE ACTIONS (NEAR SOFA / TV / BED) */}
            {!isSitting && isInsideBuilding && nearbyStation && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#130624]/95 backdrop-blur-md border border-amber-400/50 shadow-xl animate-fadeIn">
                {nearbyStation === "station-home-sofa" && (
                  <>
                    <button
                      onClick={() => onSitDown?.("seat-sofa-center")}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Armchair className="w-3.5 h-3.5" />
                      <span>Sit on Sofa</span>
                    </button>
                    <button
                      onClick={onWatchTV}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Watch TV</span>
                    </button>
                  </>
                )}

                {nearbyStation === "station-home-tv" && (
                  <>
                    <button
                      onClick={onWatchTV}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Watch TV</span>
                    </button>
                    <button
                      onClick={() => onSitDown?.("seat-sofa-center")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-amber-200 border border-amber-500/30 text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Armchair className="w-3.5 h-3.5" />
                      <span>Sit Down</span>
                    </button>
                  </>
                )}

                {nearbyStation === "station-home-bed" && (
                  <button
                    onClick={() => onSitDown?.("seat-bed")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Sit on Bed</span>
                  </button>
                )}

                {nearbyStation === "station-home-puja" && (
                  <button
                    onClick={() => onInteractStation("station-home-puja")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Offer Puja</span>
                  </button>
                )}

                {nearbyStation === "station-home-lamps" && (
                  <button
                    onClick={onToggleLamps}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Toggle Lamps</span>
                  </button>
                )}

                {nearbyStation === "station-exit-home" && (
                  <button
                    onClick={() => onInteractStation("station-exit-home")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Exit to Street</span>
                  </button>
                )}
              </div>
            )}

            {/* 3. SHIVA TEMPLE SACRED ACTIONS */}
            {isInsideTemple && nearbyStation && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#130624]/95 backdrop-blur-md border border-amber-400/50 shadow-xl animate-fadeIn">
                {nearbyStation === "station-temple-pray" && (
                  <>
                    <button
                      onClick={() => onInteractStation("station-temple-pray")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-950" />
                      <span>Pray / Pranam</span>
                    </button>
                    <button
                      onClick={() => onInteractStation("station-temple-flowers")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Flowers</span>
                    </button>
                    <button
                      onClick={() => onInteractStation("station-temple-bilva")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bilva Leaves</span>
                    </button>
                    <button
                      onClick={() => onInteractStation("station-temple-abhishek")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-400 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Abhishek</span>
                    </button>
                  </>
                )}

                {nearbyStation === "station-temple-flowers" && (
                  <button
                    onClick={() => onInteractStation("station-temple-flowers")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Offer Flowers 🌸</span>
                  </button>
                )}

                {nearbyStation === "station-temple-bilva" && (
                  <button
                    onClick={() => onInteractStation("station-temple-bilva")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Offer Bilva Leaves 🌿</span>
                  </button>
                )}

                {nearbyStation === "station-temple-abhishek" && (
                  <button
                    onClick={() => onInteractStation("station-temple-abhishek")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Perform Abhishek 💧</span>
                  </button>
                )}

                {nearbyStation === "station-temple-bell" && (
                  <button
                    onClick={() => onInteractStation("station-temple-bell")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Ring Temple Bell 🔔</span>
                  </button>
                )}

                {nearbyStation === "station-exit-temple" && (
                  <button
                    onClick={() => onInteractStation("station-exit-temple")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Exit Temple</span>
                  </button>
                )}
              </div>
            )}

            {/* 4. HANUMAN MANDIR SACRED ACTIONS */}
            {isInsideHanuman && nearbyStation && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#130624]/95 backdrop-blur-md border border-orange-400/50 shadow-xl animate-fadeIn">
                {nearbyStation === "station-hanuman-pray" && (
                  <>
                    <button
                      onClick={() => onInteractStation("station-hanuman-pray")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-950" />
                      <span>Pray / Pranam</span>
                    </button>
                    <button
                      onClick={() => onInteractStation("station-hanuman-flowers")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Marigolds</span>
                    </button>
                    <button
                      onClick={() => onInteractStation("station-hanuman-prasad")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prasad</span>
                    </button>
                  </>
                )}

                {nearbyStation === "station-hanuman-flowers" && (
                  <button
                    onClick={() => onInteractStation("station-hanuman-flowers")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Offer Marigold Mala 🌸</span>
                  </button>
                )}

                {nearbyStation === "station-hanuman-prasad" && (
                  <button
                    onClick={() => onInteractStation("station-hanuman-prasad")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-rose-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Offer Sacred Prasad 🍬</span>
                  </button>
                )}

                {nearbyStation === "station-hanuman-bell" && (
                  <button
                    onClick={() => onInteractStation("station-hanuman-bell")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Ring Mandir Bell 🔔</span>
                  </button>
                )}

                {nearbyStation === "station-exit-hanuman" && (
                  <button
                    onClick={() => onInteractStation("station-exit-hanuman")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Exit Temple</span>
                  </button>
                )}
              </div>
            )}

            {/* 5. OUTDOOR STREET STATIONS */}
            {!isInsideBuilding &&
              !isInsideTemple &&
              !isInsideHanuman &&
              nearbyStation &&
              activeStationInfo && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#130624]/95 backdrop-blur-md border border-amber-400/50 shadow-xl animate-fadeIn">
                  <button
                    onClick={() => onInteractStation(nearbyStation)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>{activeStationInfo.actionButton}</span>
                  </button>
                </div>
              )}
          </div>

          {/* CAMERA TOOLS & PRESETS */}
          <div className="self-center flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-full bg-[#150a24]/90 backdrop-blur-md border border-amber-500/40 shadow-2xl pointer-events-auto">
            {cameraPresets.map((cm) => {
              const Icon = cm.icon;
              const isActive = cameraMode === cm.id;
              return (
                <button
                  key={cm.id}
                  onClick={() => onCameraModeChange(cm.id as CameraViewMode)}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  title={cm.tip}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{cm.label}</span>
                </button>
              );
            })}

            {/* Camera Reset */}
            <button
              onClick={onResetCamera}
              className="p-1 sm:px-2 py-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              title="Reset Camera Orientation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Quick Zoom Buttons */}
            <div className="flex items-center gap-0.5 border-l border-slate-700 pl-1">
              <button
                onClick={onZoomIn}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onZoomOut}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* DUAL JOYSTICK ROW: LEFT (MOVE) + FAST TRAVEL (CENTER) + RIGHT (LOOK) */}
          <div className="w-full flex items-end justify-between gap-2 pointer-events-auto">
            {/* LEFT JOYSTICK: CHARACTER MOVEMENT (CAMERA-RELATIVE) */}
            <div className="flex flex-col items-start">
              <VirtualJoystick
                onMove={onJoystickMove}
                label="MOVE"
                subLabel="WASD"
                accent="amber"
              />
            </div>

            {/* CENTER: DESKTOP HINT & FAST TRAVEL BUTTONS */}
            <div className="flex flex-col items-center gap-1.5 pb-1 max-w-[260px] sm:max-w-none">
              {/* Desktop hint */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#150a24]/85 border border-slate-800 text-slate-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>WASD: Move • Mouse Drag: Orbit • Tap Minimap: GPS Waypoint</span>
              </div>

              {/* Fast Travel Shortcuts */}
              <div className="flex items-center gap-1 bg-[#150a24]/90 backdrop-blur-md p-1 rounded-2xl border border-amber-500/40 shadow-xl overflow-x-auto max-w-full">
                <span className="text-[10px] text-amber-300 font-bold px-1.5 hidden sm:inline">
                  Fast Travel:
                </span>
                {fastTravelSpots.map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => onTeleport(st.x, st.z)}
                      className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-100 text-[11px] font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Icon className="w-3 h-3 text-amber-400" />
                      <span>{st.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT JOYSTICK: CAMERA LOOK (ORBIT YAW & PITCH) */}
            <div className="flex flex-col items-end">
              <VirtualJoystick
                onMove={onLookJoystickMove}
                label="CAMERA"
                subLabel="DRAG"
                accent="rose"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
