import { useEffect, useRef } from "react";
import L from "leaflet";
import type { WeatherCurrent } from "../types";

interface WeatherMapProps {
  current: WeatherCurrent;
}

export function WeatherMap({ current }: WeatherMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !current) return;

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([current.lat, current.lon], 11);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CartoDB",
        maxZoom: 19,
      }).addTo(map.current);
    } else {
      map.current.setView([current.lat, current.lon], 11);
    }

    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current!.removeLayer(layer);
      }
    });

    const marker = L.marker([current.lat, current.lon], {
      icon: L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    }).addTo(map.current);

    marker.bindPopup(`<div class="text-sm"><strong>${current.city}</strong><br/>${current.description}<br/>${current.temperature}°C</div>`);
  }, [current]);

  return <div ref={mapContainer} className="rounded-[1.2rem] border border-white/10 overflow-hidden" style={{ height: "300px", width: "100%" }} />;
}
