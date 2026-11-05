"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "busy" | "done" | "error";

/**
 * NewsletterForm — compact footer capture; stores to newsletter_subscribers.
 * Labels come from the footer dictionary slice.
 */
export function NewsletterForm({
  labels,
}: {
  labels: { title: string; ph: string; submit: string; success: string };
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setStatus("busy");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error ?? "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-3 rounded-lg border border-ready/40 bg-ready/10 px-3 py-2.5 text-xs font-semibold text-ready">
        {labels.success}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        {labels.title}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label={labels.title}
          placeholder={labels.ph}
          className="min-w-0 flex-1 rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "busy"}
          className="btn-primary shrink-0 !px-3 !py-2 !text-xs disabled:opacity-60"
        >
          {status === "busy" ? "…" : labels.submit}
        </button>
      </form>
      {status === "error" ? <p className="mt-1.5 text-[11px] text-compromised">{error}</p> : null}
    </div>
  );
}
