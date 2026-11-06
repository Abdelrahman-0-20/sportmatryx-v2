"use client";

// ONE line-item component shared by the cart dialog (cart.tsx) and the full
// cart page (cart-lines.tsx) — same chips, same price maths, same controls.
// The two surfaces only differ in how edits are persisted.

import Link from "next/link";
import { Tag } from "@/components/ui/primitives";
import { Price, formatPrice } from "@/components/marketplace/price";
import type { CartItem } from "@/components/marketplace/cart";
import { cn } from "@/lib/utils";

export function CartLineItem({
  item,
  busy = false,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  /** True while this line is being persisted (page) — dims the row. */
  busy?: boolean;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
}) {
  const lineCents = item.priceCents * item.quantity;

  return (
    <li
      aria-busy={busy}
      className={cn(
        "flex items-start justify-between gap-3 rounded-md border border-edge/60 bg-panel-2 p-3",
        busy && "opacity-60",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {item.tag ? <Tag label={item.tag} /> : null}
          <Link
            href={`/marketplace/${item.productId}`}
            className="truncate text-sm font-semibold hover:text-accent"
          >
            {item.name}
          </Link>
        </div>
        <p className="mt-1 truncate text-xs text-muted">
          {item.sourceLabel ? `${item.sourceLabel} · ` : ""}
          {item.priceCents === 0
            ? "Free — no charge"
            : `${formatPrice(item.priceCents)} each`}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            type="button"
            disabled={busy || item.quantity <= 1}
            onClick={() => onQuantityChange?.(item.productId, item.quantity - 1)}
            className="rounded-lg border border-edge/70 bg-panel-2/60 px-2 py-1 text-xs font-semibold hover:border-accent/40 hover:bg-panel-2 disabled:opacity-50"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            −
          </button>
          <span className="tabular w-5 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => onQuantityChange?.(item.productId, item.quantity + 1)}
            className="rounded-lg border border-edge/70 bg-panel-2/60 px-2 py-1 text-xs font-semibold hover:border-accent/40 hover:bg-panel-2 disabled:opacity-50"
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onRemove?.(item.productId)}
            className="ml-auto text-xs text-compromised hover:underline disabled:opacity-50"
            aria-label={`Remove ${item.name}`}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <Price cents={lineCents} size="sm" />
      </div>
    </li>
  );
}
