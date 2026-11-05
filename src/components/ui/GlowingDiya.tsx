"use client";

import React from "react";

interface GlowingDiyaProps {
  isLit?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function GlowingDiya({
  isLit = true,
  size = "md",
  onClick,
  label,
  className = "",
}: GlowingDiyaProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {/* Glow halo when lit */}
        {isLit && (
          <div className="absolute -top-3 w-10 h-10 bg-amber-400/40 rounded-full blur-md animate-pulse-glow pointer-events-none" />
        )}

        {/* Diya SVG */}
        <svg
          viewBox="0 0 100 85"
          className="w-full h-full filter drop-shadow-md overflow-visible"
        >
          {/* Flame (renders only if isLit is true) */}
          {isLit ? (
            <g className="animate-flicker origin-bottom" style={{ transformOrigin: "50px 38px" }}>
              {/* Outer Golden Orange Aura */}
              <path
                d="M50 4 C44 14, 38 24, 42 35 C45 40, 55 40, 58 35 C62 24, 56 14, 50 4 Z"
                fill="url(#flameGradientOuter)"
                filter="url(#flameBlur)"
              />
              {/* Inner Bright Yellow Core */}
              <path
                d="M50 12 C46 19, 43 27, 45 34 C47 37, 53 37, 55 34 C57 27, 54 19, 50 12 Z"
                fill="url(#flameGradientInner)"
              />
              {/* Hot White Center */}
              <ellipse cx="50" cy="30" rx="2.5" ry="5" fill="#FFFFFF" opacity="0.9" />
            </g>
          ) : (
            /* Unlit wick */
            <line x1="50" y1="36" x2="50" y2="40" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Brass Diya Vessel */}
          <path
            d="M20 45 C20 45, 12 50, 16 65 C20 76, 40 78, 50 78 C60 78, 80 76, 84 65 C88 50, 80 45, 80 45 C75 52, 65 55, 50 55 C35 55, 25 52, 20 45 Z"
            fill="url(#brassGradient)"
            stroke="#92400E"
            strokeWidth="1.5"
          />

          {/* Brass Lip / Rim Highlights */}
          <path
            d="M20 45 C30 52, 70 52, 80 45 C70 42, 30 42, 20 45 Z"
            fill="url(#rimGradient)"
            opacity="0.95"
          />

          {/* Diya Base Pedestal */}
          <ellipse cx="50" cy="76" rx="16" ry="4" fill="#B45309" stroke="#78350F" strokeWidth="1" />

          {/* Intricate decorative etching on brass */}
          <circle cx="50" cy="62" r="2.5" fill="#FEF3C7" opacity="0.7" />
          <circle cx="38" cy="60" r="1.8" fill="#FEF3C7" opacity="0.6" />
          <circle cx="62" cy="60" r="1.8" fill="#FEF3C7" opacity="0.6" />

          {/* SVG Gradients & Filters */}
          <defs>
            <linearGradient id="flameGradientOuter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FBBF24" />
              <stop offset="65%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            <linearGradient id="flameGradientInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="40%" stopColor="#FDE68A" />
              <stop offset="70%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="rimGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <filter id="flameBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
        </svg>
      </div>

      {label && (
        <span className="mt-1 text-[11px] font-medium tracking-wide text-amber-200/90 text-center select-none">
          {label}
        </span>
      )}
    </div>
  );
}
