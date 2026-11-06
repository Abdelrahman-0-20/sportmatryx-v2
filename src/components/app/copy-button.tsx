"use client";

import { useState } from "react";

/**
 * Audit hash cell — shows the truncated chain hash and copies the full value
 * to the clipboard on click, with visible success/failure feedback.
 */
export function AuditHash({ hash }: { hash: string | null }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  if (!hash) {
    return <span className="text-xs text-muted">—</span>;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(hash as string);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1800);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={copy}
        title={`${hash} — click to copy`}
        className="w-24 truncate rounded border border-transparent px-1 py-0.5 text-left font-mono text-xs text-accent hover:border-edge hover:bg-panel-2"
      >
        {state === "copied" ? "Copied ✓" : state === "failed" ? "Copy failed" : `${hash.slice(0, 8)}…`}
      </button>
      <span className="sr-only" role="status">
        {state === "copied" ? "Hash copied to clipboard" : state === "failed" ? "Copy failed" : ""}
      </span>
    </span>
  );
}
