"use client";

import React, { useRef, useState, useEffect } from "react";

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
}

export function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState<boolean>(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 42; // Max pixel deflection

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove(0, 0);
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
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
    const normX = (deltaX / distance) * clampedDist;
    const normY = (deltaY / distance) * clampedDist;

    setKnobPos({ x: normX, y: normY });
    // Screen deltaX maps to world X; deltaY maps to world Z
    onMove(normX / maxRadius, normY / maxRadius);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-28 h-28 rounded-full bg-slate-950/60 border-2 border-amber-500/40 backdrop-blur-md flex items-center justify-center touch-none select-none shadow-2xl"
      style={{
        boxShadow: isActive ? "0 0 25px rgba(245,158,11,0.5)" : "none",
      }}
    >
      {/* Base Cross Guides */}
      <div className="absolute w-full h-[1px] bg-amber-400/20" />
      <div className="absolute h-full w-[1px] bg-amber-400/20" />

      {/* Movable Joystick Knob */}
      <div
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-white shadow-lg flex items-center justify-center transition-transform duration-75 pointer-events-none"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        <div className="w-4 h-4 rounded-full bg-amber-950/40" />
      </div>
    </div>
  );
}
