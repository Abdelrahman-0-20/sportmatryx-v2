import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Changelog — Sportmetryx",
  description:
    "What shipped at Sportmetryx — release notes: design, product, data and infrastructure changes.",
};

export default async function ChangelogPage() {
  const t = (await getDict()).changelog;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3">{t.h1}</h1>
        <p className="lede mt-4 max-w-2xl">{t.lede}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="Releases">
        <Reveal>
          <ol className="relative space-y-10 border-l border-edge/70 pl-7">
            {t.releases.map((r) => (
              <li
                key={r.version}
                className="relative grid gap-x-10 gap-y-3 md:grid-cols-[10rem_minmax(0,1fr)]"
              >
                <span
                  className="absolute -left-[35px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-canvas"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-start md:gap-2">
                  <span className="rounded-full border border-accent bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                    {r.version}
                  </span>
                  <span className="tabular text-xs text-muted">{r.date}</span>
                </div>
                <div className="min-w-0 max-w-3xl">
                  <h2 className="h-sec">{r.title}</h2>
                  <ul className="mt-4 space-y-2">
                    {r.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-12 text-center">
          <h2 className="h-sec">{t.ctaH2}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              {t.btn2}
            </Link>
            <Link href="/proof" className="btn-ghost">
              {t.btn1}
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
