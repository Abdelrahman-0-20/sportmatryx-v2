"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * LanguageSwitcher — globe dropdown for EN / ES / PT / ZH. Persists the
 * choice in a cookie (read server-side by pages) and refreshes the router so
 * server components re-render in the new language.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: Locale) => {
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = code;
    setOpen(false);
    if (code !== locale) router.refresh();
  };

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex items-center gap-1.5 rounded-full border border-edge/80 bg-panel/70 px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-ink"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.75 5.7 3.75 9S14.5 18.3 12 21c-2.5-2.7-3.75-5.7-3.75-9S9.5 5.7 12 3z" />
        </svg>
        <span className="hidden sm:inline">
          {current.flag} {current.label}
        </span>
        <span aria-hidden="true" className="hidden text-[9px] sm:inline">
          ▼
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-edge/80 bg-panel py-1.5 shadow-[var(--shadow-float)]"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => pick(l.code)}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-muted hover:bg-panel-2 hover:text-ink"
                  }`}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {l.flag}
                  </span>
                  <span className="flex-1">{l.label}</span>
                  {active ? (
                    <span aria-hidden="true" className="text-xs">
                      ✓
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
