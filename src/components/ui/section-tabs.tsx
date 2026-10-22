"use client";

// NEW FILE — section-tabs.tsx
// In-page tab bar shared by the Athletes section pages (roster, team command,
// interventions, position room, practice, game readiness, recovery, environment).
// Highlights the active route automatically via usePathname.

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/roster", label: "Athletes" },
  { href: "/team-command", label: "Team overview" },
  { href: "/interventions", label: "Interventions" },
  { href: "/position-room", label: "Positions" },
  { href: "/practice-command", label: "Practice" },
  { href: "/game-readiness", label: "Game readiness" },
  { href: "/recovery-command", label: "Recovery" },
  { href: "/environment-travel", label: "Environment" },
];

export function SectionTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Athletes section" className="mb-5 flex flex-wrap gap-2 border-b border-edge pb-3">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={active
              ? "rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
              : "rounded-md border border-edge bg-panel-2 px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink"}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
