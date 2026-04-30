import type { CME } from '../types/solar';
import { SectionCard } from './SectionCard';
import { formatTime } from '../utils/format';

interface Props {
  cmes: CME[];
}

function cmeTypeBadge(type: string) {
  const colors: Record<string, string> = {
    S: 'bg-yellow-500/20 text-yellow-300',
    C: 'bg-orange-500/20 text-orange-300',
    O: 'bg-purple-500/20 text-purple-300',
    R: 'bg-red-500/20 text-red-300',
    ER: 'bg-red-700/20 text-red-400',
  };
  return colors[type] ?? 'bg-slate-500/20 text-slate-300';
}

export function CMEList({ cmes }: Props) {
  const recent = cmes.slice(0, 10);

  return (
    <SectionCard
      title="Coronal Mass Ejections"
      subtitle="NASA DONKI — last 30 days, most recent first"
    >
      {recent.length === 0 ? (
        <p className="text-slate-500 text-sm">No CMEs reported.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((cme) => {
            const analysis = cme.cmeAnalyses?.[0];
            return (
              <div key={cme.activityID} className="border border-slate-700/50 rounded-lg px-3 py-2.5 bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-300">{formatTime(cme.startTime)}</span>
                  {analysis?.type && (
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${cmeTypeBadge(analysis.type)}`}>
                      {analysis.type}
                    </span>
                  )}
                  {analysis?.speed && (
                    <span className="text-xs text-slate-400 ml-auto">{Math.round(analysis.speed)} km/s</span>
                  )}
                </div>
                {cme.note && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{cme.note}</p>
                )}
                {cme.sourceLocation && (
                  <p className="text-xs text-slate-600 mt-1">{cme.sourceLocation}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
