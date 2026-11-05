"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Compass, CheckCircle2, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface QuestClue {
  step: number;
  riddle: string;
  hint: string;
  targetAnswer: string;
  revealedKeepsake: string;
  romanticMessage: string;
}

export function TreasureHunt() {
  const { treasureCluesSolved, solveTreasureClue } = useWonderland();
  const [userGuess, setUserGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const clues: QuestClue[] = [
    {
      step: 1,
      riddle: "Where did our conversations first cross the screen to the real world on September 27th?",
      hint: "A buzzing mall where your radiant smile first met Aalekh's eyes.",
      targetAnswer: "elpro",
      revealedKeepsake: "First Meeting Compass 🧭",
      romanticMessage: "You walked through Elpro Mall and everything else disappeared. That smile was the beginning of forever.",
    },
    {
      step: 2,
      riddle: "On October 4th, in dim lights and quiet whispers, which cinema hall witnessed our hands finding each other and our very first kiss?",
      hint: "Popcorn, dark theater seats, and hearts beating at 180 bpm.",
      targetAnswer: "inox",
      revealedKeepsake: "Golden Cinema Ticket 🎟️",
      romanticMessage: "Our first kiss at INOX. I still get butterflies thinking about how perfect that second felt.",
    },
    {
      step: 3,
      riddle: "Which cozy cafe did we sneak off to right after that movie date, unable to stop smiling over warm coffee?",
      hint: "Warm brews, latte hearts, and that blissful autumn evening.",
      targetAnswer: "phullaura",
      revealedKeepsake: "Cinnamon Latte Charm ☕",
      romanticMessage: "Sitting across from you at Phullaura Cafe, admiring how your laughter sounded so melodic.",
    },
    {
      step: 4,
      riddle: "Which sunset hilltop viewpoint did we sit at on October 18th, feeling the cool breeze with the entire city below us?",
      hint: "High above Pune, breathing the fresh air shoulder-to-shoulder.",
      targetAnswer: "durga",
      revealedKeepsake: "Summit Twilight Crystal 🌄",
      romanticMessage: "Looking out over the world from Durga Tekdi, knowing with complete peace that my heart belongs to you.",
    },
  ];

  const currentClue = clues[treasureCluesSolved] || null;
  const isQuestComplete = treasureCluesSolved >= clues.length;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClue || !userGuess.trim()) return;

    const normalized = userGuess.trim().toLowerCase();
    if (normalized.includes(currentClue.targetAnswer)) {
      setFeedback("Correct! You unlocked a memory treasure! ✨");
      solveTreasureClue();
      setUserGuess("");

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#10B981", "#EC4899"],
      });
    } else {
      setFeedback("Almost! Think about our special places: " + currentClue.hint);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Memory Quest</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          The Wonderland Treasure Hunt 🗺️💎
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Solve the romantic riddles based on our real dates and milestones to discover Aalekh&apos;s hidden keepsakes.
        </p>

        {/* Quest Progress */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {clues.map((c, i) => (
            <div
              key={c.step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                i < treasureCluesSolved
                  ? "bg-emerald-500 text-slate-950 border-emerald-300"
                  : i === treasureCluesSolved
                  ? "bg-amber-500 text-slate-950 border-amber-300 animate-pulse"
                  : "bg-slate-900 text-slate-500 border-slate-700"
              }`}
            >
              {i < treasureCluesSolved ? "✓" : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Active Clue or Quest Completed */}
      {!isQuestComplete && currentClue ? (
        <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs text-amber-400 font-bold">
            <span>CLUE #{currentClue.step} OF {clues.length}</span>
            <span>Keepsake Reward: {currentClue.revealedKeepsake}</span>
          </div>

          <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-3">
            {currentClue.riddle}
          </h4>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-amber-200/70 mb-5 italic">
            Hint: {currentClue.hint}
          </div>

          <form onSubmit={handleVerify} className="flex gap-2">
            <input
              type="text"
              value={userGuess}
              onChange={(e) => {
                setUserGuess(e.target.value);
                setFeedback(null);
              }}
              placeholder="Type landmark or place name..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Solve Clue ✨
            </button>
          </form>

          {feedback && (
            <p
              className={`text-xs mt-3 font-semibold ${
                feedback.includes("Correct") ? "text-emerald-400" : "text-amber-300"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-xl p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-emerald-950/30 to-amber-950/40 border-2 border-emerald-500/40 text-center animate-fadeIn">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" />
          <h4 className="text-2xl font-serif font-bold text-amber-100 mb-2">
            Treasure Hunt Mastered! 🏆
          </h4>
          <p className="text-sm text-amber-200/90 leading-relaxed mb-4">
            You solved every memory riddle with flying colors! Every place we&apos;ve walked together is precious, but the greatest treasure Aalekh will ever have is your heart, Shirjana.
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>All Keepsakes Collected & Unlocked</span>
          </div>
        </div>
      )}

      {/* Discovered Keepsakes Carousel / Badges */}
      <div className="w-full max-w-xl mt-8">
        <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/80 mb-3 text-center">
          Unlocked Memory Treasures ({treasureCluesSolved})
        </h5>
        <div className="grid grid-cols-2 gap-2.5">
          {clues.map((c, i) => {
            const isUnlocked = i < treasureCluesSolved;
            return (
              <div
                key={c.step}
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isUnlocked
                    ? "bg-slate-900/80 border-amber-400/50 text-amber-100"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}
              >
                <span className="text-base">{isUnlocked ? "💎" : "🔒"}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate">
                    {isUnlocked ? c.revealedKeepsake : `Locked Treasure #${c.step}`}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isUnlocked ? "Discovered" : "Solve riddle to unlock"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

