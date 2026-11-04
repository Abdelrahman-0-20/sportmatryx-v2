"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "busy" | "done" | "error";

const INPUT =
  "mt-1 w-full rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";

/**
 * PilotForm — waitlist signup for the pilot program. Posts to /api/pilot
 * (table: pilot_waitlist) and shows an on-page success state.
 */
export function PilotForm() {
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
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-ready/50 bg-ready/10 p-7">
        <div className="display-heading text-xl text-ready">You&apos;re on the list.</div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We review waitlist entries weekly and reply with a pilot slot, the data-audit plan and
          the success metrics we would agree up front. Keep an eye on your inbox.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-5 inline-flex !text-xs"
        >
          Add another signup
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Email <span className="text-accent">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={INPUT}
          placeholder="you@club.com"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Name</span>
          <input name="name" autoComplete="name" className={INPUT} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Organization
          </span>
          <input
            name="organization"
            autoComplete="organization"
            className={INPUT}
            placeholder="Club, academy or league"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Squad size
          </span>
          <select name="squadSize" className={INPUT} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            <option>Youth / school</option>
            <option>Academy (U16–U21)</option>
            <option>Semi-pro / college</option>
            <option>Professional</option>
            <option>League / governing body</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Window
          </span>
          <select name="seasonWindow" className={INPUT} defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            <option>Next 30 days</option>
            <option>This season</option>
            <option>Next season</option>
            <option>Just evaluating</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          What do you collect today?
        </span>
        <textarea
          name="note"
          rows={3}
          className={INPUT}
          placeholder="GPS exports, wellness forms, session logs — anything you already have."
        />
      </label>

      <button
        type="submit"
        disabled={status === "busy"}
        className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
      >
        {status === "busy" ? "Joining…" : "Join the pilot list"}
      </button>

      {status === "error" ? (
        <p className="text-xs text-compromised">{error}</p>
      ) : (
        <p className="text-[11px] text-muted">
          No spam — one reply from a human when a pilot slot opens.
        </p>
      )}
    </form>
  );
}
