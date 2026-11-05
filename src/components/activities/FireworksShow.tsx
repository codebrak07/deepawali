"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Heart, Flame, Play, Pause } from "lucide-react";
import { soundManager } from "@/components/audio/SoundManager";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  gravity: number;
  decay: number;
}

export function FireworksShow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [fireworkType, setFireworkType] = useState<"mixed" | "heart" | "gold">("heart");

  const colors = ["#F59E0B", "#EF4444", "#EC4899", "#38BDF8", "#10B981", "#FEF08A"];

  const launchRocket = (targetX: number, targetY: number, forceHeart = false) => {
    soundManager.playFireworkLaunch();

    const isHeart = forceHeart || fireworkType === "heart" || (fireworkType === "mixed" && Math.random() < 0.4);
    const particleCount = isHeart ? 60 : 70;
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    if (isHeart) {
      // Parametric heart formula: x = 16 sin^3(t), y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.22;

        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: hx * speed + (Math.random() - 0.5) * 0.4,
          vy: hy * speed + (Math.random() - 0.5) * 0.4,
          alpha: 1,
          color: Math.random() > 0.5 ? "#F43F5E" : "#FDE68A",
          size: Math.random() * 2.5 + 1.5,
          gravity: 0.03,
          decay: Math.random() * 0.012 + 0.012,
        });
      }
    } else {
      // Circular Peony / Brocade burst
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: fireworkType === "gold" ? "#F59E0B" : baseColor,
          size: Math.random() * 3 + 1,
          gravity: 0.06,
          decay: Math.random() * 0.015 + 0.015,
        });
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastAutoLaunch = Date.now();

    const loop = () => {
      ctx.fillStyle = "rgba(5, 7, 20, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto launch periodically
      if (autoPlay && Date.now() - lastAutoLaunch > 1400) {
        lastAutoLaunch = Date.now();
        const randX = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
        const randY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.15;
        launchRocket(randX, randY);
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoPlay, fireworkType]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    launchRocket(x, y);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Illuminating The Sky for Shirjana</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Fireworks for Sana 🎆
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Click or tap anywhere on the dark sky below to trigger a customized firework display!
        </p>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-2xl aspect-[16/9] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl cursor-pointer">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          onClick={handleCanvasClick}
          className="w-full h-full bg-[#050714]"
        />
        <div className="absolute bottom-3 left-4 text-[10px] text-amber-300/70 pointer-events-none">
          Click sky to ignite • Heart fireworks dedicated to Sana
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:border-amber-400 cursor-pointer"
        >
          {autoPlay ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
          <span>{autoPlay ? "Pause Auto-Fireworks" : "Start Auto-Fireworks"}</span>
        </button>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-700 text-xs">
          <button
            onClick={() => setFireworkType("heart")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
              fireworkType === "heart" ? "bg-rose-600 text-white shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Heart Burst</span>
          </button>
          <button
            onClick={() => setFireworkType("gold")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
              fireworkType === "gold" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Golden Willow</span>
          </button>
          <button
            onClick={() => setFireworkType("mixed")}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              fireworkType === "mixed" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
            }`}
          >
            Rainbow Mix
          </button>
        </div>
      </div>
    </div>
  );
}
