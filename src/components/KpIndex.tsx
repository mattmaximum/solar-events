import type { KpPoint } from '../types/solar';
import { SectionCard } from './SectionCard';
import { kpColor } from '../utils/format';

interface Props {
  kp: KpPoint[];
}

function kpLabel(kp: number): string {
  if (kp >= 9) return 'Extreme';
  if (kp >= 8) return 'Severe';
  if (kp >= 7) return 'Strong';
  if (kp >= 6) return 'Moderate';
  if (kp >= 5) return 'G1 Storm';
  if (kp >= 4) return 'Active';
  return 'Quiet';
}

function kpBarColor(kp: number): string {
  if (kp >= 8) return 'bg-red-500';
  if (kp >= 6) return 'bg-orange-500';
  if (kp >= 4) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

export function KpIndex({ kp }: Props) {
  const latest = kp[0];
  const currentKp = latest?.kp_index ?? 0;

  const hourly = kp.filter((_, i) => i % 60 === 0).slice(0, 48);

  return (
    <SectionCard
      title="Planetary Kp Index"
      subtitle="NOAA SWPC — geomagnetic activity (0–9 scale)"
    >
      <div className="flex items-center gap-4 mb-5">
        <div>
          <p className={`text-5xl font-mono font-bold ${kpColor(currentKp)}`}>{currentKp.toFixed(1)}</p>
          <p className={`text-sm mt-1 ${kpColor(currentKp)}`}>{kpLabel(currentKp)}</p>
        </div>
        <div className="flex-1">
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${kpBarColor(currentKp)}`}
              style={{ width: `${(currentKp / 9) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0</span>
            <span>3</span>
            <span>5</span>
            <span>7</span>
            <span>9</span>
          </div>
        </div>
      </div>

      {hourly.length > 1 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">48-hour history (hourly)</p>
          <KpBar points={hourly} />
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        {[
          { label: 'G1 Storm', kp: 5, color: 'text-yellow-400' },
          { label: 'G2 Storm', kp: 6, color: 'text-orange-400' },
          { label: 'G3+ Storm', kp: 7, color: 'text-red-400' },
        ].map(({ label, kp: threshold, color }) => (
          <div key={label} className="bg-slate-800/50 rounded px-2 py-1.5">
            <p className={`font-semibold ${color}`}>{label}</p>
            <p className="text-slate-500">Kp ≥ {threshold}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function KpBar({ points }: { points: KpPoint[] }) {
  return (
    <div className="flex items-end gap-0.5 h-16">
      {[...points].reverse().map((p, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${kpBarColor(p.kp_index)} opacity-80`}
          style={{ height: `${(p.kp_index / 9) * 100}%`, minHeight: '2px' }}
          title={`Kp ${p.kp_index} — ${p.time_tag}`}
        />
      ))}
    </div>
  );
}
