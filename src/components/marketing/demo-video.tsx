"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DemoVideo — the home-page "90-second tour" player.
 *
 * Two modes:
 *  - If `public/demo.mp4` exists (HEAD 200), it renders a real <video>.
 *  - Otherwise it renders an animated chapter player (five illustrative
 *    product screens with transport controls) — a video-like experience with
 *    no media asset required.
 */

type Chapter = {
  id: string;
  label: string;
  start: number; // seconds
};

const CHAPTER_MS = 5000;

const CHAPTERS: Chapter[] = [
  { id: "overview", label: "Overview", start: 0 },
  { id: "board", label: "Athletes board", start: 5 },
  { id: "player", label: "Player 360", start: 10 },
  { id: "market", label: "Marketplace", start: 15 },
  { id: "gov", label: "Governance", start: 20 },
];

const TOTAL_MS = CHAPTERS.length * CHAPTER_MS;

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- illustrative chapter screens (synthetic) ---------- */

function OverviewScreen() {
  const bands: Array<[label: string, pct: number, cls: string]> = [
    ["READY", 46, "bg-ready"],
    ["MONITOR", 34, "bg-monitor"],
    ["COMPROMISED", 12, "bg-compromised"],
    ["WITHHELD", 8, "bg-withheld"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-8">
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <div className="hero-number text-5xl text-accent sm:text-6xl">87</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Squad readiness</div>
        </div>
        {[
          ["50", "athletes"],
          ["3", "teams"],
          ["28", "days"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="hero-number text-2xl text-ink">{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex h-3.5 w-full overflow-hidden rounded-full border border-edge/70 bg-panel-2">
        {bands.map(([label, pct, cls]) => (
          <div key={label} className={cls} style={{ width: `${pct}%` }} title={`${label}: ${pct}%`} />
        ))}
      </div>
      <p className="text-xs text-muted">Validity-gated distribution across the last scored week.</p>
    </div>
  );
}

function BoardScreen() {
  const rows: Array<[name: string, pos: string, score: string, band: string, bandCls: string]> = [
    ["Amari Osei", "TRENCH", "91", "READY", "bg-ready/15 text-ready"],
    ["Cinder_01", "SKILL", "84", "READY", "bg-ready/15 text-ready"],
    ["Nova_07", "LB_TE", "61", "MONITOR", "bg-monitor/15 text-monitor"],
    ["Rook_12", "QB", "42", "COMPROMISED", "bg-compromised/15 text-compromised"],
    ["Vale_03", "ST", "—", "WITHHELD", "bg-withheld/15 text-withheld"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-5 sm:p-8">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        Athletes · readiness board
      </div>
      {rows.map(([name, pos, score, band, cls], i) => (
        <div
          key={name}
          className="tour-row flex items-center gap-3 rounded-xl border border-edge/50 bg-panel/80 px-3 py-2.5"
          style={{ animationDelay: `${i * 110}ms` }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-[13px] font-semibold text-ink">{name}</span>
          <span className="hidden text-[10px] uppercase tracking-wider text-muted sm:block">{pos}</span>
          <span className="tabular w-8 text-right text-sm font-bold text-ink">{score}</span>
          <span className={`rounded-md px-2 py-1 text-[9px] font-bold ${cls}`}>{band}</span>
        </div>
      ))}
    </div>
  );
}

function PlayerScreen() {
  const drivers: Array<[label: string, pct: number, cls: string]> = [
    ["Sleep quality", 82, "bg-ready"],
    ["Acute load", 64, "bg-monitor"],
    ["Wellness", 71, "bg-ready"],
    ["GPS dropout", 28, "bg-compromised"],
  ];
  return (
    <div className="flex h-full items-center gap-6 p-5 sm:p-8">
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="h-28 w-28 sm:h-36 sm:w-36">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(37,55,85,0.9)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke="var(--color-accent)" strokeWidth="10"
            strokeLinecap="round" pathLength={100} strokeDasharray="84 100"
            transform="rotate(-90 60 60)" className="ring-anim"
          />
          <text x="60" y="58" textAnchor="middle" className="hero-number" fill="var(--color-ink)" fontSize="30">84</text>
          <text x="60" y="78" textAnchor="middle" fill="var(--color-muted)" fontSize="9" letterSpacing="2">READY</text>
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Player 360 · drivers</div>
        <div className="mt-3 space-y-2.5">
          {drivers.map(([label, pct, cls], i) => (
            <div key={label} className="tour-row" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted">{label}</span>
                <span className="tabular font-semibold text-ink">{pct}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
                <div className={`h-full ${cls}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketScreen() {
  const cards: Array<[name: string, price: string]> = [
    ["FaceBit vitals package", "$59"],
    ["Black Stack dataset", "$25"],
    ["Community listing", "$25"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Marketplace</div>
        <span className="rounded-md bg-accent/15 px-2 py-1 text-[10px] font-bold text-accent">Cart · 2</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cards.map(([name, price], i) => (
          <div
            key={name}
            className="tour-row rounded-xl border border-edge/50 bg-panel/80 p-3"
            style={{ animationDelay: `${i * 130}ms` }}
          >
            <div className="mb-2 h-10 rounded-md bg-gradient-to-br from-accent/25 to-prototype/25" />
            <div className="truncate text-[11px] font-semibold text-ink">{name}</div>
            <div className="mt-1 flex items-center justify-between">
              <span className="tabular text-sm font-bold text-accent">{price}</span>
              <span className="text-[9px] font-bold text-muted">ADD</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted">Demo checkout — clearly labeled synthetic pricing.</p>
    </div>
  );
}

function GovScreen() {
  const rows: Array<[hash: string, action: string]> = [
    ["0x8f3a…c21e", "score.read · roster.read"],
    ["0x12bd…90af", "consent.verify · audit.append"],
    ["0x77e1…4d5c", "marketplace.list · export.write"],
    ["0xc04f…b832", "session.login · rbac.check"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5 sm:p-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        Governance · hash-chained audit
      </div>
      {rows.map(([hash, action], i) => (
        <div
          key={hash}
          className="tour-row flex items-center gap-3 rounded-lg border border-edge/50 bg-panel/80 px-3 py-2"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className="tabular text-[11px] text-prototype">{hash}</span>
          <span className="flex-1 truncate text-[11px] text-muted">{action}</span>
          <span className="text-[9px] font-bold text-ready">VERIFIED</span>
        </div>
      ))}
      <p className="text-[11px] text-muted">Consent-governed · tamper-evident · every access recorded.</p>
    </div>
  );
}

const SCREENS: Record<string, () => React.ReactElement> = {
  overview: OverviewScreen,
  board: BoardScreen,
  player: PlayerScreen,
  market: MarketScreen,
  gov: GovScreen,
};

export function DemoVideo() {
  const [hasRealVideo, setHasRealVideo] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  /* Detect a real recording dropped into /public/demo.mp4. */
  useEffect(() => {
    fetch("/demo.mp4", { method: "HEAD" })
      .then((r) => setHasRealVideo(r.ok))
      .catch(() => setHasRealVideo(false));
  }, []);

  /* Play only while on screen. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Chapter clock. */
  useEffect(() => {
    if (!playing || !inView || hasRealVideo) return;
    const id = window.setInterval(() => {
      setElapsed((e) => (e + 100) % TOTAL_MS);
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, inView, hasRealVideo]);

  if (hasRealVideo) {
    return (
      <div ref={stageRef} className="glass overflow-hidden rounded-2xl">
        <video
          src="/demo.mp4"
          controls
          preload="metadata"
          className="block w-full"
          title="Sportmetryx product demo"
        >
          Your browser does not support embedded video.
        </video>
      </div>
    );
  }

  const chapterIndex = Math.min(CHAPTERS.length - 1, Math.floor(elapsed / CHAPTER_MS));
  const current = CHAPTERS[chapterIndex]!;
  const Screen = SCREENS[current.id]!;

  return (
    <div ref={stageRef} className="glass overflow-hidden rounded-2xl">
      {/* Stage */}
      <div className="relative aspect-video overflow-hidden bg-panel-2/80">
        <div key={current.id} className="chapter-screen absolute inset-0">
          <Screen />
        </div>

        {/* Fake transport overlay */}
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
          className="absolute inset-0 flex items-center justify-center bg-canvas/0 transition-colors hover:bg-canvas/30"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border border-accent/50 bg-canvas/80 text-accent opacity-0 transition-opacity group-hover:opacity-100 ${
              playing ? "opacity-0 hover:opacity-100" : "opacity-100"
            }`}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <rect x="3" y="2" width="4" height="14" rx="1" />
                <rect x="11" y="2" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <path d="M5 3.5v11l9-5.5z" />
              </svg>
            )}
          </span>
        </button>

        <span className="absolute left-3 top-3 rounded-md bg-canvas/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
          Animated walkthrough
        </span>
      </div>

      {/* Transport bar */}
      <div className="border-t border-edge/70 bg-panel/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-canvas transition-transform hover:scale-105"
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <rect x="3" y="2" width="4" height="14" rx="1" />
                <rect x="11" y="2" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                <path d="M5 3.5v11l9-5.5z" />
              </svg>
            )}
          </button>

          <span className="tabular shrink-0 text-[11px] text-muted">
            {fmt(elapsed)} / {fmt(TOTAL_MS)}
          </span>

          {/* Segmented progress */}
          <div className="flex flex-1 gap-1">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setElapsed(i * CHAPTER_MS)}
                aria-label={`Jump to ${c.label}`}
                className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-edge/80"
              >
                <span
                  className="video-progress-fill absolute inset-y-0 left-0 bg-accent"
                  style={{
                    width:
                      i < chapterIndex ? "100%" : i > chapterIndex ? "0%" : `${((elapsed % CHAPTER_MS) / CHAPTER_MS) * 100}%`,
                  }}
                />
              </button>
            ))}
          </div>

          <span className="hidden shrink-0 text-[11px] font-semibold text-ink sm:block">{current.label}</span>
        </div>

        {/* Chapter pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setElapsed(i * CHAPTER_MS)}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                i === chapterIndex
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-edge text-muted hover:border-accent/50 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
