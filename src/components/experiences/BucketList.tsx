"use client";

import React, { useState } from "react";
import { useWonderland } from "@/context/WonderlandContext";
import { Sparkles, CheckSquare, Square, Plus } from "lucide-react";
import confetti from "canvas-confetti";

export function BucketList() {
  const { bucketList, toggleBucketItem, addBucketItem } = useWonderland();
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"travel" | "tradition" | "daily" | "adventure">("adventure");
  const [filter, setFilter] = useState<string>("all");

  const handleToggle = (id: string, completed: boolean) => {
    toggleBucketItem(id);
    if (!completed) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#10B981", "#EC4899"],
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addBucketItem(newTitle.trim(), newCategory);
    setNewTitle("");
  };

  const filteredList =
    filter === "all" ? bucketList : bucketList.filter((item) => item.category === filter);

  const completedCount = bucketList.filter((i) => i.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto my-12 p-6 sm:p-10 rounded-3xl glass-diwali-card border-2 border-amber-500/40 shadow-2xl">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Adventures Together</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-1">
          Things I Want to Do With You ❤️
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/80">
          Completed {completedCount} of {bucketList.length} dreams
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
        {["all", "travel", "tradition", "daily", "adventure"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === cat
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-amber-500/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List items */}
      <div className="space-y-3 mb-8">
        {filteredList.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id, item.completed)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.completed
                  ? "bg-emerald-950/20 border-emerald-500/40 text-slate-300"
                  : "bg-slate-900/60 border-amber-500/20 text-white hover:border-amber-400/50"
              }`}
            >
              <button
                className="mt-0.5 text-amber-400 shrink-0"
                aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm sm:text-base font-medium ${
                      item.completed ? "line-through text-slate-400" : "text-amber-100"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-amber-500/20 text-amber-300 uppercase shrink-0">
                    {item.category}
                  </span>
                </div>
                {item.note && (
                  <p className="text-xs text-amber-200/70 mt-1 italic font-light">
                    &ldquo;{item.note}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row gap-2.5 items-center"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new dream to do together, Sana..."
          className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value as "travel" | "tradition" | "daily" | "adventure")}
          aria-label="Bucket list category"
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 shrink-0"
        >
          <option value="adventure">Adventure</option>
          <option value="travel">Travel</option>
          <option value="tradition">Tradition</option>
          <option value="daily">Daily Romance</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dream</span>
        </button>
      </form>
    </div>
  );
}

