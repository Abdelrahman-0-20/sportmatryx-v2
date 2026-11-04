"use client";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

/**
 * Demo request form. No backend: on submit it opens the visitor's mail
 * client with a prefilled message. All labels come from the i18n dictionary.
 */
const CONTACT_EMAIL = "sportmatryx@protonmail.com";

export function DemoForm({ labels }: { labels: Dict["demo"]["form"] }) {
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
      <div className="rounded-2xl border border-ready/50 bg-ready/10 p-6">
        <div className="display-heading text-lg text-ready">{labels.successTitle}</div>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {labels.successBody.replace("{email}", CONTACT_EMAIL)}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn-ghost mt-4 inline-flex text-xs!"
        >
          {labels.editBtn}
        </button>
      </div>
    );
  }

  const INPUT =
    "mt-1 w-full rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.role}</span>
          <input name="role" className={INPUT} placeholder={labels.rolePh} />
        </label>
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
            placeholder={labels.emailPh}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{labels.message}</span>
        <textarea name="message" rows={4} className={INPUT} placeholder={labels.msgPh} />
      </label>
      <button type="submit" className="btn-primary w-full">
        {labels.submit}
      </button>
      <p className="text-[11px] text-muted">{labels.mailNote}</p>
    </form>
  );
}
