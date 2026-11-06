"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * MarketingNav — the desktop primary nav.
 *
 * Server-rendered chrome cannot know the active route, so links shipped with
 * no current-page indication at all. This client component adds `aria-current`
 * plus a visible active state, and keeps the shared focus ring.
 */
export function MarketingNav({ items, label }: { items: { href: string; label: string }[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-7 text-sm md:flex" aria-label={label}>
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-1 py-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? "text-accent" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
