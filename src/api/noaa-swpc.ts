import type { SolarWindPlasmaPoint, SolarWindMagPoint, KpPoint } from '../types/solar';

const BASE = 'https://services.swpc.noaa.gov';

async function fetchSWPC<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`NOAA SWPC ${path} failed: ${res.status}`);
  return res.json();
}

export async function fetchSolarWind(): Promise<SolarWindPlasmaPoint[]> {
  // Returns array of arrays: [time_tag, speed, density, temperature, speed_sigma, density_sigma, temperature_sigma]
  const raw = await fetchSWPC<(string | number)[][]>('/products/solar-wind/plasma-7-day.json');
  // Columns: time_tag, density, speed, temperature
  return raw.slice(1).map((row) => ({
    time_tag: String(row[0]),
    density: row[1] !== null ? Number(row[1]) : null,
    speed: row[2] !== null ? Number(row[2]) : null,
    temperature: row[3] !== null ? Number(row[3]) : null,
  })).reverse();
}

export async function fetchMagField(): Promise<SolarWindMagPoint[]> {
  // Returns array of arrays: [time_tag, bx_gsm, by_gsm, bz_gsm, lon_gsm, lat_gsm, bt]
  const raw = await fetchSWPC<(string | number)[][]>('/products/solar-wind/mag-7-day.json');
  return raw.slice(1).map((row) => ({
    time_tag: String(row[0]),
    bx_gsm: row[1] !== null ? Number(row[1]) : null,
    by_gsm: row[2] !== null ? Number(row[2]) : null,
    bz_gsm: row[3] !== null ? Number(row[3]) : null,
    bt: row[6] !== null ? Number(row[6]) : null,
  })).reverse();
}

export async function fetchKpIndex(): Promise<KpPoint[]> {
  const raw = await fetchSWPC<{ time_tag: string; kp_index: number; source: string }[]>(
    '/json/planetary_k_index_1m.json'
  );
  return (raw || []).reverse().slice(0, 180);
}
