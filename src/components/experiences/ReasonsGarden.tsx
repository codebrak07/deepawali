"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export function ReasonsGarden() {
  const { flowers, bloomedFlowers, bloomFlower } = useWonderland();
  const [selectedFlowerId, setSelectedFlowerId] = useState<number>(1);

  const handleBloom = (id: number) => {
    bloomFlower(id);
    setSelectedFlowerId(id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.65 },
      colors: ["#F43F5E", "#EC4899", "#F59E0B"],
    });
  };

  const selectedFlower = flowers.find((f) => f.id === selectedFlowerId) || flowers[0];

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Every Bloom Holds A Truth</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Reasons I Adore You 🌸
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Touch any flower bud in our enchanted garden to watch it bloom and reveal an appreciation message.
        </p>
      </div>

      {/* Flower Buds Garden Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {flowers.map((fl) => {
          const isBloomed = bloomedFlowers.includes(fl.id);
          const isSelected = selectedFlowerId === fl.id;

          return (
            <div
              key={fl.id}
              onClick={() => handleBloom(fl.id)}
              className={`p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-between ${
                isSelected
                  ? "bg-slate-900/90 border-amber-400 shadow-xl shadow-rose-500/10 scale-105"
                  : "bg-slate-950/40 border-slate-800 hover:border-amber-500/40"
              }`}
            >
              {/* Flower SVG */}
              <div className="relative w-16 h-16 flex items-center justify-center my-2">
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full transition-transform duration-500 ${
                    isBloomed ? "scale-100 rotate-0" : "scale-75 opacity-70"
                  }`}
                >
                  {/* Stem & Leaves */}
                  <path d="M50 60 Q45 80 50 95" stroke="#10B981" strokeWidth="4" fill="none" />
                  <ellipse cx="40" cy="78" rx="8" ry="4" fill="#059669" transform="rotate(-30 40 78)" />
                  <ellipse cx="60" cy="72" rx="8" ry="4" fill="#059669" transform="rotate(30 60 72)" />

                  {/* Petals */}
                  {Array.from({ length: fl.petalCount }).map((_, pIdx) => {
                    const angle = (pIdx * 360) / fl.petalCount;
                    return (
                      <ellipse
                        key={pIdx}
                        cx="50"
                        cy="36"
                        rx="9"
                        ry="18"
                        fill={fl.color}
                        opacity={isBloomed ? "0.9" : "0.5"}
                        transform={`rotate(${angle} 50 50)`}
                      />
                    );
                  })}

                  {/* Center Core */}
                  <circle cx="50" cy="50" r="10" fill="#FEF08A" />
                  <circle cx="50" cy="50" r="6" fill="#F59E0B" />
                </svg>
              </div>

              <div className="text-xs font-bold text-amber-100 mt-1">
                {fl.flowerName}
              </div>
              <span
                className={`mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isBloomed
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {isBloomed ? "Bloomed 🌸" : "Tap to Bloom"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Flower Appreciation Reveal */}
      {selectedFlower && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-purple-950/40 border-2 border-rose-500/30 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{selectedFlower.quote}</span>
          </div>
          <h4 className="text-xl font-serif font-bold text-white mb-2">
            {selectedFlower.flowerName}
          </h4>
          <p className="text-base sm:text-lg text-amber-100/90 font-medium max-w-2xl mx-auto italic">
            &ldquo;{selectedFlower.reason}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
