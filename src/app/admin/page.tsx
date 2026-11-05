"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import {
  Sparkles,
  Lock,
  Unlock,
  Save,
  Trash2,
  Plus,
  ArrowLeft,
  Mail,
  Clock,
  Heart,
  Database,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const {
    letters,
    updateLetter,
    timeline,
    bucketList,
    addBucketItem,
    toggleBucketItem,
    wishes,
    lightAllDiyasDemo,
  } = useWonderland();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"letters" | "memories" | "bucket" | "wishes">("letters");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Default passcode for Aalekh: "sana2026" or "aalekh"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "sana2026" || passcode.trim() === "aalekh" || passcode.trim() === "diwali") {
      setIsAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg("Incorrect passcode. Only Aalekh can access this dashboard.");
    }
  };

  const handleLetterUpdate = (id: string, field: "title" | "content", value: string) => {
    if (field === "title") {
      updateLetter(id, { title: value });
    } else {
      updateLetter(id, { content: value.split("\n\n") });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#050714] text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/20">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Diwali Wonderland</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Firebase & Local Storage Active</span>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-diwali-card border-2 border-amber-500/40 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-amber-100 mb-2">
              Aalekh&apos;s Secret Console 🪔
            </h2>
            <p className="text-xs text-amber-200/70 mb-6">
              Enter Aalekh&apos;s passcode to manage love letters, memories, and wishes.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Enter passcode (hint: sana2026)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Protected Admin Dashboard */
          <div>
            {/* Dashboard Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 flex items-center gap-2">
                  <Unlock className="w-6 h-6 text-amber-400" />
                  <span>Aalekh&apos;s Management Console</span>
                </h2>
                <p className="text-xs text-amber-200/70">
                  Update love letters, monitor Sana&apos;s wishes, and manage bucket list items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={lightAllDiyasDemo}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  Force Light All Diyas ✨
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-400 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Changes saved successfully to storage!</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3 mb-6">
              {[
                { id: "letters", label: "Manage Letters", icon: Mail },
                { id: "memories", label: "View Memories", icon: Clock },
                { id: "bucket", label: "Bucket List", icon: Sparkles },
                { id: "wishes", label: "Sana's Wishes", icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "bg-slate-900/60 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Letters Editor Tab */}
            {activeTab === "letters" && (
              <div className="space-y-6">
                {letters.map((letItem) => (
                  <div
                    key={letItem.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-amber-400 uppercase">
                        {letItem.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {letItem.id}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Letter Title</label>
                        <input
                          type="text"
                          value={letItem.title}
                          onChange={(e) => handleLetterUpdate(letItem.id, "title", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">
                          Letter Content (Paragraphs separated by blank lines)
                        </label>
                        <textarea
                          rows={4}
                          value={letItem.content.join("\n\n")}
                          onChange={(e) => handleLetterUpdate(letItem.id, "content", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-serif leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Memories Tab */}
            {activeTab === "memories" && (
              <div className="space-y-4">
                {timeline.map((mem) => (
                  <div key={mem.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                      <span>{mem.date} • {mem.location}</span>
                      <span className="text-slate-400">{mem.tag}</span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-white mb-1">{mem.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{mem.detailedMemory}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Bucket List Tab */}
            {activeTab === "bucket" && (
              <div className="space-y-3">
                {bucketList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.note}</div>
                    </div>
                    <button
                      onClick={() => toggleBucketItem(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                        item.completed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.completed ? "Completed ✓" : "Pending"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Wishes Tab */}
            {activeTab === "wishes" && (
              <div className="space-y-3">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20"
                  >
                    <p className="text-sm font-serif italic text-amber-100">&ldquo;{w.text}&rdquo;</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Submitted on {w.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
