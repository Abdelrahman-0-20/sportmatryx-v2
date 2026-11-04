import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404 · Off the pitch</p>
      <h1 className="hero-title mt-4">Page not found.</h1>
      <p className="lede mt-4 max-w-md">
        The link is broken or the page moved. Every athlete is where they should be — this one
        isn&apos;t.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/marketplace" className="btn-ghost">
          Open marketplace
        </Link>
        <Link href="/guest" className="btn-ghost">
          Continue as guest
        </Link>
      </div>
      <p className="mt-10 text-xs text-muted">
        Decision support only. Not a medical device. &copy; Sportmetryx
      </p>
    </main>
  );
}
