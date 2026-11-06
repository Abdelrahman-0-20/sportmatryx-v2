"use client";

// Client island for the full cart page: lets you change quantity or remove
// items. Persists through /api/marketplace/cart-state (same cookie the
// marketplace listing dialog uses), then refreshes the server-rendered page
// so re-pricing and checkout totals stay in sync. No backend changes.
//
// Lines themselves render through the shared CartLineItem so the page and
// the dialog can never drift apart again.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CartLineItem } from "@/components/marketplace/cart-line-item";
// The cookie cart stores items written by the client dialog, which may carry
// tag/sourceLabel; those live on the client CartItem type, not the server one.
import type { CartItem } from "@/components/marketplace/cart";

export function CartLines({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function persist(next: CartItem[], focusId: string | null) {
    setBusyId(focusId);
    fetch("/api/marketplace/cart-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: next }),
    })
      .then(() => {
        startTransition(() => router.refresh());
      })
      .catch(() => {
        setBusyId(null);
      });
  }

  function setQuantity(productId: string, quantity: number) {
    const next = items
      .map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i,
      )
      .filter((i) => i.quantity > 0);
    persist(next, productId);
  }

  function remove(productId: string) {
    persist(items.filter((i) => i.productId !== productId), productId);
  }

  return (
    <ul className="flex flex-col gap-2" aria-busy={pending}>
      {items.map((i) => (
        <CartLineItem
          key={i.productId}
          item={i}
          busy={busyId === i.productId && pending}
          onQuantityChange={setQuantity}
          onRemove={remove}
        />
      ))}
    </ul>
  );
}
