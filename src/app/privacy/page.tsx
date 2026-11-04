import type { Metadata } from "next";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Privacy — Sportmetryx Football",
  description:
    "How Sportmetryx handles data: synthetic demo data by default, consent-governed athlete records, cookies, demo orders and your rights.",
};

const SECTIONS: Array<[title: string, body: string]> = [
  [
    "The short version",
    "This demo runs on clearly-labeled synthetic data — it is not real athlete data. The website stores only what is needed to keep you signed in and to place demo orders. No real payments are processed, ever.",
  ],
  [
    "What we collect",
    "Account sessions (a session cookie when you sign in), guest-mode preference (a single cookie), and the details you type into the demo checkout form (email and name) — which are stored only in the demo database to show the order history screen.",
  ],
  [
    "Athlete data & consent",
    "The platform is built around consent: athlete records are visible only to roles the athlete has consented to, every access is written to a tamper-evident audit log, and consent can be withdrawn. In this demo, all athlete data is synthetic.",
  ],
  [
    "Cookies",
    "Strictly functional: session, guest mode and cart contents. No advertising or cross-site tracking cookies are used in this demo.",
  ],
  [
    "Where data lives",
    "The site runs on Vercel's edge network; the database runs on Neon (PostgreSQL). Both are infrastructure providers under their own privacy policies.",
  ],
  [
    "Your rights",
    "You can request access to, correction of, or deletion of anything you submitted (for example a demo order email) by using the contact details on the Book a demo page. Demo data can be purged on request without argument.",
  ],
  [
    "Not medical data",
    "Sportmetryx is decision support, not a medical device. Nothing on this site should be treated as medical information or advice.",
  ],
  [
    "Status of this notice",
    "Draft for the prototype stage — before launch with real clubs, this notice will be reviewed by counsel and updated with the legal entity, region-specific rights (GDPR/CCPA) and retention periods.",
  ],
];

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-4xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Legal</p>
        <h1 className="hero-title mt-3">Privacy</h1>
        <p className="lede mt-4">
          Plain language, because a consent-governed product should be able to explain itself.
        </p>
        <p className="mt-2 text-xs text-muted">Last updated: November 2026 · prototype stage</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10 md:px-10">
        <Reveal>
          <div className="space-y-7">
            {SECTIONS.map(([title, body]) => (
              <div key={title}>
                <h2 className="text-lg font-semibold text-ink">{title}</h2>
                <p className="body-md mt-2">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-10 text-center">
          <p className="lede">Questions about your data?</p>
          <a href="/demo" className="btn-primary mt-5 inline-flex">
            Contact us
          </a>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
