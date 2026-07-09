import { ArrowRight, History, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

interface HistoryPageProps {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

export function HistoryPage({ history, onSelect, onClear }: HistoryPageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-slate-950/30 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-cyan-300">
            <History size={16} />
            <span className="text-xs font-mono uppercase tracking-widest">Recent searches</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Weather history</h2>
        </div>
        <nav className="flex gap-2">
          <NavLink to="/" className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">Home</NavLink>
          <NavLink to="/saved" className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">Saved</NavLink>
        </nav>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/60">
          Your recent searches will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:bg-white/10"
            >
              <span className="font-medium">{city}</span>
              <span className="flex items-center gap-2 text-sm text-white/50">
                View weather <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <button onClick={onClear} className="mt-5 flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">
          <Trash2 size={14} /> Clear history
        </button>
      )}
    </div>
  );
}
