"use client";

import React from "react";
import { CameraViewMode } from "@/components/world3d/LocalityScene";
import { VirtualJoystick } from "./VirtualJoystick";
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
  Mail,
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
}: GameOverlayUIProps) {
  const cameraPresets = [
    { id: "exploration", label: "Third Person", icon: Eye, tip: "Free Orbit Follow" },
    { id: "closeup", label: "Close-up", icon: Heart, tip: "Intimate View" },
    { id: "street", label: "Street Eye", icon: MapPin, tip: "Dattawadi Perspective" },
    { id: "birdeye", label: "Bird's-eye", icon: Compass, tip: "Locality Overview" },
  ];

  const fastTravelSpots = [
    { id: "station-a", name: "Diyas", icon: Flame, x: 0, z: 8 },
    { id: "station-b", name: "Rangoli", icon: Palette, x: 0, z: -24 },
    { id: "station-c", name: "Lantern", icon: Send, x: 30, z: 0 },
    { id: "station-letters", name: "Letters", icon: Mail, x: -16, z: 0 },
  ];

  // Active contextual station info
  const activeStationInfo = INTERACTIVE_STATIONS.find((s) => s.id === nearbyStation);

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-2.5 sm:p-5">
      {/* ======================================================== */}
      {/* TOP BAR: BRAND + MODE SWITCHER + AUDIO + SURPRISE */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-2 pointer-events-auto">
        {/* Brand / Locality Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-[#180a26]/85 backdrop-blur-md border border-amber-500/40 shadow-xl">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 leading-none">
              <span>Sana&apos;s Open World</span>
              <span className="text-[10px] text-amber-300 font-normal hidden sm:inline">
                • Dattawadi, Akurdi (Pune)
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
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

      {/* ======================================================== */}
      {/* CONTEXTUAL ACTION BUTTON (PROXIMITY BASED - ZERO "PRESS E") */}
      {/* ======================================================== */}
      {nearbyStation && isExploreMode && (
        <div className="self-center pointer-events-auto my-auto animate-bounce">
          <button
            onClick={() => onInteractStation(nearbyStation)}
            className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_40px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: "4s" }} />
            <span>{activeStationInfo?.actionButton || "✨ EXPLORE ACTIVITY"}</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* EXPLORE MODE CONTROLS: DUAL JOYSTICKS & CAMERA TOOLS */}
      {/* ======================================================== */}
      {isExploreMode && (
        <div className="flex flex-col gap-2 pointer-events-none">
          {/* CAMERA TOOLS & PRESETS (TOP OF CONTROLS) */}
          <div className="self-center flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-full bg-[#150a24]/90 backdrop-blur-md border border-amber-500/40 shadow-2xl pointer-events-auto">
            {/* Camera Presets */}
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
                <span>WASD: Move • Mouse Drag: Rotate Camera • Wheel: Zoom • Click: Interact</span>
              </div>

              {/* Fast Travel Shortcuts */}
              <div className="flex items-center gap-1 bg-[#150a24]/90 backdrop-blur-md p-1 rounded-2xl border border-amber-500/40 shadow-xl">
                <span className="text-[10px] text-amber-300 font-bold px-1.5 hidden sm:inline">
                  Fast Travel:
                </span>
                {fastTravelSpots.map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.id}
                      onClick={() => onTeleport(st.x, st.z)}
                      className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-100 text-[11px] font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                label="LOOK"
                subLabel="DRAG"
                accent="cyan"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
