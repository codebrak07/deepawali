"use client";

import React, { useEffect, useRef, useState } from "react";
import { LocalitySceneEngine, CameraViewMode } from "@/components/world3d/LocalityScene";
import { GameOverlayUI } from "@/components/ui/GameOverlayUI";
import { StationModals } from "@/components/ui/StationModals";
import { FinalSurpriseModal } from "@/components/surprise/FinalSurpriseModal";
import { useWonderland } from "@/context/WonderlandContext";
import { soundManager } from "@/components/audio/SoundManager";

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LocalitySceneEngine | null>(null);

  const { soundEnabled, toggleSound, showFinalSurprise, setShowFinalSurprise } = useWonderland();

  // Camera & Interaction states
  const [cameraMode, setCameraMode] = useState<CameraViewMode>("exploration");
  const [nearbyStation, setNearbyStation] = useState<string | null>(null);
  const [activeModalStation, setActiveModalStation] = useState<string | null>(null);

  // Initialize 3D Engine on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new LocalitySceneEngine(containerRef.current);
    engineRef.current = engine;

    engine.onProximityChange = (stationId) => {
      setNearbyStation(stationId);
    };

    engine.start();

    // Keyboard controls for WASD / Arrow Keys & 'E' for interaction
    const keysPressed = new Set<string>();

    const updateInputFromKeys = () => {
      let x = 0;
      let y = 0;
      if (keysPressed.has("KeyW") || keysPressed.has("ArrowUp")) y -= 1;
      if (keysPressed.has("KeyS") || keysPressed.has("ArrowDown")) y += 1;
      if (keysPressed.has("KeyA") || keysPressed.has("ArrowLeft")) x -= 1;
      if (keysPressed.has("KeyD") || keysPressed.has("ArrowRight")) x += 1;

      const len = Math.sqrt(x * x + y * y);
      if (len > 0) {
        engine.setInputVector(x / len, y / len);
      } else {
        engine.setInputVector(0, 0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.code);
      updateInputFromKeys();

      // [E] or Space to interact with nearby station
      if (e.code === "KeyE" && engine.nearbyStation) {
        setActiveModalStation(engine.nearbyStation);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.code);
      updateInputFromKeys();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Camera mode change
  const handleCameraModeChange = (mode: CameraViewMode) => {
    setCameraMode(mode);
    if (engineRef.current) {
      engineRef.current.setCameraMode(mode);
    }
  };

  // Joystick input from mobile touch
  const handleJoystickMove = (x: number, y: number) => {
    if (engineRef.current) {
      engineRef.current.setInputVector(x, y);
    }
  };

  // Fast travel teleport
  const handleTeleport = (x: number, z: number) => {
    if (engineRef.current) {
      engineRef.current.navigateTo(x, z);
    }
  };

  // Station Modal Actions
  const handleRangoliProgress = (progress: number) => {
    if (engineRef.current) {
      engineRef.current.rangoliProgress = progress;
    }
  };

  const handleLanternRelease = () => {
    if (engineRef.current) {
      engineRef.current.lanternRising = true;
      handleCameraModeChange("lanternsky");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060818]">
      {/* 3D WebGL Canvas Container (Occupies 100% of viewport) */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Game HUD Overlay */}
      <GameOverlayUI
        cameraMode={cameraMode}
        onCameraModeChange={handleCameraModeChange}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        nearbyStation={nearbyStation}
        onInteractStation={(stId) => setActiveModalStation(stId)}
        onTeleport={handleTeleport}
        onJoystickMove={handleJoystickMove}
        onOpenSurprise={() => setShowFinalSurprise(true)}
      />

      {/* Interactive Station Modals (Stations A, B, C) */}
      <StationModals
        stationId={activeModalStation}
        onClose={() => setActiveModalStation(null)}
        onRangoliProgressUpdate={handleRangoliProgress}
        onLanternReleaseTrigger={handleLanternRelease}
      />

      {/* Secret Final Surprise Modal */}
      {showFinalSurprise && <FinalSurpriseModal />}
    </div>
  );
}
