"use client";

/** Route error boundary — branded recovery screen instead of a raw crash. */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Signal lost</p>
      <h1 className="hero-title mt-4">Something broke.</h1>
      <p className="lede mt-4 max-w-md">
        The play didn&apos;t come off. Try again — if it keeps failing, the reference below helps
        us find it fast.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/" className="btn-ghost">
          Back home
        </a>
      </div>
      {error?.digest ? (
        <p className="mt-8 text-[11px] text-muted">Error reference: {error.digest}</p>
      ) : null}
    </main>
  );
}
