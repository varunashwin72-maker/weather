import { type KeyboardEvent, type ReactNode } from "react";
import { Search, Wind, Droplets, Gauge, Eye, Thermometer, MapPin, RefreshCw, ArrowUp, BookmarkPlus, Home, History, Bookmark } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { ThemeConfig, WeatherData } from "../types";

interface HomePageProps {
  city: string;
  setCity: (value: string) => void;
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  theme: ThemeConfig;
  handleSearch: () => void;
  handleKey: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSaveLocation: () => void;
  isSaved: boolean;
}

function StatCard({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: string }) {
  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-2 text-white/50 text-xs font-mono uppercase tracking-widest">
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div className="text-white text-xl font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
        {value}
      </div>
    </div>
  );
}

function FloatingParticle({ emoji, delay, duration, x }: { emoji: string; delay: number; duration: number; x: number }) {
  return (
    <div
      className="absolute text-2xl pointer-events-none select-none opacity-20"
      style={{
        left: `${x}%`,
        bottom: "-10%",
        animation: `floatUp ${duration}s ${delay}s infinite linear`,
      }}
    >
      {emoji}
    </div>
  );
}

function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatTime(unix: number, tz: number): string {
  const d = new Date((unix + tz) * 1000);
  return d.toUTCString().slice(17, 22);
}

export function HomePage({
  city,
  setCity,
  weather,
  loading,
  error,
  theme,
  handleSearch,
  handleKey,
  onSaveLocation,
  isSaved,
}: HomePageProps) {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    emoji: theme.particles[0],
    delay: i * 1.5,
    duration: 8 + i * 1.2,
    x: 5 + i * 12,
  }));

  const conditionLabel = weather?.weather[0].description ?? "";
  const conditionCapped = conditionLabel.charAt(0).toUpperCase() + conditionLabel.slice(1);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-110vh) scale(0.5); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .fade-in-up-delay-1 { animation: fadeInUp 0.5s 0.1s ease forwards; opacity: 0; }
        .fade-in-up-delay-2 { animation: fadeInUp 0.5s 0.2s ease forwards; opacity: 0; }
        .fade-in-up-delay-3 { animation: fadeInUp 0.5s 0.3s ease forwards; opacity: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/30 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${theme.glow}, transparent)` }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <FloatingParticle key={i} {...p} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 fade-in-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }} />
                <span className="text-xs font-mono uppercase tracking-widest text-white/40">Live Weather</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Weather <span style={{ color: theme.accent }}>Forecast</span>
              </h1>
              <p className="text-white/40 text-sm mt-1">Real-time atmospheric data from OpenWeatherMap</p>
            </div>

            <nav className="flex flex-wrap gap-2">
              <NavLink to="/" end className={({ isActive }) => `flex items-center gap-2 rounded-full px-3 py-2 text-sm ${isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <Home size={16} /> Home
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => `flex items-center gap-2 rounded-full px-3 py-2 text-sm ${isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <History size={16} /> History
              </NavLink>
              <NavLink to="/saved" className={({ isActive }) => `flex items-center gap-2 rounded-full px-3 py-2 text-sm ${isActive ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <Bookmark size={16} /> Saved
              </NavLink>
            </nav>
          </div>

          <div className="w-full mb-8 fade-in-up-delay-1">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-2 pl-4 backdrop-blur-md transition-all duration-300 focus-within:border-white/30" style={{ background: "rgba(255,255,255,0.07)" }}>
              <MapPin size={18} className="text-white/40 shrink-0" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search city — try Mumbai, Tokyo, New York..."
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                style={{ background: theme.accent, color: "#0a0f1e" }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                Search
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-400/80 flex items-center gap-2 px-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {weather && (
            <div className="w-full space-y-4">
              <div className="rounded-3xl border border-white/10 backdrop-blur-xl p-6 sm:p-8 fade-in-up-delay-2 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl" style={{ background: theme.accent, transform: "translate(30%, -30%)" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: theme.accent }} />
                        <span className="text-white font-semibold text-lg">
                          {weather.name}
                          <span className="text-white/40 text-sm font-normal ml-2">{weather.sys.country}</span>
                        </span>
                      </div>
                      <button
                        onClick={onSaveLocation}
                        className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
                      >
                        {isSaved ? <Bookmark size={16} style={{ color: theme.accent }} /> : <BookmarkPlus size={16} />}
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-7xl sm:text-8xl font-bold leading-none tracking-tighter" style={{ color: theme.accent }}>
                        {Math.round(weather.main.temp)}°
                      </span>
                      <span className="text-white/50 text-2xl mb-3 font-light">C</span>
                    </div>
                    <p className="text-white/70 text-base font-medium mb-1">{conditionCapped}</p>
                    <p className="text-white/40 text-sm font-mono">
                      H:{Math.round(weather.main.temp_max)}° &nbsp; L:{Math.round(weather.main.temp_min)}°
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={conditionCapped} className="w-28 h-28 object-contain drop-shadow-lg" style={{ filter: `drop-shadow(0 0 24px ${theme.accent}60)` }} />
                    <div className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                      <Thermometer size={12} />
                      Feels like {Math.round(weather.main.feels_like)}°C
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono text-white/40">
                  <span>🌅 Sunrise &nbsp; {formatTime(weather.sys.sunrise, weather.timezone)}</span>
                  <div className="flex-1 mx-4 h-px" style={{ background: `linear-gradient(90deg, ${theme.accent}40, ${theme.accent}90, ${theme.accent}40)` }} />
                  <span>🌇 Sunset &nbsp; {formatTime(weather.sys.sunset, weather.timezone)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-in-up-delay-3">
                <StatCard icon={<Droplets size={14} />} label="Humidity" value={`${weather.main.humidity}%`} accent={theme.accent} />
                <StatCard icon={<Wind size={14} />} label="Wind" value={`${weather.wind.speed} m/s ${getWindDirection(weather.wind.deg)}`} accent={theme.accent} />
                <StatCard icon={<Gauge size={14} />} label="Pressure" value={`${weather.main.pressure} hPa`} accent={theme.accent} />
                <StatCard icon={<Eye size={14} />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} accent={theme.accent} />
              </div>

              <div className="rounded-2xl border border-white/10 backdrop-blur-md p-5 flex items-center gap-6 fade-in-up-delay-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="relative w-14 h-14 shrink-0">
                  <div className="absolute inset-0 rounded-full border border-white/10 flex items-center justify-center">
                    <ArrowUp size={22} className="transition-transform duration-700" style={{ color: theme.accent, transform: `rotate(${weather.wind.deg}deg)` }} />
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">Wind Direction</p>
                  <p className="text-white text-lg font-semibold">
                    {getWindDirection(weather.wind.deg)} <span className="text-white/40 text-sm font-normal">— {weather.wind.deg}°</span>
                  </p>
                  <p className="text-white/30 text-xs font-mono mt-0.5">Speed: {weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-10 text-white/20 text-xs font-mono text-center">Powered by OpenWeatherMap API · Data updates in real-time</p>
        </div>
      </div>
    </div>
  );
}
