"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HeroBackground — full-bleed cinematic background for the home hero.
 *
 * Plays a crossfading sequence of five licensed stock clips (public/hero/
 * 1..5.mp4, ~60 s total) using two stacked <video> layers: when the active
 * clip ends, the preloaded next clip fades in — a continuous, film-like loop
 * with no editing pipeline required. Muted, no controls, decorative only.
 *
 * Reduced-motion visitors never receive the videos (aurora stays). If any
 * clip fails to load, the shell stays transparent and the aurora shows.
 */

const CLIPS = ["/hero/1.mp4", "/hero/2.mp4", "/hero/3.mp4", "/hero/4.mp4", "/hero/5.mp4"];

export function HeroBackground() {
  const aRef = useRef<HTMLVideoElement | null>(null);
  const bRef = useRef<HTMLVideoElement | null>(null);
  const idxRef = useRef(0);
  const activeARef = useRef(true);
  const [activeSide, setActiveSide] = useState<"a" | "b">("a");
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  /* Respect reduced motion — no videos at all. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  /* Boot: arm clip 1 on layer A, fade in on first frame, preload clip 2. */
  useEffect(() => {
    if (!enabled) return;
    const a = aRef.current;
    if (!a) return;
    a.src = CLIPS[0]!;
    a.dataset.clip = "0";
    const onCanPlay = () => {
      setReady(true);
      a.play().catch(() => undefined);
      const b = bRef.current;
      if (b && b.dataset.clip !== "1") {
        b.src = CLIPS[1]!;
        b.dataset.clip = "1";
      }
    };
    a.addEventListener("canplay", onCanPlay, { once: true });
    return () => {
      a.removeEventListener("canplay", onCanPlay);
      a.pause();
      bRef.current?.pause();
    };
  }, [enabled]);

  /* Crossfade to the next clip when the active one ends. */
  const handleEnded = () => {
    const cur = activeARef.current ? aRef.current : bRef.current;
    const nxt = activeARef.current ? bRef.current : aRef.current;
    if (!cur || !nxt) return;

    const nextIdx = (idxRef.current + 1) % CLIPS.length;
    if (nxt.dataset.clip !== String(nextIdx)) {
      nxt.src = CLIPS[nextIdx]!;
      nxt.dataset.clip = String(nextIdx);
    }
    nxt.currentTime = 0;
    nxt.play().catch(() => undefined);

    activeARef.current = !activeARef.current;
    idxRef.current = nextIdx;
    setActiveSide(activeARef.current ? "a" : "b");

    /* After the fade, preload the following clip into the hidden layer. */
    window.setTimeout(() => {
      const after = (idxRef.current + 1) % CLIPS.length;
      cur.pause();
      if (cur.dataset.clip !== String(after)) {
        cur.src = CLIPS[after]!;
        cur.dataset.clip = String(after);
      }
    }, 1200);
  };

  if (!enabled) return null;

  return (
    <div
      className={`hero-video-shell ${ready ? "ready" : ""}`}
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <video
        ref={aRef}
        className={`hero-video ${activeSide === "a" ? "on" : ""}`}
        muted
        autoPlay
        playsInline
        preload="auto"
        disablePictureInPicture
        onEnded={handleEnded}
      />
      <video
        ref={bRef}
        className={`hero-video ${activeSide === "b" ? "on" : ""}`}
        muted
        autoPlay
        playsInline
        preload="auto"
        disablePictureInPicture
        onEnded={handleEnded}
      />
      <div className="hero-video-overlay" />
    </div>
  );
}
