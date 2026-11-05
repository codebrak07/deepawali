"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  INITIAL_TIMELINE,
  INITIAL_LETTERS,
  INITIAL_BUCKET_LIST,
  INITIAL_REASON_FLOWERS,
  MemoryMilestone,
  LoveLetter,
  BucketListItem,
  ReasonFlower,
} from "@/data/defaultData";
import { soundManager } from "@/components/audio/SoundManager";

interface WishItem {
  id: string;
  text: string;
  date: string;
}

interface WonderlandContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasEntered: boolean;
  setHasEntered: (val: boolean) => void;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (val: boolean) => void;

  // Audio
  soundEnabled: boolean;
  toggleSound: () => void;

  // Locality & Character
  characterPos: { x: number; y: number };
  setCharacterPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  characterDir: "left" | "right" | "up" | "down";
  setCharacterDir: (dir: "left" | "right" | "up" | "down") => void;
  characterSpeech: string | null;
  setCharacterSpeech: (text: string | null) => void;
  isWalking: boolean;
  setIsWalking: (walking: boolean) => void;
  visitedLocations: string[];
  visitLocation: (id: string) => void;
  moveToLocation: (x: number, y: number, name: string) => void;

  // Diyas & Activities
  litDiyas: number[];
  lightDiya: (index: number) => void;
  lightAllDiyasDemo: () => void;
  totalLitDiyasCount: number;

  // Timeline & Letters
  timeline: MemoryMilestone[];
  letters: LoveLetter[];
  readLetters: string[];
  markLetterRead: (id: string) => void;
  updateLetter: (id: string, newLetter: Partial<LoveLetter>) => void;

  // Bucket list
  bucketList: BucketListItem[];
  toggleBucketItem: (id: string) => void;
  addBucketItem: (title: string, category: BucketListItem["category"]) => void;

  // Reasons garden
  bloomedFlowers: number[];
  bloomFlower: (id: number) => void;
  flowers: ReasonFlower[];

  // Lanterns & Wishes
  wishes: WishItem[];
  addWish: (text: string) => void;

  // Treasure Hunt & Secret Gifts
  treasureCluesSolved: number;
  solveTreasureClue: () => void;
  foundGifts: string[];
  claimGift: (giftId: string) => void;

  // Final Surprise
  finalSurpriseUnlocked: boolean;
  showFinalSurprise: boolean;
  setShowFinalSurprise: (val: boolean) => void;
  progressPercent: number;
}

const WonderlandContext = createContext<WonderlandContextType | undefined>(undefined);

const STORAGE_KEY = "aalekh_sana_diwali_v1";

