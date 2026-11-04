import type { Metadata } from "next";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Terms — Sportmetryx Football",
  description:
    "Terms of use for the Sportmetryx Football platform: acceptable use, liability and contact.",
};

const SECTIONS: Array<[title: string, body: string]> = [
  [
    "Acceptance",
    "By using this website you agree to these terms. If you do not agree, please do not use the service.",
  ],
  [
    "Service availability",
    "Features, data and pricing shown on the platform may change without notice as the product evolves.",
  ],
  [
    "Staff-owned decisions",
    "The platform informs performance decisions. Clinical, selection and clearance calls remain the responsibility of qualified staff.",
  ],
  [
    "Checkout",
    "Marketplace checkout completes orders for data products. Review the license terms attached to each product before purchasing.",
  ],
  [
    "Acceptable use",
    "Do not attempt to disrupt the service, probe infrastructure, scrape at scale, upload malicious content, or misrepresent sample data. Automated testing of the live site requires written permission.",
  ],
  [
    "Intellectual property",
    "The Sportmetryx brand, interface and datasets belong to Healthmetryx. Third-party footage on this site is used under free stock licenses. You may not resell platform datasets as third-party data — ever.",
  ],
  [
    "No warranties",
    "The service is provided “as is”, without warranties of any kind, express or implied — including fitness for a particular purpose.",
  ],
  [
    "Limitation of liability",
    "To the maximum extent permitted by law, Healthmetryx is not liable for indirect, incidental or consequential damages arising from use of this platform.",
  ],
  [
    "Governing law & contact",
    "Placeholder pending the legal entity: [JURISDICTION]. Questions or notices: use the Book a demo page. These terms will be revised as the platform moves to production with real clubs.",
  ],
];

export default function TermsPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-4xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Legal</p>
        <h1 className="hero-title mt-3">Terms</h1>
        <p className="lede mt-4">
          The fine print: what the platform is, what it is not, and the rules of the road.
        </p>
        <p className="mt-2 text-xs text-muted">Last updated: November 2026</p>
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
          <p className="lede">Want the production terms and a real conversation?</p>
          <a href="/demo" className="btn-primary mt-5 inline-flex">
            Book a demo
          </a>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
