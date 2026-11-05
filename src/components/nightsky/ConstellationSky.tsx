"use client";

import React, { useState } from "react";
import { Sparkles, Moon, Heart } from "lucide-react";
import { soundManager } from "@/components/audio/SoundManager";
import confetti from "canvas-confetti";

export function ConstellationSky() {
  const [revealedQuote, setRevealedQuote] = useState<boolean>(false);

  const handleConstellationTap = () => {
    setRevealedQuote(true);
    soundManager.playLanternFloat();

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#F59E0B", "#FDE68A", "#EC4899", "#38BDF8"],
    });
  };

  // Star points for "A + S" constellation
  // "A": (20,60), (28,25), (36,60), (24,45), (32,45)
  // "+": (46,42), (54,42), (50,34), (50,50)
  // "S": (72,25), (64,25), (63,40), (73,45), (73,60), (63,60)
  const constellationStars = [
    // Letter A
    { x: 20, y: 62 },
    { x: 28, y: 22 },
    { x: 36, y: 62 },
    { x: 23, y: 44 },
    { x: 33, y: 44 },

    // Heart / Plus symbol in center
    { x: 47, y: 42 },
    { x: 53, y: 42 },
    { x: 50, y: 35 },
    { x: 50, y: 49 },

    // Letter S
    { x: 73, y: 24 },
    { x: 64, y: 24 },
    { x: 63, y: 41 },
    { x: 74, y: 45 },
    { x: 74, y: 62 },
    { x: 64, y: 62 },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center select-none">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
          <Moon className="w-3.5 h-3.5" />
          <span>Written in the Heavens</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
          The Midnight Starlight Sky 🌌
        </h2>
        <p className="text-sm text-amber-200/80">
          Touch the glowing celestial constellation of A + S in the center of the night sky.
        </p>
      </div>

      {/* Deep Space Interactive Viewport */}
      <div
        onClick={handleConstellationTap}
        className="relative w-full aspect-[16/10] max-h-[500px] rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] cursor-pointer group"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, #0c1433 0%, #050819 60%, #02030a 100%)",
        }}
      >
        {/* Twinkling Background Stars */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle pointer-events-none"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 96}%`,
              width: `${(i % 3) + 1.2}px`,
              height: `${(i % 3) + 1.2}px`,
              animationDelay: `${(i % 5) * 0.5}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
              opacity: 0.4 + ((i % 5) * 0.12),
            }}
          />
        ))}

        {/* Crescent Moon in top corner */}
        <div className="absolute top-8 right-10 w-16 h-16 pointer-events-none filter drop-shadow-[0_0_20px_rgba(254,240,138,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M75 10 C50 15, 30 35, 30 60 C30 85, 50 105, 75 110 C45 100, 20 75, 20 50 C20 25, 45 5, 75 10 Z"
              fill="#FEF08A"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Constellation Lines & Stars SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Letter A lines */}
          <line x1="20%" y1="62%" x2="28%" y2="22%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="28%" y1="22%" x2="36%" y2="62%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="23%" y1="44%" x2="33%" y2="44%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

          {/* Plus lines */}
          <line x1="47%" y1="42%" x2="53%" y2="42%" stroke="#F43F5E" strokeWidth="2" opacity="0.8" />
          <line x1="50%" y1="35%" x2="50%" y2="49%" stroke="#F43F5E" strokeWidth="2" opacity="0.8" />

          {/* Letter S lines */}
          <line x1="73%" y1="24%" x2="64%" y2="24%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="64%" y1="24%" x2="63%" y2="41%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="63%" y1="41%" x2="74%" y2="45%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="74%" y1="45%" x2="74%" y2="62%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="74%" y1="62%" x2="64%" y2="62%" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        </svg>

        {/* Constellation Glowing Stars */}
        {constellationStars.map((st, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform"
            style={{ left: `${st.x}%`, top: `${st.y}%` }}
          >
            <div className="w-3.5 h-3.5 bg-yellow-200 rounded-full blur-[1px] shadow-[0_0_12px_#FDE68A]" />
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
          </div>
        ))}

        {/* Constellation Label */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950/80 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-lg">
          Tap Constellation A + S ✨
        </div>
      </div>

      {/* The Exact User-Requested Celestial Quote Reveal */}
      {revealedQuote && (
        <div className="w-full max-w-xl mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-amber-950/50 border-2 border-amber-400/60 shadow-2xl text-center animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated to Shirjana</span>
          </div>
          <p className="text-xl sm:text-2xl font-serif font-bold text-white leading-relaxed mb-4">
            &ldquo;Out of all the lights in this world, you will always be my favourite one.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-300 font-medium">
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>Forever woven into the stars by Aalekh</span>
          </div>
        </div>
      )}
    </div>
  );
}

