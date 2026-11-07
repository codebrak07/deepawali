"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  ArrowRight,
  Flame,
  Palette,
  Send,
  MapPin,
  Calendar,
  Mail,
  Home,
  Gamepad2,
} from "lucide-react";
import { INITIAL_TIMELINE, INITIAL_LETTERS, INITIAL_BUCKET_LIST, LoveLetter } from "@/data/defaultData";
import { soundManager } from "@/components/audio/SoundManager";

interface StorybookLandingProps {
  onEnterExploreMode: (stationId?: string) => void;
  onOpenSurprise: () => void;
}

export function StorybookLanding({ onEnterExploreMode, onOpenSurprise }: StorybookLandingProps) {
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [timelineIdx, setTimelineIdx] = useState(1); // Default to 26 Sep

  const activities = [
    {
      id: "station-a",
      name: "Light the Sacred Diyas",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      description: "Touch the terracotta lamps along Dattawadi Main Road to cast dynamic warm lights and reveal intimate relationship memories.",
      actionText: "Walk to Station A in 3D ➔",
    },
    {
      id: "station-b",
      name: "Draw the 3D Rangoli",
      icon: Palette,
      color: "from-rose-500 to-pink-600",
      description: "In Hanuman Mandir Chowk, press and hold to scatter authentic turmeric, vermilion, and peacock blue powders into a blooming street mandala.",
      actionText: "Walk to Station B in 3D ➔",
    },
    {
      id: "station-c",
      name: "Release the Akash Kandil",
      icon: Send,
      color: "from-blue-500 to-cyan-600",
      description: "Type your heartfelt Diwali wish and launch an illuminated star lantern into the midnight sky above Akurdi.",
      actionText: "Walk to Station C in 3D ➔",
    },
  ];

  const handleOpenLetterModal = (letter: LoveLetter) => {
    soundManager.playPaperRustle();
    setSelectedLetter(letter);
  };

  return (
    <div className="relative w-full text-slate-100 z-20 pointer-events-auto">
      {/* ======================================================== */}
      {/* SECTION 1: HERO VIEWPORT SPACER */}
      {/* ======================================================== */}
      <section className="min-h-screen w-full flex flex-col items-center justify-end pb-16 px-4 text-center pointer-events-auto">
        <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b0a2c]/85 border border-amber-400/40 text-amber-200 text-xs font-semibold mb-3 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive 3D Diwali Locality</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-rose-200 drop-shadow mb-3">
            A Diwali Wonderland For Sana ❤️
          </h2>

          <p className="text-sm sm:text-base text-amber-100/90 font-light mb-6 max-w-md italic">
            &ldquo;Every glowing light in our little neighbourhood was placed with you in mind.&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnterExploreMode()}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore Locality in 3D ✨</span>
            </button>
            <a
              href="#welcome"
              className="px-5 py-3.5 rounded-full bg-[#1b0a2c]/80 border border-slate-700 hover:border-amber-400/60 text-amber-200 text-xs font-semibold transition-all"
            >
              Read Our Story ➔
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: WELCOME TO YOUR LITTLE WORLD */}
      {/* ======================================================== */}
      <section
        id="welcome"
        className="py-24 px-4 sm:px-8 max-w-4xl mx-auto text-center"
      >
        <div className="p-8 sm:p-14 rounded-3xl bg-[#130722]/85 backdrop-blur-xl border-2 border-amber-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Editorial Preface</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 mb-6 leading-tight">
            A whole little world, with you at its centre.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed font-light max-w-2xl mx-auto">
            <p>
              Happy Diwali, my Jaanuuuu. I wanted to make something a little different this time — something that feels like you, something that holds our memories and all the love I have for you.
            </p>
            <p>
              Instead of an ordinary card, I built an explorable miniature version of your real neighbourhood in Dattawadi, Akurdi. Every building is bathed in warm festive lights, the streets are lined with glowing diyas, and around every corner lives a memory that belongs only to us.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: OUR LITTLE NEIGHBOURHOOD */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#130722]/85 backdrop-blur-xl border border-amber-500/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-amber-500/20">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geographical Foundation</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
                Our Little Neighbourhood: Dattawadi, Akurdi
              </h3>
            </div>
            <button
              onClick={() => onEnterExploreMode()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>Walk the 3D Streets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-sm font-bold text-amber-200 mb-1">Sai Hospital Landmark</h4>
              <p className="text-xs text-slate-300">
                Corner of Dattawadi Main Road and South Station Link, glowing with cyan architectural trims and festive balconies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-sm font-bold text-amber-200 mb-1">Hanuman Mandir Chowk</h4>
              <p className="text-xs text-slate-300">
                Northward lane leading to the open temple courtyard, illuminated with a golden shikhara and the 3D street Rangoli.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-sm font-bold text-amber-200 mb-1">Diwali Swagat Kaman</h4>
              <p className="text-xs text-slate-300">
                Ceremonial archway welcoming visitors with fresh marigold garlands, hanging lamps, and auspicious blessings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: LITTLE LIGHTS, BIG MEMORIES (DIWALI ACTIVITIES) */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Stations</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            Little Lights, Big Memories 🪔
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
            Three real interactive stations waiting for your touch in the 3D world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="group p-6 rounded-3xl bg-[#130722]/85 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${act.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-amber-100 mb-2">
                    {act.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light mb-6">
                    {act.description}
                  </p>
                </div>

                <button
                  onClick={() => onEnterExploreMode(act.id)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{act.actionText}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: OUR STORY (RELATIONSHIP TIMELINE) */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#130722]/85 backdrop-blur-xl border border-amber-500/30 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Real Relationship Milestones</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
              The Journey of Sana & Aalekh ❤️
            </h3>
          </div>

          {/* Stepper Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {INITIAL_TIMELINE.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setTimelineIdx(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  timelineIdx === idx
                    ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                    : "bg-slate-900 text-amber-200/80 border border-slate-700 hover:border-amber-400"
                }`}
              >
                {item.date}
              </button>
            ))}
          </div>

          {/* Active Milestone Display */}
          {INITIAL_TIMELINE[timelineIdx] && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
                <span>{INITIAL_TIMELINE[timelineIdx].location}</span>
                <span>{INITIAL_TIMELINE[timelineIdx].tag}</span>
              </div>
              <h4 className="text-xl font-serif font-bold text-white mb-2">
                {INITIAL_TIMELINE[timelineIdx].title}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-light mb-4">
                {INITIAL_TIMELINE[timelineIdx].detailedMemory}
              </p>

              {/* Real Chat Excerpts on 26 Sep */}
              {INITIAL_TIMELINE[timelineIdx].chatExcerpts && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  {INITIAL_TIMELINE[timelineIdx].chatExcerpts!.map((m, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span className="font-bold text-amber-300">{m.sender}:</span>
                      <span className="italic">&ldquo;{m.text}&rdquo;</span>
                      <span className="text-slate-500 font-mono">{m.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 6: LETTERS FOR YOU */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Written From My Soul</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
            Letters Written Just for You 💌
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
            Open whenever your heart needs a warm reminder of how deeply you are loved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INITIAL_LETTERS.slice(0, 6).map((letter) => (
            <div
              key={letter.id}
              onClick={() => handleOpenLetterModal(letter)}
              className="p-5 rounded-2xl bg-[#130722]/85 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1 block">
                  {letter.category}
                </span>
                <h4 className="text-base font-serif font-bold text-white mb-2">
                  {letter.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 italic font-light">
                  &ldquo;{letter.preview}&rdquo;
                </p>
              </div>
              <span className="text-xs text-amber-300 font-bold mt-4 flex items-center gap-1">
                <span>Read Letter</span>
                <span>➔</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 7: OUR LITTLE FUTURE */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#130722]/85 backdrop-blur-xl border border-amber-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            <Home className="w-3.5 h-3.5" />
            <span>Our Tomorrow</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mb-4">
            Our Dream Home & Bucket List 🏡
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-xl mx-auto mb-6">
            A home with a marigold toran on the doorway, a cozy living room for late movie dates, and a balcony under the stars where we sip warm chai together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {INITIAL_BUCKET_LIST.slice(0, 4).map((b) => (
              <span key={b.id} className="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-amber-200">
                ✓ {b.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 8: THE FINAL SURPRISE */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-8 max-w-3xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#260e38]/90 to-[#12071d]/95 border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Grand Finale</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-rose-300 mb-4">
            ONE LAST LITTLE SURPRISE ❤️
          </h3>
          <p className="text-sm sm:text-base text-amber-100/90 font-light max-w-md mx-auto mb-8">
            A personal Diwali love letter written from Aalekh to Shirjana, celebrating our first of countless Diwalis together.
          </p>
          <button
            onClick={onOpenSurprise}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-extrabold text-base tracking-wider shadow-[0_0_40px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            OPEN THE FINAL SURPRISE ✨
          </button>
        </div>
      </section>

      {/* Parchment Letter Reading Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#FAF5EB] text-[#291E13] p-6 sm:p-8 border-4 border-[#C2933C] shadow-2xl">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#EAD8B7] hover:bg-[#D4BE94] text-[#422C17]"
            >
              ✕
            </button>
            <div className="text-center mb-4 border-b border-[#EAD8B7] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A6B29]">
                {selectedLetter.category}
              </span>
              <h4 className="text-2xl font-serif font-bold text-[#3B2613] mt-1">
                {selectedLetter.title}
              </h4>
            </div>
            <div className="space-y-3 text-sm sm:text-base font-serif leading-relaxed text-[#3B2613]">
              {selectedLetter.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 pt-3 border-t border-[#EAD8B7] text-right font-serif font-bold text-[#422C17]">
              {selectedLetter.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

