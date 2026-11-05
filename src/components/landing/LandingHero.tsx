"use client";

import React, { useState, useEffect } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { Sparkles, ArrowRight, Volume2, VolumeX, Heart } from "lucide-react";
import { WelcomeLetterModal } from "./WelcomeLetterModal";

export function LandingHero() {
  const {
    setHasEntered,
    setActiveTab,
    soundEnabled,
    toggleSound,
    showWelcomeModal,
    setShowWelcomeModal,
  } = useWonderland();

  // Progressive reveal steps (1 through 6)
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 700); // stars appear
    const timer2 = setTimeout(() => setStep(3), 1600); // diyas ignite
    const timer3 = setTimeout(() => setStep(4), 2600); // lanterns float
    const timer4 = setTimeout(() => setStep(5), 3600); // Sana's name glows
    const timer5 = setTimeout(() => setStep(6), 4600); // Full heading & CTA

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    setShowWelcomeModal(true);
    setActiveTab("world");
  };

  const handleSkip = () => {
    setStep(6);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#030511] via-[#090b20] to-[#040614] px-4 select-none">
      {/* 1. Midnight Starfield */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          step >= 2 ? "opacity-100" : "opacity-30"
        }`}
      >
        {/* Dynamic background stars */}
        {Array.from({ length: 45 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100 animate-twinkle"
            style={{
              top: `${(i * 17) % 94}%`,
              left: `${(i * 23) % 98}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDelay: `${(i % 5) * 0.7}s`,
              animationDuration: `${2 + (i % 3)}s`,
              opacity: 0.3 + ((i % 5) * 0.15),
            }}
          />
        ))}

        {/* Crescent Moon */}
        <div className="absolute top-10 right-10 md:top-16 md:right-24 w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_0_35px_rgba(254,240,138,0.35)] opacity-85 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
            <path
              d="M75 10 C50 15, 30 35, 30 60 C30 85, 50 105, 75 110 C45 100, 20 75, 20 50 C20 25, 45 5, 75 10 Z"
              fill="#FEF08A"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* 4. Floating Sky Lanterns */}
      {step >= 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute animate-float-lantern"
              style={{
                left: `${10 + idx * 10}%`,
                bottom: `${(idx * 7) % 50}%`,
                animationDelay: `${idx * 0.6}s`,
                animationDuration: `${5 + (idx % 4)}s`,
                opacity: 0.75,
              }}
            >
              <div className="relative w-7 h-10 md:w-9 md:h-12 bg-gradient-to-t from-amber-500 via-orange-400 to-amber-200 rounded-t-lg rounded-b-sm shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-yellow-100 rounded-full blur-[1px] animate-pulse" />
                <div className="absolute -bottom-1 w-5 h-1 bg-amber-900 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Floating Controls: Sound & Skip */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs hover:border-amber-400 transition-all cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Music Playing 🪔</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Turn On Sound</span>
            </>
          )}
        </button>

        {step < 6 && (
          <button
            onClick={handleSkip}
            className="text-xs text-amber-300/80 hover:text-amber-100 underline underline-offset-4 cursor-pointer"
          >
            Skip Intro ➔
          </button>
        )}
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        {/* 3. Diyas Row Illuminating Progressively */}
        <div
          className={`flex items-center justify-center gap-3 sm:gap-6 mb-8 transition-all duration-1000 ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <GlowingDiya isLit={step >= 3} size="md" />
          <GlowingDiya isLit={step >= 3} size="lg" />
          <GlowingDiya isLit={step >= 3} size="xl" />
          <GlowingDiya isLit={step >= 3} size="lg" />
          <GlowingDiya isLit={step >= 3} size="md" />
        </div>

        {/* 5. Sana's Name Reveal */}
        <div
          className={`transition-all duration-1000 mb-3 ${
            step >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-medium tracking-widest uppercase shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Dedicated with endless love to Sana (Shirjana)</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
        </div>

        {/* 6. Exact Main Heading & Subtitle */}
        <div
          className={`transition-all duration-1000 ${
            step >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            <span className="block gold-shimmer-text">
              THIS DIWALI, I MADE A LITTLE WORLD
            </span>
            <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-rose-300 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              JUST FOR YOU, SANA ❤️
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-amber-100/90 font-light max-w-2xl mx-auto mb-10 tracking-wide italic">
            &ldquo;Because every little light reminds me of you.&rdquo;
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleEnter}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-extrabold text-base sm:text-lg tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:shadow-[0_0_50px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-current text-rose-900 group-hover:scale-125 transition-transform" />
              <span>ENTER YOUR LITTLE WORLD ✨</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          {/* Subtle note from Aalekh */}
          <p className="mt-6 text-xs text-amber-300/60 tracking-wider">
            Crafted with all my heart by Aalekh • Diwali 2026
          </p>
        </div>
      </div>

      {/* Decorative Bottom Diya Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amber-950/40 to-transparent pointer-events-none" />

      {/* Welcome Letter Modal */}
      <WelcomeLetterModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  );
}
