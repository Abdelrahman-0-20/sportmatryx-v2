"use client";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

/**
 * Demo request form. No backend: on submit it validates every field, then
 * opens the visitor's mail client with a prefilled message. The success state
 * is honest about that — it never claims the message was sent, and the linked
 * draft is kept so nothing is lost when no mail client opens.
 *
 * All labels come from the i18n dictionary; per-field messages come from the
 * browser's own constraint validation (localized with the visitor's browser).
 */
const CONTACT_EMAIL = "sportmatryx@protonmail.com";

const INPUT =
  "mt-1 w-full rounded-lg border border-edge/70 bg-panel-2/80 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none aria-invalid:border-compromised";

const LABEL = "block text-[11px] font-bold uppercase tracking-[0.14em] text-muted";

type FieldName = "name" | "organization" | "role" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

export function DemoForm({ labels }: { labels: Dict["demo"]["form"] }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<string[]>([]);
  const [mailHref, setMailHref] = useState("");

  const fieldLabels: Record<string, string> = {
    name: labels.name,
    organization: labels.organization,
    role: labels.role,
    email: labels.email,
    message: labels.message,
  };

  /** Collect constraint violations: per-field messages + a readable summary. */
  function collect(form: HTMLFormElement, focusFirst: boolean): string[] {
    const next: FieldErrors = {};
    const messages: string[] = [];
    let firstInvalid: HTMLElement | null = null;

    for (const el of Array.from(form.elements)) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) continue;
      if (el.checkValidity()) continue;
      const message = el.validationMessage;
      next[el.name as FieldName] = message;
      messages.push(`${fieldLabels[el.name] ?? el.name} — ${message}`);
      if (!firstInvalid) firstInvalid = el;
    }

    setErrors(next);
    setSummary(messages);
    if (focusFirst) firstInvalid?.focus();
    return messages;
  }

  function handleChange(e: FormEvent<HTMLFormElement>) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (!target.checkValidity()) return; // still being typed — mark only on submit
    setErrors((prev) =>
      prev[target.name as FieldName] ? { ...prev, [target.name as FieldName]: undefined } : prev,
    );
    const stillInvalid = Array.from(e.currentTarget.elements).some(
      (el) =>
        (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && !el.checkValidity(),
    );
    if (!stillInvalid) setSummary([]);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (collect(form, true).length > 0) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const org = String(data.get("organization") ?? "");
    const role = String(data.get("role") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = encodeURIComponent(`Demo request — ${org || name || "Sportmetryx"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nOrganization: ${org}\nRole: ${role}\nEmail: ${email}\n\n${message}`,
    );
    setMailHref(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSent(true);
  }

  if (sent) {
    const [before, ...rest] = labels.successBody.split("{email}");
    const after = rest.join("{email}");
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-ready/50 bg-ready/10 p-6">
        <div className="display-heading text-lg text-ready">{labels.successTitle}</div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {before}
          <a
            href={mailHref || `mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-accent underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          {after}
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-ghost mt-4">
          {labels.editBtn}
        </button>
      </div>
    );
  }

  function err(name: FieldName) {
    return errors[name] ? (
      <p className="mt-1 text-xs leading-relaxed text-compromised">{errors[name]}</p>
    ) : null;
  }

  return (
    <form noValidate onSubmit={handleSubmit} onChange={handleChange} className="space-y-3">
      {summary.length > 0 ? (
        <div
          role="alert"
          aria-live="assertive"
          className="flex gap-2.5 rounded-xl border border-compromised/50 bg-compromised/10 px-4 py-3 text-sm text-compromised"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.486 3.4a1 1 0 0 1 1.9-.4l6.1 9.6A1 1 0 0 1 15.6 14H4.4a1 1 0 0 1-.886-1.4l6.086-9.2ZM10 7.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0V8A.75.75 0 0 1 10 7.25Zm0 5.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
              clipRule="evenodd"
            />
          </svg>
          <ul className="space-y-0.5">
            {summary.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>
            {labels.name} <span className="text-accent">*</span>
          </span>
          <input
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors.name ? "true" : undefined}
            className={INPUT}
            placeholder={labels.namePh}
          />
          {err("name")}
        </label>
        <label className="block">
          <span className={LABEL}>{labels.organization}</span>
          <input
            name="organization"
            autoComplete="organization"
            aria-invalid={errors.organization ? "true" : undefined}
            className={INPUT}
            placeholder={labels.orgPh}
          />
          {err("organization")}
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>{labels.role}</span>
          <input
            name="role"
            aria-invalid={errors.role ? "true" : undefined}
            className={INPUT}
            placeholder={labels.rolePh}
          />
          {err("role")}
        </label>
        <label className="block">
          <span className={LABEL}>
            {labels.email} <span className="text-accent">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            className={INPUT}
            placeholder={labels.emailPh}
          />
          {err("email")}
        </label>
      </div>
      <label className="block">
        <span className={LABEL}>{labels.message}</span>
        <textarea
          name="message"
          rows={4}
          aria-invalid={errors.message ? "true" : undefined}
          className={INPUT}
          placeholder={labels.msgPh}
        />
        {err("message")}
      </label>
      <button type="submit" className="btn-primary w-full">
        {labels.submit}
      </button>
      <p className="text-xs leading-relaxed text-muted">{labels.mailNote}</p>
    </form>
  );
}
