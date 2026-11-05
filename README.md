[![Live](https://img.shields.io/badge/live-sportmatryx--v2.vercel.app-0b1529?style=flat&logo=vercel&logoColor=5fd0f0)](https://sportmatryx-v2.vercel.app)

# Sportmetryx

**Human performance intelligence for sport** — validity-gated readiness scores, explainable drivers, consent-governed data.

**Live: https://sportmatryx-v2.vercel.app**

## What it does

- **Readiness board** — daily `READY / MONITOR / COMPROMISED / WITHHELD` per athlete, scored against personal baselines, never from bad inputs
- **Player 360** — score breakdown, drivers, 14-day trends, confidence
- **Marketplace** — data products, cart, demo checkout (the revenue layer)
- **Tactics** — CSS-3D board: formations, phases, game systems, coaching drills
- **Governance** — consent records, role-based access, hash-chained audit log
- **Marketing site** — Platform · Solutions · Tactics · Proof · Demo · Pilot · Changelog

## Stack

Next.js (App Router) · TypeScript · Tailwind · PostgreSQL (**Neon**) via Prisma · Vercel

## Run it

```bash
pnpm install
cp .env.example .env    # set DATABASE_URL (Neon) + AUTH_SECRET
pnpm dev                # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `pnpm build` | `prisma generate` + production build |
| `pnpm db:deploy` | apply `prisma/migrations` to the configured database |
| `pnpm start` | serve the production build |

## Structure

```
src/app         pages + API routes (marketing, app, api)
src/lib         scoring engine, RBAC, services, prisma client
src/components  UI: marketing chrome, marketplace, tactical board, ui kit
prisma          schema + versioned migrations (Neon)
public          demo dataset (CSV) + hero footage
```

## Notes

- Sample data included to explore every screen out of the box.
- Checkout is secure — no payment details are required.

Built by **Healthmetryx**.