export function WonderlandProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Character
  const [characterPos, setCharacterPos] = useState<{ x: number; y: number }>({ x: 50, y: 55 });
  const [characterDir, setCharacterDir] = useState<"left" | "right" | "up" | "down">("down");
  const [characterSpeech, setCharacterSpeech] = useState<string | null>("Happy Diwali Sana! Let's explore ❤️");
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [visitedLocations, setVisitedLocations] = useState<string[]>([]);

  // Diyas & Unlocks
  const [litDiyas, setLitDiyas] = useState<number[]>([0, 1, 2]); // Initial warm glow
  const [timeline] = useState<MemoryMilestone[]>(INITIAL_TIMELINE);
  const [letters, setLetters] = useState<LoveLetter[]>(INITIAL_LETTERS);
  const [readLetters, setReadLetters] = useState<string[]>([]);
  const [bucketList, setBucketList] = useState<BucketListItem[]>(INITIAL_BUCKET_LIST);
  const [bloomedFlowers, setBloomedFlowers] = useState<number[]>([1]);
  const [flowers] = useState<ReasonFlower[]>(INITIAL_REASON_FLOWERS);
  const [wishes, setWishes] = useState<WishItem[]>([
    { id: "w-0", text: "May Aalekh & Sana celebrate every Diwali together forever ❤️🪔", date: "2026-11-06" },
  ]);
  const [treasureCluesSolved, setTreasureCluesSolved] = useState<number>(0);
  const [foundGifts, setFoundGifts] = useState<string[]>([]);
  const [showFinalSurprise, setShowFinalSurprise] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.visitedLocations) setVisitedLocations(data.visitedLocations);
        if (data.litDiyas) setLitDiyas(data.litDiyas);
        if (data.readLetters) setReadLetters(data.readLetters);
        if (data.bucketList) setBucketList(data.bucketList);
        if (data.bloomedFlowers) setBloomedFlowers(data.bloomedFlowers);
        if (data.wishes) setWishes(data.wishes);
        if (data.treasureCluesSolved) setTreasureCluesSolved(data.treasureCluesSolved);
        if (data.foundGifts) setFoundGifts(data.foundGifts);
        if (data.letters) setLetters(data.letters);
      }
    } catch {
      // LocalStorage error fallback
    }
  }, []);

  // Save on state change
  useEffect(() => {
    try {
      const data = {
        visitedLocations,
        litDiyas,
        readLetters,
        bucketList,
        bloomedFlowers,
        wishes,
        treasureCluesSolved,
        foundGifts,
        letters,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore write errors
    }
  }, [visitedLocations, litDiyas, readLetters, bucketList, bloomedFlowers, wishes, treasureCluesSolved, foundGifts, letters]);

  const toggleSound = () => {
    const isNowOn = soundManager.toggleMute();
    setSoundEnabled(isNowOn);
  };

  const visitLocation = (id: string) => {
    soundManager.playDiyaChime();
    setVisitedLocations((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const moveToLocation = (targetX: number, targetY: number, name: string) => {
    setIsWalking(true);
    soundManager.playFootstep();

    // Direction calculation
    if (Math.abs(targetX - characterPos.x) > Math.abs(targetY - characterPos.y)) {
      setCharacterDir(targetX > characterPos.x ? "right" : "left");
    } else {
      setCharacterDir(targetY > characterPos.y ? "down" : "up");
    }

    setCharacterPos({ x: targetX, y: targetY });
    setCharacterSpeech(`Arrived at ${name}! ✨`);

    setTimeout(() => {
      setIsWalking(false);
    }, 600);
  };

  const lightDiya = (index: number) => {
    soundManager.playDiyaChime();
    setLitDiyas((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const lightAllDiyasDemo = () => {
    soundManager.playDiyaChime();
    const all = Array.from({ length: 15 }, (_, i) => i);
    setLitDiyas(all);
  };

  const markLetterRead = (id: string) => {
    soundManager.playPaperRustle();
    setReadLetters((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const updateLetter = (id: string, updatedFields: Partial<LoveLetter>) => {
    setLetters((prev) =>
      prev.map((letItem) => (letItem.id === id ? { ...letItem, ...updatedFields } : letItem))
    );
  };

  const toggleBucketItem = (id: string) => {
    soundManager.playDiyaChime();
    setBucketList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const addBucketItem = (title: string, category: BucketListItem["category"]) => {
    const newItem: BucketListItem = {
      id: `custom-${Date.now()}`,
      title,
      category,
      completed: false,
      note: "Added with love for Sana & Aalekh",
    };
    setBucketList((prev) => [newItem, ...prev]);
  };

  const bloomFlower = (id: number) => {
    soundManager.playDiyaChime();
    setBloomedFlowers((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const addWish = (text: string) => {
    soundManager.playLanternFloat();
    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      text,
      date: new Date().toISOString().split("T")[0],
    };
    setWishes((prev) => [newWish, ...prev]);
  };

  const solveTreasureClue = () => {
    soundManager.playDiyaChime();
    setTreasureCluesSolved((prev) => Math.min(prev + 1, 5));
  };

  const claimGift = (giftId: string) => {
    soundManager.playDiyaChime();
    setFoundGifts((prev) => (prev.includes(giftId) ? prev : [...prev, giftId]));
  };

  // Conditions for unlocking final surprise:
  // - Lit at least 7 diyas
  // - Visited at least 4 locations
  // - Solved at least 2 treasure clues or read 3 letters
  const diyasCondition = litDiyas.length >= 7;
  const visitCondition = visitedLocations.length >= 4;
  const deepCondition = readLetters.length >= 2 || treasureCluesSolved >= 2;
  const finalSurpriseUnlocked = diyasCondition && visitCondition && deepCondition;

  // Calculate progress percentage
  const diyasScore = Math.min(litDiyas.length / 10, 1) * 35;
  const visitScore = Math.min(visitedLocations.length / 6, 1) * 35;
  const engagementScore = Math.min((readLetters.length + treasureCluesSolved + foundGifts.length) / 5, 1) * 30;
  const progressPercent = Math.min(Math.round(diyasScore + visitScore + engagementScore), 100);

  return (
    <WonderlandContext.Provider
      value={{
        activeTab,
        setActiveTab,
        hasEntered,
        setHasEntered,
        showWelcomeModal,
        setShowWelcomeModal,
        soundEnabled,
        toggleSound,
        characterPos,
        setCharacterPos,
        characterDir,
        setCharacterDir,
        characterSpeech,
        setCharacterSpeech,
        isWalking,
        setIsWalking,
        visitedLocations,
        visitLocation,
        moveToLocation,
        litDiyas,
        lightDiya,
        lightAllDiyasDemo,
        totalLitDiyasCount: litDiyas.length,
        timeline,
        letters,
        readLetters,
        markLetterRead,
        updateLetter,
        bucketList,
        toggleBucketItem,
        addBucketItem,
        bloomedFlowers,
        bloomFlower,
        flowers,
        wishes,
        addWish,
        treasureCluesSolved,
        solveTreasureClue,
        foundGifts,
        claimGift,
        finalSurpriseUnlocked,
        showFinalSurprise,
        setShowFinalSurprise,
        progressPercent,
      }}
    >
      {children}
    </WonderlandContext.Provider>
  );
}

export function useWonderland() {
  const ctx = useContext(WonderlandContext);
  if (!ctx) {
    throw new Error("useWonderland must be used within a WonderlandProvider");
  }
  return ctx;
}

