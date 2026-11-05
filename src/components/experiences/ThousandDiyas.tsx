"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { INITIAL_DIYAS_MESSAGES } from "@/data/defaultData";
import { Sparkles, Flame, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export function ThousandDiyas() {
  const { litDiyas, lightDiya, lightAllDiyasDemo } = useWonderland();
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const totalDiyas = 15;

  const handleDiyaClick = (idx: number) => {
    lightDiya(idx);
    const msg = INITIAL_DIYAS_MESSAGES[idx % INITIAL_DIYAS_MESSAGES.length];
    setActiveMessage(msg);

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.7 },
      colors: ["#F59E0B", "#FDE68A", "#F97316"],
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>A Sacred Sea of Lights</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
          A Thousand Diyas for You 🪔
        </h2>
        <p className="text-sm text-amber-200/80">
          Touch every diya to illuminate its flame and reveal an authentic reason why Aalekh adores you.
        </p>

        {/* Counter & Action */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
            {litDiyas.length} of {totalDiyas} Diyas Glowing Radiant
          </div>
          <button
            onClick={lightAllDiyasDemo}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Light All Diyas at Once ✨
          </button>
        </div>
      </div>

      {/* Message Reveal Banner */}
      {activeMessage && (
        <div className="w-full max-w-xl mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-amber-950/60 border-2 border-amber-400/50 shadow-xl shadow-amber-500/10 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Appreciation For Sana</span>
          </div>
          <p className="text-base sm:text-lg font-serif text-white font-medium italic">
            &ldquo;{activeMessage}&rdquo;
          </p>
        </div>
      )}

      {/* Grid of 15 Glowing Diyas */}
      <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-6 sm:gap-8 justify-items-center p-6 sm:p-10 rounded-3xl bg-slate-950/60 border border-amber-500/30 backdrop-blur-md shadow-2xl">
        {Array.from({ length: totalDiyas }).map((_, idx) => {
          const isLit = litDiyas.includes(idx);
          return (
            <div
              key={idx}
              className="flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:bg-white/5 cursor-pointer"
              onClick={() => handleDiyaClick(idx)}
            >
              <GlowingDiya isLit={isLit} size="lg" />
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[11px] font-semibold text-amber-200">
                  Diya #{idx + 1}
                </span>
                {isLit && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

