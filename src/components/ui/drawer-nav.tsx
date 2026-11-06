"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * DrawerNav — the mobile/tablet navigation both shells share.
 *
 * Below the `md` breakpoint the marketing header hides its nav and the app
 * sidebar is `md:flex`, so without this there is no way to move around the
 * product on a phone. Renders a hamburger trigger + a right-side slide-in
 * panel with the same links, closes on navigation, on Escape, and on
 * backdrop click, and locks background scroll while open.
 */

export type DrawerItem = { href: string; label: string };

export function DrawerNav({
  items,
  label,
  cta,
  footer,
  align = "right",
}: {
  items: DrawerItem[];
  /** Accessible name for the trigger button. */
  label: string;
  cta?: DrawerItem;
  footer?: ReactNode;
  /** Which edge the panel slides from. */
  align?: "right" | "left";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = "smx-drawer-nav";

  // Close whenever the route changes so the panel never covers new content.
  useEffect(() => setOpen(false), [pathname]);

  // Lock background scroll + Escape to close while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? `Close ${label}` : `Open ${label}`}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-edge bg-panel-2 text-ink transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label={`Close ${label}`}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
          />
          <nav
            id={panelId}
            aria-label={label}
            className={`absolute top-0 ${align === "right" ? "right-0" : "left-0"} flex h-dvh w-[82vw] max-w-xs flex-col gap-1 overflow-y-auto border-edge bg-panel-2 px-4 py-4 shadow-2xl ${
              align === "right" ? "border-l" : "border-r"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label={`Close ${label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-edge text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                className={`min-h-11 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active(item.href)
                    ? "bg-accent/12 text-accent"
                    : "text-ink/90 hover:bg-panel hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {cta ? (
              <Link
                href={cta.href}
                className="btn-primary mt-3 min-h-11 justify-center rounded-lg px-4 py-3 text-center"
              >
                {cta.label}
              </Link>
            ) : null}

            {footer ? <div className="mt-auto border-t border-edge pt-3">{footer}</div> : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
