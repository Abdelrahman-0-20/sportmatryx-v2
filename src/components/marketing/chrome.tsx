import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { BackToTop } from "@/components/marketing/back-to-top";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";
import { getDict, getLocale } from "@/lib/i18n/server";

/**
 * Shared marketing chrome — sticky glass header (with language switcher) and
 * the animated, logically grouped footer: what it is → what to do →
 * trust & legal. Localized via the i18n dictionaries.
 */

export async function MarketingHeader() {
  const [dict, locale] = await Promise.all([getDict(), getLocale()]);

  const nav = [
    { href: "/platform", label: dict.nav.platform },
    { href: "/solutions", label: dict.nav.solutions },
    { href: "/tactics", label: dict.nav.tactics },
    { href: "/proof", label: dict.nav.proof },
    { href: "/marketplace", label: dict.nav.marketplace },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-edge/70 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 md:px-10">
        <Link href="/" className="display-heading text-xl tracking-tight">
          <span className="text-accent">Sportmetryx</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <LanguageSwitcher locale={locale} label={dict.lang.label} />
          <Link
            href="/roster"
            className="hidden font-medium text-muted transition-colors hover:text-ink lg:block"
          >
            {dict.header.athletes}
          </Link>
          <Link
            href="/login"
            className="hidden font-medium text-muted transition-colors hover:text-ink sm:block"
          >
            {dict.header.signIn}
          </Link>
          <Link href="/demo" className="btn-primary">
            {dict.header.bookDemo}
          </Link>
        </div>
      </div>
    </header>
  );
}

function FooterMark() {
  return (
    <span
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-edge bg-panel shadow-[0_0_20px_-8px_rgba(95,208,240,0.5)]"
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
        <path
          d="M20 18 L34 32 L20 46"
          stroke="#5fd0f0"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36 18 L50 32 L36 46"
          stroke="#5fd0f0"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </span>
  );
}

export async function MarketingFooter() {
  const dict = await getDict();
  const f = dict.footer;

  /* Logical grouping: the product → ways in → trust + legal. */
  const columns: Array<{ title: string; links: Array<[href: string, label: string]> }> = [
    {
      title: f.product,
      links: [
        ["/platform", dict.nav.platform],
        ["/solutions", dict.nav.solutions],
        ["/tactics", dict.nav.tactics],
        ["/marketplace", dict.nav.marketplace],
        ["/roster", dict.header.athletes],
      ],
    },
    {
      title: f.getStarted,
      links: [
        ["/demo", f.demo],
        ["/pilot", f.pilot],
        ["/guest", f.guest],
        ["/share", dict.share.eyebrow],
        ["/login", dict.header.signIn],
      ],
    },
    {
      title: f.trust,
      links: [
        ["/proof", dict.nav.proof],
        ["/methodology", dict.methodology.eyebrow],
        ["/changelog", f.changelog],
        ["/investors", dict.investors.eyebrow],
        ["/privacy", f.privacy],
        ["/terms", f.terms],
      ],
    },
  ];

  return (
    <footer>
      {/* Animated light along the top edge */}
      <div className="footer-rule" aria-hidden="true" />
      <div className="bg-panel-2/40">
        {/* Brand + conversion CTAs */}
        <div className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <FooterMark />
                <div>
                  <div className="display-heading text-xl">
                    <span className="text-accent">Sportmetryx</span>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{f.tagline}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link href="/demo" className="btn-primary btn-sheen">
                  {f.demo}
                </Link>
                <Link href="/pilot" className="btn-ghost">
                  {f.pilotCta}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Link columns — staggered scroll-in: product → actions → trust */}
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-11 sm:grid-cols-3 md:px-10">
          {columns.map((col, i) => (
            <Reveal key={col.title} delay={i * 90}>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-3.5 text-sm">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="f-link text-muted">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-edge/70">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-5 text-center text-xs text-muted md:flex-row md:justify-between md:px-10 md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                {f.chip}
              </span>
              <span>{f.disclaimer}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{f.copyright}</span>
              <BackToTop />
            </div>
          </div>
          <p className="px-6 pb-4 text-center text-[11px] leading-relaxed text-muted md:px-10">
            {f.medical}
          </p>
        </div>
      </div>
    </footer>
  );
}
