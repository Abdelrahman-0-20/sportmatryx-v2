import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel } from "@/components/ui/primitives";

/**
 * Route-level loading skeleton for the athlete profile page.
 * Rendered while the dynamic server component awaits data.
 */
export default function PlayerProfileLoading() {
  return (
    <AppShell crumb="/player" title="Athlete profile">
      <div className="animate-pulse" aria-label="Loading athlete profile">
        {/* Header block */}
        <div className="mb-4 space-y-2">
          <div className="h-7 w-64 rounded bg-panel-2" />
          <div className="h-4 w-96 rounded bg-panel-2" />
        </div>

        {/* Hero row */}
        <div className="mb-4 grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardLabel>&nbsp;</CardLabel>
              <div className="h-12 w-28 rounded bg-panel-2" />
              <div className="mt-3 h-3 w-40 rounded bg-panel-2" />
            </Card>
          ))}
        </div>

        {/* Driver cards */}
        <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i}>
              <CardLabel>&nbsp;</CardLabel>
              <div className="h-3 w-24 rounded bg-panel-2" />
              <div className="mt-3 h-1.5 w-full rounded-full bg-panel-2" />
            </Card>
          ))}
        </div>

        {/* Trend + sessions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardLabel>&nbsp;</CardLabel>
            <div className="flex h-20 items-end gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
                <div key={i} className="w-full rounded-t bg-panel-2" style={{ height: `${30 + ((i * 13) % 55)}%` }} />
              ))}
            </div>
          </Card>
          <Card>
            <CardLabel>&nbsp;</CardLabel>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-full rounded bg-panel-2" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
