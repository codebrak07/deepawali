"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Heart, X, Send, Palette, Flame, CheckCircle2, Mail } from "lucide-react";
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

  // Station B (Rangoli) Automatic Color Flow & Cursor Animation State
  const [rangoliPercent, setRangoliPercent] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [powderColor, setPowderColor] = useState("#F59E0B");
  const [isCompleted, setIsCompleted] = useState(false);
  const animFrameRef = useRef<number | null>(null);

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

  // Automatic powder cursor flow animation for Rangoli
  useEffect(() => {
    if (stationId !== "station-b") return;

    soundManager.playDiyaChime();
    const startTime = Date.now();
    const colors = ["#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#10B981", "#FEF08A"];

    const runFlow = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Spiral parametric path: r = a * theta
      const angle = elapsed * 3.5;
      const radius = Math.min(42, elapsed * 10);
      const cx = 50 + Math.cos(angle) * radius;
      const cy = 50 + Math.sin(angle) * radius;

      setCursorPos({ x: cx, y: cy });
      setPowderColor(colors[Math.floor(elapsed * 2) % colors.length]);

      // Fill percent progresses smoothly from 0% to 100% over 3.2 seconds
      const progress = Math.min(100, (elapsed / 3.2) * 100);
      setRangoliPercent(progress);
      onRangoliProgressUpdate(progress / 100);

      if (progress < 100) {
        animFrameRef.current = requestAnimationFrame(runFlow);
      } else {
        setIsCompleted(true);
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#10B981"],
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(runFlow);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stationId, onRangoliProgressUpdate]);

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

  const handleRangoliCanvasTap = () => {
    // Instant tap-to-complete or sprinkle more colors
    setRangoliPercent(100);
    setIsCompleted(true);
    onRangoliProgressUpdate(1.0);
    soundManager.playDiyaChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#EC4899", "#10B981", "#38BDF8"],
    });
  };

  const handleRangoliPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
    setRangoliPercent((prev) => {
      const next = Math.min(100, prev + 2);
      onRangoliProgressUpdate(next / 100);
      return next;
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
        {/* STATION B: DRAW THE RANGOLI (AUTOMATIC FLOW & COLOR FILL) */}
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

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mb-1">
              3D Rangoli Powder Flow 🎨
            </h3>
            <p className="text-xs text-amber-200/70 mb-4">
              Watch the automatic festive gulal powders flow and fill the mandala petals!
            </p>

            {/* Interactive Visual Canvas with Animated Flowing Cursor */}
            <div
              onClick={handleRangoliCanvasTap}
              onPointerMove={handleRangoliPointerMove}
              className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full bg-[#0a0515] border-2 border-amber-500/40 p-2 shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden cursor-pointer mb-5"
              title="Tap anywhere or drag to sprinkle full colors!"
            >
              {/* Concentric Rangoli Petal Rings */}
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
                {/* Outer Ring */}
                <circle cx="50" cy="50" r="44" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6" />

                {/* 12 Outer Petals that fill with vibrant colors */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 360) / 12;
                  const isFilled = rangoliPercent >= (i / 12) * 80;
                  return (
                    <ellipse
                      key={i}
                      cx="50"
                      cy="18"
                      rx="6"
                      ry="12"
                      fill={isFilled ? (i % 2 === 0 ? "#EF4444" : "#F59E0B") : "#334155"}
                      opacity={isFilled ? "0.95" : "0.3"}
                      transform={`rotate(${angle} 50 50)`}
                      className="transition-colors duration-300"
                    />
                  );
                })}

                {/* Inner 8 Lotus Petals */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 360) / 8;
                  const isFilled = rangoliPercent >= 50 + (i / 8) * 50;
                  return (
                    <ellipse
                      key={i}
                      cx="50"
                      cy="32"
                      rx="4.5"
                      ry="9"
                      fill={isFilled ? (i % 2 === 0 ? "#06B6D4" : "#EC4899") : "#1e293b"}
                      opacity={isFilled ? "0.95" : "0.3"}
                      transform={`rotate(${angle} 50 50)`}
                      className="transition-colors duration-300"
                    />
                  );
                })}

                {/* Sacred Center Core */}
                <circle
                  cx="50"
                  cy="50"
                  r="8"
                  fill={rangoliPercent > 20 ? "#FEF08A" : "#475569"}
                  className="transition-colors duration-300"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="4"
                  fill={rangoliPercent > 50 ? "#B91C1C" : "#1e293b"}
                />
              </svg>

              {/* Animated Floating Powder Cursor Stream */}
              {!isCompleted && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
                  style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                >
                  <div
                    className="w-4 h-4 rounded-full blur-[1px] animate-ping"
                    style={{ backgroundColor: powderColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full shadow-lg border border-white"
                    style={{ backgroundColor: powderColor }}
                  />
                </div>
              )}
            </div>

            {/* Progress Dial Bar */}
            <div className="mb-5 p-3 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="flex justify-between text-xs text-amber-300 font-semibold mb-1.5">
                <span>Vibrant Colors Filling</span>
                <span>{Math.round(rangoliPercent)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-150"
                  style={{ width: `${rangoliPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5">
                {isCompleted
                  ? "🌸 Blooming! The 3D street Rangoli is now fully glowing in the Chowk!"
                  : "Flowing festive powder trail across petals... (Tap canvas to fill instantly!)"}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>See Glowing 3D Rangoli on Street ➔</span>
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

        {/* ======================================================== */}
        {/* STATION: SANA'S LOVE LETTER (station-letters) */}
        {/* ======================================================== */}
        {stationId === "station-letters" && (
          <div>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center mx-auto mb-3 text-rose-400">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Gangai Chambers Verandah</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mb-2">
              A Letter Written For Shirjana ❤️
            </h3>
            <p className="text-xs text-amber-200/70 mb-5">
              From our midnight conversations to this Diwali wonderland.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#1b0c26]/90 border border-rose-500/30 text-rose-100 text-xs sm:text-sm leading-relaxed font-serif text-left shadow-inner mb-5">
              <p className="font-bold text-amber-300 text-sm mb-3">Dearest Sana,</p>
              <p className="mb-3">
                Every corner of this little 3D world was built with you in mind. From the moment we made it official at 1:32 AM on 26 September, to holding your hand and our first kiss under the cinema lights on 4 October, you turned ordinary days into pure magic.
              </p>
              <p className="mb-4">
                No matter how many festive lanterns fill the night sky, none of them shine brighter than your smile. Happy Diwali, my heart.
              </p>
              <p className="font-bold text-amber-300 text-right italic font-serif">
                Forever yours,<br />Aalekh ❤️
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Close & Keep Exploring 🌸
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
