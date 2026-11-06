[![Live](https://img.shields.io/badge/live-sportmatryx--v2.vercel.app-0b1529?style=flat&logo=vercel&logoColor=5fd0f0)](https://sportmatryx-v2.vercel.app)

# Sportmetryx

**Human performance intelligence for sport** — validity-gated readiness scores, explainable drivers, consent-governed data.

**Live: https://sportmatryx-v2.vercel.app**

## What it does

- **Readiness board** — daily `READY / MONITOR / COMPROMISED / WITHHELD` per athlete, scored against personal baselines, never from bad inputs
- **Player 360** — score breakdown, drivers, 14-day trends, confidence
- **Marketplace** — data products, cart, secure checkout (the revenue layer)
- **Tactics** — CSS-3D board: formations, phases, game systems, coaching drills
- **Data explorer** — `/data`: per-sport session stats, two downloadable datasets, 106-column dictionary
- **Governance** — consent records, role-based access, hash-chained audit log
- **Marketing site** — Platform · Solutions · Tactics · Proof · Demo · Pilot · Changelog · Methodology

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) · TypeScript · Tailwind |
| **Database** | **Neon** — serverless PostgreSQL (pooled endpoint for the app, direct endpoint for migrations) |
| Data access | Prisma — typed client, schema, versioned migrations in `prisma/migrations` |
| Hosting | Vercel — auto-deploy from `main` |
| Email | Resend — transactional (optional) |

The database lives entirely on **Neon**: schema and migrations are applied with
`pnpm db:deploy`, and the app reads `DATABASE_URL` at runtime. Prisma is only the
access layer — never a second database.

## Datasets

Served from `public/datasets/` and downloadable at [`/data`](https://sportmatryx-v2.vercel.app/data):

| File | Grain |
|---|---|
| `Sportmetryx_Combined_Wide_Athlete_Day.csv` | 1,362 athlete-days — scores, bands, drivers, checks |
| `final1.csv` | 1,431 sessions joined with athletes, environment & device metrics |
| `Sportmetryx_Wide_Data_Dictionary.csv` | Every column of the athlete-day file, described |

## Environment variables

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string (used by Prisma migrations) |
| `AUTH_SECRET` | `openssl rand -hex 32` |
| `RESEND_API_KEY` | optional — Resend key for welcome/alert emails |
| `RESEND_FROM` | optional — sender address (defaults to Resend's onboarding sender) |
| `NEWSLETTER_OWNER` | optional — inbox that receives waitlist alerts |

## Run it

```bash
pnpm install
cp .env.example .env    # fill DATABASE_URL (Neon) + AUTH_SECRET
pnpm dev                # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `pnpm build` | `prisma generate` + production build |
| `pnpm db:deploy` | apply `prisma/migrations` to the Neon database |
| `pnpm start` | serve the production build |

## Structure

```
src/app         pages + API routes (marketing, app, api)
src/lib         scoring engine, RBAC, services, prisma client
src/components  UI: marketing chrome, marketplace, tactical board, ui kit
prisma          schema + versioned migrations (Neon)
public          datasets (CSV) + hero footage
```

## Notes

- Sample data included to explore every screen out of the box.
- Checkout is secure — no payment details are required.

Built by **Healthmetryx**.
