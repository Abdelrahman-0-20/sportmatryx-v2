"use client";

/** Back-to-top control in the footer bar — smooth unless reduced motion. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      aria-label="Back to top"
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-panel text-muted transition-all hover:border-accent/60 hover:text-accent hover:shadow-[0_0_18px_-6px_rgba(95,208,240,0.6)]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="transition-transform group-hover:-translate-y-0.5"
      >
        <path
          d="M7 11.5V2.5M7 2.5L2.5 7M7 2.5L11.5 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
