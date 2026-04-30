export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function flareColor(classType: string): string {
  const cls = classType?.charAt(0).toUpperCase();
  if (cls === 'X') return 'text-red-400';
  if (cls === 'M') return 'text-orange-400';
  if (cls === 'C') return 'text-yellow-400';
  if (cls === 'B') return 'text-blue-400';
  return 'text-slate-400';
}

export function flareBg(classType: string): string {
  const cls = classType?.charAt(0).toUpperCase();
  if (cls === 'X') return 'bg-red-500/10 border-red-500/30';
  if (cls === 'M') return 'bg-orange-500/10 border-orange-500/30';
  if (cls === 'C') return 'bg-yellow-500/10 border-yellow-500/30';
  if (cls === 'B') return 'bg-blue-500/10 border-blue-500/30';
  return 'bg-slate-500/10 border-slate-500/30';
}

export function kpColor(kp: number): string {
  if (kp >= 8) return 'text-red-400';
  if (kp >= 6) return 'text-orange-400';
  if (kp >= 4) return 'text-yellow-400';
  return 'text-emerald-400';
}

export function bzColor(bz: number | null): string {
  if (bz === null) return 'text-slate-500';
  if (bz < -10) return 'text-red-400';
  if (bz < -5) return 'text-orange-400';
  if (bz < 0) return 'text-yellow-400';
  return 'text-emerald-400';
}
