import { cn } from "@/lib/utils";

/**
 * The single, honest description of what this marketplace actually is.
 *
 * Rendered identically on the catalogue, the product detail page and the cart
 * so the buyer reads ONE demo-truth message — never three slightly different
 * versions of it buried in 11px text.
 */
export function DemoTruthBanner({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/[0.07] px-4 py-3 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-accent"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.6" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M7 6.4v3.4M7 4.3v.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
          Demo marketplace
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-ink">
          Prices are display-only and checkout is simulated — no payment is processed
          and no money moves. Sample previews and CSV downloads are real, free and
          instant.
        </p>
      </div>
    </div>
  );
}
