

import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const MONO_FAMILY = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// Same axis order as ProgressChart so the two views read together
const SKILLS = [
  { key: 'fluency', label: 'Fluency' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'content_structure', label: 'Content Structure' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'coherence', label: 'Coherence' },
];

// Display-only threshold for the "mastery" ring. Adjust to your rubric.
const MASTERY = 8;

const ACCENT = '#34d399'; // brand emerald, single series
const INK = {
  surface: '#0d0d0d',
  primary: '#ffffff',
  secondary: '#c3c2b7',
  muted: '#898781',
};

// Dashed ring at the mastery threshold
const masteryRing = {
  id: 'masteryRing',
  beforeDatasetsDraw(chart) {
    const r = chart.scales.r;
    if (!r) return;
    const { ctx } = chart;
    const radius = r.getDistanceFromCenterForValue(MASTERY);
    ctx.save();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(r.xCenter, r.yCenter, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};

function RadarP({ ratings }) {
  const chartRef = useRef(null);

  const values = SKILLS.map((s) => {
    const v = Number(ratings?.[s.key]);
    return Number.isFinite(v) ? v : null;
  });
  const scored = SKILLS.map((s, i) => ({ ...s, index: i, value: values[i] })).filter((s) => s.value !== null);
  const ranked = [...scored].sort((a, b) => b.value - a.value);
  const avg = scored.length ? scored.reduce((sum, s) => sum + s.value, 0) / scored.length : null;
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];
  const atMastery = scored.filter((s) => s.value >= MASTERY).length;

  // Hovering a list row highlights that vertex on the radar
  const focusPoint = (index) => {
    const chart = chartRef.current;
    if (!chart) return;
    const meta = chart.getDatasetMeta(0);
    const el = meta?.data?.[index];
    if (!el) return;
    const active = [{ datasetIndex: 0, index }];
    chart.setActiveElements(active);
    chart.tooltip.setActiveElements(active, { x: el.x, y: el.y });
    chart.update();
  };
  const clearFocus = () => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.setActiveElements([]);
    chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    chart.update();
  };

  const data = {
    labels: SKILLS.map((s) => s.label),
    datasets: [
      {
        label: 'Rating',
        data: values,
        backgroundColor: 'rgba(52, 211, 153, 0.12)',
        borderColor: ACCENT,
        borderWidth: 2,
        borderJoinStyle: 'round',
        fill: true,
        spanGaps: true,
        pointBackgroundColor: ACCENT,
        pointBorderColor: INK.surface,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: ACCENT,
        pointHoverBorderColor: INK.surface,
        pointHitRadius: 14,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    layout: { padding: 4 },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#5a5955',
          backdropColor: 'transparent',
          font: { family: MONO_FAMILY, size: 9 },
          z: 1,
        },
        grid: { color: 'rgba(255,255,255,0.06)', circular: true },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: {
          color: INK.secondary,
          padding: 10,
          font: { family: MONO_FAMILY, size: 10 },
          callback: (label, i) =>
            values[i] === null ? [label, '—'] : [label, values[i].toFixed(1)],
        },
      },
    },
    plugins: {
      legend: {
        display: false, // single series: the card title names it
      },
      tooltip: {
        backgroundColor: '#111111',
        borderColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        titleColor: INK.primary,
        bodyColor: INK.secondary,
        titleFont: { family: MONO_FAMILY, size: 11, weight: '500' },
        bodyFont: { family: MONO_FAMILY, size: 11 },
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.r;
            const gap = MASTERY - v;
            return gap <= 0
              ? `${v.toFixed(1)} / 10  ·  ✓ at mastery`
              : `${v.toFixed(1)} / 10  ·  ${gap.toFixed(1)} to mastery`;
          },
        },
      },
    },
  };

  if (!scored.length) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
        <p className={`${SERIF} text-3xl text-neutral-300`}>
          No skill scores <em className="text-neutral-600">yet.</em>
        </p>
        <p className="mt-2 max-w-xs text-sm text-neutral-500">
          Your latest attempt didn't include a skill breakdown.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* ---------- summary ---------- */}
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.08]">
        <div className="bg-[#0d0d0d] px-4 py-3">
          <p className={`${MONO} text-[10px] uppercase tracking-[0.15em] text-neutral-500`}>average</p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className={`${SERIF} text-3xl leading-none text-neutral-50`}>{avg.toFixed(1)}</span>
            <span className={`${MONO} text-[10px] text-neutral-600`}>/10</span>
          </p>
        </div>
        <div className="bg-[#0d0d0d] px-4 py-3">
          <p className={`${MONO} text-[10px] uppercase tracking-[0.15em] text-neutral-500`}>strongest</p>
          <p className="mt-1.5 truncate text-sm text-neutral-100">{strongest.label}</p>
          <p className={`${MONO} text-[11px] text-emerald-400`}>{strongest.value.toFixed(1)}</p>
        </div>
        <div className="bg-[#0d0d0d] px-4 py-3">
          <p className={`${MONO} text-[10px] uppercase tracking-[0.15em] text-neutral-500`}>focus next</p>
          <p className="mt-1.5 truncate text-sm text-neutral-100">{weakest.label}</p>
          <p className={`${MONO} text-[11px] text-amber-300/90`}>{weakest.value.toFixed(1)}</p>
        </div>
      </div>

      {/* ---------- radar ---------- */}
      <div className="relative mx-auto mt-4 h-[300px] w-full max-w-[420px]">
        <Radar ref={chartRef} data={data} options={options} plugins={[masteryRing]} />
      </div>

      <p className={`${MONO} mt-1 flex items-center justify-center gap-2 text-[10px] text-neutral-600`}>
        <span className="inline-block w-5 border-t border-dashed border-emerald-400/60" />
        mastery line · {MASTERY.toFixed(1)}
        <span className="text-neutral-700">·</span>
        <span className="text-neutral-400">
          {atMastery}/{scored.length}
        </span>{' '}
        skills at mastery
      </p>

      {/* ---------- ranked list ---------- */}
      <div className="mt-5 border-t border-white/[0.08] pt-4" onMouseLeave={clearFocus}>
        <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {ranked.map((s, i) => {
            const mastered = s.value >= MASTERY;
            return (
              <button
                key={s.key}
                type="button"
                onMouseEnter={() => focusPoint(s.index)}
                onFocus={() => focusPoint(s.index)}
                onBlur={clearFocus}
                className="group -mx-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className={`${MONO} flex items-center justify-between text-[11px]`}>
                  <span className="flex items-center gap-2 text-neutral-400 group-hover:text-neutral-200">
                    <span className="w-4 text-neutral-700">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </span>
                  <span className="flex items-center gap-1.5 tabular-nums text-neutral-100">
                    {mastered && <span className="text-emerald-400">✓</span>}
                    {s.value.toFixed(1)}
                  </span>
                </div>
                <div className="relative mt-1.5 h-1 rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${mastered ? 'bg-emerald-400' : 'bg-neutral-400'}`}
                    style={{ width: `${Math.min(100, (s.value / 10) * 100)}%` }}
                  />
                  {/* mastery tick */}
                  <span
                    className="absolute -top-0.5 h-2 w-px bg-emerald-400/50"
                    style={{ left: `${MASTERY * 10}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RadarP;