import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Platform — Sportmetryx",
  description:
    "The Sportmetryx platform: team command, explainable performance index, load and recovery intelligence, environment context, athlete twin, marketplace and governance.",
};

type Status = "ESTABLISHED" | "DERIVED" | "BETA";

/* Codes and status enums don't translate — names/bodies come from dict. */
const MODULE_META: Array<{ code: string; status: Status }> = [
  { code: "SMX-01", status: "ESTABLISHED" },
  { code: "SMX-02", status: "ESTABLISHED" },
  { code: "SMX-03", status: "DERIVED" },
  { code: "SMX-04", status: "DERIVED" },
  { code: "SMX-05", status: "DERIVED" },
  { code: "SMX-06", status: "BETA" },
  { code: "SMX-07", status: "ESTABLISHED" },
  { code: "SMX-08", status: "ESTABLISHED" },
];

const STATUS_STYLE: Record<Status, string> = {
  ESTABLISHED: "text-positive",
  DERIVED: "text-accent",
  BETA: "text-prototype",
};

const STATUS_KEY: Record<Status, "established" | "derived" | "beta"> = {
  ESTABLISHED: "established",
  DERIVED: "derived",
  BETA: "beta",
};

export default async function PlatformPage() {
  const t = (await getDict()).platform;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">{t.lede}</p>
      </section>

      {/* Pipeline strip */}
      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10" aria-label="Data pipeline">
        <Reveal>
          <ol className="grid gap-3 md:grid-cols-5">
            {t.pipeline.map((step, i) => (
              <li key={step.title} className="relative surface rounded-2xl p-5">
                <span className="display-heading text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="display-heading mt-1 text-base">{step.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" aria-label="Modules">
        <Reveal>
          <h2 className="h-sec">{t.modulesTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.modulesLede}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.modules.map((m, i) => {
              const meta = MODULE_META[i]!;
              return (
                <li key={meta.code} className="surface flex flex-col rounded-2xl p-6">
                  <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em]">
                    <span className="text-muted">{meta.code}</span>
                    <span className={STATUS_STYLE[meta.status]}>{t.statuses[STATUS_KEY[meta.status]]}</span>
                  </span>
                  <span className="display-heading mt-2 text-lg">{m.name}</span>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{m.body}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* Governance */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Governance principles">
        <Reveal>
          <h2 className="h-sec">{t.principlesTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.principles.map((item) => (
              <div key={item.title} className="surface rounded-2xl p-5">
                <div className="display-heading text-base text-accent">{item.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl p-8 text-center">
            <h2 className="h-sec">{t.ctaH2}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{t.ctaLede}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                {t.ctaBtn1}
              </Link>
              <Link href="/guest" className="btn-ghost">
                {t.ctaBtn2}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
