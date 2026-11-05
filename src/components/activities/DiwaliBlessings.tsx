"use client";

import React, { useState } from "react";
import { Sparkles, Heart, BellRing } from "lucide-react";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { soundManager } from "@/components/audio/SoundManager";
import confetti from "canvas-confetti";

export function DiwaliBlessings() {
  const [activeBlessingIdx, setActiveBlessingIdx] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const blessings = [
    {
      title: "Blessing of Radiant Health & Longevity",
      sanskrit: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
      translation: "May you always be blessed with blooming health, boundless energy, and deep peaceful nights, my Jaanuu.",
      icon: "🌿",
    },
    {
      title: "Blessing of Unshakable Joy & Laughter",
      sanskrit: "आनन्दो ब्रह्म",
      translation: "May that beautiful smile of yours never dim, and may every morning greet you with a reason to giggle.",
      icon: "✨",
    },
    {
      title: "Blessing of Prosperity & Fulfilled Dreams",
      sanskrit: "शुभं करोति कल्याणमारोग्यं धनसंपदा",
      translation: "May the universe clear every obstacle from your path and bless all your academic, personal, and life goals.",
      icon: "🌟",
    },
    {
      title: "Blessing of Everlasting Romance & Harmony",
      sanskrit: "यदेतद्धृदयं तव तदस्तु हृदयं मम",
      translation: "May Aalekh and Shirjana’s hearts beat in eternal harmony, celebrating countless happy Diwalis together.",
      icon: "❤️",
    },
  ];

  const handleRotateThali = () => {
    setIsRotating(true);
    soundManager.playDiyaChime();

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#FDE68A", "#FEF08A"],
    });

    setTimeout(() => {
      setActiveBlessingIdx((prev) => (prev + 1) % blessings.length);
      setIsRotating(false);
    }, 600);
  };

  const currentBlessing = blessings[activeBlessingIdx];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <BellRing className="w-3.5 h-3.5" />
          <span>Sacred Festive Blessings</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Diwali Aarti & Sacred Blessings 🪔🙏
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Rotate the sacred brass Aarti thali to reveal ancient Vedic blessings dedicated to Sana&apos;s happiness.
        </p>
      </div>

      {/* Illustrated Brass Aarti Thali */}
      <div
        onClick={handleRotateThali}
        className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-3 my-4 cursor-pointer group transition-transform duration-500 ${
          isRotating ? "rotate-180 scale-105" : "hover:scale-105"
        }`}
        style={{
          background: "radial-gradient(circle, #FDE68A 0%, #F59E0B 40%, #B45309 85%, #78350F 100%)",
          boxShadow: "0 0 40px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(0,0,0,0.5)",
          border: "4px solid #FEF3C7",
        }}
      >
        {/* Intricate Thali border rim pattern */}
        <div className="absolute inset-1 rounded-full border border-amber-950/40 border-dashed pointer-events-none" />

        {/* Center Ceremonial Diya */}
        <div className="absolute inset-0 flex items-center justify-center">
          <GlowingDiya size="lg" isLit={true} />
        </div>

        {/* Marigold Petals and Haldi Kumkum along the edge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs">🌼</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs">🌼</div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">🌸</div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">🌸</div>
      </div>

      <div className="text-xs text-amber-300/80 mb-6 font-medium">
        (Tap the Brass Aarti Thali to Receive Next Blessing ✨)
      </div>

      {/* Blessing Display Card */}
      <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center animate-fadeIn">
        <div className="text-2xl mb-1">{currentBlessing.icon}</div>
        <h4 className="text-lg font-serif font-bold text-amber-100 mb-2">
          {currentBlessing.title}
        </h4>
        <div className="text-xs sm:text-sm text-amber-300/80 font-serif mb-3 tracking-wider">
          {currentBlessing.sanskrit}
        </div>
        <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
          &ldquo;{currentBlessing.translation}&rdquo;
        </p>
      </div>
    </div>
  );
}

