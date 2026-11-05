"use client";

import React from "react";
import { BUILDINGS_LIGHTS } from "@/data/locations";

export function BuildingLighting() {
  const fairyColors = [
    "#F59E0B", // Golden amber
    "#EC4899", // Fuchsia pink
    "#10B981", // Emerald green
    "#06B6D4", // Cyan
    "#F43F5E", // Crimson
    "#8B5CF6", // Purple
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {BUILDINGS_LIGHTS.map((bld) => {
        return (
          <div
            key={bld.id}
            className="absolute rounded-xl transition-all duration-500"
            style={{
              left: `${bld.x}%`,
              top: `${bld.y}%`,
              width: `${bld.width}px`,
              height: `${bld.height}px`,
              background: `linear-gradient(180deg, ${bld.roofColor}ee 0%, ${bld.facadeColor}dd 100%)`,
              border: "1px solid rgba(245, 158, 11, 0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(245,158,11,0.2)",
            }}
          >
            {/* Ornate Indian cornice & roof overhang */}
            <div
              className="absolute -top-3.5 left-0 right-0 h-4 rounded-t-md"
              style={{
                background: `linear-gradient(90deg, #B45309, #FDE68A, #B45309)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {/* Roof Diya in center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 rounded-full blur-[2px] animate-pulse" />
            </div>

            {/* String of Colorful Diwali Fairy Lights along the roofline */}
            <div className="absolute -top-1 left-1 right-1 flex justify-between items-center px-1">
              {Array.from({ length: 9 }).map((_, lightIdx) => {
                const color = fairyColors[lightIdx % fairyColors.length];
                const animClass = `fairy-light-${(lightIdx % 4) + 1}`;
                return (
                  <div key={lightIdx} className="relative flex flex-col items-center">
                    {/* Wire droop */}
                    <div className="w-1.5 h-1 border-b border-white/40" />
                    {/* Glowing bulb */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${animClass}`}
                      style={{
                        backgroundColor: color,
                        color: color,
                        boxShadow: `0 0 8px ${color}`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Glowing Diwali Welcome Banner */}
            {bld.diwaliBanner && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-950/80 border border-amber-400/50 shadow-md">
                <span className="text-[9px] font-bold tracking-wider text-amber-200">
                  {bld.diwaliBanner}
                </span>
              </div>
            )}

            {/* Glowing Windows with Festive Warmth */}
            <div className="absolute inset-x-2 top-6 bottom-2 grid grid-cols-3 gap-1.5 p-1">
              {Array.from({ length: 6 }).map((_, wIdx) => {
                const isWindowLit = (wIdx + bld.x) % 2 === 0;
                return (
                  <div
                    key={wIdx}
                    className={`rounded-sm border border-amber-500/30 transition-all ${
                      isWindowLit
                        ? "bg-gradient-to-b from-amber-200/40 to-orange-500/40 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-slate-900/60"
                    }`}
                  >
                    {/* Window cross mullion */}
                    <div className="w-full h-full border-t border-r border-amber-950/50 opacity-40" />
                  </div>
                );
              })}
            </div>

            {/* Building Name Tag */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700">
              <span className="text-[10px] font-medium text-amber-100">{bld.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
