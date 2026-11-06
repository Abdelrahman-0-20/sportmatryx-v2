"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MarketplaceCart } from "@/components/marketplace/cart";
import { ProductCard } from "@/components/marketplace/product-card";
import { FeaturedSpotlight } from "@/components/marketplace/featured-spotlight";
import { SellListing } from "@/components/marketplace/sell-listing";
import {
  MarketplaceProvider,
  useMarketplace,
  filteredProducts,
  EMPTY_FILTERS,
  type MarketplaceFilters,
} from "@/components/marketplace/marketplace-state";
import type { MarketProduct, CartItem } from "@/lib/services/marketplace";

const TAG_OPTIONS = [
  { value: "", label: "All tags" },
  { value: "SAMPLE", label: "SAMPLE" },
  { value: "ESTABLISHED", label: "ESTABLISHED" },
  { value: "PROTOTYPE", label: "BETA" },
  { value: "COMMUNITY", label: "COMMUNITY" },
];

const AVAILABLE_OPTIONS = [
  { value: "", label: "All availability" },
  { value: "true", label: "Available only" },
  { value: "false", label: "Unavailable only" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "tag", label: "Tag" },
  { value: "price-asc", label: "Price: low to high" },
];

export function MarketplaceListing({
  products,
  guest,
}: {
  products: MarketProduct[];
  guest: boolean;
}) {
  return (
    <MarketplaceProvider>
      <MarketplaceListInner products={products} guest={guest} />
    </MarketplaceProvider>
  );
}

