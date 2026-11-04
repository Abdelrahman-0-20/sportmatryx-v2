"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * PageHero — a contained cinematic video banner for app page headers
 * (Marketplace, Athletes). A single licensed clip from /public/hero plays
 * muted behind the intro copy under a directional scrim, so text stays
 * crisp. Reduced-motion visitors get a static panel.
 */
export function PageHero({
  children,
  clip = 1,
  className = "",
}: {
  children: ReactNode;
  clip?: number;
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  return (
    <div className={`page-hero relative overflow-hidden ${className}`}>
      {enabled ? (
        <video
          className="page-hero-video"
          src={`/hero/${clip}.mp4`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
        />
      ) : null}
      <div className="page-hero-scrim" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
