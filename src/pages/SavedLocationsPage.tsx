import { Bookmark, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SavedLocationsPageProps {
  savedLocations: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export function SavedLocationsPage({ savedLocations, onSelect, onRemove }: SavedLocationsPageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-slate-950/30 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-amber-300">
            <Bookmark size={16} />
            <span className="text-xs font-mono uppercase tracking-widest">Pinned places</span>
          </div>
          <h2 className="text-2xl font-semibold text-white">Saved locations</h2>
        </div>
        <nav className="flex gap-2">
          <NavLink to="/" className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">Home</NavLink>
          <NavLink to="/history" className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">History</NavLink>
        </nav>
      </div>

      {savedLocations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/60">
          Save a city from the home page to keep it here.
        </div>
      ) : (
        <div className="space-y-3">
          {savedLocations.map((city) => (
            <div key={city} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white">
              <button onClick={() => onSelect(city)} className="flex items-center gap-2 font-medium">
                <Bookmark size={15} className="text-amber-300" />
                {city}
              </button>
              <button onClick={() => onRemove(city)} className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
