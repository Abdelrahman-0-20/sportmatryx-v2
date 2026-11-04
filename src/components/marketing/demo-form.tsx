"use client";

import { useState, type FormEvent } from "react";

/**
 * Demo request form. No backend on purpose: on submit it opens the visitor's
 * mail client with a prefilled message. Replace CONTACT_EMAIL with the real
 * inbox before sharing this page publicly.
 */
const CONTACT_EMAIL = "hello@healthmetryx.com"; // TODO: replace with your real inbox

export function DemoForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const org = String(data.get("organization") ?? "");
    const role = String(data.get("role") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Demo request — ${org || name || "Sportmetryx"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization: ${org}\nRole: ${role}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-[10px] border border-ready/50 bg-ready/10 p-6">
        <div className="display-heading text-lg text-ready">Your mail app is opening</div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          If nothing happened, copy your details and email them to{" "}
          <span className="text-ink">{CONTACT_EMAIL}</span> — we will get back to you with a
          30-minute slot.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 rounded-md border border-edge px-4 py-2 text-xs font-semibold text-ink hover:bg-panel"
        >
          Edit details
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-edge bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Organization</span>
          <input
            name="organization"
            required
            autoComplete="organization"
            className="mt-1 w-full rounded-md border border-edge bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            placeholder="Club, academy or company"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Role</span>
          <input
            name="role"
            className="mt-1 w-full rounded-md border border-edge bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            placeholder="Performance staff, coach, analyst…"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-edge bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            placeholder="you@club.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          What do you want to see?
        </span>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-md border border-edge bg-panel-2 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
          placeholder="Which seat are you solving for? Which data do you already collect?"
        />
      </label>
      <button
        type="submit"
        className="btn-primary w-full"
      >
        Request my demo
      </button>
      <p className="text-[11px] text-muted">
        This opens your mail app with the details prefilled — nothing is stored on this site.
      </p>
    </form>
  );
}
