"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * TiltCard — 3D perspective hover: the card tilts toward the cursor and
 * lifts slightly. Pure CSS transforms (no 3D library), disabled automatically
 * for reduced-motion users.
 */
export function TiltCard({
  children,
  className = "",
  maxDegrees = 6,
}: {
  children: ReactNode;
  className?: string;
  maxDegrees?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * maxDegrees).toFixed(2)}deg) rotateY(${(
      px * maxDegrees
    ).toFixed(2)}deg) translateY(-3px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
