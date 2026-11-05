"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { LoveLetter } from "@/data/defaultData";
import { Mail, Sparkles, X, Heart, CheckCircle2 } from "lucide-react";

export function LettersSection() {
  const { letters, readLetters, markLetterRead } = useWonderland();
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);

  const handleOpenLetter = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    markLetterRead(letter.id);
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>Written From The Deepest Part of My Heart</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
          Letters Written Just for You 💌
        </h2>
        <p className="text-sm text-amber-200/80">
          Open whenever your heart needs a warm reminder of how deeply you are loved.
        </p>
      </div>

      {/* Grid of Envelope Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {letters.map((letter) => {
          const isRead = readLetters.includes(letter.id);
          return (
            <div
              key={letter.id}
              onClick={() => handleOpenLetter(letter)}
              className="group relative rounded-2xl glass-diwali-card glass-diwali-card-hover p-6 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Top Envelope Flap styling */}
              <div
                className={`h-1.5 w-full rounded-full bg-gradient-to-r ${letter.accentColor} mb-4`}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    {letter.category}
                  </span>
                  {isRead ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Read
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                      New
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                  {letter.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 italic mb-4 font-light">
                  &ldquo;{letter.preview}&rdquo;
                </p>
              </div>

              {/* Envelope Bottom Seal */}
              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-xs text-amber-300/80 group-hover:text-amber-200 font-semibold flex items-center gap-1">
                  <span>Open Envelope</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </span>
                <div className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-400/50 flex items-center justify-center text-xs">
                  💌
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unfolded Letter Modal (Parchment Texture Style) */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF5EB] text-[#291E13] p-6 sm:p-10 shadow-2xl border-4 border-[#C2933C] relative">
            {/* Close */}
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-[#EAD8B7] hover:bg-[#D4BE94] text-[#422C17] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="text-center mb-6 border-b border-[#EAD8B7] pb-4">
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#9A6B29] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedLetter.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2613]">
                {selectedLetter.title}
              </h3>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#3B2613] font-serif">
              {selectedLetter.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Letter Signature & Wax Seal */}
            <div className="mt-8 pt-4 border-t border-[#EAD8B7] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8A5A24] italic">With all my love,</p>
                <p className="text-base sm:text-lg font-serif font-bold text-[#422C17]">
                  {selectedLetter.signature}
                </p>
              </div>

              {/* Red Wax Seal */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-700 to-red-900 border-2 border-red-950 shadow-md flex items-center justify-center text-white text-xs font-bold">
                <Heart className="w-6 h-6 fill-current text-rose-200" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
