import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { DemoForm } from "@/components/marketing/demo-form";
import { GreetingVideo } from "@/components/marketing/greeting-video";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Book a demo — Sportmetryx",
  description:
    "A 30-minute walkthrough of the Sportmetryx platform on live data, plus what a pilot season looks like on your own.",
};

export default async function DemoPage() {
  const dict = await getDict();
  const t = dict.demo;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      {/* Hero: headline + founder greeting side by side — both render eagerly. */}
      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="hero-title mt-3 max-w-3xl">
              {t.h1a} <span className="text-accent">{t.h1b}</span>
            </h1>
            <p className="lede mt-5 max-w-2xl">{t.lede}</p>
          </div>
          <GreetingVideo title={t.greetingTitle} note={t.greetingNote} />
        </div>
      </section>

      {/* Agenda + booking form. The form is the page's entire purpose, so it is
          never wrapped in Reveal — it must be visible in the first capture. */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label={t.agendaTitle}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <h2 className="h-sec">{t.agendaTitle}</h2>
            <ol className="mt-5 space-y-3">
              {t.agenda.map((item, i) => (
                <li key={item.title} className="surface flex gap-3 rounded-2xl p-4">
                  <span className="display-heading text-xl text-accent">{i + 1}</span>
                  <span>
                    <span className="display-heading block text-sm">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{item.body}</span>
                  </span>
                </li>
              ))}
            </ol>

            <h2 className="h-sec mt-9">{t.bringTitle}</h2>
            <ul className="mt-4 space-y-2.5">
              {t.bring.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 text-sm leading-relaxed text-muted">
              {t.notReady}{" "}
              <Link href="/guest" className="text-accent underline-offset-2 hover:underline">
                {t.notReadyGuest}
              </Link>
              {t.notReadyMid}{" "}
              <Link href="/pilot" className="text-accent underline-offset-2 hover:underline">
                {t.notReadyPilot}
              </Link>{" "}
              {t.notReadyTail}
            </p>
          </div>

          <div id="book" className="surface scroll-mt-24 rounded-2xl p-6">
            <div className="display-heading text-lg">{t.formCardTitle}</div>
            <p className="mb-4 mt-1 text-sm text-muted">{t.formCardNote}</p>
            <DemoForm labels={t.form} />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
