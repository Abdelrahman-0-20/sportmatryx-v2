import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsEvents } from "@/components/analytics-events";import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sportmatryx-v2.vercel.app"),
  title: "Sportmetryx",
  description:
    "Human Performance Intelligence for sport — validity-gated readiness, explainable scores, consent-governed data.",
  openGraph: {
    siteName: "Sportmetryx",
    title: "Sportmetryx — decisions you can defend",
    description:
      "Validity-gated readiness intelligence for sport: one daily readiness score per athlete, always explainable, consent-governed.",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportmetryx — decisions you can defend",
    description: "Validity-gated readiness intelligence for sport.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="app-backdrop">
        {children}
        <Analytics />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
