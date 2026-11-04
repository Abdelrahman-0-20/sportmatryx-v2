import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Changelog — Sportmetryx Football",
  description:
    "What shipped on Sportmetryx Football — release notes: design, product, data and infrastructure changes.",
};

type Release = {
  version: string;
  date: string;
  title: string;
  items: string[];
};

const RELEASES: Release[] = [
  {
    version: "v2.3",
    date: "4 Nov 2026",
    title: "Growth & credibility layer",
    items: [
      "Pilot program: public waitlist with a real backend table and weekly slot allocation",
      "Public changelog (this page) — visible shipping velocity",
      "Branded route loading and error states",
    ],
  },
  {
    version: "v2.2",
    date: "4 Nov 2026",
    title: "Cinematic layer",
    items: [
      "Home hero: 60-second crossfading background film sequence (5 licensed clips)",
      "Video banners behind Marketplace and Athletes page headers",
      "Cinematic product-tour player: browser chrome, title card, camera pushes, lower-thirds",
      "Favicon, generated share card (OG image), branded 404",
      "Privacy & terms pages, sitemap.xml, robots.txt, OpenGraph/Twitter metadata",
    ],
  },
  {
    version: "v2.1",
    date: "4 Nov 2026",
    title: "Premium redesign & marketing flow",
    items: [
      "Premium dark design system: sentence-case type, gradient surfaces, glowing CTAs",
      "Kitman-style site flow: Platform, Solutions, Proof, Demo pages",
      "3D tactical board: formation switcher, animated phases, coaching drill, systems library",
      "Marketplace premium pass: cinematic spotlight, glowing tabs, primary CTAs, polished checkout",
      "Repo stripped to source + Neon config only (138 tracked files)",
    ],
  },
  {
    version: "v2.0",
    date: "3 Nov 2026",
    title: "Two-version strategy & production data",
    items: [
      "Legacy edition preserved (Sportmatryx.git); v2 established as the commercial edition",
      "Missing production migrations applied — marketplace tables live on Neon",
      "Combined multisport dataset pipeline (50 athletes · 8 sports · 1,431 sessions)",
      "Investor Q&A playbook prepared",
    ],
  },
  {
    version: "v1.x",
    date: "Oct 2026",
    title: "Product foundation",
    items: [
      "Readiness board, Player 360, team command, interventions",
      "Governance: consent records, role-based access, hash-chained audit log",
      "Marketplace catalog, cart and checkout; guest mode",
      "Validity-gated scoring against personal baselines",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-4xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Changelog</p>
        <h1 className="hero-title mt-3">What shipped.</h1>
        <p className="lede mt-4">
          Everything below is already live on the deployments — newest first, written the way
          we&apos;d tell a teammate.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:px-10">
        <Reveal>
          <ol className="relative space-y-10 border-l border-edge/70 pl-7">
            {RELEASES.map((r) => (
              <li key={r.version + r.date} className="relative">
                <span
                  className="absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-canvas"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-accent bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    {r.version}
                  </span>
                  <span className="text-xs text-muted">{r.date}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-ink">{r.title}</h2>
                <ul className="mt-2.5 space-y-1.5">
                  {r.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-prototype/80" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-12 text-center">
          <h2 className="h-sec">We ship weekly. Deploy it yourself.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/proof" className="btn-primary">
              See the proof
            </Link>
            <Link href="/demo" className="btn-ghost">
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
