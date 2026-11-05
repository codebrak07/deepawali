"use client";

import React from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Heart } from "lucide-react";

export function AalekhCharacter() {
  const { characterPos, characterDir, characterSpeech, isWalking } = useWonderland();

  // Direction transform flip
  const isFacingLeft = characterDir === "left";

  return (
    <div
      className="absolute z-30 transition-all duration-500 ease-out pointer-events-none select-none"
      style={{
        left: `${characterPos.x}%`,
        top: `${characterPos.y}%`,
        transform: "translate(-50%, -85%)",
      }}
    >
      {/* Speech Bubble */}
      {characterSpeech && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-950/95 border border-amber-400 text-amber-200 text-xs font-medium shadow-xl shadow-amber-500/20 flex items-center gap-1.5 animate-bounce">
          <Heart className="w-3 h-3 text-rose-500 fill-current" />
          <span>{characterSpeech}</span>
          {/* Speech bubble beak */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-amber-400 rotate-45" />
        </div>
      )}

      {/* Character Figure Container */}
      <div
        className={`relative w-14 h-20 flex flex-col items-center justify-end ${
          isWalking ? "animate-pulse" : ""
        } ${isFacingLeft ? "-scale-x-100" : "scale-x-100"}`}
      >
        {/* Soft shadow under character */}
        <div className="absolute bottom-0 w-10 h-3 bg-black/50 rounded-full blur-[2px]" />

        {/* Character SVG representation of Aalekh */}
        <svg viewBox="0 0 100 140" className="w-full h-full filter drop-shadow-lg overflow-visible">
          {/* Aalekh's Hair */}
          <path
            d="M32 30 C30 14, 50 10, 68 14 C74 18, 75 32, 70 38 C60 38, 40 38, 32 30 Z"
            fill="#1E293B"
          />
          {/* Head / Face */}
          <ellipse cx="50" cy="34" rx="16" ry="17" fill="#FBD38D" />

          {/* Sweet smile & eyes */}
          {characterDir === "up" ? (
            /* Back of head */
            <ellipse cx="50" cy="34" rx="15" ry="16" fill="#1E293B" />
          ) : (
            <>
              {/* Eyes */}
              <circle cx="44" cy="32" r="2.2" fill="#0F172A" />
              <circle cx="56" cy="32" r="2.2" fill="#0F172A" />
              {/* Eye sparkle */}
              <circle cx="45" cy="31" r="0.7" fill="#FFFFFF" />
              <circle cx="57" cy="31" r="0.7" fill="#FFFFFF" />
              {/* Rosy blush cheeks */}
              <ellipse cx="40" cy="36" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.4" />
              <ellipse cx="60" cy="36" rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.4" />
              {/* Happy Smile */}
              <path
                d="M45 38 Q50 43 55 38"
                stroke="#0F172A"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Festive Diwali Kurta (Crimson & Gold Trim) */}
          <path
            d="M32 48 L22 65 L28 68 L34 56 L34 94 L66 94 L66 56 L72 68 L78 65 L68 48 Z"
            fill="#B91C1C"
            stroke="#7F1D1D"
            strokeWidth="1.2"
          />

          {/* Golden Kurta Placket & Embroidery */}
          <line x1="50" y1="48" x2="50" y2="82" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="50" cy="54" r="1.5" fill="#FEF08A" />
          <circle cx="50" cy="62" r="1.5" fill="#FEF08A" />
          <circle cx="50" cy="70" r="1.5" fill="#FEF08A" />

          {/* Tiny Diya held in hands when facing forward */}
          {characterDir !== "up" && (
            <g transform="translate(42, 64) scale(0.2)">
              <ellipse cx="40" cy="40" rx="18" ry="10" fill="#F59E0B" />
              <circle cx="40" cy="25" r="8" fill="#EF4444" className="animate-ping" opacity="0.6" />
              <circle cx="40" cy="25" r="5" fill="#FEF08A" />
            </g>
          )}

          {/* White Pyjama / Pants */}
          <rect x="37" y="94" width="10" height="28" rx="3" fill="#F8FAFC" />
          <rect x="53" y="94" width="10" height="28" rx="3" fill="#F8FAFC" />

          {/* Traditional Jutti / Shoes */}
          <ellipse
            cx={isWalking ? 42 : 40}
            cy="124"
            rx="6"
            ry="4"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1"
          />
          <ellipse
            cx={isWalking ? 58 : 60}
            cy="124"
            rx="6"
            ry="4"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1"
          />
        </svg>

        {/* Name tag */}
        <div className="absolute -bottom-4 whitespace-nowrap px-1.5 py-0.2 rounded-full bg-slate-900/90 border border-amber-500/50">
          <span className="text-[10px] font-bold text-amber-300">Aalekh 🪔</span>
        </div>
      </div>
    </div>
  );
}
