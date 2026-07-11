import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ForecastEntry } from "../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface ForecastChartProps {
  title: string;
  series: ForecastEntry[];
  accent: string;
}

export function ForecastChart({ title, series, accent }: ForecastChartProps) {
  const labels = series.map((item) => item.label);
  const values = series.map((item) => item.temp);

  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <span className="text-xs uppercase tracking-[0.25em] text-slate-500">24h outlook</span>
      </div>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Temperature",
              data: values,
              borderColor: accent,
              backgroundColor: `${accent}22`,
              borderWidth: 3,
              pointRadius: 0,
              tension: 0.35,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: "rgba(255,255,255,0.45)" }, grid: { display: false } },
            y: { ticks: { color: "rgba(255,255,255,0.45)" }, grid: { color: "rgba(255,255,255,0.08)" } },
          },
        }}
      />
    </div>
  );
}
