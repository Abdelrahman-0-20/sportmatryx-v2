"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives";

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
    <div className="rounded-2xl border border-edge/70 bg-gradient-to-b from-panel to-panel-2/70 p-5 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.9)]">
      <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">
        Secure checkout — no payment details required. Consent-governed data only.
      </p>

      <div className="mt-3 flex flex-col gap-3">
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

        <div className="flex gap-2">
          <Button onClick={submit} disabled={busy || !email || !name} className="flex-1">
            {busy ? "Placing demo order…" : "Place demo order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
