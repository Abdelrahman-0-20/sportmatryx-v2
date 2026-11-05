"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DemoVideo — the home-page product-tour player, styled as a screen recording:
 * browser-window chrome with the real route per chapter, title card, Ken Burns
 * camera motion, dip-to-black cuts, broadcast lower-thirds and a proper
 * transport with seekable chapter segments.
 *
 * If `public/demo.mp4` exists (HEAD 200) the same frame plays that real
 * recording instead of the animated chapters.
 */

type Segment = {
  id: string;
  label: string;
  route: string;
  ms: number;
};

const SEGMENTS: Segment[] = [
  { id: "title", label: "Title", route: "/", ms: 3000 },
  { id: "overview", label: "Overview", route: "/", ms: 5500 },
  { id: "board", label: "Athletes board", route: "/roster", ms: 5500 },
  { id: "player", label: "Player 360", route: "/player/ATH-001", ms: 5500 },
  { id: "market", label: "Marketplace", route: "/marketplace", ms: 5500 },
  { id: "gov", label: "Governance", route: "/platform", ms: 5500 },
];

const STARTS: number[] = [];
let acc = 0;
for (const s of SEGMENTS) {
  STARTS.push(acc);
  acc += s.ms;
}
const TOTAL_MS = acc;

function indexAt(ms: number): number {
  let i = 0;
  while (i < STARTS.length - 1 && ms >= STARTS[i + 1]!) i++;
  return i;
}

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ---------- title card ---------- */

function TitleCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="display-heading text-4xl sm:text-6xl">
        <span className="text-accent">Sportmetryx</span>
      </div>
      <span className="title-line mt-4 block h-0.5 w-44 bg-gradient-to-r from-accent to-prototype" />
      <div className="mt-4 text-xs uppercase tracking-[0.35em] text-muted sm:text-sm">
        The product tour
      </div>
      <div className="mt-2 text-[11px] text-muted/80">5 chapters · product tour</div>
    </div>
  );
}

/* ---------- chapter screens (illustrative, synthetic) ---------- */

