/** Route-level loading UI — shown during every navigation (App Router). */
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm text-center" role="status" aria-live="polite">
        <div className="display-heading text-lg">
          <span className="text-accent">Sportmetryx</span>
        </div>
        <div className="mt-5 space-y-2.5" aria-hidden="true">
          <div className="shimmer h-3.5 w-full rounded-full" />
          <div className="shimmer h-3.5 w-5/6 rounded-full" />
          <div className="shimmer h-3.5 w-2/3 rounded-full" />
        </div>
      </div>
    </div>
  );
}
