"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/primitives";
import { CartLineItem } from "@/components/marketplace/cart-line-item";
import { Price } from "@/components/marketplace/price";

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  tag?: string;
  sourceLabel?: string;
};

export function MarketplaceCart({
  items,
  onUpdate,
  onOpenFullCart,
  open: openProp,
  onOpenChange,
}: {
  items: CartItem[];
  onUpdate: (items: CartItem[]) => void;
  onOpenFullCart?: () => void;
  // Optional controlled mode: the parent owns open/close so "Add to cart"
  // can open this dialog directly. Falls back to internal state otherwise.
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  function setOpen(next: boolean) {
    if (isControlled) onOpenChange?.(next);
    else setInternalOpen(next);
  }

  function setQuantity(productId: string, quantity: number) {
    const next = items.map((i) =>
      i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i,
    );
    onUpdate(next.filter((i) => i.quantity > 0));
  }

  function remove(productId: string) {
    onUpdate(items.filter((i) => i.productId !== productId));
  }

  function clear() {
    onUpdate([]);
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);
  const totalCents = items.reduce((a, i) => a + i.priceCents * i.quantity, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-edge bg-panel-2 px-2 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
        aria-label="Open cart"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 12.5H11M5 12.5V8.5L6.5 6l2 2.5V12.5M10 12.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="2" r="1.2" fill="currentColor" />
        </svg>
        {totalItems > 0 ? <span className="tabular">{totalItems}</span> : null}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/70 p-4 pt-10"
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-edge/70 bg-gradient-to-b from-panel to-panel-2/80 p-5 shadow-[var(--shadow-float)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <div className="flex items-center gap-2">
                <h2 className="display-heading text-lg">Cart</h2>
                {totalItems > 0 ? (
                  <span className="rounded-full border border-edge bg-panel-2 px-2 py-0.5 text-xs tabular text-muted">
                    {totalItems} item{totalItems === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-muted hover:text-ink" aria-label="Close cart">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 3l12 12M3 15L15 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted">Your cart is empty.</p>
                <div className="mt-3 flex justify-center">
                  <LinkButton href="/marketplace" variant="ghost" className="text-xs">Browse marketplace</LinkButton>
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((i) => (
                  <CartLineItem
                    key={i.productId}
                    item={i}
                    onQuantityChange={setQuantity}
                    onRemove={remove}
                  />
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Demo total
                </span>
                <Price cents={totalCents} size="sm" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={clear} disabled={items.length === 0} className="px-3 text-xs">
                  Clear
                </Button>
                <LinkButton href="/marketplace/cart" className="px-3 text-xs">
                  View full cart
                </LinkButton>
              </div>
            </div>

            {onOpenFullCart ? (
              <div className="mt-2 text-center">
                <button type="button" onClick={() => { setOpen(false); onOpenFullCart() }} className="text-xs text-accent hover:underline">
                  Review full cart and checkout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
