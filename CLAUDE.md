# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # type-check + compile to dist/
npm run lint      # ESLint
npm run preview   # serve the dist/ build locally
```

No test suite yet.

## Architecture

Single-page React app (Vite + TypeScript + Tailwind v4). All data fetching is client-side — no backend, no proxy. The app is purely manual-refresh; there is no polling.

### Data flow

`App.tsx` owns all state (`SolarData`, `LoadState`, `errors[]`). On Refresh, it fires 6 parallel `fetch` calls and fans results into the corresponding panel components. Each fetch failure is caught individually so a single broken source doesn't blank the whole dashboard.

**API layer** (`src/api/`):
- `nasa-donki.ts` — NASA DONKI REST API. Uses `DEMO_KEY` (hardcoded, 30 req/hr limit). Endpoints: `FLR` (flares, 30-day window), `CME` (30-day), `GST` (geomagnetic storms, 90-day). All return most-recent-first after `.reverse()`.
- `noaa-swpc.ts` — NOAA SWPC JSON feeds (no key required). Endpoints: `/products/solar-wind/plasma-7-day.json`, `/products/solar-wind/mag-7-day.json`, `/json/planetary_k_index_1m.json`. Both plasma and mag feeds return array-of-arrays with a header row that must be skipped (`raw.slice(1)`). Column order in the plasma feed is `[time_tag, density, speed, temperature]` — not speed-first.

**Types** (`src/types/solar.ts`): All API response shapes and the top-level `SolarData` aggregate live here.

**Utils** (`src/utils/format.ts`): Color helpers (`flareColor`, `bzColor`, `kpColor`) and `formatTime`. Colors are Tailwind class strings returned as plain strings — they rely on Tailwind's full class list being present at build time, so don't construct them dynamically.

### Components

Each panel is a self-contained component receiving typed props — no internal fetching:
- `KpIndex` — current Kp number, storm-level label, progress bar, 48-hour bar chart
- `SolarWind` — 4 stat tiles (speed, density, Bz, Bt) + inline SVG sparklines for Bz and speed
- `SolarFlares` — chronological list, color-coded by class (X/M/C/B)
- `CMEList` — CME list with type badge and speed; uses `cmeAnalyses[0]` for the primary analysis
- `GeomagneticStorms` — storm list, max Kp derived from `allKpIndex[]`
- `SectionCard` — shared card wrapper (title, optional subtitle, children)

### Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml`. The Vite `base` is set to `/solar-events/` — required because Pages serves from a subdirectory. Any change to the base path must be reflected in both `vite.config.ts` and the workflow.

To swap the NASA DEMO_KEY for a real key, edit the `API_KEY` constant in `src/api/nasa-donki.ts`.
