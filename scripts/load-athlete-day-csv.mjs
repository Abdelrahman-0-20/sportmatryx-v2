// scripts/load-athlete-day-csv.mjs
// Loads data/Sportmetryx_Combined_Wide_Athlete_Day.csv (1,362 athlete-day rows)
// into the app database: teams, athletes, per-day sensor observations,
// training sessions, and performance scores.
// Idempotent: re-runs delete only rows tagged with the [csv-load] marker.
//
// Usage: node scripts/load-athlete-day-csv.mjs
// Honesty rule: this is the team-generated SYNTHETIC dataset; the loader tags
// every created row with source "Combined Wide Athlete-Day CSV".

import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = path.join(ROOT, "data", "Sportmetryx_Combined_Wide_Athlete_Day.csv");
const SOURCE_NAME = "Combined Wide Athlete-Day CSV";
const MARK = "[csv-load]";

const prisma = new PrismaClient();

// --- Minimal RFC4180 CSV parser (handles quoted fields with commas) --------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const UNITS = {
  ACCEL_N: "count", ACWR: "ratio", ALT_M: "m", AQI: "index", HEAT_C: "C",
  HRV_MS: "ms", JUMP_CM: "cm", LOAD_AU: "au", RESP_RATE: "brpm", RHR: "bpm",
  SLEEP_H: "h", SPO2: "%", TZ_SHIFT_H: "h", VENT_EFF: "%", VO2_PROXY: "ml/kg/min",
};
const SENSOR_COLS = Object.keys(UNITS);

function parseDay(s) { return new Date(`${s}T12:00:00.000Z`); }
function num(v) { const f = parseFloat(v); return Number.isFinite(f) ? f : null; }

