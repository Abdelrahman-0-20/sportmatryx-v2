import { Fragment } from "react";

/**
 * Rich — renders a dictionary string with **bold emphasis** markers:
 * "Every score is **validity-gated**…" → bold accent-ink spans.
 */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-ink">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
