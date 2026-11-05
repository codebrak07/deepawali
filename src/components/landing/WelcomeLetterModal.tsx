"use client";

import React from "react";
import { Sparkles, Heart, X } from "lucide-react";
import { GlowingDiya } from "@/components/ui/GlowingDiya";

interface WelcomeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeLetterModal({ isOpen, onClose }: WelcomeLetterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c1328] via-[#130d1d] to-[#0a0612] border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl shadow-amber-500/20 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-amber-200/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close message"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Diya Accent */}
        <div className="flex justify-center mb-3">
          <GlowingDiya size="lg" isLit={true} />
        </div>

        {/* Heading */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Diwali Note For Sana</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 mb-4 tracking-tight">
          Happy Diwali, My Jaanuuuu ❤️
        </h2>

        {/* The Exact User-Requested Message */}
        <div className="space-y-4 text-amber-100/90 text-sm md:text-base leading-relaxed font-light px-2 py-3 bg-amber-950/20 rounded-xl border border-amber-500/20 text-left">
          <p>
            &ldquo;Happy Diwali, my Jaanuuuu. I wanted to make something a little different this time, something that feels like you, something that holds our little memories and all the love I have for you.&rdquo;
          </p>
          <p className="text-xs md:text-sm text-amber-200/80 italic">
            Wander through our illustrated locality, light the diyas, read my letters, and look out for the secret memories waiting around every corner.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current text-rose-900" />
            <span>Begin Exploring, Aalekh ❤️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

