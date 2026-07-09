export interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number; temp_min: number; temp_max: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number; deg: number };
  visibility: number;
  timezone: number;
}

export interface ThemeConfig {
  bg: string;
  glow: string;
  accent: string;
  particles: string[];
}

export interface SavedLocation {
  id: number;
  name: string;
  country: string;
  addedAt: string;
}

export interface HistoryItem {
  id: number;
  name: string;
  country: string;
  temp: number;
  condition: string;
  timestamp: string;
}
