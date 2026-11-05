"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  label?: string;
  subLabel?: string;
  accent?: "amber" | "cyan" | "rose";
  className?: string;
}

export function VirtualJoystick({
  onMove,
  label = "MOVE",
  subLabel,
  accent = "amber",
  className = "",
}: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);
  const touchIdRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);

  const maxRadius = 42; // Maximum deflection in pixels

  const handleDeflection = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance === 0) {
        setKnobPos({ x: 0, y: 0 });
        onMove(0, 0);
        return;
      }

      const clampedDist = Math.min(distance, maxRadius);
      const normX = deltaX / distance;
      const normY = deltaY / distance;

      const finalX = normX * clampedDist;
      const finalY = normY * clampedDist;

      setKnobPos({ x: finalX, y: finalY });
      onMove(finalX / maxRadius, finalY / maxRadius);
    },
    [maxRadius, onMove]
  );

  const resetKnob = useCallback(() => {
    setIsActive(false);
    touchIdRef.current = null;
    isMouseDownRef.current = false;
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  // Touch Handlers (Multi-touch aware for simultaneous dual joystick use)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    handleDeflection(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        handleDeflection(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        resetKnob();
        break;
      }
    }
  };

  // Mouse Handlers for Desktop Testing
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    setIsActive(true);
    handleDeflection(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      handleDeflection(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        resetKnob();
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleDeflection, resetKnob]);

  const accentStyles = {
    amber: {
      border: "border-amber-500/40",
      glow: "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
      knob: "from-amber-400 via-orange-500 to-amber-600 border-amber-300",
      badge: "text-amber-300 bg-amber-500/15 border-amber-500/30",
    },
    cyan: {
      border: "border-cyan-500/40",
      glow: "shadow-[0_0_25px_rgba(6,182,212,0.35)]",
      knob: "from-cyan-400 via-sky-500 to-blue-600 border-cyan-300",
      badge: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
    },
    rose: {
      border: "border-rose-500/40",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.35)]",
      knob: "from-rose-400 via-pink-500 to-red-600 border-rose-300",
      badge: "text-rose-300 bg-rose-500/15 border-rose-500/30",
    },
  }[accent];

  return (
    <div className={`relative flex flex-col items-center select-none touch-none ${className}`}>
      {/* Outer Joystick Base Ring */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#0a0718]/85 backdrop-blur-lg border-2 ${accentStyles.border} ${
          isActive ? accentStyles.glow : "shadow-xl"
        } flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow duration-200`}
        style={{ touchAction: "none" }}
      >
        {/* Cardinal Direction Tick Marks */}
        <div className="absolute top-1.5 w-1 h-2 bg-white/25 rounded-full" />
        <div className="absolute bottom-1.5 w-1 h-2 bg-white/25 rounded-full" />
        <div className="absolute left-1.5 h-1 w-2 bg-white/25 rounded-full" />
        <div className="absolute right-1.5 h-1 w-2 bg-white/25 rounded-full" />

        {/* Center Target Crosshair */}
        <div className="w-6 h-6 rounded-full border border-dashed border-white/20 pointer-events-none" />

        {/* Draggable Knob */}
        <div
          className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${accentStyles.knob} border-2 shadow-lg flex items-center justify-center pointer-events-none transition-transform duration-75`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white/70 shadow-sm" />
        </div>
      </div>

      {/* Label Badge Underneath */}
      <div
        className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${accentStyles.badge}`}
      >
        {label}
        {subLabel && <span className="opacity-60 ml-1 font-normal">({subLabel})</span>}
      </div>
    </div>
  );
}
