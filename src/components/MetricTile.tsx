import { ReactNode } from "react";

interface MetricTileProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent: string;
}

export function MetricTile({ label, value, icon, accent }: MetricTileProps) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
        <div style={{ color: accent }}>{icon}</div>
      </div>
      <div className="text-lg sm:text-xl font-semibold text-white">{value}</div>
    </div>
  );
}