function MarketplaceListInner({ products, guest }: { products: MarketProduct[]; guest: boolean }) {
  const { filters, setFilters } = useMarketplace();
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"buy" | "sell">("buy");
  // Marketplace tabs: Data = platform data products; Goods = community-listed items.
  const [section, setSection] = useState<"data" | "goods">("data");
  // Sport filter — platform datasets are multi-sport (undefined) and always
  // match; community listings match their seller-selected sport.
  const [sportSel, setSportSel] = useState<string | null>(null);
  const sports = [...new Set(products.map((p) => p.sport ?? "Multi-sport"))].sort((a, b) =>
    a === "Multi-sport" ? 1 : b === "Multi-sport" ? -1 : a.localeCompare(b),
  );
  const pillStyle = (active: boolean) =>
    active
      ? "shrink-0 rounded-full border border-accent bg-accent/15 px-3.5 py-1.5 text-xs font-semibold text-accent"
      : "shrink-0 rounded-full border border-edge/80 bg-panel-2/60 px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-ink";
  // Cart ↔ cookie sync: the full cart page (/marketplace/cart) and the header
  // count read the smx_marketplace_cart cookie via /api/marketplace/cart-state.
  // Hydrate the dialog from it on mount and persist every change back so
  // "View full cart" shows the same items as this dialog.
  const cartHydrated = useRef(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/marketplace/cart-state")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((body: { items?: CartItem[] }) => {
        if (cancelled) return;
        const loaded = Array.isArray(body.items) ? body.items : [];
        setItems((prev) => {
          if (prev.length === 0) return loaded;
          // Local additions win; merge cookie items in by product id.
          const merged = prev.map((p) => ({ ...p }));
          for (const l of loaded) {
            const idx = merged.findIndex((m) => m.productId === l.productId);
            if (idx >= 0) merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + l.quantity };
            else merged.push({ ...l });
          }
          return merged;
        });
        cartHydrated.current = true;
      })
      .catch(() => {
        cartHydrated.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cartHydrated.current) return;
    fetch("/api/marketplace/cart-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).catch(() => {});
  }, [items]);
  const base = filteredProducts(products, filters);
  const sectioned = section === "goods"
    ? base.filter((p) => p.tag === "COMMUNITY")
    : base.filter((p) => p.tag !== "COMMUNITY");
  const filtered = sportSel
    ? sectioned.filter((p) => p.sport === undefined || p.sport === sportSel)
    : sectioned;

  // The spotlight is scoped to what the buyer can actually see: it disappears
  // with "No products match your filters" and never leaks into Market goods.
  const featured = filtered.find((p) => p.featured) ?? null;

  // ONE Clear control: resets every piece of filter state — query, tag,
  // availability, sort, sport and section — back to the default view.
  function clearAll() {
    setFilters({ ...EMPTY_FILTERS });
    setSportSel(null);
    setSection("data");
  }

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.tag !== null ||
    filters.available !== null ||
    sportSel !== null ||
    section !== "data";

  function addToCart(product: MarketProduct) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          priceCents: product.priceCents,
          quantity: 1,
          tag: product.tag,
          sourceLabel: product.sourceLabel,
        },
      ];
    });
    setCartOpen(true);
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setView("buy")}
          className={view === "buy"
            ? "shrink-0 whitespace-nowrap rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
            : "shrink-0 whitespace-nowrap rounded-full border border-edge/80 bg-panel-2/60 px-4 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-ink"}
          aria-pressed={view === "buy"}
        >
          Buy data
        </button>
        <button
          type="button"
          onClick={() => setView("sell")}
          className={view === "sell"
            ? "shrink-0 whitespace-nowrap rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
            : "shrink-0 whitespace-nowrap rounded-full border border-edge/80 bg-panel-2/60 px-4 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-ink"}
          aria-pressed={view === "sell"}
        >
          Sell / list
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2" role="tablist" aria-label="Marketplace section">
          {([["data", "Data"], ["goods", "Market goods"]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={section === value}
              onClick={() => setSection(value)}
              className={section === value
                ? "shrink-0 whitespace-nowrap rounded-full border border-accent bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
                : "shrink-0 whitespace-nowrap rounded-full border border-edge/80 bg-panel-2/60 px-4 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-ink"}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "sell" ? (
        guest ? <SignInToSell onBack={() => setView("buy")} /> : <SellListing />
      ) : (
        <>
      {/* Sport pills scroll horizontally on phones so the row never eats
          three lines of vertical space. */}
      <div
        className="mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0"
        role="group"
        aria-label="Filter by sport"
      >
        <span className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">Sport</span>
        <button type="button" onClick={() => setSportSel(null)} aria-pressed={sportSel === null} className={pillStyle(sportSel === null)}>
          All sports
        </button>
        {sports.map((sp) => (
          <button key={sp} type="button" onClick={() => setSportSel(sp)} aria-pressed={sportSel === sp} className={pillStyle(sportSel === sp)}>
            {sp}
          </button>
        ))}
      </div>

      {/* Toolbar: one search row (search + Clear + cart) and one horizontally
          scrollable selects row on mobile — every control stays reachable. */}
      <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-edge/70 bg-panel/60 px-3 py-3 md:flex-row md:flex-wrap md:items-center md:gap-3 md:px-4">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 md:max-w-[280px] md:flex-none">
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Search products…"
              className="w-full min-w-0 rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 pl-9 text-sm placeholder:text-muted focus:border-accent"
              aria-label="Search marketplace products"
            />
            {/* Proper magnifier — the old path was a malformed funnel/blob. */}
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="4.3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9.3 9.3L12.6 12.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="shrink-0 whitespace-nowrap rounded-lg border border-edge/80 bg-panel-2/60 px-2.5 py-2 text-[11px] font-semibold text-ink transition-colors hover:border-accent/45 hover:text-accent"
            >
              Clear
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setCartOpen((v) => !v)}
            className="ml-auto shrink-0 whitespace-nowrap rounded-lg bg-gradient-to-br from-accent to-[#4dd7f5] px-3 py-2 text-xs font-bold text-canvas shadow-[0_8px_22px_-10px_rgba(95,208,240,0.55)] hover:brightness-105 md:ml-0"
          >
            {cartOpen ? "Close cart" : "Open cart"}
          </button>
        </div>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-1 md:flex-wrap md:overflow-visible md:pb-0">
          <select
            value={filters.tag ?? ""}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value || null })}
            className="shrink-0 rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm focus:border-accent"
            aria-label="Filter by tag"
          >
            {TAG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={filters.available ? (filters.available === true ? "true" : "false") : ""}
            onChange={(e) => {
              const v = e.target.value;
              setFilters({
                ...filters,
                available: v === "true" ? true : v === "false" ? false : null,
              });
            }}
            className="shrink-0 rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm focus:border-accent"
            aria-label="Filter by availability"
          >
            {AVAILABLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as MarketplaceFilters["sort"] })}
            className="shrink-0 rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm focus:border-accent"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="ml-auto flex shrink-0 items-center gap-2 text-sm text-muted">
            <span className="whitespace-nowrap tabular">{filtered.length}</span>
            <span className="whitespace-nowrap opacity-60">/ {products.length}</span>
            {totalItems > 0 && (
              <span className="whitespace-nowrap rounded-full border border-edge bg-panel-2 px-2 py-0.5 text-xs tabular text-muted">
                Cart: {totalItems} item{totalItems === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>

      {filters.query ? (
        <div className="mb-3 text-xs text-muted">
          Showing results for “{filters.query}”.{" "}
          <button
            type="button"
            onClick={clearAll}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            Clear
          </button>{" "}
          to see all products.
        </div>
      ) : null}

      {featured ? (
        <FeaturedSpotlight product={featured} onAddToCart={addToCart} />
      ) : null}

      {filtered.length === 0 ? (
        <div className="surface rounded-2xl p-8 text-center">
          <p className="text-sm text-muted">No products match your filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 rounded-md border border-edge bg-panel-2 px-3 py-2 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="stagger mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
          ))}
        </div>
      )}

      {/* Community listings are served through listProducts() and appear in the
          main grid above as regular products with Add-to-cart. */}

      </>
      )}

      <MarketplaceCart
        items={items}
        onUpdate={setItems}
        onOpenFullCart={() => setCartOpen(false)}
        open={cartOpen}
        onOpenChange={setCartOpen}
      />
    </>
  );
}

function SignInToSell({ onBack }: { onBack: () => void }) {
  return (
    <div className="surface rounded-2xl p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </div>
      <h3 className="display-heading mt-4 text-xl">Sign in to list a product or dataset</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Guests can browse the full marketplace — publishing a listing requires a real account.
        It takes seconds and keeps the catalog trustworthy.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link href="/login?next=/marketplace" className="btn-primary">Sign in</Link>
        <button type="button" onClick={onBack} className="btn-ghost">Keep browsing</button>
      </div>
    </div>
  );
}
