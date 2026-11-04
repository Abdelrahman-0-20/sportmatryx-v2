import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export default async function NotFound() {
  const nf = (await getDict()).nf;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">{nf.eyebrow}</p>
      <h1 className="hero-title mt-4">{nf.h1}</h1>
      <p className="lede mt-4 max-w-md">{nf.lede}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          {nf.btnHome}
        </Link>
        <Link href="/marketplace" className="btn-ghost">
          {nf.btnMarket}
        </Link>
        <Link href="/guest" className="btn-ghost">
          {nf.btnGuest}
        </Link>
      </div>
      <p className="mt-10 text-xs text-muted">{nf.note}</p>
    </main>
  );
}
