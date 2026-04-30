import type { SolarFlare, CME, GeomagneticStorm } from '../types/solar';

const BASE = 'https://api.nasa.gov/DONKI';
const API_KEY = 'DEMO_KEY';

function dateRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function fetchDONKI<T>(endpoint: string, days = 30): Promise<T> {
  const { startDate, endDate } = dateRange(days);
  const url = `${BASE}/${endpoint}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DONKI ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function fetchFlares(): Promise<SolarFlare[]> {
  const data = await fetchDONKI<SolarFlare[]>('FLR', 30);
  return (data || []).reverse();
}

export async function fetchCMEs(): Promise<CME[]> {
  const data = await fetchDONKI<CME[]>('CME', 30);
  return (data || []).reverse();
}

export async function fetchGeomagneticStorms(): Promise<GeomagneticStorm[]> {
  const data = await fetchDONKI<GeomagneticStorm[]>('GST', 90);
  return (data || []).reverse();
}
