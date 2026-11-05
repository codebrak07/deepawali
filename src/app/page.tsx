"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { LandingHero } from "@/components/landing/LandingHero";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { LocalityMap } from "@/components/world/LocalityMap";
import { RelationshipTimeline } from "@/components/timeline/RelationshipTimeline";
import { ThousandDiyas } from "@/components/experiences/ThousandDiyas";
import { LettersSection } from "@/components/experiences/LettersSection";
import { FutureHome } from "@/components/experiences/FutureHome";
import { BucketList } from "@/components/experiences/BucketList";
import { ReasonsGarden } from "@/components/experiences/ReasonsGarden";
import { RangoliCanvas } from "@/components/activities/RangoliCanvas";
import { LanternRelease } from "@/components/activities/LanternRelease";
import { FireworksShow } from "@/components/activities/FireworksShow";
import { TreasureHunt } from "@/components/activities/TreasureHunt";
import { HiddenGifts } from "@/components/activities/HiddenGifts";
import { DiwaliBlessings } from "@/components/activities/DiwaliBlessings";
import { ConstellationSky } from "@/components/nightsky/ConstellationSky";
import { FinalSurpriseModal } from "@/components/surprise/FinalSurpriseModal";
import {
  Palette,
  Send,
  Flame,
  Compass,
  Gift,
  BellRing,
  Heart,
  Flower2,
} from "lucide-react";

function ActivitiesHub() {
  const [currentSubTab, setCurrentSubTab] = useState<
    "rangoli" | "lantern" | "fireworks" | "treasure" | "gifts" | "blessings" | "bucket" | "garden"
  >("rangoli");

  const subTabs = [
    { id: "rangoli", label: "Rangoli Studio", icon: Palette },
    { id: "lantern", label: "Release Lantern", icon: Send },
    { id: "fireworks", label: "Fireworks For Sana", icon: Flame },
    { id: "treasure", label: "Treasure Hunt", icon: Compass },
    { id: "gifts", label: "Hidden Gifts", icon: Gift },
    { id: "blessings", label: "Diwali Blessings", icon: BellRing },
    { id: "bucket", label: "Bucket List", icon: Heart },
    { id: "garden", label: "Reasons Garden", icon: Flower2 },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-3 sm:px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Sub-navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 bg-slate-950/60 p-2 rounded-2xl border border-amber-500/30 max-w-4xl">
        {subTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentSubTab(item.id as typeof currentSubTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                  : "bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render active activity component */}
      {currentSubTab === "rangoli" && <RangoliCanvas />}
      {currentSubTab === "lantern" && <LanternRelease />}
      {currentSubTab === "fireworks" && <FireworksShow />}
      {currentSubTab === "treasure" && <TreasureHunt />}
      {currentSubTab === "gifts" && <HiddenGifts />}
      {currentSubTab === "blessings" && <DiwaliBlessings />}
      {currentSubTab === "bucket" && <BucketList />}
      {currentSubTab === "garden" && <ReasonsGarden />}
    </div>
  );
}

export default function Page() {
  const { hasEntered, activeTab } = useWonderland();

  if (!hasEntered || activeTab === "landing") {
    return <LandingHero />;
  }

  return (
    <main className="min-h-screen w-full bg-[#050714] text-[#FDF8EE] relative overflow-x-hidden">
      {/* Persistent Navigation */}
      <NavigationBar />

      {/* Primary Tab Views */}
      {activeTab === "world" && <LocalityMap />}
      {activeTab === "timeline" && <RelationshipTimeline />}
      {activeTab === "diyas" && <ThousandDiyas />}
      {activeTab === "letters" && <LettersSection />}
      {activeTab === "home" && <FutureHome />}
      {activeTab === "activities" && <ActivitiesHub />}
      {activeTab === "nightsky" && <ConstellationSky />}

      {/* Secret Final Surprise Modal */}
      <FinalSurpriseModal />
    </main>
  );
}
