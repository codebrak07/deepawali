"use client";

import React from "react";
import { CameraViewMode } from "@/components/world3d/LocalityScene";
import { VirtualJoystick } from "./VirtualJoystick";
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
  onOpenSurprise,
  isExploreMode,
  onToggleMode,
}: GameOverlayUIProps) {
  const cameraPresets = [
    { id: "exploration", label: "Follow 3rd Person", icon: Eye, tip: "Smooth behind Aalekh" },
    { id: "closeup", label: "Character Close-up", icon: Heart, tip: "Eye-level intimate" },
    { id: "street", label: "Street Perspective", icon: MapPin, tip: "Dattawadi Main Road" },
    { id: "birdeye", label: "Locality Bird's-eye", icon: Compass, tip: "Overview from above" },
  ];

  const stations = [
    { id: "station-a", key: "A", name: "Light Diyas", icon: Flame, x: 0, z: 8, badge: "Station A" },
    { id: "station-b", key: "B", name: "Create Rangoli", icon: Palette, x: 0, z: -24, badge: "Station B" },
    { id: "station-c", key: "C", name: "Release Lantern", icon: Send, x: 30, z: 0, badge: "Station C" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-30 flex flex-col justify-between p-3 sm:p-5">
      {/* ======================================================== */}
      {/* TOP BAR: BRAND + MODE SWITCHER + AUDIO + SURPRISE */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-2 pointer-events-auto">
        {/* Brand / Locality Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#180a26]/85 backdrop-blur-md border border-amber-500/40 shadow-xl">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5 leading-none">
              <span>Sana&apos;s World</span>
              <span className="text-[10px] text-amber-300 font-normal hidden sm:inline">
                • Dattawadi, Akurdi (Pune)
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher: Story Mode <-> Explore Mode */}
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
                <span className="hidden sm:inline">View Storybook</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white border border-amber-300 text-xs font-bold shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span className="hidden sm:inline">Surprise</span>
            <span className="sm:hidden">🎁</span>
          </button>

          {/* Admin link */}
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
      {/* PROXIMITY INTERACTION BANNER (CENTER) */}
      {/* ======================================================== */}
      {nearbyStation && isExploreMode && (
        <div className="self-center pointer-events-auto animate-bounce my-auto">
          <button
            onClick={() => onInteractStation(nearbyStation)}
            className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-[0_0_40px_rgba(245,158,11,0.95)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-white cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: "5s" }} />
            <span>
              {nearbyStation === "station-a" && "INTERACT: LIGHT THE DIYAS 🪔"}
              {nearbyStation === "station-b" && "INTERACT: DRAW THE RANGOLI 🎨"}
              {nearbyStation === "station-c" && "INTERACT: RELEASE THE LANTERN 🏮"}
            </span>
            <span className="hidden sm:inline text-xs bg-slate-950 text-amber-200 px-2 py-0.5 rounded-md font-mono">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* BOTTOM FLOATING CONTROLS (Only visible in Explore Mode) */}
      {/* ======================================================== */}
      {isExploreMode && (
        <div className="flex flex-col gap-2.5 pointer-events-auto">
          {/* CAMERA VIEW SELECTOR (COMPACT SEGMENTED PILL) */}
          <div className="self-center flex items-center gap-1 p-1 rounded-full bg-[#150a24]/90 backdrop-blur-md border border-amber-500/40 shadow-2xl">
            {cameraPresets.map((cm) => {
              const Icon = cm.icon;
              const isActive = cameraMode === cm.id;
              return (
                <button
                  key={cm.id}
                  onClick={() => onCameraModeChange(cm.id as CameraViewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-105"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                  title={cm.tip}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{cm.label}</span>
                </button>
              );
            })}
          </div>

          {/* BOTTOM ROW: JOYSTICK (MOBILE) + FAST TRAVEL STATIONS */}
          <div className="flex items-end justify-between gap-3">
            {/* Mobile Touch Joystick */}
            <div className="block md:hidden">
              <VirtualJoystick onMove={onJoystickMove} />
            </div>

            {/* Desktop Navigation Helper Hint */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#150a24]/85 border border-slate-800 text-slate-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>WASD / Arrow Keys to walk • Click street to navigate • [E] to interact</span>
            </div>

            {/* Fast Travel Stations (A, B, C) */}
            <div className="flex items-center gap-1.5 bg-[#150a24]/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-500/40 shadow-xl">
              <span className="text-[10px] text-amber-300 font-bold px-2 hidden sm:inline">
                Fast Travel:
              </span>
              {stations.map((st) => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.id}
                    onClick={() => onTeleport(st.x, st.z)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-100 text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-amber-300 sm:hidden">{st.key}</span>
                    <span className="hidden sm:inline">{st.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
