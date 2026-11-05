# data-combined — the sessions dataset pipeline

## final1.csv (1,431 rows × 71 columns)
One row per training session, joining four sources:

| Group | Columns | Source |
|---|---|---|
| base | `session_id`, `sport`, `level`, `session_type`, times, RPE, distance, HR… | `combine_final1/src/sessions.csv` |
| `ath_*` | athlete features: alias, position, team, physicals, VO2max, fitness… | `combine_final1/src/athletes.csv` |
| `env_*` | environment per session: city, temperature, humidity, wind, AQI, altitude… | `combine_final1/src/environmental_conditions.csv` |
| `dev_*` | device-observation aggregates: counts, devices, battery/signal/dropout + n/mean/min/max for HR, RESP_RATE, SPO2, ACCEL_MAG, GPS_SPEED | `combine_final1/src/device_observations*.csv` |
| — | `date_iso` | derived from `start_ts_utc` |

## Rebuild

```bash
cd data-combined
python3 build_final1.py
```

Reads `../combine_final1/src/`: athletes, sessions and environment files in full; device
observations use the tracked 20k-row **sample** (`device_observations_SAMPLE.csv`) when the
full 158,747-row raw file is not present (available on request).

## Related dataset

`public/datasets/Sportmetryx_Combined_Wide_Athlete_Day.csv` — one row per athlete-day
(1,362 rows), served on the home page as the demo download.
