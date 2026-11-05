"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import {
  FORMATIONS,
  FORMATION_KEYS,
  PHASES,
  PHASE_KEYS,
  SYSTEMS,
  formationForPhase,
  phaseForFormation,
  resolveArrows,
  type PhaseKey,
} from "@/lib/tactics/american-football";

/**
 * TacticalStudio — the CSS-3D American-football board: formation switcher,
 * phase animations (routes and rush lanes draw themselves), a drill loop and a
 * game-systems library that drives the board.
 *
 * All formations, phases and systems come from
 * `lib/tactics/american-football.ts` — this file only renders them. Display
 * copy (phase/system names and descriptions) is looked up in the locale
 * dictionary by index, so the data module stays language-neutral.
 * All data is illustrative — labeled on the UI.
 */

/* Field geometry in the 460×660 viewBox, matching the 0–100 token space:
 * end zones sit outside the goal lines, yard lines every 10 yards between. */
const FIELD = { top: 14, bottom: 646, goalTop: 66, goalBottom: 594, left: 14, right: 446 };
const YARD_STEP = (FIELD.goalBottom - FIELD.goalTop) / 10;
const YARD_LINES = Array.from({ length: 9 }, (_, i) => FIELD.goalTop + YARD_STEP * (i + 1));
const YARD_LABELS = YARD_LINES.map((y, i) => ({ y, value: i < 5 ? (i + 1) * 10 : (9 - i) * 10 }));

/* viewBox matches the field aspect (460:660) so strokes scale uniformly. */
const VX = (x: number) => x * 4.6;
const VY = (y: number) => y * 6.6;

export function TacticalStudio({ labels }: { labels: Dict["tacticsBoard"] }) {
  const [board, setBoard] = useState<{ formation: string; phase: PhaseKey }>({
    formation: "I-Form",
    phase: "run",
  });
  const [playing, setPlaying] = useState(false);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const positions = FORMATIONS[board.formation]!;
  const currentPhase = PHASES.find((p) => p.key === board.phase)!;
  const arrows = resolveArrows(currentPhase, positions);
  const curText = labels.phases[PHASE_KEYS.indexOf(board.phase)]!;

  /* Coaching drill loop — each phase keeps a formation that can run it. */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setBoard((b) => {
        const next = PHASE_KEYS[(PHASE_KEYS.indexOf(b.phase) + 1) % PHASE_KEYS.length]!;
        return { phase: next, formation: formationForPhase(next, b.formation) };
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [playing]);

  /** Pick a phase; swap the shape only when the current one cannot run it. */
  const pickPhase = (key: PhaseKey) =>
    setBoard((b) => ({ phase: key, formation: formationForPhase(key, b.formation) }));

  /** Pick a shape; keep the phase when it is legal for that shape. */
  const pickFormation = (key: string) =>
    setBoard((b) => {
      const active = PHASES.find((p) => p.key === b.phase)!;
      return active.formations.includes(key)
        ? { ...b, formation: key }
        : { formation: key, phase: phaseForFormation(key) };
    });

  const applySystem = (sys: (typeof SYSTEMS)[number]) => {
    setBoard({ formation: sys.formation, phase: sys.phase });
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
              {board.formation} · {curText.label}
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

                  {/* Field markings — end zones, goal lines, yard lines, yard numbers */}
                  <g fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="2.5">
                    <rect x={FIELD.left} y={FIELD.top} width={FIELD.right - FIELD.left} height={FIELD.bottom - FIELD.top} rx="4" />
                    {/* End zones */}
                    <rect x={FIELD.left} y={FIELD.top} width={FIELD.right - FIELD.left} height={FIELD.goalTop - FIELD.top} fill="rgba(95,208,240,0.10)" />
                    <rect x={FIELD.left} y={FIELD.goalBottom} width={FIELD.right - FIELD.left} height={FIELD.bottom - FIELD.goalBottom} fill="rgba(95,208,240,0.10)" />
                    {/* Goal lines */}
                    <line x1={FIELD.left} y1={FIELD.goalTop} x2={FIELD.right} y2={FIELD.goalTop} />
                    <line x1={FIELD.left} y1={FIELD.goalBottom} x2={FIELD.right} y2={FIELD.goalBottom} />
                    {/* Yard lines every 10 yards */}
                    {YARD_LINES.map((y) => (
                      <line
                        key={y}
                        x1={FIELD.left}
                        y1={y}
                        x2={FIELD.right}
                        y2={y}
                        stroke="rgba(95,208,240,0.16)"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>

                  {/* Yard numbers, both sidelines */}
                  <g fill="rgba(255,255,255,0.18)" fontSize="26" fontWeight="700" textAnchor="middle">
                    {YARD_LABELS.map(({ y, value }) => (
                      <g key={`n${y}`}>
                        <text x="64" y={y + 9}>{value}</text>
                        <text x="396" y={y + 9}>{value}</text>
                      </g>
                    ))}
                  </g>

                  {/* Routes / rush lanes — remount per formation + phase to replay */}
                  <g key={`${board.formation}-${board.phase}`}>
                    {arrows.map((a, i) => (
                      <line
                        key={i}
                        x1={VX(a.from[0])}
                        y1={VY(a.from[1])}
                        x2={VX(a.to[0])}
                        y2={VY(a.to[1])}
                        pathLength={1}
                        className="play-arrow"
                        stroke="var(--color-accent)"
                        strokeWidth={3}
                        strokeLinecap="round"
                        markerEnd="url(#smx-arrow)"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </g>
                </svg>

                {/* Ground shadows (flat on the field plane) */}
                {positions.map((p, i) => (
                  <span
                    key={`s${i}`}
                    className="token-shadow"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  />
                ))}
              </div>

              {/* Floating tokens (counter-rotated to face the camera) */}
              {positions.map((p, i) => (
                <div
                  key={`t${i}`}
                  className="token-pos"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
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
              <button key={k} type="button" onClick={() => pickFormation(k)} className={pill(k === board.formation)}>
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
                  pickPhase(k);
                  setPlaying(false);
                }}
                className={pill(k === board.phase)}
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
