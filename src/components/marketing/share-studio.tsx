"use client";

import { useMemo, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

type Labels = Dict["share"];

/**
 * ShareCardStudio — live readiness-card generator. Preview points at
 * /api/share/card (server-rendered PNG); download saves it directly.
 */
export function ShareCardStudio({ labels }: { labels: Labels }) {
  const [name, setName] = useState("");
  const [score, setScore] = useState(87);
  const [band, setBand] = useState("READY");

  const cardUrl = useMemo(
    () =>
      `/api/share/card?name=${encodeURIComponent(name.trim() || "My squad")}&score=${score}&band=${band}`,
    [name, score, band],
  );

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
          <p className="text-[11px] leading-relaxed text-muted">{labels.tip}</p>
        </div>
      </div>

      {/* Live preview */}
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated PNG from our own API */}
        <img
          src={cardUrl}
          alt={`${name || "My squad"} readiness card`}
          width={1200}
          height={630}
          className="w-full rounded-2xl border border-edge/70 shadow-[0_30px_80px_-50px_rgba(95,208,240,0.5)]"
        />
        <p className="mt-3 text-center text-[11px] text-muted">{labels.tip}</p>
      </div>
    </div>
  );
}
