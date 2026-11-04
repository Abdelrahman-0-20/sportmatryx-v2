"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

/**
 * TacticalStudio — the CSS-3D tactical board: formation switcher, phase
 * animations (passing arrows draw themselves), a coaching drill loop and a
 * game-systems library that drives the board. All data is illustrative —
 * labeled on the UI.
 */

type Pos = [number, number];
type Arrow = { f: number; t: Pos };
type Phase = { label: string; ball: Pos; desc: string; arrows: Arrow[] };

const FORMATIONS: Record<string, Pos[]> = {
  "4-3-3": [
    [50, 94], [85, 78], [63, 82], [37, 82], [15, 78],
    [72, 58], [50, 63], [28, 58],
    [85, 25], [50, 18], [15, 25],
  ],
  "4-2-3-1": [
    [50, 94], [85, 78], [63, 82], [37, 82], [15, 78],
    [62, 70], [38, 70],
    [82, 45], [50, 48], [18, 45],
    [50, 20],
  ],
  "3-5-2": [
    [50, 94], [68, 84], [50, 87], [32, 84],
    [88, 62], [65, 66], [50, 70], [35, 66], [12, 62],
    [62, 25], [38, 25],
  ],
  "4-4-2": [
    [50, 94], [85, 78], [63, 82], [37, 82], [15, 78],
    [85, 55], [62, 60], [38, 60], [15, 55],
    [62, 22], [38, 22],
  ],
};

const PHASES: Record<string, Phase> = {
  build: {
    label: "Build-up",
    ball: [50, 93],
    desc: "Play out from the back: centre-backs split, full-backs push high, the pivot offers the passing lane through the first line.",
    arrows: [
      { f: 0, t: [70, 80] },
      { f: 1, t: [80, 52] },
      { f: 4, t: [20, 52] },
    ],
  },
  press: {
    label: "High press",
    ball: [50, 12],
    desc: "Trigger from the front: the striker curves to screen the centre-back, wingers jump the full-backs, midfield steps up on the bounce pass.",
    arrows: [
      { f: 9, t: [52, 6] },
      { f: 8, t: [76, 10] },
      { f: 10, t: [24, 10] },
    ],
  },
  transition: {
    label: "Transition",
    ball: [50, 44],
    desc: "First three seconds after regaining: vertical to the nine, wingers attack the channels before the opponent block resets.",
    arrows: [
      { f: 9, t: [50, 24] },
      { f: 8, t: [78, 30] },
      { f: 6, t: [50, 34] },
    ],
  },
  setpiece: {
    label: "Set piece",
    ball: [97, 3],
    desc: "Corner routine: near-post screen, far-post overload, edge-of-box second ball — three rehearsed variants.",
    arrows: [
      { f: 9, t: [64, 12] },
      { f: 10, t: [44, 8] },
      { f: 7, t: [74, 18] },
    ],
  },
};

const SYSTEMS: Array<{
  name: string;
  tag: string;
  body: string;
  formation: string;
  phase: string;
}> = [
  {
    name: "High press",
    tag: "Out of possession",
    body: "Win it high: the front three screen central passes, the midfield line jumps on the bounce, full-backs squeeze.",
    formation: "4-3-3",
    phase: "press",
  },
  {
    name: "Mid block",
    tag: "Out of possession",
    body: "Compact banks of four, force play wide, spring forward on the bad touch or the forced pass inside.",
    formation: "4-2-3-1",
    phase: "press",
  },
  {
    name: "Positional play",
    tag: "In possession",
    body: "Third-man combinations through the half-spaces; full-backs invert, wingers hold the width, the pivot ghosts between lines.",
    formation: "4-3-3",
    phase: "build",
  },
  {
    name: "Counter-press",
    tag: "Transition",
    body: "Five-second swarm after losing it — the nearest three press while the rest protect the central lane.",
    formation: "4-2-3-1",
    phase: "transition",
  },
  {
    name: "Quick transition",
    tag: "Transition",
    body: "Direct vertical attack in three passes; wingers sprint the channels, the nine pins both centre-backs.",
    formation: "4-4-2",
    phase: "transition",
  },
  {
    name: "Corner routines",
    tag: "Set piece",
    body: "Near-post screen, far-post overload, edge-of-box second ball — rehearsed delivery variants.",
    formation: "4-4-2",
    phase: "setpiece",
  },
];

const FORMATION_KEYS = Object.keys(FORMATIONS);
const PHASE_KEYS = Object.keys(PHASES);

/* viewBox matches the pitch aspect (46:66) so strokes scale uniformly. */
const VX = (x: number) => x * 4.6;
const VY = (y: number) => y * 6.6;

