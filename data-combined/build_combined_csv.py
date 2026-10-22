#!/usr/bin/env python3
"""
Sportmetryx — build combined CSVs from the 14 source files.

Outputs (in data-combined/):
  1. Sportmetryx_Combined_All_Data.csv        -> EVERY row of EVERY file in one file
     (long format: source_file, record_type, date_iso + all columns merged, name collisions qualified)
  2. Sportmetryx_Combined_Wide_Athlete_Day.csv -> analysis-ready: one row per athlete per day,
     joining roster, baselines, consent, sessions (aggregated), scores, components (pivoted),
     drivers (pivoted), validity checks (pivoted), observations (daily aggregates)
  3. Sportmetryx_Athletes_Sessions_Joined.csv -> research dataset: athletes.csv joined to
     sessions.csv on athlete_id (one row per session with athlete features appended)
  4. README.md documenting the columns

Pure Python (csv module) — no pandas required.
"""

import csv
import os
import sys
from collections import defaultdict, Counter
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "source")

FILES = {
    "00-users": "00-users.csv",
    "01-roster": "01-roster.csv",
    "02-baselines": "02-baselines.csv",
    "03-training-sessions": "03-training-sessions.csv",
    "04-performance-scores": "04-performance-scores.csv",
    "05-score-components": "05-score-components.csv",
    "06-score-drivers": "06-score-drivers.csv",
    "07-validity-checks": "07-validity-checks.csv",
    "08-observations": "08-observations.csv",
    "09-consent-records": "09-consent-records.csv",
    "10-interventions": "10-interventions.csv",
    "11-intervention-reviews": "11-intervention-reviews.csv",
    "athletes": "athletes.csv",
    "sessions": "sessions.csv",
}

# which column of each file carries the event date (used for the unified date_iso column)
DATE_COL = {
    "03-training-sessions": "Date",
    "04-performance-scores": "Timestamp",
    "05-score-components": "Score Timestamp",
    "06-score-drivers": "Score Timestamp",
    "07-validity-checks": "Score Timestamp",
    "08-observations": "Timestamp",
    "02-baselines": "Start",
    "09-consent-records": "Granted At",
    "sessions": "start_ts_utc",
}

# columns shared by several files but with DIFFERENT meaning -> qualify per file
QUALIFY = {
    "03-training-sessions": {"Type": "Session Type", "Description": "Session Description"},
    "02-baselines": {"Type": "Baseline Type", "Status": "Baseline Status"},
    "08-observations": {"Type": "Observation Type", "Timestamp": "Observation Timestamp"},
    "04-performance-scores": {"Timestamp": "Score Timestamp"},
    "06-score-drivers": {"Type": "Driver Type"},
    "09-consent-records": {"Status": "Consent Status"},
    "10-interventions": {"Status": "Intervention Status"},
    "01-roster": {"Status": "Roster Status"},
}


def parse_date(raw):
    """Parse the various source formats -> ISO yyyy-mm-dd (or '')."""
    if not raw or not raw.strip():
        return ""
    raw = raw.strip()
    for fmt in ("%m/%d/%Y %H:%M", "%m/%d/%Y", "%Y-%m-%dT%H:%M:%SZ"):
        try:
            return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    # sessions.csv has ISO like 2026-02-20T17:49:56Z
    if len(raw) >= 10 and raw[4] == "-" and raw[7] == "-":
        return raw[:10]
    return ""


def read_all():
    data = {}
    for key, fname in FILES.items():
        path = os.path.join(SRC, fname)
        with open(path, newline="", encoding="utf-8-sig") as f:
            rows = [dict(r) for r in csv.DictReader(f)]
        data[key] = rows
        print(f"  read {fname}: {len(rows)} rows")
    return data


