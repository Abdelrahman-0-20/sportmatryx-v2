"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveal — fades/slides children into view the first time they scroll into
 * the viewport. Adds the `is-visible` class which CSS transitions use; also
 * drives child animations like the readiness-bar growth (`.is-visible .…`).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={[className, visible ? "is-visible" : ""].filter(Boolean).join(" ")}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * CountUp — animates a number from 0 to `value` the first time it enters the
 * viewport (respecting reduced-motion, which shows the final value at once).
 */
export function CountUp({
  value,
  duration = 1300,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Start at the final value so the server renders a real number: without JS
  // (or before the observer fires) stats must never read "0".
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = window.requestAnimationFrame(() => setDisplay(value));
      return () => window.cancelAnimationFrame(id);
    }
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          io.disconnect();
          if (prefersReducedMotion()) {
            setDisplay(value);
            return;
          }
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("en-US")}
    </span>
  );
}
