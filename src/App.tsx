import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { HistoryPage } from "./pages/HistoryPage";
import { SavedLocationsPage } from "./pages/SavedLocationsPage";
import type { ThemeConfig, WeatherData } from "./types";

const API_KEY = "dda41e776c9c7326ccebf0cbcdfd7cdf";

const weatherThemes: Record<string, ThemeConfig> = {
  Clear: {
    bg: "from-[#0a1628] via-[#1a2f5e] to-[#2a4a8a]",
    glow: "rgba(255, 200, 50, 0.15)",
    accent: "#fbbf24",
    particles: ["☀️"],
  },
  Clouds: {
    bg: "from-[#1a1f2e] via-[#2a3142] to-[#3a4155]",
    glow: "rgba(148, 163, 184, 0.1)",
    accent: "#94a3b8",
    particles: ["☁️"],
  },
  Rain: {
    bg: "from-[#0d1b2e] via-[#1a2d4a] to-[#243858]",
    glow: "rgba(99, 179, 237, 0.15)",
    accent: "#63b3ed",
    particles: ["🌧️"],
  },
  Drizzle: {
    bg: "from-[#0d1b2e] via-[#1a2d4a] to-[#243858]",
    glow: "rgba(99, 179, 237, 0.1)",
    accent: "#63b3ed",
    particles: ["🌦️"],
  },
  Thunderstorm: {
    bg: "from-[#080d1a] via-[#0f1525] to-[#1a1f35]",
    glow: "rgba(167, 139, 250, 0.2)",
    accent: "#a78bfa",
    particles: ["⛈️"],
  },
  Snow: {
    bg: "from-[#0f1f35] via-[#1a2f48] to-[#243850]",
    glow: "rgba(186, 230, 253, 0.15)",
    accent: "#bae6fd",
    particles: ["❄️"],
  },
  Mist: {
    bg: "from-[#131a26] via-[#1e2738] to-[#283345]",
    glow: "rgba(148, 163, 184, 0.08)",
    accent: "#94a3b8",
    particles: ["🌫️"],
  },
  Fog: {
    bg: "from-[#131a26] via-[#1e2738] to-[#283345]",
    glow: "rgba(148, 163, 184, 0.08)",
    accent: "#94a3b8",
    particles: ["🌫️"],
  },
  Haze: {
    bg: "from-[#1a1510] via-[#2a2018] to-[#3a2e20]",
    glow: "rgba(251, 191, 36, 0.1)",
    accent: "#f59e0b",
    particles: ["🌁"],
  },
};

const defaultTheme: ThemeConfig = {
  bg: "from-[#0a0f1e] via-[#0f1629] to-[#1a2040]",
  glow: "rgba(79, 168, 255, 0.1)",
  accent: "#4fa8ff",
  particles: ["🌤️"],
};

function AppRoutes() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(defaultTheme);
  const [history, setHistory] = useState<string[]>([]);
  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const navigate = useNavigate();

  async function fetchWeather(cityName: string) {
    if (!cityName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        setError("City not found. Please try another location.");
        setWeather(null);
      } else {
        setWeather(data);
        const condition = data.weather[0].main;
        setTheme(weatherThemes[condition] ?? defaultTheme);
        setHistory((prev) => [data.name, ...prev.filter((item) => item !== data.name)].slice(0, 8));
        setCity(data.name);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    fetchWeather(city);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  function handleSaveLocation() {
    if (!weather?.name) return;
    setSavedLocations((prev) => (prev.includes(weather.name) ? prev : [...prev, weather.name]));
  }

  function handleSelectLocation(nextCity: string) {
    setCity(nextCity);
    navigate("/");
    fetchWeather(nextCity);
  }

  function handleClearHistory() {
    setHistory([]);
  }

  function handleRemoveSavedLocation(cityName: string) {
    setSavedLocations((prev) => prev.filter((item) => item !== cityName));
  }

  useEffect(() => {
    const saved = localStorage.getItem("weather-history");
    const pinned = localStorage.getItem("weather-saved");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
    if (pinned) {
      setSavedLocations(JSON.parse(pinned));
    }
    fetchWeather("London");
  }, []);

  useEffect(() => {
    localStorage.setItem("weather-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("weather-saved", JSON.stringify(savedLocations));
  }, [savedLocations]);

  return (
    <div className={`min-h-screen w-full relative overflow-hidden bg-gradient-to-br ${theme.bg} transition-all duration-1000`} style={{ fontFamily: "Outfit, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${theme.glow}, transparent)`, transition: "background 1s ease" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                city={city}
                setCity={setCity}
                weather={weather}
                loading={loading}
                error={error}
                theme={theme}
                handleSearch={handleSearch}
                handleKey={handleKey}
                onSaveLocation={handleSaveLocation}
                isSaved={savedLocations.includes(weather?.name ?? "")}
              />
            }
          />
          <Route path="/history" element={<HistoryPage history={history} onSelect={handleSelectLocation} onClear={handleClearHistory} />} />
          <Route path="/saved" element={<SavedLocationsPage savedLocations={savedLocations} onSelect={handleSelectLocation} onRemove={handleRemoveSavedLocation} />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
