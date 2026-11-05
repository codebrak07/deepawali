"use client";

import React, { useState } from "react";
import { Sparkles, Home, Heart, Moon, Coffee, Flower2, Key, Check } from "lucide-react";
import { GlowingDiya } from "@/components/ui/GlowingDiya";

interface HomeArea {
  id: string;
  name: string;
  icon: typeof Home;
  color: string;
  title: string;
  dreamPromise: string;
  elements: string[];
}

export function FutureHome() {
  const [activeAreaId, setActiveAreaId] = useState<string>("entrance");

  const homeAreas: HomeArea[] = [
    {
      id: "entrance",
      name: "Decorated Entrance",
      icon: Key,
      color: "#F59E0B",
      title: "Where Every Day Begins & Ends Together",
      dreamPromise:
        "Our wooden door decorated with a fresh marigold toran every festive season, brass nameplate engraved 'Aalekh & Shirjana', and warm light spilling out to welcome us home after long days.",
      elements: ["Brass Nameplate", "Marigold Toran", "Fairy-lit Archway", "Welcome Chimes"],
    },
    {
      id: "rangoli",
      name: "Courtyard Rangoli",
      icon: Sparkles,
      color: "#EC4899",
      title: "Our Festive Colors & Laughter",
      dreamPromise:
        "Every Diwali morning, you and I sitting on the porch making colorful rangolis with rose and marigold petals, laughing as our hands get dusted with festive colors.",
      elements: ["Concentric Floral Mandala", "Surrounding Oil Diyas", "Gulal Powders", "Petal Baskets"],
    },
    {
      id: "living",
      name: "Cozy Living Room",
      icon: Home,
      color: "#D97706",
      title: "Movie Nights & Pillow Forts",
      dreamPromise:
        "A huge plush sofa with thick fluffy blankets, ambient warm lamps, fairy lights cascading behind the bookshelves, and endless cozy movie marathons with hot butter popcorn.",
      elements: ["Plush Velvet Couch", "Framed Photo Wall", "Warm Hearth Glow", "Cozy Blankets"],
    },
    {
      id: "balcony",
      name: "Balcony Under The Stars",
      icon: Moon,
      color: "#38BDF8",
      title: "Midnight Chai & Stargazing Dates",
      dreamPromise:
        "Two cushioned wicker chairs overlooking the tranquil night skyline, sipping warm ginger-cardamom chai together, watching the monsoon rain and pointing out constellations.",
      elements: ["Wicker Swing Chair", "Warm Chai Mugs", "Stargazer Telescope", "Potted Jasmine"],
    },
    {
      id: "garden",
      name: "The Little Garden",
      icon: Flower2,
      color: "#10B981",
      title: "Blooming Peace & Morning Sun",
      dreamPromise:
        "A green oasis with fragrant mogra, night-blooming jasmine, and marigolds that fill our mornings with pure tranquility. Our quiet sanctuary where life slows down.",
      elements: ["Fragrant Mogra Bushes", "Stone Garden Path", "Bird Feeder", "Herb Pots"],
    },
  ];

  const activeArea = homeAreas.find((a) => a.id === activeAreaId) || homeAreas[0];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Home className="w-3.5 h-3.5" />
          <span>Our Tomorrow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
          Our Little Future Home 🏡❤️
        </h2>
        <p className="text-sm text-amber-200/80">
          An interactive illustrated tour of the sanctuary we are going to build together, Sana.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {homeAreas.map((area) => {
          const Icon = area.icon;
          const isActive = area.id === activeAreaId;
          return (
            <button
              key={area.id}
              onClick={() => setActiveAreaId(area.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105"
                  : "bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-amber-500/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{area.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Showcase Card */}
      <div className="w-full max-w-4xl glass-diwali-card rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: activeArea.color }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Visual Illustration Representation */}
          <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center shadow-inner overflow-hidden">
            {/* Illustrated Elements based on area */}
            <div className="mb-4">
              <GlowingDiya size="xl" isLit={true} />
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>Aalekh & Shirjana&apos;s Sanctuary</span>
            </div>

            <h4 className="text-xl font-serif font-bold text-white mb-2">
              {activeArea.name}
            </h4>

            {/* Micro tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {activeArea.elements.map((elem, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-amber-500/20 text-amber-200"
                >
                  {elem}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Narrative Promise */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Future Promise & Vision
            </div>

            <h3 className="text-2xl font-serif font-bold text-amber-100">
              {activeArea.title}
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 text-slate-200 text-sm sm:text-base leading-relaxed">
              <p>{activeArea.dreamPromise}</p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/80">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>A promise written for our shared tomorrow.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
