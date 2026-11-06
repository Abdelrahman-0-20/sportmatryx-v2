import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms — Sportmetryx",
  description:
    "Terms of use for the Sportmetryx platform: acceptable use, liability and contact.",
};

const CONTACT_EMAIL = "sportmatryx@protonmail.com";

/**
 * Legal template (shared with /privacy): hero → anchor nav + clause sections →
 * CTA band. Clause bodies come from the dictionary; any contact address in
 * them is rendered as a real mailto link so notices reach a human directly.
 */
function withContact(body: string): ReactNode[] {
  const parts = body.split(CONTACT_EMAIL);
  return parts.flatMap((part, i) => {
    const nodes: ReactNode[] = [];
    if (i > 0) {
      nodes.push(
        <a
          key={`mail-${i}`}
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          {CONTACT_EMAIL}
        </a>,
      );
    }
    if (part) nodes.push(<span key={`text-${i}`}>{part}</span>);
    return nodes;
  });
}

export default async function TermsPage() {
  const dict = await getDict();
  const t = dict.terms;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3">{t.h1}</h1>
        <p className="lede mt-4 max-w-2xl">{t.lede}</p>
        <p className="mt-3 text-sm text-muted">{t.updated}</p>
      </section>

      {/* Anchor nav across clauses + the clauses themselves */}
      <section className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {dict.footer.trust}
            </div>
            <ol className="mt-4 space-y-0.5 border-l border-edge/70">
              {t.sections.map((section, i) => (
                <li key={section.title}>
                  <a
                    href={`#clause-${i + 1}`}
                    className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-3 text-sm text-muted transition-colors hover:border-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="tabular shrink-0 text-[11px] font-bold text-accent/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 max-w-3xl">
            <Reveal>
              {t.sections.map((section, i) => (
                <section
                  key={section.title}
                  id={`clause-${i + 1}`}
                  className="scroll-mt-24 border-t border-edge/40 pb-8 pt-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="h-sec">{section.title}</h2>
                  <p className="body-md mt-3">{withContact(section.body)}</p>
                </section>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA — same band shape as /privacy; direct contact stays one click away */}
      <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-10 text-center">
          <h2 className="h-sec">{t.ctaQ}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              {t.ctaBtn}
            </Link>
            {/* Shared legal contact label lives with the privacy copy (one template). */}
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-ghost">
              {dict.privacy.ctaBtn}
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
