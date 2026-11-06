"use client";
import { track } from "@vercel/analytics/react";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

type Status = "idle" | "busy" | "done" | "error";

const INPUT =
  "mt-1 w-full rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";

/**
 * PilotForm — waitlist signup for the pilot program. Posts to /api/pilot
 * (table: pilot_waitlist) and shows an on-page success state. All labels
 * come from the i18n dictionary.
 */
export function PilotForm({ labels }: { labels: Dict["pilot"]["form"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      email: String(data.get("email") ?? ""),
      name: String(data.get("name") ?? ""),
      org: String(data.get("organization") ?? ""),
      squadSize: String(data.get("squadSize") ?? ""),
      seasonWindow: String(data.get("seasonWindow") ?? ""),
      note: String(data.get("note") ?? ""),
    };

    setStatus("busy");
    setError("");
    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "Something went wrong.");
      }
      track("pilot_signup");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-ready/50 bg-ready/10 p-7">
        <div className="display-heading text-xl text-ready">{labels.successTitle}</div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{labels.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-5 inline-flex text-xs!"
        >
          {labels.addAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {labels.email} <span className="text-accent">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={INPUT}
          placeholder={labels.emailPh ?? "you@club.com"}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.name}</span>
          <input name="name" autoComplete="name" className={INPUT} placeholder={labels.namePh} />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.organization}</span>
          <input name="organization" autoComplete="organization" className={INPUT} placeholder={labels.orgPh} />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.squadSize}</span>
          <select name="squadSize" className={INPUT} defaultValue="">
            <option value="" disabled>
              {labels.choose}
            </option>
            {labels.optionsSquad.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.window}</span>
          <select name="seasonWindow" className={INPUT} defaultValue="">
            <option value="" disabled>
              {labels.choose}
            </option>
            {labels.optionsWindow.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.note}</span>
        <textarea name="note" rows={3} className={INPUT} placeholder={labels.notePh} />
      </label>

      <button
        type="submit"
        disabled={status === "busy"}
        className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
      >
        {status === "busy" ? labels.busy : labels.submit}
      </button>

      {status === "error" ? (
        <p className="text-xs text-compromised">{error}</p>
      ) : (
        <p className="text-[11px] text-muted">{labels.noSpam}</p>
      )}
    </form>
  );
}
