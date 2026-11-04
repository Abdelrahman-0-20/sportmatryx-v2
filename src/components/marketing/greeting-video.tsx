"use client";

import { useRef, useState } from "react";

/**
 * GreetingVideo — founder greeting clip with an explicit play button
 * (browsers block audible autoplay, and a talking-head loop as a muted
 * background would look wrong). Captions/labels come from the dictionary.
 */
export function GreetingVideo({ title, note }: { title: string; note: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => undefined);
  };

  return (
    <div className="surface rounded-2xl p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{title}</span>
        <span className="tabular text-[10px] text-muted">0:10</span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-edge/60 bg-canvas">
        <video
          ref={videoRef}
          src="/greeting.mp4"
          preload="metadata"
          playsInline
          controls={started}
          className="block w-full"
        />
        {!started ? (
          <button
            type="button"
            onClick={start}
            aria-label={title}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas/65 transition-colors hover:bg-canvas/45"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/60 bg-canvas/85 text-accent shadow-[0_0_30px_-8px_rgba(95,208,240,0.7)] transition-transform hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <path d="M5 3.5v11l9-5.5z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-ink">{note}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
