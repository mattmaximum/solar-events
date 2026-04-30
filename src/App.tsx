import { useState } from 'react';
import { fetchFlares, fetchCMEs, fetchGeomagneticStorms } from './api/nasa-donki';
import { fetchSolarWind, fetchMagField, fetchKpIndex } from './api/noaa-swpc';
import { SolarFlares } from './components/SolarFlares';
import { CMEList } from './components/CMEList';
import { SolarWind } from './components/SolarWind';
import { KpIndex } from './components/KpIndex';
import { GeomagneticStorms } from './components/GeomagneticStorms';
import type { SolarData, LoadState } from './types/solar';

const EMPTY: SolarData = {
  flares: [], cmes: [], storms: [], solarWind: [], magField: [], kp: [],
};

export default function App() {
  const [data, setData] = useState<SolarData>(EMPTY);
  const [state, setState] = useState<LoadState>('idle');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function refresh() {
    setState('loading');
    setErrors([]);

    const errs: string[] = [];

    const [flares, cmes, storms, solarWind, magField, kp] = await Promise.all([
      fetchFlares().catch(e => { errs.push('Solar flares: ' + e.message); return []; }),
      fetchCMEs().catch(e => { errs.push('CMEs: ' + e.message); return []; }),
      fetchGeomagneticStorms().catch(e => { errs.push('Geomagnetic storms: ' + e.message); return []; }),
      fetchSolarWind().catch(e => { errs.push('Solar wind: ' + e.message); return []; }),
      fetchMagField().catch(e => { errs.push('Mag field: ' + e.message); return []; }),
      fetchKpIndex().catch(e => { errs.push('Kp index: ' + e.message); return []; }),
    ]);

    setData({ flares, cmes, storms, solarWind, magField, kp });
    setErrors(errs);
    setState(errs.length > 0 ? 'error' : 'success');
    setLastUpdated(new Date());
  }

  return (
    <div className="min-h-screen" style={{ background: '#050816' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                Solar Events
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                NASA DONKI + NOAA SWPC — space weather at a glance
              </p>
            </div>
            <div className="text-right shrink-0">
              <button
                onClick={refresh}
                disabled={state === 'loading'}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer"
              >
                {state === 'loading' ? 'Loading…' : 'Refresh'}
              </button>
              {lastUpdated && (
                <p className="text-xs text-slate-600 mt-1.5">
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-4 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-red-400 mb-1">Partial load — some sources failed:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {errors.map(e => (
                  <li key={e} className="text-xs text-red-400/70">{e}</li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {state === 'idle' && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <div className="text-6xl mb-4">☀️</div>
            <p className="text-lg mb-6">Hit Refresh to load live space weather data.</p>
            <p className="text-xs max-w-sm text-center leading-relaxed">
              Data from NASA DONKI (solar flares, CMEs, geomagnetic storms) and NOAA SWPC
              (solar wind speed, density, Bz, Kp index). NASA DEMO_KEY: 30 req/hr limit.
              Get a free key at api.nasa.gov.
            </p>
          </div>
        )}

        {state === 'loading' && (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <p className="text-lg animate-pulse">Fetching space weather data…</p>
          </div>
        )}

        {(state === 'success' || state === 'error') && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KpIndex kp={data.kp} />
              <SolarWind plasma={data.solarWind} mag={data.magField} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SolarFlares flares={data.flares} />
              <div className="space-y-6">
                <CMEList cmes={data.cmes} />
                <GeomagneticStorms storms={data.storms} />
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-700">
          <p>
            Sources:{' '}
            <a href="https://api.nasa.gov/" className="text-slate-600 hover:text-slate-500" target="_blank" rel="noreferrer">NASA DONKI</a>
            {' · '}
            <a href="https://www.swpc.noaa.gov/" className="text-slate-600 hover:text-slate-500" target="_blank" rel="noreferrer">NOAA SWPC</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
