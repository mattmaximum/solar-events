import type { SolarFlare } from '../types/solar';
import { SectionCard } from './SectionCard';
import { formatTime, flareColor, flareBg } from '../utils/format';

interface Props {
  flares: SolarFlare[];
}

export function SolarFlares({ flares }: Props) {
  const recent = flares.slice(0, 15);

  return (
    <SectionCard
      title="Solar Flares"
      subtitle="NASA DONKI — last 30 days, most recent first"
    >
      {recent.length === 0 ? (
        <p className="text-slate-500 text-sm">No flares reported.</p>
      ) : (
        <div className="space-y-2">
          {recent.map((f) => (
            <div
              key={f.flrID}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${flareBg(f.classType)}`}
            >
              <span className={`font-mono font-bold text-base w-12 shrink-0 ${flareColor(f.classType)}`}>
                {f.classType}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-300">{formatTime(f.beginTime)}</p>
                {f.sourceLocation && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {f.sourceLocation}
                    {f.activeRegionNum ? ` · AR${f.activeRegionNum}` : ''}
                  </p>
                )}
              </div>
              {f.peakTime && (
                <div className="ml-auto text-right shrink-0">
                  <p className="text-xs text-slate-500">Peak</p>
                  <p className="text-xs text-slate-400">{formatTime(f.peakTime).split(',')[1]?.trim() ?? ''}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
