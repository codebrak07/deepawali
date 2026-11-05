"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Heart, X, Send, Palette, Flame } from "lucide-react";
import { soundManager } from "@/components/audio/SoundManager";
import confetti from "canvas-confetti";

interface StationModalsProps {
  stationId: string | null;
  onClose: () => void;
  onRangoliProgressUpdate: (progress: number) => void;
  onLanternReleaseTrigger: () => void;
}

export function StationModals({
  stationId,
  onClose,
  onRangoliProgressUpdate,
  onLanternReleaseTrigger,
}: StationModalsProps) {
  // Station A state
  const [diyaMemoryIdx, setDiyaMemoryIdx] = useState(0);

  // Station B (Rangoli) Hold State
  const [rangoliPercent, setRangoliPercent] = useState(25);
  const [isHoldingRangoli, setIsHoldingRangoli] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Station C (Lantern) Wish State
  const [wishText, setWishText] = useState("");
  const [isLanternLaunched, setIsLanternLaunched] = useState(false);

  // Station A Memories
  const diyaMemories = [
    {
      title: "First DMs • 11 September",
      text: "A simple hello that changed my world. Talking to you didn't feel like talking to someone new; it felt like returning home to a conversation my heart had waited for all along.",
    },
    {
      title: "Making It Official • 26 September",
      text: "1:24 AM: 'ig we are in relationship' • 1:32 AM: 'fine let's make it official' • 1:36 AM: 'LY2' • 1:37 AM: 'I loveeee youuu tooo babyyy ❤️'. The happiest second of my life.",
    },
    {
      title: "First Sight • 27 September",
      text: "Walking into Elpro Mall and seeing you in real life for the first time. You looked even more breathtaking than any photo or video call.",
    },
    {
      title: "First Kiss • 4 October",
      text: "INOX cinema lights, tangled fingers, and that electric first kiss. Then warm coffee at Phullaura Cafe and walking under the trees at Appu Garden.",
    },
  ];

  // Station B Hold Progress loop
  useEffect(() => {
    if (isHoldingRangoli) {
      holdIntervalRef.current = setInterval(() => {
        setRangoliPercent((prev) => {
          const next = Math.min(100, prev + 2.5);
          onRangoliProgressUpdate(next / 100);
          if (next >= 100) {
            setIsHoldingRangoli(false);
            soundManager.playDiyaChime();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#F59E0B", "#EF4444", "#EC4899", "#06B6D4"],
            });
          }
          return next;
        });
      }, 50);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHoldingRangoli, onRangoliProgressUpdate]);

  if (!stationId) return null;

  const handleNextDiya = () => {
    soundManager.playDiyaChime();
    setDiyaMemoryIdx((prev) => (prev + 1) % diyaMemories.length);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.65 },
      colors: ["#F59E0B", "#FDE68A", "#F97316"],
    });
  };

  const handleLaunchLantern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isLanternLaunched) return;
    setIsLanternLaunched(true);
    soundManager.playLanternFloat();
    onLanternReleaseTrigger();

    confetti({
      particleCount: 45,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#F59E0B", "#F97316", "#FEF08A"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#1b1028] via-[#12091d] to-[#07040f] border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-amber-200/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ======================================================== */}
        {/* STATION A: LIGHT THE DIYAS */}
        {/* ======================================================== */}
        {stationId === "station-a" && (
          <div>
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dattawadi Main Road • Diyas Lit</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mb-2">
              Sacred Diwali Diyas Illuminated 🪔
            </h3>
            <p className="text-xs text-amber-200/70 mb-5">
              The terracotta lamps are glowing warmly along the street. Tap to reveal each memory:
            </p>

            {/* Memory Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-left mb-6 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                <span>{diyaMemories[diyaMemoryIdx].title}</span>
              </div>
              <p className="text-sm text-slate-100 font-light leading-relaxed">
                {diyaMemories[diyaMemoryIdx].text}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleNextDiya}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Light Next Diya & Memory ✨
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION B: DRAW THE RANGOLI */}
        {/* ======================================================== */}
        {stationId === "station-b" && (
          <div>
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-3 text-cyan-400">
              <Palette className="w-6 h-6 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hanuman Mandir Chowk</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mb-2">
              Draw the 3D Street Rangoli 🎨
            </h3>
            <p className="text-xs text-amber-200/70 mb-5">
              Press and hold the button below to pour turmeric & vermilion powders into the street mandala!
            </p>

            {/* Progress Circular Dial / Bar */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
              <div className="flex justify-between text-xs text-amber-300 font-semibold mb-2">
                <span>Rangoli Completion</span>
                <span>{Math.round(rangoliPercent)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-100"
                  style={{ width: `${rangoliPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {rangoliPercent >= 100
                  ? "✨ Complete! The 3D Rangoli is now glowing in the Chowk!"
                  : "Hold down to scatter more vibrant petals..."}
              </div>
            </div>

            {/* Touch-and-Hold Button */}
            <button
              onMouseDown={() => setIsHoldingRangoli(true)}
              onMouseUp={() => setIsHoldingRangoli(false)}
              onMouseLeave={() => setIsHoldingRangoli(false)}
              onTouchStart={() => setIsHoldingRangoli(true)}
              onTouchEnd={() => setIsHoldingRangoli(false)}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg transition-all select-none cursor-pointer ${
                rangoliPercent >= 100
                  ? "bg-emerald-600 text-white cursor-default"
                  : isHoldingRangoli
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white scale-95 shadow-amber-500/50"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:scale-[1.02]"
              }`}
            >
              {rangoliPercent >= 100
                ? "Rangoli Masterpiece Complete! 🌸"
                : isHoldingRangoli
                ? "Drawing in Progress... ✨"
                : "Hold to Pour Rangoli Powder 🌸"}
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION C: RELEASE THE LANTERN */}
        {/* ======================================================== */}
        {stationId === "station-c" && (
          <div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center mx-auto mb-3 text-orange-400">
              <Send className="w-6 h-6 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sky Lantern Clearing</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mb-2">
              Release the Akash Kandil 🏮
            </h3>
            <p className="text-xs text-amber-200/70 mb-5">
              Type a heartfelt wish or promise for our future. Watch the 3D lantern rise into the night sky!
            </p>

            {!isLanternLaunched ? (
              <form onSubmit={handleLaunchLantern} className="space-y-4">
                <textarea
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  rows={3}
                  placeholder="Type a Diwali wish for Aalekh & Sana..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
                <button
                  type="submit"
                  disabled={!wishText.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Release 3D Lantern into Night Sky ✨</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-400/40 text-amber-200 text-xs sm:text-sm leading-relaxed font-serif">
                  <p className="italic mb-2">&ldquo;{wishText}&rdquo;</p>
                  <p className="text-[11px] text-amber-400 font-sans font-bold">
                    Your Akash Kandil is ascending into the heavens! Look up as it joins the stars.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Watch Lantern in Sky ➔
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

