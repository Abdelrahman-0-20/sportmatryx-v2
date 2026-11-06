import { formatUsdCents } from "@/lib/marketplace/demo-pricing";
import { cn } from "@/lib/utils";

/**
 * ONE canonical price presentation for the marketplace.
 *
 * Every screen (card, spotlight, detail, cart dialog, cart page, checkout
 * summary) renders money through `Price` / `formatPrice` so a price can never
 * be spelled five different ways again.
 *
 * Free and paid are deliberately different SHAPE, not just colour: `--color-ready`
 * and `--color-accent` are the same cyan, so free items get a dashed outline
 * pill with the literal word "Free" while paid items get a plain cyan figure.
 */

/** Plain-text canonical price, e.g. 5900 → "$59.00". */
export function formatPrice(cents: number, currency = "USD"): string {
  const base = formatUsdCents(cents);
  return currency && currency !== "USD" ? `${base} ${currency}` : base;
}

type PriceSize = "sm" | "md" | "lg";

const PAID_SIZE: Record<PriceSize, string> = {
  sm: "text-sm font-semibold",
  md: "text-lg font-bold",
  lg: "hero-number text-4xl md:text-5xl",
};

const FREE_SIZE: Record<PriceSize, string> = {
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-xs px-3 py-1",
};

/** Canonical price figure. `size` adapts it to card / detail / hero slots. */
export function Price({
  cents,
  currency = "USD",
  size = "md",
  className = "",
}: {
  cents: number;
  currency?: string;
  size?: PriceSize;
  className?: string;
}) {
  if (cents <= 0) {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span
          className={cn(
            "rounded-full border border-dashed border-ink/45 bg-ink/[0.06] font-bold uppercase tracking-wider text-ink",
            FREE_SIZE[size],
          )}
        >
          Free
        </span>
        <span className={cn("tabular text-muted", size === "lg" ? "text-sm" : "text-xs")}>
          {formatPrice(0, currency)}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className={cn("tabular text-accent", PAID_SIZE[size])}>
        {formatUsdCents(cents)}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        {currency}
      </span>
    </span>
  );
}

/**
 * Canonical price block for the purchase panel: label, figure, one honest
 * footnote. Used on the product detail page.
 */
export function PriceBlock({
  cents,
  currency = "USD",
  className = "",
}: {
  cents: number;
  currency?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Price
      </span>
      <div className="mt-1">
        <Price cents={cents} currency={currency} size="lg" />
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
        Display-only demo price.
      </p>
    </div>
  );
}