def to_float(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def build_long(data):
    """1) One big CSV: every row of every file, with source_file + record_type + date_iso."""
    # union of (qualified) column names across files, preserving encounter order
    all_cols = []
    col_seen = set()
    for key in FILES:
        for row in data[key]:
            for c in row.keys():
                qc = QUALIFY.get(key, {}).get(c, c)
                if qc not in col_seen:
                    col_seen.add(qc)
                    all_cols.append(qc)

    header = ["source_file", "record_type", "date_iso"] + all_cols
    n = 0
    out = os.path.join(BASE, "Sportmetryx_Combined_All_Data.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header, extrasaction="ignore")
        w.writeheader()
        for key in FILES:
            qual = QUALIFY.get(key, {})
            for row in data[key]:
                rec = {"source_file": key, "record_type": key.split("-", 1)[-1] if "-" in key else key}
                for c, v in row.items():
                    rec[qual.get(c, c)] = v
                dc = DATE_COL.get(key)
                rec["date_iso"] = parse_date(row.get(dc, "")) if dc else ""
                w.writerow(rec)
                n += 1
    print(f"  -> Sportmetryx_Combined_All_Data.csv: {n} rows, {len(header)} columns")
    return all_cols


def build_wide(data):
    """2) One row per (athlete, date) — everything merged into feature columns."""
    roster = {r["Athlete"]: r for r in data["01-roster"]}
    baselines = defaultdict(list)
    for r in data["02-baselines"]:
        baselines[r["Athlete"]].append(r)
    consent = defaultdict(list)
    for r in data["09-consent-records"]:
        consent[r["Athlete"]].append(r)
    interventions = defaultdict(list)
    for r in data["10-interventions"]:
        interventions[r["Athlete"]].append(r)
    reviews = defaultdict(list)
    for r in data["11-intervention-reviews"]:
        reviews[r["Athlete"]].append(r)

    # ---- index by (athlete, date) ----
    scores = defaultdict(list)          # 04
    components = defaultdict(list)      # 05
    drivers = defaultdict(list)         # 06
    checks = defaultdict(list)          # 07
    obs = defaultdict(list)             # 08
    sess = defaultdict(list)            # 03

    for r in data["04-performance-scores"]:
        scores[(r["Athlete"], parse_date(r["Timestamp"]))].append(r)
    for r in data["05-score-components"]:
        components[(r["Athlete"], parse_date(r["Score Timestamp"]))].append(r)
    for r in data["06-score-drivers"]:
        drivers[(r["Athlete"], parse_date(r["Score Timestamp"]))].append(r)
    for r in data["07-validity-checks"]:
        checks[(r["Athlete"], parse_date(r["Score Timestamp"]))].append(r)
    for r in data["08-observations"]:
        obs[(r["Athlete"], parse_date(r["Timestamp"]))].append(r)
    for r in data["03-training-sessions"]:
        sess[(r["Athlete"], parse_date(r["Date"]))].append(r)

    obs_types = sorted({r["Observation Type"] if False else r["Type"] for r in data["08-observations"]})
    comp_types = sorted({r["Component"] for r in data["05-score-components"]})
    check_types = sorted({r["Check"] for r in data["07-validity-checks"]})

    header = ["Athlete", "Date"]
    # athlete-level attributes
    header += ["Team", "Position", "Roster Role", "Roster Status", "Born", "Roster Consent"]
    header += ["Baseline Start", "Baseline End", "Baseline Status", "Baseline Version"]
    header += ["Consent Status", "Consent Granted At"]
    header += ["Intervention Exception", "Intervention Priority", "Intervention Status",
               "Intervention Window", "Intervention Recommendation"]
    header += ["Review Decision", "Review Reviewer", "Review Notes"]
    # score-level
    header += ["Score", "Score Band", "Score Confidence", "Score Validity", "Score Reason"]
    # pivoted components
    for c in comp_types:
        name = c.title().replace("_", " ")
        header += [f"{name} Norm", f"{name} Original", f"{name} Unit", f"{name} Contribution"]
    # pivoted drivers
    header += ["Positive Drivers", "Positive Drivers n", "Negative Drivers", "Negative Drivers n"]
    # pivoted validity checks
    for c in check_types:
        header += [f"Check {c.replace('_', ' ').title()}"]
    # pivoted observations (daily mean + n)
    for t in obs_types:
        header += [f"{t} Mean", f"{t} n"]
    # aggregated sessions
    header += ["Sessions n", "Session Types", "Session Duration Total min", "Session Intensity Avg",
               "Session Venues", "Session Opponents", "Session Surface", "Session Drill",
               "Session Air Quality", "Session Temp C", "Session Travel"]

    keys = sorted(set(scores) | set(components) | set(drivers) | set(checks) | set(obs) | set(sess),
                  key=lambda k: (k[0], k[1]))
    n = 0
    out = os.path.join(BASE, "Sportmetryx_Combined_Wide_Athlete_Day.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        for (athlete, date) in keys:
            if not athlete or not date:
                continue
            row = {c: "" for c in header}
            row["Athlete"], row["Date"] = athlete, date

            r = roster.get(athlete)
            if r:
                row["Team"], row["Position"] = r["Team"], r["Position"]
                row["Roster Role"], row["Roster Status"] = r["Roster Role"], r["Status"]
                row["Born"], row["Roster Consent"] = r["Born"], r["Consent"]

            bl = baselines.get(athlete)
            if bl:
                b = bl[0]
                row["Baseline Start"], row["Baseline End"] = b["Start"], b["End"]
                row["Baseline Status"], row["Baseline Version"] = b["Status"], b["Version"]

            cs = consent.get(athlete)
            if cs:
                row["Consent Status"] = "; ".join(sorted({c["Status"] for c in cs}))
                row["Consent Granted At"] = "; ".join(sorted({c["Granted At"] for c in cs if c["Granted At"]}))

            iv = interventions.get(athlete)
            if iv:
                i = iv[0]
                row["Intervention Exception"] = i["Exception"]
                row["Intervention Priority"] = i["Priority"]
                row["Intervention Status"] = i["Status"]
                row["Intervention Window"] = i["Window"]
                row["Intervention Recommendation"] = i["Recommendation"]

            rv = reviews.get(athlete)
            if rv:
                row["Review Decision"] = rv[0]["Decision"]
                row["Review Reviewer"] = rv[0]["Reviewer"]
                row["Review Notes"] = rv[0]["Notes"]

            sc = scores.get((athlete, date))
            if sc:
                s = sc[0]
                row["Score"] = s["Score"]
                row["Score Band"] = s["Band"]
                row["Score Confidence"] = s["Confidence"]
                row["Score Validity"] = s["Validity"]
                row["Score Reason"] = s["Reason"]

            for c in comp_types:
                rows_c = [x for x in components.get((athlete, date), []) if x["Component"] == c]
                if rows_c:
                    name = c.title().replace("_", " ")
                    row[f"{name} Norm"] = rows_c[0]["Normalized (0-1)"]
                    row[f"{name} Original"] = rows_c[0]["Original Value"]
                    row[f"{name} Unit"] = rows_c[0]["Original Unit"]
                    row[f"{name} Contribution"] = rows_c[0]["Contribution"]

            dr = drivers.get((athlete, date), [])
            pos = [d for d in dr if d["Type"] == "POSITIVE"]
            neg = [d for d in dr if d["Type"] == "NEGATIVE"]
            row["Positive Drivers"] = "; ".join(d["Driver"] for d in pos)
            row["Negative Drivers"] = "; ".join(d["Driver"] for d in neg)
            row["Positive Drivers n"] = len(pos)
            row["Negative Drivers n"] = len(neg)

            ck = checks.get((athlete, date), [])
            for c in check_types:
                rows_c = [x for x in ck if x["Check"] == c]
                if rows_c:
                    row[f"Check {c.replace('_', ' ').title()}"] = rows_c[0]["Status"]

            ob = obs.get((athlete, date), [])
            by_type = defaultdict(list)
            for x in ob:
                v = to_float(x["Value"])
                if v is not None:
                    by_type[x["Type"]].append(v)
            for t in obs_types:
                vals = by_type.get(t)
                if vals:
                    row[f"{t} Mean"] = round(sum(vals) / len(vals), 3)
                    row[f"{t} n"] = len(vals)

            ss = sess.get((athlete, date), [])
            if ss:
                row["Sessions n"] = len(ss)
                row["Session Types"] = "; ".join(sorted({s["Type"] for s in ss}))
                row["Session Duration Total min"] = sum(to_float(s["Duration (min)"]) or 0 for s in ss)
                ints = [to_float(s["Intensity"]) for s in ss if to_float(s["Intensity"]) is not None]
                row["Session Intensity Avg"] = round(sum(ints) / len(ints), 2) if ints else ""
                row["Session Venues"] = "; ".join(sorted({s["Venue"] for s in ss if s["Venue"]}))
                row["Session Opponents"] = "; ".join(sorted({s["Opponent"] for s in ss if s["Opponent"]}))
                row["Session Surface"] = "; ".join(sorted({s["Surface"] for s in ss if s["Surface"]}))
                row["Session Drill"] = "; ".join(sorted({s["Drill"] for s in ss if s["Drill"]}))
                row["Session Air Quality"] = "; ".join(sorted({s["Air Quality"] for s in ss if s["Air Quality"]}))
                temps = [to_float(s["Temp (C)"]) for s in ss if to_float(s["Temp (C)"]) is not None]
                row["Session Temp C"] = max(temps) if temps else ""
                row["Session Travel"] = "; ".join(sorted({s["Travel"] for s in ss if s["Travel"]})) or ""

            w.writerow([row[c] for c in header])
            n += 1
    print(f"  -> Sportmetryx_Combined_Wide_Athlete_Day.csv: {n} rows, {len(header)} columns")
    return n


def build_athlete_session(data):
    """3) athletes.csv x sessions.csv on athlete_id — one row per session."""
    athletes = {a["athlete_id"]: a for a in data["athletes"]}
    sessions = data["sessions"]
    if not sessions:
        return 0
    athlete_cols = list(sessions[0].keys())
    header = list(athlete_cols)
    for c in athletes[next(iter(athletes))].keys():
        if c != "athlete_id":
            header.append(f"ath_{c}")
    header.append("date_iso")

    n = 0
    out = os.path.join(BASE, "Sportmetryx_Athletes_Sessions_Joined.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for s in sessions:
            row = {f"ath_{c}": "" for c in athletes[next(iter(athletes))] if c != "athlete_id"}
            for c, v in s.items():
                row[c] = v
            a = athletes.get(s["athlete_id"])
            if a:
                for c, v in a.items():
                    if c != "athlete_id":
                        row[f"ath_{c}"] = v
            row["date_iso"] = parse_date(s.get("start_ts_utc", ""))
            w.writerow(row)
            n += 1
    print(f"  -> Sportmetryx_Athletes_Sessions_Joined.csv: {n} rows, {len(header)} columns")
    return n


def main():
    print("Reading source CSVs from data-combined/source ...")
    data = read_all()
    print("\n1) Building the big long combined file ...")
    build_long(data)
    print("\n2) Building the wide athlete-day combined file ...")
    build_wide(data)
    print("\n3) Building the research dataset join ...")
    build_athlete_session(data)
    print("\nDone. All outputs are in data-combined/.")


if __name__ == "__main__":
    sys.exit(main())
