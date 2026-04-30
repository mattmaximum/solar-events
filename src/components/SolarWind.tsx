import type { SolarWindPlasmaPoint, SolarWindMagPoint } from '../types/solar';
import { SectionCard } from './SectionCard';
import { formatTime, bzColor } from '../utils/format';

interface Props {
  plasma: SolarWindPlasmaPoint[];
  mag: SolarWindMagPoint[];
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-4 py-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-mono font-semibold ${color ?? 'text-slate-200'}`}>
        {value}
        {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

export function SolarWind({ plasma, mag }: Props) {
  const latest = plasma[0];
  const latestMag = mag[0];

  return (
    <SectionCard
      title="Solar Wind"
      subtitle={`NOAA SWPC ACE — latest reading${latest ? ': ' + formatTime(latest.time_tag) : ''}`}
    >
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat
          label="Speed"
          value={latest?.speed != null ? Math.round(latest.speed).toString() : '—'}
          unit="km/s"
          color={latest?.speed != null && latest.speed > 600 ? 'text-orange-400' : 'text-emerald-400'}
        />
        <Stat
          label="Density"
          value={latest?.density != null ? latest.density.toFixed(1) : '—'}
          unit="p/cm³"
        />
        <Stat
          label="Bz (GSM)"
          value={latestMag?.bz_gsm != null ? latestMag.bz_gsm.toFixed(1) : '—'}
          unit="nT"
          color={bzColor(latestMag?.bz_gsm ?? null)}
        />
        <Stat
          label="Bt (total)"
          value={latestMag?.bt != null ? latestMag.bt.toFixed(1) : '—'}
          unit="nT"
        />
      </div>

      <div>
        <p className="text-xs text-slate-500 mb-2">Bz last 2 hours</p>
        <BzSparkline points={mag.slice(0, 24)} />
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-1">Speed last 2 hours</p>
        <SpeedSparkline points={plasma.slice(0, 24)} />
      </div>
    </SectionCard>
  );
}

function BzSparkline({ points }: { points: SolarWindMagPoint[] }) {
  const reversed = [...points].reverse();
  const values = reversed.map(p => p.bz_gsm ?? 0);
  const min = Math.min(...values, -5);
  const max = Math.max(...values, 5);
  const range = max - min || 10;
  const w = 600, h = 60;

  const pts = reversed.map((_, i) => {
    const x = (i / (reversed.length - 1)) * w;
    const y = h - ((values[i] - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const zeroY = h - ((0 - min) / range) * h;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <line x1="0" y1={zeroY} x2={w} y2={zeroY} stroke="#475569" strokeWidth="0.5" strokeDasharray="4,4" />
      <polyline points={pts} fill="none" stroke="#fb923c" strokeWidth="1.5" />
    </svg>
  );
}

function SpeedSparkline({ points }: { points: SolarWindPlasmaPoint[] }) {
  const reversed = [...points].reverse();
  const values = reversed.map(p => p.speed ?? 0);
  const min = Math.min(...values.filter(Boolean)) - 20;
  const max = Math.max(...values) + 20;
  const range = max - min || 100;
  const w = 600, h = 40;

  const pts = reversed.map((_, i) => {
    const x = (i / (reversed.length - 1)) * w;
    const y = h - ((values[i] - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="1.5" />
    </svg>
  );
}
