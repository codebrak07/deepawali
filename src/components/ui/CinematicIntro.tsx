"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { soundManager } from "@/components/audio/SoundManager";

interface CinematicIntroProps {
  onEnter: () => void;
}

export function CinematicIntro({ onEnter }: CinematicIntroProps) {
  // Sequence stages: 1 (0-1.5s), 2 (1.5-3s), 3 (3-4.5s), 4 (4.5-6s), 5 (6-7s), 6 (7s+)
  const [stage, setStage] = useState<number>(1);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 1500); // central diya illuminates
    const t2 = setTimeout(() => setStage(3), 3000); // "SANA" & "A LITTLE WORLD, MADE JUST FOR YOU"
    const t3 = setTimeout(() => setStage(4), 4500); // Subtitle
    const t4 = setTimeout(() => setStage(5), 6000); // 3D neighbourhood emerges behind
    const t5 = setTimeout(() => setStage(6), 7200); // Main CTA button

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    soundManager.playDiyaChime();
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  const handleSkip = () => {
    handleEnterClick();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-4 transition-all duration-700 pointer-events-auto select-none ${
        isExiting
          ? "opacity-0 pointer-events-none scale-105"
          : stage >= 5
          ? "bg-slate-950/75 backdrop-blur-[6px]"
          : "bg-gradient-to-b from-[#180922] via-[#0d071a] to-[#060818]"
      }`}
    >
      {/* Skip button top right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="text-xs text-amber-300/80 hover:text-white font-medium underline underline-offset-4 cursor-pointer transition-colors"
        >
          Skip Intro ➔
        </button>
      </div>

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300 animate-twinkle"
            style={{
              top: `${(i * 19) % 92}%`,
              left: `${(i * 27) % 96}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              opacity: 0.35 + ((i % 4) * 0.15),
              animationDelay: `${(i % 5) * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Center Cinematic Container */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Stage 2 (1.5s+): Central Diya slowly illuminates */}
        <div
          className={`transition-all duration-1000 mb-6 ${
            stage >= 2 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {stage >= 2 && (
              <div className="absolute w-36 h-36 rounded-full bg-amber-500/25 blur-2xl animate-pulse pointer-events-none" />
            )}
            <GlowingDiya size="xl" isLit={stage >= 2} />
          </div>
        </div>

        {/* Stage 3 (3s+): "SANA" & "A LITTLE WORLD, MADE JUST FOR YOU." */}
        <div
          className={`transition-all duration-1000 mb-3 ${
            stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Diwali Special Presentation</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-rose-300 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]">
            SANA
          </h1>

          <p className="text-sm sm:text-base font-serif tracking-[0.25em] text-amber-200/90 font-medium uppercase mt-2">
            A LITTLE WORLD, MADE JUST FOR YOU.
          </p>
        </div>

        {/* Stage 4 (4.5s+): Subtitle */}
        <div
          className={`transition-all duration-1000 mb-8 max-w-lg mx-auto ${
            stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm sm:text-lg text-amber-100/90 font-light italic leading-relaxed">
            &ldquo;Some places become special because of the people we imagine sharing them with.&rdquo;
          </p>
        </div>

        {/* Stage 6 (7s+): Main CTA Button & Creator Signature */}
        <div
          className={`transition-all duration-1000 flex flex-col items-center gap-3 ${
            stage >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          <button
            onClick={handleEnterClick}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-extrabold text-base sm:text-lg tracking-wider shadow-[0_0_40px_rgba(245,158,11,0.7)] hover:shadow-[0_0_60px_rgba(245,158,11,1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-current text-rose-900 group-hover:scale-125 transition-transform" />
            <span>ENTER SANA&apos;S WORLD ✨</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-xs text-amber-300/70 tracking-wider">
            Crafted with endless love by Aalekh.
          </span>
        </div>
      </div>
    </div>
  );
}

