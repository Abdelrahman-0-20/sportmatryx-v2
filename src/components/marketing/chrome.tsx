import Link from "next/link";

/**
 * Shared marketing chrome — sticky glass header with Book-a-demo CTA and the
 * multi-column footer used by every public page (home, platform, solutions,
 * proof, demo).
 */

const NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/tactics", label: "Tactics" },
  { href: "/proof", label: "Proof" },
  { href: "/marketplace", label: "Marketplace" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge/70 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 md:px-10">
        <Link href="/" className="display-heading text-xl tracking-tight">
          <span className="text-accent">Sportmetryx</span> Football
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/roster" className="hidden font-medium text-muted transition-colors hover:text-ink lg:block">
            Athletes
          </Link>
          <Link href="/login" className="hidden font-medium text-muted transition-colors hover:text-ink sm:block">
            Sign in
          </Link>
          <Link href="/demo" className="btn-primary">
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  );
}

const EXPLORE: Array<[href: string, label: string]> = [
  ["/platform", "Platform"],
  ["/solutions", "Solutions"],
  ["/proof", "Proof"],
  ["/demo", "Book a demo"],
];

const PRODUCT: Array<[href: string, label: string]> = [
  ["/marketplace", "Marketplace"],
  ["/roster", "Athletes"],
  ["/guest", "Continue as guest"],
  ["/login", "Sign in"],
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-edge/70 bg-panel-2/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <div className="display-heading text-xl tracking-tight">
            <span className="text-accent">Sportmetryx</span> Football
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Human performance intelligence for football — validity-gated readiness, explainable
            scores and consent-governed data. Built by Healthmetryx.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted/70">
            Decision support · not a medical device
          </p>
        </div>
        <nav aria-label="Explore">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Explore</div>
          <ul className="mt-4 space-y-3 text-sm">
            {EXPLORE.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Product">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Product</div>
          <ul className="mt-4 space-y-3 text-sm">
            {PRODUCT.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-edge/70 px-6 py-5 text-center text-xs text-muted md:px-10">
        Decision support only. Not a medical device. Prototype models are for research and demonstration.
        &copy; Sportmetryx. All athlete data governed by consent and access controls.
      </div>
    </footer>
  );
}
