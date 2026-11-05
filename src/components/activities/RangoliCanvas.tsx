"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, RotateCcw, Download, Palette } from "lucide-react";
import confetti from "canvas-confetti";

export function RangoliCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#F59E0B");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [symmetry, setSymmetry] = useState<number>(8); // 8-fold radial symmetry!
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const colors = [
    "#F59E0B", // Turmeric Gold
    "#EF4444", // Vermilion Red
    "#EC4899", // Lotus Pink
    "#06B6D4", // Peacock Blue
    "#10B981", // Emerald Green
    "#8B5CF6", // Royal Purple
    "#FFFFFF", // Rice Powder White
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090d1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle guide rings
    ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
    ctx.lineWidth = 1;
    [50, 100, 150, 200].forEach((r) => {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const drawSymmetricPoints = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const angleStep = (Math.PI * 2) / symmetry;

    ctx.fillStyle = selectedColor;
    ctx.shadowColor = selectedColor;
    ctx.shadowBlur = 8;

    for (let i = 0; i < symmetry; i++) {
      const angle = i * angleStep;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const rotX = centerX + (dx * cos - dy * sin);
      const rotY = centerY + (dx * sin + dy * cos);

      ctx.beginPath();
      ctx.arc(rotX, rotY, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    drawSymmetricPoints(x, y);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    drawSymmetricPoints(x, y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090d1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
    ctx.lineWidth = 1;
    [50, 100, 150, 200].forEach((r) => {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "sana_diwali_rangoli.png";
    link.href = image;
    link.click();

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-2">
          <Palette className="w-3.5 h-3.5" />
          <span>Interactive Diwali Art</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Create Your Own Rangoli Mandala 🎨
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Pick your festive gulal powder and drag across the canvas. Dynamic symmetry mirrors every stroke in real time!
        </p>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl touch-none mb-6">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="w-full max-w-[420px] sm:max-w-[480px] aspect-square bg-[#090d1f] cursor-crosshair"
        />
      </div>

      {/* Controls Bar */}
      <div className="w-full max-w-lg flex flex-col gap-4">
        {/* Color Palette */}
        <div className="flex items-center justify-center gap-3">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                selectedColor === c ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950" : "hover:scale-110"
              }`}
              style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        {/* Symmetry & Brush Sliders */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span>Symmetry:</span>
            {[4, 8, 12].map((s) => (
              <button
                key={s}
                onClick={() => setSymmetry(s)}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                  symmetry === s ? "bg-amber-500 text-slate-950" : "bg-white/10"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span>Brush:</span>
            {[3, 6, 10].map((b) => (
              <button
                key={b}
                onClick={() => setBrushSize(b)}
                className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                  brushSize === b ? "bg-amber-500 text-slate-950" : "bg-white/10"
                }`}
              >
                {b}px
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Canvas</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download My Rangoli</span>
          </button>
        </div>
      </div>
    </div>
  );
}

