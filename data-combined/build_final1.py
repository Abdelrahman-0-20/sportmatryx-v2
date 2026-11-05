#!/usr/bin/env python3
"""
Sportmetryx — build final1.csv: the logical combined dataset for the new
multisport source files.

Grain: ONE ROW PER SESSION (the grain shared by sessions.csv and
environmental_conditions.csv; device observations are aggregated into it).

Join logic (all on athlete_id / session_id, inner join — verified no orphans):
  1. sessions.csv            -> base columns (one row per session)
  2. athletes.csv            -> athlete features, prefixed `ath_`
                                (same convention as
                                Sportmetryx_Athletes_Sessions_Joined.csv)
  3. environmental_conditions.csv -> environment features, prefixed `env_`
     (duplicate keys skipped: session_id, athlete_id, sport, start_ts_utc,
      indoor, is_synthetic — already present from the session row)
  4. device_observations_linked_multisport.csv -> aggregated per session,
     prefixed `dev_`:
       - dev_observations_n, dev_device_ids, dev_battery_pct_mean,
         dev_signal_quality_mean, dev_signal_dropout_pct
       - per metric_type (ACCEL_MAG, GPS_SPEED, HR, RESP_RATE, SPO2):
         {M}_n, {M}_mean, {M}_min, {M}_max
  5. Sportmetryx_Athletes_Sessions_Joined.csv -> not consumed as input; its
     content (athletes x sessions) is regenerated exactly by steps 1+2.

Output: data-combined/final1.csv  (sorted by athlete_id, then start_ts_utc)
Pure Python (csv module) — no pandas required.
"""

import csv
import os
import sys
from collections import defaultdict

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "combine_final1", "src")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "final1.csv")

# columns in environmental_conditions.csv that duplicate the session row
ENV_SKIP = {"session_id", "athlete_id", "sport", "start_ts_utc", "indoor", "is_synthetic"}

METRICS = ["ACCEL_MAG", "GPS_SPEED", "HR", "RESP_RATE", "SPO2"]  # fixed, sorted order


def to_float(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def read(name):
    try:
        with open(os.path.join(SRC, name), newline="", encoding="utf-8-sig") as f:
            return list(csv.DictReader(f))
    except FileNotFoundError:
        # Fresh clones ship the 20k-row sample instead of the full 21.5MB raw file.
        sample = name.replace(".csv", "_SAMPLE.csv")
        print(f"  {name} not present — using {sample}")
        with open(os.path.join(SRC, sample), newline="", encoding="utf-8-sig") as f:
            return list(csv.DictReader(f))


def main():
    athletes = read("athletes.csv")
    sessions = read("sessions.csv")
    env = read("environmental_conditions.csv")
    obs = read("device_observations_linked_multisport.csv")

    print(f"  read athletes: {len(athletes)}, sessions: {len(sessions)}, "
          f"env: {len(env)}, observations: {len(obs)}")

    # ---- indexes ----
    ath_by_id = {a["athlete_id"]: a for a in athletes}
    env_by_session = {e["session_id"]: e for e in env}

    # ---- aggregate device observations per session ----
    # stats[session][metric] -> list of floats
    stats = defaultdict(lambda: defaultdict(list))
    meta = defaultdict(lambda: {"n": 0, "battery": [], "signal": [], "dropouts": 0, "devices": set()})
    for o in obs:
        sid = o["session_id"]
        m = meta[sid]
        m["n"] += 1
        if o["device_id"]:
            m["devices"].add(o["device_id"])
        b = to_float(o["battery_pct"])
        if b is not None:
            m["battery"].append(b)
        q = to_float(o["signal_quality"])
        if q is not None:
            m["signal"].append(q)
        if (o["signal_dropout"] or "").strip().lower() == "true":
            m["dropouts"] += 1
        v = to_float(o["value"])
        if v is not None:
            stats[sid][o["metric_type"]].append(v)

    # ---- header ----
    header = list(sessions[0].keys())
    ath_cols = [c for c in athletes[0].keys() if c != "athlete_id"]
    header += [f"ath_{c}" for c in ath_cols]
    env_cols = [c for c in env[0].keys() if c not in ENV_SKIP]
    header += [f"env_{c}" for c in env_cols]
    header += ["dev_observations_n", "dev_device_ids", "dev_battery_pct_mean",
               "dev_signal_quality_mean", "dev_signal_dropout_pct"]
    for metric in METRICS:
        header += [f"dev_{metric}_{s}" for s in ("n", "mean", "min", "max")]
    header.append("date_iso")

    # ---- rows ----
    sessions_sorted = sorted(sessions, key=lambda s: (s["athlete_id"], s["start_ts_utc"]))
    n = 0
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for s in sessions_sorted:
            sid = s["session_id"]
            row = {c: "" for c in header}
            row.update(s)

            a = ath_by_id.get(s["athlete_id"])
            if a:
                for c in ath_cols:
                    row[f"ath_{c}"] = a.get(c, "")

            e = env_by_session.get(sid)
            if e:
                for c in env_cols:
                    row[f"env_{c}"] = e.get(c, "")

            m = meta.get(sid)
            if m:
                row["dev_observations_n"] = m["n"]
                row["dev_device_ids"] = "; ".join(sorted(m["devices"]))
                if m["battery"]:
                    row["dev_battery_pct_mean"] = round(sum(m["battery"]) / len(m["battery"]), 3)
                if m["signal"]:
                    row["dev_signal_quality_mean"] = round(sum(m["signal"]) / len(m["signal"]), 4)
                row["dev_signal_dropout_pct"] = round(100.0 * m["dropouts"] / m["n"], 2)
                for metric in METRICS:
                    vals = stats[sid].get(metric)
                    if vals:
                        row[f"dev_{metric}_n"] = len(vals)
                        row[f"dev_{metric}_mean"] = round(sum(vals) / len(vals), 3)
                        row[f"dev_{metric}_min"] = round(min(vals), 3)
                        row[f"dev_{metric}_max"] = round(max(vals), 3)

            row["date_iso"] = (s.get("start_ts_utc") or "")[:10]
            w.writerow(row)
            n += 1

    print(f"  -> final1.csv: {n} rows, {len(header)} columns")
    return 0


if __name__ == "__main__":
    sys.exit(main())