export function TacticalStudio({ labels }: { labels: Dict["tacticsBoard"] }) {
  const [formation, setFormation] = useState("4-3-3");
  const [phase, setPhase] = useState("build");
  const [playing, setPlaying] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const positions = FORMATIONS[formation]!;
  const currentPhase = PHASES[phase]!;
  const curText = labels.phases[PHASE_KEYS.indexOf(phase)]!;

  /* Coaching drill loop. */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPhase((p) => {
        const i = PHASE_KEYS.indexOf(p);
        return PHASE_KEYS[(i + 1) % PHASE_KEYS.length]!;
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [playing]);

  const applySystem = (sys: (typeof SYSTEMS)[number]) => {
    setFormation(sys.formation);
    setPhase(sys.phase);
    setPlaying(false);
    window.requestAnimationFrame(() => {
      boardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const pill = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
      active ? "border-accent bg-accent/15 text-accent" : "border-edge text-muted hover:border-accent/50 hover:text-ink"
    }`;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------- 3D board ---------- */}
        <div ref={boardRef} className="glass scroll-mt-24 rounded-2xl p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {formation} · {curText.label}
            </span>
            <span className="text-[10px] text-muted">{labels.boardTag}</span>
          </div>

          <div className="pitch-wrap py-2">
            <div className="pitch3d">
              <div className="pitch-surface">
                <div className="pitch-stripes" />
                <svg viewBox="0 0 460 660" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <marker
                      id="smx-arrow"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="4.5"
                      markerHeight="4.5"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)" />
                    </marker>
                  </defs>

                  {/* Pitch markings */}
                  <g fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="2.5">
                    <rect x="14" y="14" width="432" height="632" rx="4" />
                    <line x1="14" y1="330" x2="446" y2="330" />
                    <circle cx="230" cy="330" r="58" />
                    <rect x="97" y="14" width="266" height="101" />
                    <rect x="146" y="14" width="168" height="36" />
                    <rect x="97" y="545" width="266" height="101" />
                    <rect x="146" y="610" width="168" height="36" />
                    <circle cx="230" cy="80" r="3.5" fill="rgba(95,208,240,0.55)" stroke="none" />
                    <circle cx="230" cy="580" r="3.5" fill="rgba(95,208,240,0.55)" stroke="none" />
                  </g>

                  {/* Passing / running arrows — remount per phase to replay */}
                  <g key={`${formation}-${phase}`}>
                    {currentPhase.arrows.map((a, i) => {
                      const from = positions[a.f]!;
                      return (
                        <line
                          key={i}
                          x1={VX(from[0])}
                          y1={VY(from[1])}
                          x2={VX(a.t[0])}
                          y2={VY(a.t[1])}
                          pathLength={1}
                          className="play-arrow"
                          stroke="var(--color-accent)"
                          strokeWidth={3}
                          strokeLinecap="round"
                          markerEnd="url(#smx-arrow)"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      );
                    })}
                  </g>
                </svg>

                {/* Ground shadows (flat on the pitch plane) */}
                {positions.map((p, i) => (
                  <span
                    key={`s${i}`}
                    className="token-shadow"
                    style={{ left: `${p[0]}%`, top: `${p[1]}%` }}
                  />
                ))}
              </div>

              {/* Floating tokens (counter-rotated to face the camera) */}
              {positions.map((p, i) => (
                <div
                  key={`t${i}`}
                  className="token-pos"
                  style={{
                    left: `${p[0]}%`,
                    top: `${p[1]}%`,
                    transform: "translate(-50%, -50%) translateZ(16px) rotateX(-50deg)",
                  }}
                >
                  <span className="token">{i + 1}</span>
                </div>
              ))}

              {/* Ball */}
              <div className="ball" style={{ left: `${currentPhase.ball[0]}%`, top: `${currentPhase.ball[1]}%` }} />
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted">{curText.desc}</p>
        </div>

        {/* ---------- Controls ---------- */}
        <div className="glass rounded-2xl p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{labels.formation}</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {FORMATION_KEYS.map((k) => (
              <button key={k} type="button" onClick={() => setFormation(k)} className={pill(k === formation)}>
                {k}
              </button>
            ))}
          </div>

          <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{labels.phase}</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {PHASE_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setPhase(k);
                  setPlaying(false);
                }}
                className={pill(k === phase)}
              >
                {labels.phases[PHASE_KEYS.indexOf(k)]!.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="btn-primary mt-5 w-full"
          >
            {playing ? (
              <>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                  <rect x="3" y="2" width="4" height="14" rx="1" />
                  <rect x="11" y="2" width="4" height="14" rx="1" />
                </svg>
                {labels.pauseDrill}
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.5v11l9-5.5z" />
                </svg>
                {labels.playDrill}
              </>
            )}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            {labels.cycleHint}
          </p>
        </div>
      </div>

      {/* ---------- Game systems library ---------- */}
      <div className="mt-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          {labels.gameSystems}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applySystem(s)}
              className="surface rounded-2xl p-5 text-left"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                {labels.systems[i]!.tag}
              </span>
              <span className="mt-2 block text-base font-semibold text-ink">{labels.systems[i]!.name}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-muted">{labels.systems[i]!.body}</span>
              <span className="mt-3 block text-xs font-bold text-accent">{labels.showOnBoard}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
