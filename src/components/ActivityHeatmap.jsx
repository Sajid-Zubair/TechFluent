import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Flame, ChevronDown } from "lucide-react";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"
  : "https://final-techfluent.onrender.com";

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

// One-hue sequential ramp (dark surface): empty → most active
const LEVELS = ["bg-white/[0.05]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"];
const levelFor = (c) => (c <= 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : c <= 4 ? 3 : 4);

const CELL = 11;
const GAP = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const prettyDate = (d) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

function buildMonths(startYear, startMonth, count) {
  return Array.from({ length: count }, (_, i) => {
    const first = new Date(startYear, startMonth + i, 1);
    const y = first.getFullYear();
    const m = first.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return {
      id: `${y}-${m}`,
      label: MONTHS[m],
      offset: first.getDay(), // 0 = Sunday row
      days: Array.from({ length: daysInMonth }, (_, d) => new Date(y, m, d + 1)),
    };
  });
}

function ActivityHeatmap() {
  const [counts, setCounts] = useState({});
  const [streak, setStreak] = useState({ current_streak: 0, max_streak: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("past");
  const [tip, setTip] = useState(null);

  const wrapRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    const config = { headers: { Authorization: `Bearer ${token}` } };

    Promise.allSettled([
      axios.get(`${BASE_URL}/api/get_interview_progress/`, config),
      axios.get(`${BASE_URL}/api/current_streak/`, config),
    ]).then(([progress, streakRes]) => {
      if (progress.status === "fulfilled") {
        const map = {};
        (progress.value.data || []).forEach((entry) => {
          const k = String(entry.date).slice(0, 10);
          map[k] = (map[k] || 0) + 1;
        });
        setCounts(map);
      } else {
        console.error("Heatmap fetch error:", progress.reason);
        setError("Failed to load activity.");
      }
      if (streakRes.status === "fulfilled") setStreak(streakRes.value.data);
      setLoading(false);
    });
  }, []);

  const today = new Date();
  const todayKey = keyOf(today);

  const years = useMemo(() => {
    const ys = new Set(Object.keys(counts).map((k) => Number(k.slice(0, 4))));
    ys.add(today.getFullYear());
    return [...ys].sort((a, b) => b - a);
  }, [counts]);

  const months = useMemo(() => {
    if (period === "past") return buildMonths(today.getFullYear(), today.getMonth() - 11, 12);
    return buildMonths(Number(period), 0, 12);
  }, [period]);

  // Range stats
  const stats = useMemo(() => {
    let total = 0;
    let active = 0;
    let best = 0;
    let run = 0;
    months.forEach((m) =>
      m.days.forEach((d) => {
        if (d > today) return;
        const c = counts[keyOf(d)] || 0;
        total += c;
        if (c > 0) {
          active += 1;
          run += 1;
          best = Math.max(best, run);
        } else {
          run = 0;
        }
      })
    );
    return { total, active, best };
  }, [months, counts]);

  // Scroll to the most recent month on load / period change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [months, loading]);

  const showTip = (e, date, count) => {
    const r = e.currentTarget.getBoundingClientRect();
    const w = wrapRef.current.getBoundingClientRect();
    setTip({
      x: r.left - w.left + r.width / 2,
      y: r.top - w.top,
      text: `${count === 0 ? "No" : count} interview${count === 1 ? "" : "s"}`,
      date: prettyDate(date),
    });
  };

  if (error) {
    return (
      <div className={`${MONO} rounded-lg border border-white/[0.08] bg-[#0d0d0d] p-6 text-[12px] text-rose-400`}>
        ✕ {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
      {/* ---------- header ---------- */}
      <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">
          {loading ? (
            <span className="inline-block h-4 w-48 animate-pulse rounded bg-white/[0.05] align-middle" />
          ) : (
            <>
              <span className={`${SERIF} mr-1.5 text-2xl text-neutral-50`}>{stats.total}</span>
              interview{stats.total === 1 ? "" : "s"} {period === "past" ? "in the past year" : `in ${period}`}
            </>
          )}
        </p>

        <div className={`${MONO} flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-neutral-500`}>
          <span>
            active days <span className="text-neutral-100">{stats.active}</span>
          </span>
          <span>
            max streak <span className="text-neutral-100">{stats.best}</span>
          </span>
          <span className="flex items-center gap-1">
            <Flame size={12} className={streak.current_streak > 0 ? "text-orange-400" : "text-neutral-700"} />
            current <span className="text-neutral-100">{streak.current_streak}</span>
          </span>

          <label className="relative">
            <span className="sr-only">Select period</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="cursor-pointer appearance-none rounded-md border border-white/10 bg-white/[0.03] py-1 pl-2.5 pr-7 text-[11px] text-neutral-300 outline-none transition-colors hover:border-white/20 focus:border-emerald-400/50 [&>option]:bg-[#111]"
            >
              <option value="past">Past year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          </label>
        </div>
      </div>

      {/* ---------- grid ---------- */}
      <div ref={wrapRef} className="relative px-5 pb-4 pt-5">
        <div className="flex">
          {/* weekday labels */}
          <div
            className={`${MONO} mr-2 grid shrink-0 text-[9px] text-neutral-600`}
            style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, rowGap: GAP }}
          >
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="leading-[11px]">{d}</span>
            ))}
          </div>

          <div ref={scrollRef} className="overflow-x-auto pb-1 [scrollbar-width:thin]" onScroll={() => setTip(null)}>
            <div
              className="flex w-max gap-[9px]"
              role="img"
              aria-label={`${stats.total} interviews across ${stats.active} active days`}
            >
              {months.map((m) => (
                <div key={m.id} className="flex flex-col items-start">
                  <div
                    className="grid"
                    style={{
                      gridTemplateRows: `repeat(7, ${CELL}px)`,
                      gridAutoColumns: `${CELL}px`,
                      gridAutoFlow: "column",
                      gap: GAP,
                    }}
                  >
                    {Array.from({ length: m.offset }).map((_, i) => (
                      <span key={`pad-${i}`} />
                    ))}
                    {m.days.map((d) => {
                      const k = keyOf(d);
                      const future = d > today && k !== todayKey;
                      const c = counts[k] || 0;
                      if (loading) {
                        return <span key={k} className="animate-pulse rounded-[2px] bg-white/[0.04]" />;
                      }
                      if (future) {
                        return <span key={k} className="rounded-[2px] border border-white/[0.03]" />;
                      }
                      return (
                        <span
                          key={k}
                          onMouseEnter={(e) => showTip(e, d, c)}
                          onMouseLeave={() => setTip(null)}
                          className={`rounded-[2px] transition-transform duration-100 hover:scale-125 ${LEVELS[levelFor(c)]} ${
                            k === todayKey ? "ring-1 ring-neutral-300 ring-offset-1 ring-offset-[#0d0d0d]" : ""
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className={`${MONO} mt-2 text-[10px] text-neutral-600`}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* tooltip */}
        {tip && (
          <div
            className={`${MONO} pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-[#111] px-2.5 py-1.5 text-[11px] shadow-xl shadow-black/50`}
            style={{ left: tip.x, top: tip.y - 6 }}
          >
            <span className="text-neutral-100">{tip.text}</span>
            <span className="text-neutral-500"> · {tip.date}</span>
          </div>
        )}

        {/* legend */}
        <div className={`${MONO} mt-3 flex items-center justify-between text-[10px] text-neutral-600`}>
          <span className="hidden sm:inline">one square = one day · outlined = today</span>
          <span className="flex items-center gap-1.5">
            less
            {LEVELS.map((c) => (
              <span key={c} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
            ))}
            more
          </span>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;