async function main() {
  const text = fs.readFileSync(CSV_PATH, "utf8");
  const table = parseCsv(text);
  const header = table[0];
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = table.slice(1).filter(r => r[idx.Athlete]);
  console.log(`CSV rows: ${rows.length}`);

  // 0. Data source
  const source = await prisma.dataSource.upsert({
    where: { name: SOURCE_NAME },
    update: { type: "FILE_UPLOAD", description: `Team-generated synthetic dataset, ${rows.length} athlete-day rows. ${MARK}` },
    create: { name: SOURCE_NAME, type: "FILE_UPLOAD", description: `Team-generated synthetic dataset, ${rows.length} athlete-day rows. ${MARK}` },
  });

  // Clean previous load (idempotent)
  const delObs = await prisma.observation.deleteMany({ where: { dataSourceId: source.id } });
  const delSes = await prisma.trainingSession.deleteMany({ where: { description: { contains: MARK } } });
  const delScore = await prisma.performanceScore.deleteMany({ where: { explanation: { contains: MARK } } });
  console.log(`Cleared previous load: obs=${delObs.count} sessions=${delSes.count} scores=${delScore.count}`);

  // Performance model / config version (reuse seed's if present)
  let model = await prisma.performanceModel.findFirst({ orderBy: { createdAt: "asc" } });
  if (!model) {
    model = await prisma.performanceModel.create({
      data: { name: "HealthMetryx Composite v1 (CSV load)", description: `${MARK} created by loader`, isActive: true },
    });
  }
  let version = await prisma.modelConfigurationVersion.findFirst({
    where: { performanceModelId: model.id }, orderBy: { versionNumber: "desc" },
  });
  if (!version) {
    version = await prisma.modelConfigurationVersion.create({
      data: {
        performanceModelId: model.id, versionNumber: 1,
        weights: { "Baseline Deviation": 0.2, "Environment Travel": 0.1, "Movement Explosive": 0.15, "Oxygen Function": 0.15, "Recovery Autonomic": 0.15, "Respiratory Efficiency": 0.15, "Workload Response": 0.1 },
        validityRules: { marker: MARK },
      },
    });
  }

  const teams = new Map();
  const athletes = new Map(); // name -> athlete row
  const obsRows = [];
  let sessions = 0, scores = 0, consents = 0, newAthletes = 0;

  for (const r of rows) {
    const name = r[idx.Athlete].trim();
    const teamName = (r[idx.Team] || "Unassigned").trim();

    // Team upsert
    if (!teams.has(teamName)) {
      const t = await prisma.team.upsert({
        where: { name: teamName },
        update: {},
        create: { name: teamName, description: `${MARK} imported from ${SOURCE_NAME}` },
      });
      teams.set(teamName, t.id);
    }
    const teamId = teams.get(teamName);

    // Athlete upsert by first+last name
    const [first, ...rest] = name.split(" ");
    const last = rest.join(" ") || "Unknown";
    let athlete = athletes.get(name);
    if (!athlete) {
      athlete = await prisma.athlete.findFirst({
        where: { AND: [{ firstName: { equals: first } }, { lastName: { equals: last } }] },
      });
      if (!athlete) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        athlete = await prisma.athlete.create({
          data: {
            externalId: `CSV-${slug}`,
            firstName: first, lastName: last, teamId,
            position: (r[idx.Position] || "OTHER"),
            rosterRole: r[idx["Roster Role"]] || null,
            dateOfBirth: r[idx.Born] ? new Date(Date.UTC(parseInt(r[idx.Born], 10), 0, 1)) : null,
          },
        });
        newAthletes++;
      }
      athletes.set(name, athlete);
    }
    const athleteId = athlete.id;

    // Keep team membership in sync with the CSV (the dataset is the authority).
    if (athlete.teamId !== teamId) {
      await prisma.athlete.update({ where: { id: athleteId }, data: { teamId } });
    }

    // Consent (only if none exists for this athlete)
    if ((r[idx["Consent Status"]] || "").toUpperCase() === "GRANTED") {
      const has = await prisma.consentRecord.findFirst({ where: { athleteId }, select: { id: true } });
      if (!has) {
        await prisma.consentRecord.create({ data: { athleteId, consentType: "Data Sharing", status: "GRANTED" } });
        consents++;
      }
    }

    const day = parseDay(r[idx.Date]);

    // Observations — one per sensor column with a value
    for (const col of SENSOR_COLS) {
      const v = num(r[idx[`${col} Mean`]]);
      if (v === null) continue;
      const n = num(r[idx[`${col} n`]]) ?? 0;
      obsRows.push({
        athleteId, dataSourceId: source.id, timestamp: day,
        type: col, value: v, unit: UNITS[col],
        metadata: { n, source: SOURCE_NAME, marker: MARK },
        isValid: true,
      });
    }

    // Training session (one per day when sessions were logged)
    const sessN = num(r[idx["Sessions n"]]) ?? 0;
    if (sessN > 0) {
      const types = (r[idx["Session Types"]] || "PRACTICE").split(/[,;|]/).map(s => s.trim().toUpperCase());
      const sessionType = types.includes("GAME") ? "GAME"
        : types.includes("PRACTICE") ? "PRACTICE"
        : types.includes("TRAVEL") ? "TRAVEL"
        : types.includes("RECOVERY") ? "RECOVERY"
        : types.includes("TESTING") ? "TESTING" : "PRACTICE";
      await prisma.trainingSession.create({
        data: {
          athleteId, sessionType, date: day,
          durationMinutes: num(r[idx["Session Duration Total min"]]) ?? undefined,
          intensity: r[idx["Session Intensity Avg"]] || null,
          description: `${MARK} types=${r[idx["Session Types"]] || ""} venues=${r[idx["Session Venues"]] || ""} surface=${r[idx["Session Surface"]] || ""} aqi=${r[idx["Session Air Quality"]] || ""} tempC=${r[idx["Session Temp C"]] || ""}`,
        },
      });
      sessions++;
    }

    // Performance score (only rows that carry a score)
    const scoreVal = num(r[idx.Score]);
    if (scoreVal !== null) {
      const exists = await prisma.performanceScore.findFirst({
        where: { athleteId, timestamp: { gte: day, lt: new Date(day.getTime() + 86400000) } },
        select: { id: true },
      });
      if (!exists) {
        await prisma.performanceScore.create({
          data: {
            athleteId, performanceModelId: model.id, modelConfigurationVersionId: version.id,
            timestamp: day, score: scoreVal,
            scoreBand: r[idx["Score Band"]] || null,
            confidence: num(r[idx["Score Confidence"]]) ?? undefined,
            validityStatus: (r[idx["Score Validity"]] || "VALID").toUpperCase(),
            validityReason: r[idx["Score Reason"]] || null,
            explanation: `${MARK} loaded from ${SOURCE_NAME}`,
          },
        });
        scores++;
      }
    }
  }

  // Bulk-insert observations in chunks
  for (let i = 0; i < obsRows.length; i += 4000) {
    await prisma.observation.createMany({ data: obsRows.slice(i, i + 4000) });
  }

  console.log(`Loaded: teams=${teams.size} athletes(new)=${newAthletes} observations=${obsRows.length} sessions=${sessions} scores=${scores} consents=${consents}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error("FAILED:", e.message); process.exit(1); });
