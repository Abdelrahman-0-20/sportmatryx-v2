"use client";

import { useMarketplace } from "@/components/marketplace/marketplace-state";
import { useAddedFeedback, AddedPulse } from "@/components/marketplace/added-feedback";
import { Card, Tag, LinkButton, Button } from "@/components/ui/primitives";
import { HighlightText } from "@/components/marketplace/highlight";
import { DownloadSamplePreview } from "@/components/marketplace/download-sample";
import { Price } from "@/components/marketplace/price";
import type { MarketProduct } from "@/lib/services/marketplace";
import { cn } from "@/lib/utils";

/**
 * The one card template used by every marketplace grid result:
 * clamped title, at most three chips, one primary action + one secondary
 * action, and the sample-preview note demoted to a tooltip on a meta link.
 */
export function ProductCard({ product, onAddToCart }: { product: MarketProduct; onAddToCart?: (product: MarketProduct) => void }) {
  const { filters } = useMarketplace();
  const query = filters.query;
  const hasQuery = query.trim().length > 0;
  const { pulse, markAdded } = useAddedFeedback();

  const includesText = product.includes.join(" · ");

  return (
    <Card className="card-lift flex h-full flex-col" ariaLabel={product.name}>
      {product.imageId ? (
        // eslint-disable-next-line @next/next/no-img-element -- database-served image, not a remote file
        <img
          src={`/api/marketplace/images/${product.imageId}`}
          alt={`${product.name} cover`}
          className="mb-3 h-40 w-full rounded-xl border border-edge/60 object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted" title={product.sourceRef ?? product.sourceLabel}>
            {hasQuery ? (
              <HighlightText text={product.sourceLabel + (product.sourceRef ? ` · ${product.sourceRef}` : "")} query={query} />
            ) : (
              <>
                {product.sourceLabel}
                {product.sourceRef ? ` · ${product.sourceRef}` : ""}
              </>
            )}
          </p>
          <h3 className="display-heading mt-0.5 line-clamp-2 text-lg">
            {hasQuery ? (
              <HighlightText text={product.name} query={query} />
            ) : (
              product.name
            )}
          </h3>
          {/* At most three chips per card. */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Tag label={product.tag} />
            {product.sport ? (
              <span className="rounded-full border border-edge bg-panel-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
                {product.sport}
              </span>
            ) : null}
            {product.featured ? (
              <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                Best in demo
              </span>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <Price cents={product.priceCents} currency={product.currency} size="md" />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {hasQuery ? (
          <HighlightText text={product.description} query={query} />
        ) : (
          product.description
        )}
      </p>

      <p
        className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted"
        title={includesText}
      >
        <span className="font-semibold text-ink">Includes:</span>{" "}
        {hasQuery ? <HighlightText text={includesText} query={query} /> : includesText}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="tabular">
          {product.rowsEstimate !== null ? `${product.rowsEstimate} rows` : "Rows n/a"}
        </span>
        <span className={product.available ? "text-ink" : "text-withheld"}>
          <span aria-hidden="true">{product.available ? "✓" : "✕"}</span>{" "}
          {product.available ? "Available" : "Unavailable"}
        </span>
        {product.tag !== "COMMUNITY" ? <DownloadSamplePreview product={product} /> : null}
      </div>

      {/* One primary + one secondary action — never three equal-weight CTAs. */}
      <div className="mt-auto flex items-center gap-2 pt-3">
        <Button
          variant="primary"
          onClick={() => {
            onAddToCart?.(product);
            markAdded();
          }}
          className={cn("min-w-0 flex-1 whitespace-nowrap px-2 text-xs font-bold", pulse && "ring-2 ring-accent brightness-110")}
          aria-label={`Add ${product.name} to cart`}
        >
          {pulse ? (
            <span className="inline-flex items-center gap-1">
              <AddedPulse active /> Added
            </span>
          ) : (
            "Add to cart"
          )}
        </Button>
        <LinkButton
          href={`/marketplace/${product.id}`}
          variant="ghost"
          className="shrink-0 whitespace-nowrap px-3 text-xs"
        >
          Details
        </LinkButton>
      </div>
    </Card>
  );
}
