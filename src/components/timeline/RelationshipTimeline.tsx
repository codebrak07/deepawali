"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { MemoryMilestone } from "@/data/defaultData";
import { GlowingDiya } from "@/components/ui/GlowingDiya";
import { Sparkles, Calendar, Heart, MapPin, MessageSquareHeart, Check } from "lucide-react";

export function RelationshipTimeline() {
  const { timeline } = useWonderland();
  const [selectedMilestone, setSelectedMilestone] = useState<MemoryMilestone>(timeline[1]); // default to 26 Sep
  const [unlockedIds, setUnlockedIds] = useState<string[]>(["mem-1", "mem-2", "mem-3", "mem-4", "mem-5", "mem-6"]);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] pt-20 pb-20 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Unforgettable Milestones</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-2">
          The Journey of Sana & Aalekh ❤️
        </h2>
        <p className="text-sm text-amber-200/80">
          Every milestone represented by a glowing festive diya. Click any diya to relive that cherished memory.
        </p>
      </div>

      {/* Interactive Diya Stepper across top */}
      <div className="w-full overflow-x-auto pb-4 mb-8 no-scrollbar">
        <div className="flex items-center justify-between min-w-[700px] relative px-6">
          {/* Connecting Golden Line */}
          <div className="absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 opacity-50 z-0" />

          {timeline.map((item, idx) => {
            const isSelected = selectedMilestone?.id === item.id;
            const isUnlocked = unlockedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMilestone(item)}
                className="relative z-10 flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <GlowingDiya
                  size={isSelected ? "lg" : "md"}
                  isLit={isUnlocked}
                  className={isSelected ? "scale-110" : "opacity-85"}
                />
                <span
                  className={`mt-2 text-xs font-bold whitespace-nowrap px-2.5 py-0.5 rounded-full border transition-all ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30"
                      : "bg-slate-900/80 text-amber-200/80 border-amber-500/30 group-hover:border-amber-400"
                  }`}
                >
                  {item.date}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 max-w-[100px] text-center truncate">
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Card */}
      {selectedMilestone && (
        <div className="w-full max-w-3xl glass-diwali-card rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedMilestone.date}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedMilestone.location}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-serif font-bold text-amber-100">
                {selectedMilestone.title}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{selectedMilestone.tag}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="text-base text-amber-200/90 font-medium mb-5 italic border-l-2 border-amber-400 pl-4 py-1">
            &ldquo;{selectedMilestone.summary}&rdquo;
          </div>

          {/* Detailed Story Narrative */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-4 mb-6 font-light">
            <p>{selectedMilestone.detailedMemory}</p>
          </div>

          {/* Authentic Real Chat Excerpts (e.g. 26 Sep Official Confession) */}
          {selectedMilestone.chatExcerpts && (
            <div className="rounded-2xl bg-slate-950/80 border border-amber-500/30 p-5 mt-6 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-4">
                <MessageSquareHeart className="w-4 h-4 text-amber-400" />
                <span>Actual DM Exchanges That Night</span>
              </div>
              <div className="space-y-3">
                {selectedMilestone.chatExcerpts.map((msg, i) => {
                  const isAalekh = msg.sender === "Aalekh";
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isAalekh ? "items-end" : "items-start"}`}
                    >
                      <div className="text-[10px] text-slate-400 px-1 mb-0.5">
                        {msg.sender} • {msg.time}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm max-w-[85%] font-medium ${
                          isAalekh
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-tr-none shadow-md"
                            : "bg-slate-800 text-amber-100 rounded-tl-none border border-slate-700"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Footnote */}
          <div className="mt-8 pt-4 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-300/70">
            <span>Milestone Preserved with Pure Authenticity</span>
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Check className="w-4 h-4" />
              Locked Forever in Aalekh&apos;s Heart
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
