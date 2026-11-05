"use client";

import React, { useState } from "react";
import { LocalityPoint } from "@/data/defaultData";
import { useWonderland } from "@/context/WonderlandContext";
import { X, Sparkles, Heart, CheckCircle2, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface LocationInteractionModalProps {
  location: LocalityPoint | null;
  onClose: () => void;
}

export function LocationInteractionModal({
  location,
  onClose,
}: LocationInteractionModalProps) {
  const { visitLocation, visitedLocations, claimGift } = useWonderland();
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  if (!location) return null;

  const isVisited = visitedLocations.includes(location.id);

  const handleAction = () => {
    setHasInteracted(true);
    visitLocation(location.id);
    if (location.unlockedContent.giftItem) {
      claimGift(location.unlockedContent.giftItem);
    }

    // Festive confetti burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#F59E0B", "#F97316", "#EC4899", "#10B981"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#171026] via-[#10091d] to-[#080511] border-2 border-amber-500/40 p-6 shadow-2xl shadow-amber-500/20 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-amber-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Location Category & Subtext */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-950"
            style={{ backgroundColor: location.color }}
          >
            {location.category}
          </span>
          <span className="text-xs text-amber-200/70 font-medium">
            {location.subtext}
          </span>
          {isVisited && (
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Explored</span>
            </span>
          )}
        </div>

        {/* Location Title */}
        <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-100 mb-1">
          {location.name}
        </h3>
        <p className="text-sm text-amber-400/90 font-medium mb-4">
          {location.title}
        </p>

        {/* Story Section */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 text-slate-200 text-sm leading-relaxed mb-5">
          <p>{location.story}</p>
        </div>

        {/* Interactive Action Button or Unlocked Result */}
        {!hasInteracted && !isVisited ? (
          <button
            onClick={handleAction}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{location.actionText}</span>
          </button>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-amber-950/40 border border-amber-400/40 shadow-inner">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1.5">
                <Heart className="w-4 h-4 fill-current text-rose-500" />
                <span>{location.unlockedContent.heading}</span>
              </div>
              <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed">
                {location.unlockedContent.body}
              </p>
            </div>

            {location.unlockedContent.giftItem && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-200 text-xs">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span>Discovered Keepsake:</span>
                </div>
                <span className="font-bold text-amber-300">
                  {location.unlockedContent.giftItem}
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              Continue Exploring The Locality ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