function OverviewScreen() {
  const bands: Array<[label: string, pct: number, cls: string]> = [
    ["READY", 46, "bg-ready"],
    ["MONITOR", 34, "bg-monitor"],
    ["COMPROMISED", 12, "bg-compromised"],
    ["WITHHELD", 8, "bg-withheld"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-10">
      <div className="flex flex-wrap items-end gap-8">
        <div>
          <div className="hero-number text-5xl text-accent sm:text-7xl">87</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Squad readiness</div>
        </div>
        {[
          ["50", "athletes"],
          ["3", "teams"],
          ["28", "days"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="hero-number text-2xl text-ink sm:text-3xl">{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-edge/70 bg-panel-2">
        {bands.map(([label, pct, cls]) => (
          <div key={label} className={cls} style={{ width: `${pct}%` }} title={`${label}: ${pct}%`} />
        ))}
      </div>
      <p className="text-xs text-muted sm:text-sm">
        Validity-gated distribution across the last scored week — every band traceable to its drivers.
      </p>
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
    <div className="flex h-full flex-col justify-center gap-2.5 p-6 sm:p-10">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        Athletes · readiness board
      </div>
      {rows.map(([name, pos, score, band, cls], i) => (
        <div
          key={name}
          className="tour-row flex items-center gap-3 rounded-xl border border-edge/50 bg-panel/85 px-4 py-3"
          style={{ animationDelay: `${i * 110}ms` }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
            {name.slice(0, 2).toUpperCase()}
          </span>
          <span className="flex-1 truncate text-sm font-semibold text-ink sm:text-[15px]">{name}</span>
          <span className="hidden text-[10px] uppercase tracking-wider text-muted sm:block">{pos}</span>
          <span className="tabular w-9 text-right text-sm font-bold text-ink sm:text-base">{score}</span>
          <span className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${cls}`}>{band}</span>
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
    <div className="flex h-full items-center gap-8 p-6 sm:p-10">
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="h-32 w-32 sm:h-44 sm:w-44">
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
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Player 360 · what moved the score
        </div>
        <div className="mt-4 space-y-3">
          {drivers.map(([label, pct, cls], i) => (
            <div key={label} className="tour-row" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="flex justify-between text-xs">
                <span className="text-muted">{label}</span>
                <span className="tabular font-semibold text-ink">{pct}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-panel-2">
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
    <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-10">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Marketplace</div>
        <span className="rounded-md bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent">Cart · 2</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cards.map(([name, price], i) => (
          <div
            key={name}
            className="tour-row rounded-xl border border-edge/50 bg-panel/85 p-3 sm:p-4"
            style={{ animationDelay: `${i * 130}ms` }}
          >
            <div className="mb-2 h-12 rounded-md bg-gradient-to-br from-accent/25 to-prototype/25 sm:h-16" />
            <div className="truncate text-xs font-semibold text-ink sm:text-[13px]">{name}</div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="tabular text-sm font-bold text-accent sm:text-base">{price}</span>
              <span className="text-[9px] font-bold text-muted">ADD</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted sm:text-xs">Secure checkout — no payment details required.</p>
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
    <div className="flex h-full flex-col justify-center gap-3 p-6 sm:p-10">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        Governance · hash-chained audit
      </div>
      {rows.map(([hash, action], i) => (
        <div
          key={hash}
          className="tour-row flex items-center gap-3 rounded-lg border border-edge/50 bg-panel/85 px-4 py-2.5"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span className="tabular text-xs text-prototype">{hash}</span>
          <span className="flex-1 truncate text-xs text-muted">{action}</span>
          <span className="text-[9px] font-bold text-ready">VERIFIED</span>
        </div>
      ))}
      <p className="text-[11px] text-muted sm:text-xs">
        Consent-governed · tamper-evident · every access recorded.
      </p>
    </div>
  );
}

const SCREENS: Record<string, () => React.ReactElement> = {
  title: TitleCard,
  overview: OverviewScreen,
  board: BoardScreen,
  player: PlayerScreen,
  market: MarketScreen,
  gov: GovScreen,
};

/* ---------- browser-window chrome ---------- */

function BrowserFrame({ route, children }: { route: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-edge/70 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-3 border-b border-edge/70 bg-panel px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-canvas/80 px-3 py-1">
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
            <rect x="0.5" y="4.5" width="8" height="6" rx="1" stroke="var(--color-muted)" />
            <path d="M2.5 4.5V3a2 2 0 0 1 4 0v1.5" stroke="var(--color-muted)" />
          </svg>
          <span className="tabular truncate text-[11px] text-muted">
            sportmatryx-v2.vercel.app<span className="text-ink">{route}</span>
          </span>
        </span>
        <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted sm:block">
          Live product
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------- player ---------- */

export function DemoVideo() {
  const [hasRealVideo, setHasRealVideo] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/demo.mp4", { method: "HEAD" })
      .then((r) => setHasRealVideo(r.ok))
      .catch(() => setHasRealVideo(false));
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) setInView(e.isIntersecting);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || hasRealVideo) return;
    const id = window.setInterval(() => {
      setElapsed((e) => (e + 100) % TOTAL_MS);
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, inView, hasRealVideo]);

  /* Real recording mode. */
  if (hasRealVideo) {
    return (
      <div ref={stageRef}>
        <BrowserFrame route="/demo">
          <video src="/demo.mp4" controls preload="metadata" className="block w-full bg-canvas"
            title="Sportmetryx product demo">
            Your browser does not support embedded video.
          </video>
        </BrowserFrame>
      </div>
    );
  }

  const idx = indexAt(elapsed);
  const seg = SEGMENTS[idx]!;
  const Screen = SCREENS[seg.id]!;
  const segProgress = ((elapsed - STARTS[idx]!) / seg.ms) * 100;

  return (
    <div ref={stageRef}>
      <BrowserFrame route={seg.route}>
        {/* Stage */}
        <div
          className="app-backdrop relative aspect-video cursor-pointer overflow-hidden bg-canvas"
          onClick={() => setPlaying((p) => !p)}
          role="button"
          tabIndex={0}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPlaying((p) => !p);
            }
          }}
        >
          {/* Chapter content with camera push */}
          <div key={seg.id} className="chapter-screen absolute inset-0">
            <div className="ken-burns h-full w-full">
              <Screen />
            </div>
          </div>

          {/* Dip-to-black cut */}
          <div key={`cut-${idx}`} className="cut-flash pointer-events-none absolute inset-0 bg-canvas" />

          {/* Status strip */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-canvas/90 via-canvas/40 to-transparent px-4 py-3">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
              <span className={`h-2 w-2 rounded-full ${playing ? "bg-critical animate-pulse" : "bg-muted"}`} />
              <span className={playing ? "text-critical" : "text-muted"}>{playing ? "REC · Playing" : "Paused"}</span>
            </span>
            <span className="tabular text-[11px] text-muted">
              {fmt(elapsed)} / {fmt(TOTAL_MS)}
            </span>
          </div>

          {/* Broadcast lower-third */}
          <div
            key={`ll-${idx}`}
            className="lower-third pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 rounded-lg border border-edge/60 bg-canvas/85 px-3 py-2 backdrop-blur"
          >
            <span className="h-9 w-1 rounded-full bg-accent" aria-hidden="true" />
            <span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
                Chapter {idx + 1} / {SEGMENTS.length}
              </span>
              <span className="display-heading block text-sm text-ink sm:text-base">{seg.label}</span>
            </span>
          </div>

          {/* Center play (only when paused) */}
          {!playing ? (
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/60 bg-canvas/85 text-accent"
              aria-hidden="true"
            >
              <svg width="22" height="22" viewBox="0 0 18 18" fill="currentColor">
                <path d="M5 3.5v11l9-5.5z" />
              </svg>
            </span>
          ) : null}
        </div>

        {/* Transport */}
        <div className="border-t border-edge/70 bg-panel/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-canvas transition-transform hover:scale-105"
            >
              {playing ? (
                <svg width="13" height="13" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                  <rect x="3" y="2" width="4" height="14" rx="1" />
                  <rect x="11" y="2" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.5v11l9-5.5z" />
                </svg>
              )}
            </button>

            <span className="tabular hidden shrink-0 text-[11px] text-muted sm:block">
              {fmt(elapsed)} / {fmt(TOTAL_MS)}
            </span>

            {/* Seekable chapter segments */}
            <div className="flex flex-1 gap-1">
              {SEGMENTS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setElapsed(STARTS[i]!)}
                  aria-label={`Jump to ${s.label}`}
                  title={s.label}
                  className="seg relative h-2 flex-none overflow-hidden rounded-full bg-edge/80"
                  style={{ flexGrow: s.ms, flexBasis: 0 }}
                >
                  <span
                    className="seg-fill absolute inset-y-0 left-0 bg-accent"
                    style={{
                      width:
                        i < idx ? "100%" : i > idx ? "0%" : `${segProgress}%`,
                    }}
                  />
                </button>
              ))}
            </div>

            <span className="hidden shrink-0 text-[11px] font-semibold text-ink md:block">{seg.label}</span>
          </div>

          {/* Chapter pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SEGMENTS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setElapsed(STARTS[i]!);
                  setPlaying(true);
                }}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                  i === idx
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-edge text-muted hover:border-accent/50 hover:text-ink"
                }`}
              >
                <span className="tabular mr-1 opacity-70">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}
