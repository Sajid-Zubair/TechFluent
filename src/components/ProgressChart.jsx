

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const MONO_FAMILY = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// Fixed categorical order, validated for the #0d0d0d surface
// (contrast ≥ 3:1, colour-blind separation ≥ 8 ΔE between neighbours).
// Colour follows the metric — hiding one never repaints the others.
const METRICS = [
  { key: "fluency", label: "Fluency", color: "#3987e5" },
  { key: "grammar", label: "Grammar", color: "#d95926" },
  { key: "content_structure", label: "Content Structure", color: "#199e70" },
  { key: "accuracy", label: "Accuracy", color: "#c98500" },
  { key: "vocabulary", label: "Vocabulary", color: "#d55181" },
  { key: "coherence", label: "Coherence", color: "#008300" },
];

const INK = {
  surface: "#0d0d0d",
  primary: "#ffffff",
  secondary: "#c3c2b7",
  muted: "#898781",
  grid: "#1f1f1e",
  axis: "#383835",
};

const RANGES = [
  { key: "all", label: "All" },
  { key: 10, label: "Last 10" },
  { key: 5, label: "Last 5" },
];

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const shortDate = (s) => {
  const d = new Date(s);
  return isNaN(d) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const longDate = (s) => {
  const d = new Date(s);
  return isNaN(d) ? s : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

const avgOf = (entry) =>
  METRICS.reduce((sum, m) => sum + (Number(entry[m.key]) || 0), 0) / METRICS.length;

// Dashed vertical crosshair on hover
const crosshair = {
  id: "crosshair",
  afterDatasetsDraw(chart) {
    const active = chart.tooltip?.getActiveElements?.() || [];
    if (!active.length) return;
    const { ctx, chartArea } = chart;
    const x = active[0].element.x;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.restore();
  },
};

function Delta({ value }) {
  if (value === null || Number.isNaN(value)) return <span className="text-neutral-600">—</span>;
  if (Math.abs(value) < 0.05) return <span className="text-neutral-500">± 0.0</span>;
  const up = value > 0;
  return (
    <span className={up ? "text-[#0ca30c]" : "text-rose-400"}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}
    </span>
  );
}

function ProgressChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  // UI-only state
  const [hidden, setHidden] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [range, setRange] = useState("all");
  const [view, setView] = useState("chart");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    axios
      .get(`${BASE_URL}/api/get_interview_progress/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Progress chart fetch error:", err);
        setError("Failed to load chart data.");
      });
  }, []);

  if (error) {
    return (
      <div className={`${MONO} flex min-h-[280px] flex-col items-center justify-center gap-2 text-center`}>
        <span className="text-[12px] text-rose-400">✕ {error}</span>
        <span className="text-[11px] text-neutral-600">GET /api/get_interview_progress/</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
        <p className={`${SERIF} text-3xl text-neutral-300`}>
          No progress <em className="text-neutral-600">yet.</em>
        </p>
        <p className="mt-2 max-w-xs text-sm text-neutral-500">
          Complete a few interviews and your skill trends will appear here.
        </p>
      </div>
    );
  }

  /* ---------------- derived ---------------- */
  const visible = range === "all" ? data : data.slice(-range);
  const latest = visible[visible.length - 1];
  const first = visible[0];
  const prevAll = data.length > 1 ? data[data.length - 2] : null;

  const latestAvg = avgOf(latest);
  const avgDelta = visible.length > 1 ? latestAvg - avgOf(first) : null;

  const toggle = (key) => {
    setHidden((h) => {
      if (h.includes(key)) return h.filter((k) => k !== key);
      if (h.length >= METRICS.length - 1) return h; // keep at least one line
      return [...h, key];
    });
  };

  const labels = visible.map((entry) => shortDate(entry.date));
  const showPoints = visible.length <= 14;

  const chartData = {
    labels,
    datasets: METRICS.map((m) => {
      const dim = hovered && hovered !== m.key;
      const stroke = dim ? hexA(m.color, 0.14) : m.color;
      return {
        label: m.label,
        baseColor: m.color,
        data: visible.map((entry) => Number(entry[m.key])),
        borderColor: stroke,
        pointBackgroundColor: stroke,
        pointBorderColor: INK.surface,
        pointHoverBackgroundColor: m.color,
        pointHoverBorderColor: INK.surface,
        borderWidth: hovered === m.key ? 2.5 : 2,
        order: hovered === m.key ? 0 : 1,
        hidden: hidden.includes(m.key),
        fill: false,
      };
    }),
  };

  const tickFont = { family: MONO_FAMILY, size: 10 };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    interaction: { mode: "index", intersect: false },
    layout: { padding: { top: 8, right: 8 } },
    elements: {
      line: { tension: 0.35, borderCapStyle: "round", borderJoinStyle: "round" },
      point: { radius: showPoints ? 3 : 0, hoverRadius: 5, borderWidth: 2, hoverBorderWidth: 2, hitRadius: 12 },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2, color: INK.muted, font: tickFont, padding: 10 },
        grid: { color: INK.grid, drawTicks: false },
        border: { display: false },
      },
      x: {
        ticks: { color: INK.muted, font: tickFont, maxRotation: 0, autoSkip: true, maxTicksLimit: 8, padding: 10 },
        grid: { display: false },
        border: { color: INK.axis },
      },
    },
    plugins: {
      legend: {
        display: false, // replaced by the interactive metric legend above
      },
      tooltip: {
        backgroundColor: "#111111",
        borderColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 12,
        titleColor: INK.primary,
        bodyColor: INK.secondary,
        titleFont: { family: MONO_FAMILY, size: 11, weight: "500" },
        bodyFont: { family: MONO_FAMILY, size: 11 },
        titleMarginBottom: 8,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 6,
        itemSort: (a, b) => b.parsed.y - a.parsed.y,
        callbacks: {
          title: (items) => longDate(visible[items[0].dataIndex]?.date),
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          },
          labelColor: (context) => ({
            borderColor: context.dataset.baseColor,
            backgroundColor: context.dataset.baseColor,
            borderWidth: 0,
            borderRadius: 2,
          }),
        },
      },
    },
  };

  return (
    <section className="w-full">
      {/* ---------- headline + controls ---------- */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`${MONO} text-[10px] uppercase tracking-[0.18em] text-neutral-500`}>
            average score · latest session
          </p>
          <p className="mt-2 flex items-baseline gap-3">
            <span className={`${SERIF} text-5xl leading-none text-neutral-50`}>{latestAvg.toFixed(1)}</span>
            <span className={`${MONO} text-[11px] text-neutral-500`}>/ 10</span>
            <span className={`${MONO} text-[11px]`}>
              <Delta value={avgDelta} />
              {avgDelta !== null && <span className="text-neutral-600"> since {shortDate(first.date)}</span>}
            </span>
          </p>
          <p className={`${MONO} mt-2 text-[11px] text-neutral-600`}>
            {visible.length} session{visible.length === 1 ? "" : "s"} shown · {data.length} total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* range */}
          <div className={`${MONO} flex rounded-md border border-white/[0.08] p-0.5 text-[11px]`}>
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                disabled={r.key !== "all" && data.length <= r.key}
                className={`rounded px-2.5 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                  range === r.key ? "bg-white/[0.08] text-neutral-100" : "text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {/* view */}
          <div className={`${MONO} flex rounded-md border border-white/[0.08] p-0.5 text-[11px]`}>
            {["chart", "table"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-2.5 py-1 transition-colors ${
                  view === v ? "bg-white/[0.08] text-neutral-100" : "text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- interactive legend / metric tiles ---------- */}
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
        {METRICS.map((m) => {
          const isHidden = hidden.includes(m.key);
          const last = Number(latest[m.key]);
          const delta = prevAll && range === "all" ? last - Number(prevAll[m.key]) : visible.length > 1 ? last - Number(visible[visible.length - 2][m.key]) : null;
          return (
            <button
              key={m.key}
              onClick={() => toggle(m.key)}
              onMouseEnter={() => !isHidden && setHovered(m.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => !isHidden && setHovered(m.key)}
              onBlur={() => setHovered(null)}
              aria-pressed={!isHidden}
              title={isHidden ? `Show ${m.label}` : `Hide ${m.label}`}
              className={`group bg-[#0d0d0d] px-4 py-3 text-left transition-colors hover:bg-[#121212] ${
                isHidden ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-[3px] w-3.5 rounded-full"
                  style={{
                    backgroundColor: isHidden ? "transparent" : m.color,
                    boxShadow: isHidden ? `inset 0 0 0 1px ${m.color}` : "none",
                  }}
                />
                <span className="truncate text-[12px] text-neutral-300">{m.label}</span>
              </div>
              <div className={`${MONO} mt-1.5 flex items-baseline justify-between gap-2`}>
                <span className="text-[15px] tabular-nums text-neutral-100">
                  {Number.isFinite(last) ? last.toFixed(1) : "—"}
                </span>
                <span className="text-[10px] tabular-nums">
                  <Delta value={delta} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <p className={`${MONO} mt-2 text-[10px] text-neutral-600`}>
        hover to focus · click to show / hide · Δ vs previous session
      </p>

      {/* ---------- chart / table ---------- */}
      {view === "chart" ? (
        <div className="mt-5 w-full overflow-x-auto">
          <div className="h-[300px] min-w-[520px]">
            <Line data={chartData} options={options} plugins={[crosshair]} />
          </div>
        </div>
      ) : (
        <div className="mt-5 max-h-[300px] overflow-auto rounded-md border border-white/[0.08]">
          <table className={`${MONO} w-full min-w-[620px] text-left text-[11px]`}>
            <thead className="sticky top-0 bg-[#111] text-[10px] uppercase tracking-[0.12em] text-neutral-500">
              <tr>
                <th className="px-4 py-2.5 font-normal">date</th>
                {METRICS.map((m) => (
                  <th key={m.key} className="px-3 py-2.5 text-right font-normal">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-[3px] w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.label}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-2.5 text-right font-normal">avg</th>
              </tr>
            </thead>
            <tbody>
              {[...visible].reverse().map((entry, i) => (
                <tr key={`${entry.date}-${i}`} className="border-t border-white/[0.05] text-neutral-400 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-2 text-neutral-300">{shortDate(entry.date)}</td>
                  {METRICS.map((m) => (
                    <td key={m.key} className="px-3 py-2 text-right tabular-nums">
                      {Number(entry[m.key]).toFixed(1)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right tabular-nums text-neutral-100">{avgOf(entry).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ProgressChart;