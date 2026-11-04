import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms — Sportmetryx Football",
  description:
    "Terms of use for the Sportmetryx Football platform: acceptable use, liability and contact.",
};

export default async function TermsPage() {
  const t = (await getDict()).terms;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-4xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3">{t.h1}</h1>
        <p className="lede mt-4">{t.lede}</p>
        <p className="mt-2 text-xs text-muted">{t.updated}</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:px-10">
        <Reveal>
          <div className="space-y-7">
            {t.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                <p className="body-md mt-2">{section.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-10 text-center">
          <p className="lede">{t.ctaQ}</p>
          <Link href="/demo" className="btn-primary mt-5 inline-flex">
            {t.ctaBtn}
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
