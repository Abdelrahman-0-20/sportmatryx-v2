"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Loading athlete-day records…",
  "Validity gates armed…",
  "Consent & audit chain verified…",
];

/**
 * BootScreen — a one-second "system boot" overlay shown on the first visit of
 * a browser session. Sets `smx_booted` in sessionStorage so it never repeats,
 * and skips entirely when the visitor prefers reduced motion.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "done">("hidden");

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("smx_booted") === "1";
    } catch {
      alreadyBooted = false;
    }
    if (alreadyBooted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        sessionStorage.setItem("smx_booted", "1");
      } catch {
        /* storage blocked — nothing to persist */
      }
      return;
    }
    const show = window.requestAnimationFrame(() => setPhase("visible"));
    const exit = window.setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem("smx_booted", "1");
      } catch {
        /* storage blocked — boot will replay next visit */
      }
    }, 1900);
    const remove = window.setTimeout(() => setPhase("hidden"), 2500);
    return () => {
      window.cancelAnimationFrame(show);
      window.clearTimeout(exit);
      window.clearTimeout(remove);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className={`boot-overlay ${phase === "done" ? "is-done" : ""}`} aria-hidden="true">
      <div className="boot-card">
        <div className="display-heading text-xl">
          <span className="text-accent">Sportmetryx</span> Football
        </div>
        <ul className="mt-3 space-y-1">
          {LINES.map((line, i) => (
            <li
              key={line}
              className="boot-line text-[11px] text-muted"
              style={{ animationDelay: `${150 + i * 330}ms` }}
            >
              <span className="text-accent">›</span> {line}
            </li>
          ))}
        </ul>
        <div className="boot-bar mt-3">
          <span className="boot-bar-fill" />
        </div>
        <div className="boot-status mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-ready">
          System ready
        </div>
      </div>
    </div>
  );
}
