import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, Tag, LinkButton } from "@/components/ui/primitives";
import { requireReadForGuest } from "@/lib/offline";
import {
  listProducts,
  productSourceSummary,
  productImages,
  type MarketProduct,
  type MarketProductImage,
} from "@/lib/services/marketplace";
import { AddToCartButton } from "@/components/marketplace/add-to-cart-button";
import { PriceBlock } from "@/components/marketplace/price";

export const dynamic = "force-dynamic";

/**
 * Product detail — a purchase-decision screen: breadcrumb + back, ONE H1
 * (rendered by the shell from the product name), a provenance/spec/terms/
 * validity table, one canonical price block and one primary CTA.
 */
export default async function MarketplaceProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: MarketProduct | null = null;
  try {
    await requireReadForGuest("roster.read");
    const catalog = await listProducts();
    product = catalog.find((p) => p.id === id) ?? null;
  } catch (e) {
    const { errorToResponse, UnauthorizedError } = await import("@/lib/auth/rbac");
    if (e instanceof UnauthorizedError) {
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/marketplace" title="Marketplace">
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell crumb="/marketplace" title="Marketplace">
        <p className="text-sm text-muted">Product not found.</p>
        <Link href="/marketplace" className="btn-ghost mt-3 inline-flex">
          Back to marketplace
        </Link>
      </AppShell>
    );
  }

  const source = await productSourceSummary(product);
  let images: MarketProductImage[] = [];
  try {
    images = await productImages(product.id);
  } catch {
    // Photo gallery is additive — catalog details still render without it.
  }

  // ---- One honest provenance / spec / terms / validity table --------------
  const termsEntry = product.includes.find((i) => i.startsWith("Terms:"));
  const terms = termsEntry
    ? termsEntry.slice("Terms:".length).trim()
    : "Demo evaluation only — no redistribution";

  const provenance =
    product.tag === "COMMUNITY"
      ? product.sellerName
        ? `Community listing · ${product.sellerName}`
        : "Community listing"
      : product.sourceRef === "sample"
        ? "Demo / offline sample data"
        : product.sourceRef?.startsWith("job-")
          ? "Existing import job"
          : product.sourceRef === "dataset-combined"
            ? "Platform team dataset"
            : product.sourceLabel;

  const refresh = product.sourceRef?.startsWith("job-")
    ? "Snapshot from import time"
    : product.tag === "COMMUNITY"
      ? "Static listing"
      : "Fixed demo snapshot";

  const specRows: { label: string; value: ReactNode }[] = [
    { label: "Provenance", value: provenance },
    ...(product.sourceRef
      ? [{ label: "Reference", value: <span className="font-mono">{product.sourceRef}</span> }]
      : []),
    {
      label: "Rows",
      value: product.rowsEstimate !== null ? `${product.rowsEstimate} rows` : "Rows n/a",
    },
    { label: "Sport", value: product.sport ?? "Multi-sport" },
    ...(product.sellerName ? [{ label: "Seller", value: product.sellerName }] : []),
    { label: "Status", value: <Tag label={product.tag} /> },
    {
      label: "Validity",
      value: (
        <span className={product.available ? "text-ink" : "text-withheld"}>
          <span aria-hidden="true">{product.available ? "✓" : "✕"}</span>{" "}
          {product.available ? "Available" : "Unavailable"}
        </span>
      ),
    },
    { label: "Terms / license", value: terms },
    { label: "Refresh", value: refresh },
  ];

  return (
    <AppShell crumb={`/marketplace/${product.id}`} title={product.name}>
      {/* Breadcrumb + back — the shell already renders the single H1 above. */}
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 font-semibold text-accent underline-offset-2 hover:underline"
        >
          <span aria-hidden="true">←</span> Back to marketplace
        </Link>
        <span aria-hidden="true" className="text-edge">
          /
        </span>
        <span className="min-w-0 text-muted">{product.name}</span>
      </nav>


      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <Card ariaLabel="Overview">
            <CardLabel>Overview</CardLabel>
            {product.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                ★ Best in demo
              </span>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>

            {images.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element -- database-served image, not a remote file
                  <img
                    key={img.id}
                    src={`/api/marketplace/images/${img.id}`}
                    alt={img.alt ?? `${product.name} photo`}
                    className="h-24 w-full rounded-md border border-edge object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}

            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Includes
            </p>
            <ul className="mt-2 grid gap-1.5 text-sm text-ink sm:grid-cols-2">
              {product.includes.map((i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ·
                  </span>
                  <span className="min-w-0">{i}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card ariaLabel="Provenance, spec and terms">
            <CardLabel>Provenance, spec &amp; terms</CardLabel>
            <dl className="grid gap-x-6 gap-y-0 text-sm sm:grid-cols-2">
              {specRows.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between gap-3 border-b border-edge/60 py-2"
                >
                  <dt className="shrink-0 text-muted">{r.label}</dt>
                  <dd className="tabular min-w-0 text-right font-semibold text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {source.previewRows.length > 0 ? (
            <Card ariaLabel="Source summary">
              <CardLabel>Source summary</CardLabel>
              <dl className="grid gap-2 text-sm md:grid-cols-2">
                {source.previewRows.map((r) => (
                  <div key={r.label} className="flex justify-between gap-2">
                    <dt className="text-muted">{r.label}</dt>
                    <dd className="tabular font-semibold text-ink">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ) : null}
        </div>

        {/* Purchase panel — sticky so it never leaves the buyer's view. */}
        <div className="min-w-0 lg:col-span-1">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            <Card ariaLabel="Purchase">
              <CardLabel>Purchase</CardLabel>
              <PriceBlock cents={product.priceCents} currency={product.currency} />
              <div className="mt-4 flex flex-col gap-2">
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  priceCents={product.priceCents}
                  tag={product.tag}
                />
                <LinkButton href="/marketplace/cart" variant="ghost" className="w-full">
                  Open cart
                </LinkButton>
              </div>
              {product.sourceRef === "dataset-combined" ? (
                <a
                  href="/datasets/Sportmetryx_Combined_Wide_Athlete_Day.csv"
                  download
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent underline-offset-2 hover:underline"
                >
                  ↓ Download full CSV (1,362 rows)
                </a>
              ) : null}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
