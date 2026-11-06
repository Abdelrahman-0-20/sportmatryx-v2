"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

type Labels = Dict["share"];

type PreviewStatus = "loading" | "ready" | "error";

/**
 * ShareCardStudio — live readiness-card generator. Preview points at
 * /api/share/card (server-rendered PNG); download saves it directly.
 *
 * The preview is wrapped in a surface to match the form panel, shows a
 * loading state while the PNG renders, and falls back to a retry panel
 * (instead of a broken-image glyph) if the API fails or is slow.
 */
export function ShareCardStudio({ labels }: { labels: Labels }) {
  const [name, setName] = useState("");
  const [score, setScore] = useState(87);
  const [band, setBand] = useState("READY");
  const [status, setStatus] = useState<PreviewStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  const cardUrl = useMemo(
    () =>
      `/api/share/card?name=${encodeURIComponent(name.trim() || "My squad")}&score=${score}&band=${band}`,
    [name, score, band],
  );

  // A new card URL means a new render — never keep the previous image's
  // state (or its broken glyph) visible while the next one loads.
  const previewUrl = attempt > 0 ? `${cardUrl}&retry=${attempt}` : cardUrl;
  useEffect(() => {
    setStatus("loading");
  }, [previewUrl]);

  const INPUT =
    "mt-1 w-full rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      {/* Controls */}
      <div className="surface rounded-2xl p-6">
        <div className="space-y-5">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              {labels.squadLabel}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={28}
              className={INPUT}
              placeholder={labels.squadPh}
            />
          </label>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                {labels.scoreLabel}
              </span>
              <span className="hero-number tabular text-3xl text-accent">{score}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              aria-label={labels.scoreLabel}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-edge accent-[#5fd0f0]"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              {labels.bandLabel}
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.bandNames.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBand(b)}
                  aria-pressed={band === b}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                    band === b
                      ? "border-accent bg-accent/15 text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
                      : "border-edge/80 text-muted hover:border-accent/40 hover:text-ink"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <a href={cardUrl} download="sportmetryx-readiness-card.png" className="btn-primary w-full">
            {labels.download}
          </a>
          {/* Printed once — not repeated under the preview. */}
          <p className="text-[11px] leading-relaxed text-muted">{labels.tip}</p>
        </div>
      </div>

      {/* Live preview — same surface treatment as the form panel. */}
      <div className="surface rounded-2xl p-6">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Live preview
          </span>
          <span className="text-[11px] text-muted">1200 × 630 PNG</span>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-xl border border-edge/70 bg-panel-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated PNG from our own API */}
          <img
            src={previewUrl}
            alt={`${name || "My squad"} readiness card`}
            width={1200}
            height={630}
            onLoad={() => setStatus("ready")}
            onError={() => setStatus("error")}
            className={status === "ready" ? "block w-full" : "invisible block w-full"}
          />

          {status === "loading" ? (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse bg-panel-2/90 text-center"
            >
              <div className="h-9 w-9 rounded-full border-2 border-accent/40 border-t-accent" />
              <p className="text-xs text-muted">Rendering your card…</p>
            </div>
          ) : null}

          {status === "error" ? (
            <div
              role="alert"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-panel-2/95 px-6 text-center"
            >
              <p className="text-sm font-semibold text-ink">Preview unavailable</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                The card image could not be rendered. Check your connection, then retry —
                your settings are kept.
              </p>
              <button
                type="button"
                onClick={() => setAttempt((a) => a + 1)}
                className="btn-primary mt-1 px-4 py-2 text-xs"
              >
                Retry preview
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
