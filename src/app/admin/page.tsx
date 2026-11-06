import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, Tag } from "@/components/ui/primitives";
import { VerifyChainButton } from "@/components/app/verify-chain";
import { AuditHash } from "@/components/app/copy-button";
import { EmptyState, TableScroll, TD, TH, count, humanize } from "@/components/app/ops-kit";
import { requireCapability, errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AUDIT_TAKE = 30;
const USER_TAKE = 12;

/**
 * Administration & Audit — audit trail (hash-chained), model configuration
 * versions, and user roster. ADMIN/MEDICAL/EXECUTIVE only (audit.read).
 */
export default async function AdminPage() {
  let audits, versions, users;
  try {
    await requireCapability("audit.read");
    [audits, versions, users] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        take: AUDIT_TAKE,
        include: { user: { select: { name: true, role: true } } },
      }),
      prisma.modelConfigurationVersion.findMany({
        orderBy: { versionNumber: "desc" },
        include: { performanceModel: { select: { name: true } } },
      }),
      prisma.user.findMany({
        select: { name: true, email: true, role: true },
        orderBy: { createdAt: "desc" },
        take: USER_TAKE,
      }),
    ]);
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/admin" title="Administration & Audit">
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  return (
    <AppShell crumb="/admin" title="Administration & Audit">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card ariaLabel="Audit trail">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
            <CardLabel>Tamper-evident audit trail</CardLabel>
            <VerifyChainButton />
          </div>
          <p className="mb-3 text-xs text-muted">
            Showing the {count(audits.length)} most recent entr{audits.length === 1 ? "y" : "ies"}.
          </p>
          {audits.length === 0 ? (
            <EmptyState
              message="No audit entries yet."
              hint="Every state change is written here with a hash chain as it happens."
            />
          ) : (
            <TableScroll minWidth="min-w-[560px]">
              <thead>
                <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                  <th className={TH}>When</th>
                  <th className={TH}>Event</th>
                  <th className={TH}>Actor</th>
                  <th className={TH}>Chain</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id} className="border-b border-edge/50">
                    <td className={`${TD} tabular text-muted`}>
                      {a.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      {a.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className={TD} title={`Action code: ${a.action}`}>
                      {humanize(a.action)}
                    </td>
                    <td className={TD}>
                      {a.user ? (
                        <span className="flex flex-col">
                          <span>{a.user.name ?? "?"}</span>
                          <span className="text-xs text-muted" title={`Role: ${a.user.role}`}>
                            {humanize(a.user.role)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted">System</span>
                      )}
                    </td>
                    <td className={TD}>
                      <AuditHash hash={a.hash} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card ariaLabel="Model configuration versions">
            <CardLabel>Model configuration versions</CardLabel>
            <p className="mb-3 text-xs text-muted">{count(versions.length)} version{versions.length === 1 ? "" : "s"} on record.</p>
            {versions.length === 0 ? (
              <EmptyState message="No model configuration versions yet." />
            ) : (
              <TableScroll minWidth="min-w-[420px]">
                <thead>
                  <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                    <th className={TH}>Model</th>
                    <th className={TH}>Version</th>
                    <th className={TH}>Active</th>
                    <th className={TH}>Effective</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((v) => (
                    <tr key={v.id} className="border-b border-edge/50">
                      <td className={TD}>{v.performanceModel.name}</td>
                      <td className={`${TD} tabular`}>v{v.versionNumber}</td>
                      <td className={TD}>
                        {v.isActive ? (
                          <Tag label="VALID" />
                        ) : (
                          <span className="text-xs text-muted">Archived</span>
                        )}
                      </td>
                      <td className={`${TD} tabular text-muted`}>
                        {v.effectiveFrom.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableScroll>
            )}
          </Card>

          <Card ariaLabel="Users">
            <CardLabel>Users</CardLabel>
            <p className="mb-3 text-xs text-muted">
              {count(users.length)} most recently created account{users.length === 1 ? "" : "s"}.
            </p>
            {users.length === 0 ? (
              <EmptyState message="No user accounts yet." />
            ) : (
              <ul className="flex flex-col gap-1.5 text-sm">
                {users.map((u) => (
                  <li
                    key={u.email ?? u.name ?? "?"}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/50 pb-1.5 last:border-0"
                  >
                    <span className="min-w-0 truncate" title={u.email ?? undefined}>
                      {u.name ?? u.email}
                    </span>
                    <span title={`Role: ${u.role}`}>
                      <Tag label={u.role} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
