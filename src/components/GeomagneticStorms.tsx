import type { GeomagneticStorm } from '../types/solar';
import { SectionCard } from './SectionCard';
import { formatTime, kpColor } from '../utils/format';

interface Props {
  storms: GeomagneticStorm[];
}

function stormLevel(maxKp: number): string {
  if (maxKp >= 9) return 'G5 Extreme';
  if (maxKp >= 8) return 'G4 Severe';
  if (maxKp >= 7) return 'G3 Strong';
  if (maxKp >= 6) return 'G2 Moderate';
  return 'G1 Minor';
}

export function GeomagneticStorms({ storms }: Props) {
  const recent = storms.slice(0, 8);

  return (
    <SectionCard
      title="Geomagnetic Storms"
      subtitle="NASA DONKI — last 90 days"
    >
      {recent.length === 0 ? (
        <p className="text-slate-500 text-sm">No geomagnetic storms recorded.</p>
      ) : (
        <div className="space-y-2">
          {recent.map((storm) => {
            const maxKp = Math.max(...(storm.allKpIndex?.map(k => k.kpIndex) ?? [0]));
            return (
              <div key={storm.gstID} className="flex items-center gap-3 border border-slate-700/50 rounded-lg px-3 py-2.5 bg-slate-800/30">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-300">{formatTime(storm.startTime)}</p>
                  <p className={`text-xs mt-0.5 ${kpColor(maxKp)}`}>{stormLevel(maxKp)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">Max Kp</p>
                  <p className={`text-lg font-mono font-bold ${kpColor(maxKp)}`}>{maxKp}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
