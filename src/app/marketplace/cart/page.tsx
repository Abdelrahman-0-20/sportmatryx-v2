import { cookies } from "next/headers";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, LinkButton } from "@/components/ui/primitives";
import { CheckoutIsland } from "@/components/marketplace/checkout-island";
import { CartLines } from "@/components/marketplace/cart-lines";
import { DemoTruthBanner } from "@/components/marketplace/demo-truth";
import { Price } from "@/components/marketplace/price";
import { requireCapability } from "@/lib/auth/rbac";
import { listProducts, finalizeCart, type CartItem, type MarketProduct } from "@/lib/services/marketplace";

export const dynamic = "force-dynamic";

/** Server cart line + the display fields the client dialog writes to the cookie. */
type DisplayCartItem = CartItem & { tag?: string; sourceLabel?: string };

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string }>;
}) {
  const params = await searchParams;
  const completedPurchase = params.done ?? null;

  let user;
  let catalog: MarketProduct[];
  let checkoutEnabled = false;

  try {
    user = await requireCapability("export.run");
    catalog = await listProducts();
    checkoutEnabled = true;
  } catch (e) {
    const { errorToResponse, UnauthorizedError } = await import("@/lib/auth/rbac");
    if (e instanceof UnauthorizedError) {
      user = null;
      catalog = [];
      checkoutEnabled = false;
    } else {
      const mapped = errorToResponse(e);
      return (
        <AppShell crumb="/marketplace/cart" title="Cart">
          <p className="text-sm text-compromised">{mapped.body.error}</p>
        </AppShell>
      );
    }
  }

  let items: CartItem[] = [];
  try {
    // Read the cart cookie directly — same cookie /api/marketplace/cart-state
    // reads and writes. (A relative-URL fetch() from a server component does
    // not work, so the previous attempt here always failed and the page
    // showed an empty cart even when the cookie held items.)
    const store = await cookies();
    const raw = store.get("smx_marketplace_cart")?.value;
    if (raw) {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) items = parsed.slice(0, 20);
    }
  } catch {
    // No persisted cart state yet — start empty.
  }

  // Re-price cart lines from the current catalog so the displayed total
  // always matches what demo checkout will charge (the cookie cart may hold
  // stale prices from before pricing existed). Carry the catalog's tag and
  // provenance so lines render with the same chips as the cart dialog.
  const pricedItems: DisplayCartItem[] = items.map((i) => {
    const product = catalog.find((p) => p.id === i.productId);
    return product
      ? { ...i, name: product.name, priceCents: product.priceCents, tag: product.tag, sourceLabel: product.sourceLabel }
      : i;
  });
  const { items: valid, totalCents } = finalizeCart(pricedItems);
  // finalizeCart spreads each line, so the display fields survive at runtime.
  const displayItems = valid as DisplayCartItem[];

  return (
    <AppShell crumb="/marketplace/cart" title="Cart">
      {completedPurchase ? (
        <Card className="card-lift mb-4 border border-ready/40" ariaLabel="Demo purchase complete">
          <CardLabel>Demo purchase completed</CardLabel>
          <p className="text-sm text-ready">
            Demo order <span className="font-mono">{completedPurchase}</span> completed.
            No payment was processed.
          </p>
          <LinkButton href="/marketplace/cart" variant="ghost" className="mt-2">
            Return to cart
          </LinkButton>
        </Card>
      ) : null}

      <DemoTruthBanner className="mb-4" />

      <p className="mb-4 text-sm text-muted">
        Review your demo purchase package(s) below.
      </p>

      {displayItems.length === 0 ? (
        /* Empty cart: one honest empty state, and NO checkout form that
           looks ready to submit. */
        <Card ariaLabel="Cart is empty">
          <p className="text-sm text-muted">Your cart is empty.</p>
          <p className="mt-1 text-sm text-muted">
            Add a data package from the marketplace to review it here before checking out.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/marketplace">Browse marketplace</LinkButton>
            {!checkoutEnabled ? (
              <LinkButton href="/login" variant="ghost">
                Sign in
              </LinkButton>
            ) : null}
          </div>
          {!checkoutEnabled ? (
            <p className="mt-3 text-xs text-muted">
              Sign in with a role that includes export capability to complete a demo purchase.
            </p>
          ) : null}
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <Card ariaLabel="Cart items">
              <CardLabel>Cart items</CardLabel>
              <CartLines items={displayItems} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3">
                <span className="text-sm text-muted">
                  {valid.length} item{valid.length === 1 ? "" : "s"}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Demo total
                  </span>
                  <Price cents={totalCents} size="md" />
                </span>
              </div>
            </Card>
          </div>

          <div className="min-w-0 lg:col-span-1">
            {checkoutEnabled ? (
              <Card>
                <CardLabel>Checkout</CardLabel>
                <CheckoutIsland items={displayItems} totalCents={totalCents} />
                <LinkButton href="/marketplace" variant="ghost" className="mt-3 w-full">
                  Continue browsing
                </LinkButton>
              </Card>
            ) : (
              <Card>
                <CardLabel>Checkout</CardLabel>
                <p className="text-sm text-muted">
                  Sign in with a role that includes export capability to complete a demo purchase.
                </p>
                <LinkButton href="/login" className="mt-2 w-full">
                  Sign in
                </LinkButton>
              </Card>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
