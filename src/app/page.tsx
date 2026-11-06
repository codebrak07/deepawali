"use client";

import React, { useEffect, useRef, useState } from "react";
import { LocalitySceneEngine, CameraViewMode } from "@/components/world3d/LocalityScene";
import { GameOverlayUI } from "@/components/ui/GameOverlayUI";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { StorybookLanding } from "@/components/story/StorybookLanding";
import { StationModals } from "@/components/ui/StationModals";
import { FinalSurpriseModal } from "@/components/surprise/FinalSurpriseModal";
import { useWonderland } from "@/context/WonderlandContext";
import { soundManager } from "@/components/audio/SoundManager";

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LocalitySceneEngine | null>(null);

  const { soundEnabled, toggleSound, showFinalSurprise, setShowFinalSurprise } = useWonderland();

  // App & Experience State
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);
  const [isExploreMode, setIsExploreMode] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>("exploration");
  const [nearbyStation, setNearbyStation] = useState<string | null>(null);
  const [activeModalStation, setActiveModalStation] = useState<string | null>(null);

  // Live Minimap & Spatial State
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number }>({ x: 0, z: 4 });
  const [playerHeading, setPlayerHeading] = useState<number>(0);
  const [waypoint, setWaypoint] = useState<{ x: number; z: number } | null>(null);
  const [isInsideBuilding, setIsInsideBuilding] = useState<boolean>(false);
  const [isInsideTemple, setIsInsideTemple] = useState<boolean>(false);
  const [isInsideHanuman, setIsInsideHanuman] = useState<boolean>(false);
  const [isSitting, setIsSitting] = useState<boolean>(false);
  const [isWatchingTV, setIsWatchingTV] = useState<boolean>(false);
  const [tvChannelName, setTvChannelName] = useState<string>("Diwali Live");
  const [isHoldingHands, setIsHoldingHands] = useState<boolean>(true);

  // Initialize 3D Engine on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new LocalitySceneEngine(containerRef.current);
    engineRef.current = engine;

    engine.onProximityChange = (stationId) => {
      setNearbyStation(stationId);
    };

    engine.onPlayerTransformChange = (pos, heading) => {
      setPlayerPos(pos);
      setPlayerHeading(heading);
      setIsInsideBuilding(engine.isInsideBuilding);
      setIsInsideTemple(engine.isInsideTemple);
      setIsInsideHanuman(engine.isInsideHanuman);
      setIsSitting(engine.isSitting);
      setIsWatchingTV(engine.isWatchingTV);
      setIsHoldingHands(engine.isHoldingHands);
      setTvChannelName(engine.interiorSuite.getTVChannelName());
    };

    engine.onWaypointChange = (wp) => {
      setWaypoint(wp);
    };

    engine.start();

    // Keyboard controls for WASD / Arrow Keys & [E] for interaction
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

      // Contextual interaction key
      if ((e.code === "KeyE" || e.code === "Space") && engine.nearbyStation) {
        if (engine.nearbyStation === "station-enter-home") {
          engine.enterBuilding();
          setIsInsideBuilding(true);
        } else if (engine.nearbyStation === "station-exit-home") {
          engine.exitBuilding();
          setIsInsideBuilding(false);
        } else if (engine.nearbyStation === "station-enter-temple") {
          engine.enterTemple();
          setIsInsideTemple(true);
        } else if (engine.nearbyStation === "station-exit-temple") {
          engine.exitTemple();
          setIsInsideTemple(false);
        } else if (engine.nearbyStation === "station-enter-hanuman") {
          engine.enterHanuman();
          setIsInsideHanuman(true);
        } else if (engine.nearbyStation === "station-exit-hanuman") {
          engine.exitHanuman();
          setIsInsideHanuman(false);
        } else if (engine.nearbyStation === "station-temple-pray") {
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-temple-bell") {
          engine.ringTempleBell();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-temple-flowers") {
          engine.offerTempleFlowers();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-temple-bilva") {
          engine.offerTempleBilvaLeaves();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-temple-abhishek") {
          engine.performAbhishek();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-hanuman-pray") {
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-hanuman-bell") {
          engine.ringHanumanBell();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-hanuman-flowers") {
          engine.offerHanumanFlowers();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-hanuman-prasad") {
          engine.offerHanumanPrasad();
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-home-sofa") {
          engine.sitDown("seat-sofa-center");
        } else if (engine.nearbyStation === "station-home-tv") {
          engine.watchTV();
        } else if (engine.nearbyStation === "station-home-bed") {
          engine.sitDown("seat-bed");
        } else if (engine.nearbyStation === "station-home-puja") {
          soundManager.playDiyaChime();
        } else if (engine.nearbyStation === "station-home-lamps") {
          engine.toggleHomeLamps();
        } else if (engine.nearbyStation === "station-surprise") {
          setShowFinalSurprise(true);
        } else {
          setActiveModalStation(engine.nearbyStation);
        }
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
  }, [setShowFinalSurprise]);

  // Handle switching between Story Mode and Explore 3D Mode
  const handleToggleMode = () => {
    const nextExplore = !isExploreMode;
    setIsExploreMode(nextExplore);

    if (engineRef.current) {
      if (nextExplore) {
        engineRef.current.setCameraMode(cameraMode);
      } else {
        engineRef.current.setCameraMode("story");
      }
    }
  };

  const handleEnterExploreMode = (stationId?: string) => {
    setIsExploreMode(true);
    if (engineRef.current) {
      engineRef.current.setCameraMode(cameraMode);
      if (stationId === "station-a") engineRef.current.navigateTo(0, 8);
      else if (stationId === "station-b") engineRef.current.navigateTo(0, -24);
      else if (stationId === "station-c") engineRef.current.navigateTo(30, 0);
    }
  };

  const handleCameraModeChange = (mode: CameraViewMode) => {
    setCameraMode(mode);
    if (engineRef.current) {
      engineRef.current.setCameraMode(mode);
    }
  };

  const handleJoystickMove = (x: number, y: number) => {
    if (engineRef.current) {
      engineRef.current.setInputVector(x, y);
    }
  };

  const handleLookJoystickMove = (x: number, y: number) => {
    if (engineRef.current) {
      engineRef.current.setLookVector(x, y);
    }
  };

  const handleResetCamera = () => {
    if (engineRef.current) {
      engineRef.current.resetCamera();
    }
  };

  const handleZoomIn = () => {
    if (engineRef.current) {
      engineRef.current.adjustZoom(-2.5);
    }
  };

  const handleZoomOut = () => {
    if (engineRef.current) {
      engineRef.current.adjustZoom(2.5);
    }
  };

  const handleTeleport = (x: number, z: number) => {
    if (engineRef.current) {
      engineRef.current.navigateTo(x, z);
    }
  };

  const handleInteractStation = (stId: string) => {
    if (stId === "station-enter-home") {
      engineRef.current?.enterBuilding();
      setIsInsideBuilding(true);
      return;
    }
    if (stId === "station-exit-home") {
      engineRef.current?.exitBuilding();
      setIsInsideBuilding(false);
      setNearbyStation(null);
      return;
    }
    if (stId === "station-enter-temple") {
      engineRef.current?.enterTemple();
      setIsInsideTemple(true);
      setNearbyStation(null);
      return;
    }
    if (stId === "station-exit-temple") {
      engineRef.current?.exitTemple();
      setIsInsideTemple(false);
      setNearbyStation(null);
      return;
    }
    if (stId === "station-enter-hanuman") {
      engineRef.current?.enterHanuman();
      setIsInsideHanuman(true);
      setNearbyStation(null);
      return;
    }
    if (stId === "station-exit-hanuman") {
      engineRef.current?.exitHanuman();
      setIsInsideHanuman(false);
      setNearbyStation(null);
      return;
    }
    if (stId === "station-temple-pray") {
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-temple-bell") {
      engineRef.current?.ringTempleBell();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-temple-flowers") {
      engineRef.current?.offerTempleFlowers();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-temple-bilva") {
      engineRef.current?.offerTempleBilvaLeaves();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-temple-abhishek") {
      engineRef.current?.performAbhishek();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-hanuman-pray") {
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-hanuman-bell") {
      engineRef.current?.ringHanumanBell();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-hanuman-flowers") {
      engineRef.current?.offerHanumanFlowers();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-hanuman-prasad") {
      engineRef.current?.offerHanumanPrasad();
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-home-sofa") {
      engineRef.current?.sitDown("seat-sofa-center");
      return;
    }
    if (stId === "station-home-tv") {
      engineRef.current?.watchTV();
      return;
    }
    if (stId === "station-home-bed") {
      engineRef.current?.sitDown("seat-bed");
      return;
    }
    if (stId === "station-home-puja") {
      soundManager.playDiyaChime();
      return;
    }
    if (stId === "station-home-lamps") {
      engineRef.current?.toggleHomeLamps();
      return;
    }
    if (stId === "station-surprise") {
      setShowFinalSurprise(true);
    } else {
      setActiveModalStation(stId);
    }
  };

  const handleSetWaypoint = (wp: { x: number; z: number } | null) => {
    setWaypoint(wp);
    if (engineRef.current) {
      if (wp) {
        engineRef.current.setWaypoint(wp.x, wp.z);
      } else {
        engineRef.current.setWaypoint(null);
      }
    }
  };

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
    <div
      className={`relative w-screen min-h-screen bg-[#07091a] text-slate-100 ${
        isExploreMode ? "overflow-hidden h-screen" : "overflow-x-hidden overflow-y-auto"
      }`}
    >
      {/* 3D WebGL Canvas Container (Fixed Full-Viewport Backdrop) */}
      <div
        ref={containerRef}
        className="fixed inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0 }}
      />

      {/* Cinematic Intro Sequence (0-8s for Sana) */}
      {!hasSeenIntro && (
        <CinematicIntro
          onEnter={() => {
            setHasSeenIntro(true);
            setIsExploreMode(false); // Opens into storybook landing
            if (engineRef.current) engineRef.current.setCameraMode("story");
          }}
        />
      )}

      {/* Persistent Game HUD Controls */}
      {hasSeenIntro && (
        <GameOverlayUI
          cameraMode={cameraMode}
          onCameraModeChange={handleCameraModeChange}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          nearbyStation={nearbyStation}
          onInteractStation={handleInteractStation}
          onTeleport={handleTeleport}
          onJoystickMove={handleJoystickMove}
          onLookJoystickMove={handleLookJoystickMove}
          onResetCamera={handleResetCamera}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onOpenSurprise={() => setShowFinalSurprise(true)}
          isExploreMode={isExploreMode}
          onToggleMode={handleToggleMode}
          playerPos={playerPos}
          playerHeading={playerHeading}
          waypoint={waypoint}
          onSetWaypoint={handleSetWaypoint}
          isInsideBuilding={isInsideBuilding}
          isInsideTemple={isInsideTemple}
          isInsideHanuman={isInsideHanuman}
          isSitting={isSitting}
          isWatchingTV={isWatchingTV}
          tvChannelName={tvChannelName}
          onSitDown={(anchor) => engineRef.current?.sitDown(anchor)}
          onStandUp={() => engineRef.current?.standUp()}
          onWatchTV={() => engineRef.current?.watchTV()}
          onStopWatchingTV={() => engineRef.current?.stopWatchingTV()}
          onNextTVChannel={() => engineRef.current?.nextTVChannel()}
          onToggleLamps={() => engineRef.current?.toggleHomeLamps()}
          isHoldingHands={isHoldingHands}
          onToggleHoldingHands={() => {
            if (engineRef.current) {
              const val = engineRef.current.toggleHoldingHands();
              setIsHoldingHands(val);
            }
          }}
        />
      )}

      {/* Story Mode: Full Editorial Scrollable Website */}
      {hasSeenIntro && !isExploreMode && (
        <StorybookLanding
          onEnterExploreMode={handleEnterExploreMode}
          onOpenSurprise={() => setShowFinalSurprise(true)}
        />
      )}

      {/* Interactive Station Modals (Stations A, B, C) */}
      {activeModalStation && (
        <StationModals
          stationId={activeModalStation}
          onClose={() => setActiveModalStation(null)}
          onRangoliProgressUpdate={handleRangoliProgress}
          onLanternReleaseTrigger={handleLanternRelease}
        />
      )}

      {/* Secret Final Surprise Modal */}
      {showFinalSurprise && <FinalSurpriseModal />}
    </div>
  );
}
