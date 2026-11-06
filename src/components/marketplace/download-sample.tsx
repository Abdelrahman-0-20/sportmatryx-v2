"use client";

import { samplePreviewCsv, samplePreviewFileName, samplePreviewNote } from "@/lib/marketplace/sample-previews";
import type { MarketProduct } from "@/lib/services/marketplace";

/**
 * Sample CSV preview download — demoted from a third card CTA to a compact
 * meta link; the explanatory note lives on its `title` tooltip instead of
 * eating a line of card copy.
 */
export function DownloadSamplePreview({ product }: { product: MarketProduct }) {
  const note = samplePreviewNote(product);

  function download() {
    const csv = samplePreviewCsv(product);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = samplePreviewFileName(product);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      title={note}
      aria-label={`Download sample preview. ${note}`}
      className="shrink-0 whitespace-nowrap text-[11px] font-semibold text-accent underline-offset-2 hover:underline"
    >
      Download sample preview
    </button>
  );
}
