"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Gift, Sparkles, Heart, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface SecretGift {
  id: string;
  name: string;
  boxColor: string;
  ribbonColor: string;
  riddleLocation: string;
  surpriseContent: string;
}

export function HiddenGifts() {
  const { foundGifts, claimGift } = useWonderland();
  const [openedGift, setOpenedGift] = useState<SecretGift | null>(null);

  const secretGifts: SecretGift[] = [
    {
      id: "gift-sweet",
      name: "Sana's Saffron Kaju Sweet Box",
      boxColor: "from-amber-600 to-yellow-500",
      ribbonColor: "text-rose-400",
      riddleLocation: "Tucked behind the Mithai Haven stall counter",
      surpriseContent: "A box of royal silver-leaf Kaju Katli with a note: 'You bring endless sweetness into Aalekh's life every single day.'",
    },
    {
      id: "gift-pol",
      name: "Elpro First Glance Polaroid",
      boxColor: "from-rose-600 to-pink-500",
      ribbonColor: "text-amber-300",
      riddleLocation: "Hidden beside the Elpro Mall photo booth",
      surpriseContent: "A golden polaroid snapshot frame capturing the exact moment you smiled at me for the first time on September 27th.",
    },
    {
      id: "gift-cup",
      name: "Phullaura Porcelain Cup Charm",
      boxColor: "from-emerald-600 to-teal-500",
      ribbonColor: "text-yellow-300",
      riddleLocation: "Resting on the wooden cafe balcony table",
      surpriseContent: "A miniature ceramic cup inscribed: 'Brewing warmth, silly laughs, and eternal love since October 4th.'",
    },
    {
      id: "gift-key",
      name: "Brass Key to Our Forever Home",
      boxColor: "from-purple-600 to-indigo-500",
      ribbonColor: "text-amber-400",
      riddleLocation: "Tied to the marigold garland at Our Future Home",
      surpriseContent: "A hand-carved golden brass key tag: 'To the girl who holds the keys to my heart, my dreams, and our future home.'",
    },
    {
      id: "gift-star",
      name: "Starlight Constellation Pendant",
      boxColor: "from-blue-600 to-cyan-500",
      ribbonColor: "text-rose-300",
      riddleLocation: "Reflected in the calm ripples of Starlight Lake",
      surpriseContent: "A glowing starlight pendant: 'Even if the entire sky ran out of stars, you would still be my brightest light.'",
    },
  ];

  const handleOpen = (gift: SecretGift) => {
    claimGift(gift.id);
    setOpenedGift(gift);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#F59E0B", "#EC4899", "#8B5CF6"],
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-2">
          <Gift className="w-3.5 h-3.5" />
          <span>Hidden Surprises for Sana</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Find the Hidden Gifts 🎁✨
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Discovered {foundGifts.length} of {secretGifts.length} festive gift boxes hidden across our little world.
        </p>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full mb-8">
        {secretGifts.map((gift) => {
          const isClaimed = foundGifts.includes(gift.id);
          return (
            <div
              key={gift.id}
              onClick={() => handleOpen(gift)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer group ${
                isClaimed
                  ? "bg-slate-900/80 border-amber-400/60 shadow-lg"
                  : "bg-slate-950/40 border-slate-800 hover:border-amber-400/40"
              }`}
            >
              {/* Gift Box Icon with animated ribbon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gift.boxColor} shadow-md flex items-center justify-center my-2 group-hover:scale-110 transition-transform ${
                  !isClaimed ? "animate-pulse" : ""
                }`}
              >
                <Gift className="w-7 h-7 text-white filter drop-shadow" />
              </div>

              <div className="text-xs font-bold text-amber-100 mb-1 leading-tight">
                {gift.name}
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isClaimed
                    ? "bg-emerald-500/20 text-emerald-300 flex items-center gap-1"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {isClaimed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Unwrapped
                  </>
                ) : (
                  "Tap to Unwrap"
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Opened Gift Reveal Box */}
      {openedGift && (
        <div className="w-full max-w-xl p-6 rounded-2xl bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-amber-950/50 border-2 border-amber-400/50 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unwrapped Keepsake</span>
          </div>
          <h4 className="text-xl font-serif font-bold text-white mb-2">
            {openedGift.name}
          </h4>
          <p className="text-sm sm:text-base text-amber-100/90 font-medium leading-relaxed italic mb-3">
            &ldquo;{openedGift.surpriseContent}&rdquo;
          </p>
          <div className="text-xs text-amber-300/70">
            Found: {openedGift.riddleLocation}
          </div>
        </div>
      )}
    </div>
  );
}
