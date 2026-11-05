import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { ShareCardStudio } from "@/components/marketing/share-studio";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Share a readiness card — Sportmetryx Football",
  description:
    "Generate a branded squad-readiness card and post it anywhere — WhatsApp, X and LinkedIn previews included.",
};

export default async function SharePage() {
  const t = (await getDict()).share;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-2xl">{t.lede}</p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <Reveal>
          <ShareCardStudio labels={t} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-12 text-center">
          <h2 className="h-sec">{t.ctaTitle}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/guest" className="btn-primary">
              Open the live product
            </Link>
            <Link href="/pilot" className="btn-ghost">
              Join the pilot
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
