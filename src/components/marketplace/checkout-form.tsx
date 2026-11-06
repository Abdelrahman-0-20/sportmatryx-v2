"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives";
import { Price } from "@/components/marketplace/price";

export function CheckoutForm({
  items,
  totalCents,
  onSubmit,
  busy,
  setBusy,
}: {
  items: { productId: string; name: string; priceCents: number; quantity: number }[];
  totalCents: number;
  onSubmit: (items: { productId: string; quantity: number }[], email: string, name: string) => void;
  busy: boolean;
  setBusy: (v: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // An empty cart must never show a button that looks ready to press.
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-edge/70 bg-panel-2/60 px-4 py-3 text-sm text-muted">
        Your cart is empty — add an item before checking out.
      </p>
    );
  }

  function submit() {
    if (items.length === 0) return;
    if (!email || !name) return;
    setBusy(true);
    onSubmit(
      items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      email.trim(),
      name.trim(),
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Email (demo)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Name (demo)</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>
      </div>

      {/* Order summary — the buyer must see the exact amount they confirm. */}
      <div className="mt-4 border-t border-edge pt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Order summary
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map((i) => (
            <li
              key={i.productId}
              className="flex items-baseline justify-between gap-2 text-sm"
            >
              <span className="min-w-0 truncate text-muted">
                {i.name}
                {i.quantity > 1 ? <span className="text-xs"> × {i.quantity}</span> : null}
              </span>
              <span className="shrink-0 tabular text-ink">
                <Price cents={i.priceCents * i.quantity} size="sm" />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-edge pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Demo total
          </span>
          <Price cents={totalCents} size="md" />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={submit} disabled={busy || !email || !name} className="flex-1">
          {busy ? "Placing demo order…" : "Place demo order"}
        </Button>
      </div>
    </div>
  );
}
