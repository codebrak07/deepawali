"use client";

import React, { useEffect } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { Sparkles, Heart, X, Lock } from "lucide-react";
import confetti from "canvas-confetti";

export function FinalSurpriseModal() {
  const {
    showFinalSurprise,
    setShowFinalSurprise,
    finalSurpriseUnlocked,
    progressPercent,
    litDiyas,
    visitedLocations,
    readLetters,
    treasureCluesSolved,
  } = useWonderland();

  useEffect(() => {
    if (showFinalSurprise && finalSurpriseUnlocked) {
      // Magnificent golden confetti fireworks cascade!
      const end = Date.now() + 3000;
      const interval: NodeJS.Timeout = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ["#F59E0B", "#FDE68A", "#EF4444", "#EC4899", "#10B981"],
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [showFinalSurprise, finalSurpriseUnlocked]);

  if (!showFinalSurprise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#1f122b] via-[#140b20] to-[#0a0512] border-3 border-amber-400 p-6 sm:p-10 shadow-[0_0_80px_rgba(245,158,11,0.5)] max-h-[92vh] overflow-y-auto text-center">
        {/* Close Button */}
        <button
          onClick={() => setShowFinalSurprise(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-amber-200 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {finalSurpriseUnlocked ? (
          /* Unlocked Final Surprise */
          <div className="space-y-6">
            <div className="flex justify-center">
              <GlowingDiya size="xl" isLit={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-300 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>The Grand Diwali Surprise Revealed</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-rose-300">
              Happy Diwali, my Shirjana ❤️
            </h2>

            {/* The Exact User-Specified Masterpiece Message */}
            <div className="text-sm sm:text-base md:text-lg text-amber-100/95 font-serif font-light leading-relaxed space-y-4 p-6 sm:p-8 rounded-2xl bg-amber-950/30 border border-amber-400/40 text-left shadow-inner">
              <p>
                &ldquo;Happy Diwali, my Shirjana ❤️
              </p>
              <p>
                I hope this little world made you smile. I cannot put every feeling into words, but I wanted to make something that reminds you how special you are to me.
              </p>
              <p>
                I hope we get to celebrate countless Diwalis together, make our own little traditions, decorate our home, light diyas and create memories that we will remember forever.
              </p>
              <p className="font-bold text-amber-200 text-right pt-2">
                I love you, Jaanuuuu.&rdquo;
              </p>
            </div>

            {/* Couple Signature & Devotion */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-500/30">
              <div className="text-xs text-amber-300/80 italic text-left">
                Created exclusively for Shirjana • With all my soul
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
                <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
                <span>Forever Aalekh & Sana</span>
              </div>
            </div>
          </div>
        ) : (
          /* Locked Progress View */
          <div className="space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-2">
                Secret Final Surprise ({progressPercent}%)
              </h3>
              <p className="text-xs sm:text-sm text-amber-200/80 max-w-md mx-auto">
                Aalekh prepared a special grand finale for you, Sana! Continue exploring our little world to unlock the final message:
              </p>
            </div>

            {/* Progress Checklist */}
            <div className="max-w-md mx-auto space-y-2.5 text-left text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                <span>Light at least 7 Diyas:</span>
                <span className={litDiyas.length >= 7 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {litDiyas.length}/7 {litDiyas.length >= 7 ? "✓" : ""}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                <span>Visit 4 Locality Landmarks:</span>
                <span className={visitedLocations.length >= 4 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {visitedLocations.length}/4 {visitedLocations.length >= 4 ? "✓" : ""}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                <span>Read Letters or Solve Clues:</span>
                <span
                  className={
                    readLetters.length + treasureCluesSolved >= 2
                      ? "text-emerald-400 font-bold"
                      : "text-amber-400"
                  }
                >
                  {readLetters.length + treasureCluesSolved}/2{" "}
                  {readLetters.length + treasureCluesSolved >= 2 ? "✓" : ""}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowFinalSurprise(false)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs tracking-wider cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              Keep Exploring To Unlock ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

