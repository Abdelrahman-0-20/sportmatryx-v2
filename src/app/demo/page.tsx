import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { DemoForm } from "@/components/marketing/demo-form";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Book a demo — Sportmetryx Football",
  description:
    "A 30-minute walkthrough of the Sportmetryx platform on live synthetic data, plus what a pilot season looks like on your own.",
};

const AGENDA: Array<[title: string, body: string]> = [
  ["The five screens (10 min)", "Home → Athletes readiness board → Player 360 → Marketplace → governance view."],
  ["Your data questions (10 min)", "What you collect today, how it maps to the combined athlete-day record, what validity gates would flag."],
  ["The pilot plan (10 min)", "Which squad, which season window, which success numbers — agreed before anything starts."],
];

const BRING: string[] = [
  "The exports you already produce (GPS, wellness, session logs — any format)",
  "Who sits in the decision loop every morning",
  "What a good vs bad week looks like for your squad",
];

export default function DemoPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Book a demo</p>
        <h1 className="hero-title mt-3 max-w-3xl">
          See it run on <span className="text-accent">your questions.</span>
        </h1>
        <p className="lede mt-5 max-w-2xl">
          Thirty minutes, live product, no slides. We walk the platform on synthetic data, map it
          to what you already collect, and sketch the pilot — you leave knowing exactly what
          week one looks like.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="h-sec">What the 30 minutes look like</h2>
              <ol className="mt-4 space-y-3">
                {AGENDA.map(([title, body], i) => (
                  <li key={title} className="flex gap-3 surface rounded-2xl p-5">
                    <span className="h-sec text-accent">{i + 1}</span>
                    <span>
                      <span className="display-heading block text-sm">{title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <h2 className="h-sec mt-8">Bring if you can</h2>
              <ul className="mt-3 space-y-2">
                {BRING.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[11px] text-muted">
                Not ready to talk?{" "}
                <Link href="/guest" className="text-accent underline-offset-2 hover:underline">
                  Continue as guest
                </Link>
                , or join the{" "}
                <Link href="/pilot" className="text-accent underline-offset-2 hover:underline">
                  pilot waitlist
                </Link>{" "}
                and we&apos;ll reach out when a slot opens.
              </p>
            </div>

            <div className="surface rounded-2xl p-7">
              <div className="display-heading text-lg">Request a slot</div>
              <p className="mb-4 mt-1 text-xs text-muted">
                Fill this in — it opens your mail app with everything prefilled.
              </p>
              <DemoForm />
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
