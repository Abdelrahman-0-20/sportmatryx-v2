import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
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
  title: "Sportmetryx Football",
  description:
    "Human Performance Intelligence for Football. Decision support only — not a medical device. Prototype models are for research and demonstration.",
  openGraph: {
    siteName: "Sportmetryx Football",
    title: "Sportmetryx Football — decisions you can defend",
    description:
      "Validity-gated readiness intelligence for football: one daily readiness score per athlete, always explainable, consent-governed.",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportmetryx Football — decisions you can defend",
    description: "Validity-gated readiness intelligence for football.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="app-backdrop">{children}</body>
    </html>
  );
}
