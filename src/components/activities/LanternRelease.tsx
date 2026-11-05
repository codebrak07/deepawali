"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Sparkles, Send, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export function LanternRelease() {
  const { wishes, addWish } = useWonderland();
  const [wishText, setWishText] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isReleasing) return;

    setIsReleasing(true);
    addWish(wishText.trim());

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#F59E0B", "#F97316", "#FEF08A"],
    });

    setTimeout(() => {
      setWishText("");
      setIsReleasing(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center relative overflow-hidden">
      {/* Animated Ascending Lantern when releasing */}
      {isReleasing && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="animate-float-lantern flex flex-col items-center">
            <div className="relative w-16 h-24 bg-gradient-to-t from-amber-500 via-orange-400 to-amber-200 rounded-t-2xl rounded-b-sm shadow-[0_0_50px_rgba(245,158,11,1)] flex items-center justify-center animate-bounce">
              <div className="w-5 h-5 bg-yellow-100 rounded-full blur-[2px] animate-ping" />
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-slate-950/80 text-amber-200 text-xs font-serif font-bold shadow-md">
              Your wish is rising to the stars... ✨
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sacred Wish to the Stars</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Release a Floating Lantern 🏮
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Type your heartfelt Diwali wish, prayer, or romantic dream. Watch your glowing lantern take flight into our midnight sky.
        </p>
      </div>

      {/* Wish Input Form */}
      <form onSubmit={handleRelease} className="w-full max-w-xl mb-10">
        <div className="relative rounded-2xl bg-slate-950/80 border-2 border-amber-500/30 p-2 shadow-inner focus-within:border-amber-400 transition-colors">
          <textarea
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            rows={3}
            placeholder="Write a sweet wish for our future, Jaanu..."
            className="w-full bg-transparent text-amber-100 placeholder-slate-500 text-sm p-3 focus:outline-none resize-none font-medium"
            disabled={isReleasing}
          />
          <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-800">
            <span className="text-[11px] text-amber-400/70 italic flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              Lantern carries your love to Aalekh
            </span>
            <button
              type="submit"
              disabled={isReleasing || !wishText.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isReleasing ? "Releasing..." : "Release Lantern ✨"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Floating Wishes Gallery */}
      <div className="w-full max-w-2xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 text-center">
          Our Wishes Floating in the Sky ({wishes.length})
        </h4>
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-start gap-3 text-xs sm:text-sm text-amber-100"
            >
              <span className="text-base">🏮</span>
              <div className="flex-1">
                <p className="font-serif italic">&ldquo;{w.text}&rdquo;</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Released on {w.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

