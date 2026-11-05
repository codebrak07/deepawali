"use client";

import React from "react";
import { useWonderland } from "@/context/WonderlandContext";
import {
  Sparkles,
  MapPin,
  Clock,
  Flame,
  Mail,
  Home,
  Rocket,
  Moon,
  Volume2,
  VolumeX,
  Lock,
  Heart,
  Settings,
} from "lucide-react";
import Link from "next/link";

export function NavigationBar() {
  const {
    activeTab,
    setActiveTab,
    soundEnabled,
    toggleSound,
    finalSurpriseUnlocked,
    setShowFinalSurprise,
    progressPercent,
  } = useWonderland();

  const tabs = [
    { id: "world", label: "Locality World", icon: MapPin },
    { id: "timeline", label: "Our Love Story", icon: Clock },
    { id: "diyas", label: "1000 Diyas", icon: Flame },
    { id: "letters", label: "Letters For You", icon: Mail },
    { id: "home", label: "Our Dream Home", icon: Home },
    { id: "activities", label: "Diwali Activities", icon: Rocket },
    { id: "nightsky", label: "Starlight Sky", icon: Moon },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050714]/80 backdrop-blur-md border-b border-amber-500/20 px-3 py-2 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div
          onClick={() => setActiveTab("world")}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-white fill-current animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xs md:text-sm font-semibold tracking-wide text-amber-100 flex items-center gap-1.5">
              <span>Sana & Aalekh</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Diwali 🪔
              </span>
            </h1>
          </div>
        </div>

        {/* Tab Navigation (Scrollable on small devices) */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-400/50 shadow-sm shadow-amber-500/20"
                    : "text-slate-300 hover:text-amber-200 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Progress, Final Surprise, Audio, Admin */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Progress towards secret final surprise */}
          <button
            onClick={() => setShowFinalSurprise(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              finalSurpriseUnlocked
                ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-300 shadow-lg shadow-rose-500/40 animate-pulse"
                : "bg-slate-900/60 text-amber-300/80 border-amber-500/30"
            }`}
            title="Secret Final Surprise Progress"
          >
            {finalSurpriseUnlocked ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span className="hidden sm:inline">Surprise Ready!</span>
                <span className="sm:hidden">🎁</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{progressPercent}%</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute music and sounds" : "Enable music and sounds"}
            className={`p-2 rounded-full border transition-all ${
              soundEnabled
                ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20"
                : "bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title={soundEnabled ? "Atmospheric sound active" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Admin link */}
          <Link
            href="/admin"
            className="p-2 rounded-full bg-slate-900/60 text-slate-400 border border-slate-700 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            title="Aalekh's Admin Dashboard"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

