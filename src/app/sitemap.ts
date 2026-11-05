import type { MetadataRoute } from "next";

const BASE = "https://sportmatryx-v2.vercel.app";

const ROUTES: Array<[path: string, priority: number]> = [
  ["", 1],
  ["/platform", 0.9],
  ["/solutions", 0.9],
  ["/tactics", 0.8],
  ["/proof", 0.8],
  ["/demo", 0.9],
  ["/marketplace", 0.8],
  ["/guest", 0.7],
  ["/pilot", 0.9],
  ["/share", 0.5],
  ["/changelog", 0.6],
  ["/login", 0.5],
  ["/investors", 0.4],
  ["/privacy", 0.3],
  ["/terms", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
