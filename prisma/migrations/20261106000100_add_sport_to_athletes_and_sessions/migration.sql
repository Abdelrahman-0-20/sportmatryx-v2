-- Multi-sport support: an athlete plays one sport, their sessions inherit it.
ALTER TABLE "athletes" ADD COLUMN "sport" TEXT NOT NULL DEFAULT 'American football';
ALTER TABLE "training_sessions" ADD COLUMN "sport" TEXT NOT NULL DEFAULT 'American football';

-- Backfill the seeded demo roster across the eight sports covered by the
-- curated dataset (public/datasets/final1.csv), deterministically ordered so
-- repeated applies are stable.
WITH sports AS (
  SELECT * FROM (VALUES
    ('American football', 0),
    ('basketball', 1),
    ('cycling', 2),
    ('baseball', 3),
    ('rugby', 4),
    ('soccer', 5),
    ('track and field', 6),
    ('volleyball', 7)
  ) AS t(sport, ord)
),
ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY COALESCE("externalId", id)) - 1 AS rn
  FROM athletes
)
UPDATE athletes a
SET sport = s.sport
FROM ranked r
JOIN sports s ON s.ord = (r.rn % 8)
WHERE a.id = r.id;

-- Sessions inherit their athlete's sport.
UPDATE training_sessions ts
SET sport = a.sport
FROM athletes a
WHERE ts."athleteId" = a.id;
