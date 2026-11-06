"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { MarketProduct } from "@/lib/services/marketplace";

export interface MarketplaceFilters {
  query: string;
  tag: string | null;
  available: boolean | null;
  sort: "name" | "price-desc" | "tag" | "price-asc";
}

export interface MarketplaceState {
  filters: MarketplaceFilters;
  setFilters: (filters: MarketplaceFilters) => void;
}

export const EMPTY_FILTERS: MarketplaceFilters = {
  query: "",
  tag: null,
  available: null,
  sort: "name",
};

const MarketplaceContext = createContext<MarketplaceState | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MarketplaceFilters>(EMPTY_FILTERS);

  return (
    <MarketplaceContext.Provider value={{ filters, setFilters }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): MarketplaceState {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}

export function filteredProducts(products: MarketProduct[], filters: MarketplaceFilters): MarketProduct[] {
  let list = [...products];

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.sourceLabel.toLowerCase().includes(q),
    );
  }

  if (filters.tag) {
    list = list.filter((p) => p.tag === filters.tag);
  }

  if (filters.available === true) {
    list = list.filter((p) => p.available);
  } else if (filters.available === false) {
    list = list.filter((p) => !p.available);
  }

  list = [...list].sort((a, b) => {
    if (filters.sort === "price-desc") return (b.priceCents - a.priceCents) || a.name.localeCompare(b.name);
    if (filters.sort === "price-asc") return a.priceCents - b.priceCents || a.name.localeCompare(b.name);
    if (filters.sort === "tag") return a.tag.localeCompare(b.tag) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  return list;
}
