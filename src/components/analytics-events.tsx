"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

/**
 * Delegated click tracking — captures site-wide CTAs and file downloads
 * without needing onClick props on every server-rendered link. Mounted once
 * in the root layout; renders nothing.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as HTMLElement | null)?.closest?.("a");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      if (!href) return;
      if (el.hasAttribute("download")) {
        track("file_download", { file: href.split("/").pop() ?? href });
        return;
      }
      if (href.startsWith("/demo")) track("cta_demo");
      else if (href.startsWith("/pilot")) track("cta_pilot");
      else if (href.startsWith("/login")) track("cta_signin");
      else if (href.startsWith("/share")) track("cta_share");
      else if (href.startsWith("/investors")) track("cta_investors");
      else if (href.startsWith("/methodology")) track("cta_methodology");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
