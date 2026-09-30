


import React, { useState, useEffect, lazy, Suspense } from "react";
import Sidenav from "./Sidenav";
import ActivityHeatmap from "./ActivityHeatmap";
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Pencil,
  Printer,
  Medal,
  Flame,
  Star,
  Mic,
  Cpu,
  Zap,
  Lock,
  Rocket,
  Target,
  Award,
  Crown,
  Layers,
  Trophy,
  MessageSquare,
} from "lucide-react";

const RadarP = lazy(() => import("./RadarP"));
const ProgressChart = lazy(() => import("./ProgressChart"));


const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

// Client-side XP model (display only). Move to the backend when XP is persisted.
const XP_RULES = { technical: 50, behavioural: 40, streakDay: 10, perLevel: 500 };

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function SectionLabel({ index, children, right }) {
  return (
    <div className={`${MONO} flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
      <span className="text-emerald-400">{index}</span>
      <span>—</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
      {right}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.04] ${className}`} />;
}

function Profile() {
  const [editP, setEditP] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ratings, setRatings] = useState(null);
  const [rankInfo, setRankInfo] = useState(0);
  const [collegeName, setCollegeName] = useState('');
  const [technicalCount, setTechnicalCount] = useState(0);
  const [behaviouralCount, setBehaviouralCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const initials = username ? username.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();

  // Initial fast-loading user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${BASE_URL}/api/user/`, config);

        setIsLoggedIn(true);
        setUsername(data.username);
        setCollegeName(data.college_name);
        setTechnicalCount(data.technical_count || 0);
        setBehaviouralCount(data.behavioural_count || 0);
      } catch (err) {
        console.error("User fetch error:", err);
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    fetchUser();
  }, []);

  // Deferred: Rankings, charts, feedback, ratings
  useEffect(() => {
    const fetchDeferredData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [attemptRes, rankRes, streakRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/latest_attempt/`, config),
          axios.get(`${BASE_URL}/api/user_rank/`, config),
          axios.get(`${BASE_URL}/api/current_streak/`, config),
        ]);

        setRatings(attemptRes.data);
        setRankInfo(rankRes.data);
        setMaxStreak(streakRes.data.max_streak || 0);
        setShowCharts(true);
      } catch (err) {
        console.error("Deferred fetch error:", err);
      }
    };

    // Wait a bit to avoid blocking FCP
    const timer = setTimeout(fetchDeferredData, 1000);
    return () => clearTimeout(timer);
  }, []);

  function handlePrint() {
    window.print();
  }

  /* ---------------- display-only derived values ---------------- */
  const totalInterviews = technicalCount + behaviouralCount;
  const rank = rankInfo?.rank;
  const totalUsers = rankInfo?.total_users;
  const topPercent = rank && totalUsers ? Math.max(1, Math.ceil((rank / totalUsers) * 100)) : null;

  const xp =
    technicalCount * XP_RULES.technical +
    behaviouralCount * XP_RULES.behavioural +
    maxStreak * XP_RULES.streakDay;
  const level = Math.floor(xp / XP_RULES.perLevel) + 1;
  const xpIntoLevel = xp % XP_RULES.perLevel;
  const levelProgress = Math.round((xpIntoLevel / XP_RULES.perLevel) * 100);

  const techShare = totalInterviews ? Math.round((technicalCount / totalInterviews) * 100) : 0;

  const badges = [
    { label: "First Steps", desc: "Complete your first interview", icon: Rocket, cur: totalInterviews, goal: 1 },
    { label: "All-Rounder", desc: "5 technical + 5 behavioural", icon: Layers, cur: Math.min(technicalCount, behaviouralCount), goal: 5 },
    { label: "Concept Crusher", desc: "10 technical interviews", icon: Cpu, cur: technicalCount, goal: 10 },
    { label: "Smooth Talker", desc: "10 behavioural interviews", icon: MessageSquare, cur: behaviouralCount, goal: 10 },
    { label: "On Fire", desc: "Reach a 7-day streak", icon: Flame, cur: maxStreak, goal: 7 },
    { label: "Unstoppable", desc: "Reach a 30-day streak", icon: Zap, cur: maxStreak, goal: 30 },
    { label: "Half Century", desc: "50 total interviews", icon: Target, cur: totalInterviews, goal: 50 },
    { label: "Top 10", desc: "Top 10 in your college", icon: Crown, cur: rank && rank <= 10 ? 1 : 0, goal: 1, hideCount: true },
  ].map((b) => ({ ...b, unlocked: b.cur >= b.goal }));
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // Latest-attempt breakdown: any numeric fields besides overall_rating
  const ratingEntries = ratings
    ? Object.entries(ratings).filter(
        ([k, v]) => typeof v === "number" && k !== "overall_rating" && !/(^id$|_id$)/i.test(k)
      )
    : [];
  const ratingMax = ratingEntries.length ? Math.max(...ratingEntries.map(([, v]) => v)) : 0;
  const ratingScale = ratingMax <= 5 ? 5 : ratingMax <= 10 ? 10 : 100;
  const prettyKey = (k) => k.replace(/_/g, " ");

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30">
      {/* Mobile Top Bar */}
      <div className="print:hidden md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0a0a0a]/85 px-4 backdrop-blur-xl">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <span className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
          <span className="text-emerald-400">●</span>&nbsp; profile
        </span>
        <span className="w-9" />
      </div>

      {/* Desktop Sidenav */}
      <div className="print:hidden hidden md:block md:w-64 md:shrink-0">
        <Sidenav />
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="print:hidden fixed left-0 top-0 z-[60] h-full w-64 overflow-auto border-r border-white/[0.08] bg-[#0d0d0d] shadow-2xl shadow-black/60">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="absolute right-3 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`relative w-full flex-1 overflow-hidden transition-opacity duration-300 ${
          mobileNavOpen ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        {/* ambient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 right-0 h-[380px] w-[620px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 md:pt-12"
        >
          {/* ======================= HEADER ======================= */}
          <motion.header
            variants={fadeUp}
            className="flex flex-col gap-10 border-b border-white/[0.08] pb-10 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              {/* avatar */}
              <div className="relative w-fit">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-emerald-400/40 to-transparent blur-md" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-xl border border-white/15 bg-[#111]">
                  {username ? (
                    <span className={`${SERIF} text-6xl leading-none text-neutral-50`}>{initials}</span>
                  ) : (
                    <Skeleton className="h-10 w-10" />
                  )}
                </div>
                <span
                  className={`${MONO} absolute -bottom-2 -right-2 rounded-md border border-emerald-400/40 bg-[#0a0a0a] px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400`}
                >
                  LV {level}
                </span>
              </div>

              <div>
                <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
                  <span className="text-emerald-400">~/</span>profile
                </p>
                <h1 className={`${SERIF} mt-3 text-5xl leading-none tracking-[-0.02em] text-neutral-50 md:text-6xl`}>
                  {username || <Skeleton className="inline-block h-12 w-56 align-middle" />}
                </h1>
                <p className="mt-3 text-neutral-400">
                  {collegeName || "College Name Not Available"}
                </p>
              </div>
            </div>

            <div className="print:hidden flex flex-wrap gap-2">
              <button
                onClick={() => setEditP(true)}
                className="group inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
              >
                <Pencil size={14} className="text-neutral-500 group-hover:text-white" />
                Edit profile
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                <Printer size={14} />
                Export report
              </button>
            </div>
          </motion.header>

          {/* ======================= 01 OVERVIEW ======================= */}
          <motion.section variants={fadeUp} className="mt-10">
            <SectionLabel index="01">Overview</SectionLabel>

            <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
              {/* rank */}
              <div className="relative bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>college_rank</span>
                  <Medal size={16} className={rank ? "text-amber-300" : "text-neutral-700"} />
                </div>
                {!showCharts ? (
                  <Skeleton className="mt-5 h-14 w-28" />
                ) : rank ? (
                  <>
                    <p className="mt-5 flex items-baseline gap-2">
                      <span className={`${SERIF} text-6xl leading-none text-neutral-50`}>#{rank}</span>
                      <span className="text-sm text-neutral-500">/ {totalUsers}</span>
                    </p>
                    <p className={`${MONO} mt-4 text-[11px] text-emerald-400`}>top {topPercent}% of your college</p>
                  </>
                ) : (
                  <>
                    <p className={`${SERIF} mt-5 text-4xl leading-none text-neutral-600`}>Unranked</p>
                    <p className={`${MONO} mt-4 text-[11px] text-neutral-600`}>complete an interview to rank</p>
                  </>
                )}
              </div>

              {/* overall rating */}
              <div className="bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>overall_rating</span>
                  <Star size={16} className="text-neutral-600" />
                </div>
                {!showCharts ? (
                  <Skeleton className="mt-5 h-14 w-24" />
                ) : (
                  <p className={`${SERIF} mt-5 text-6xl leading-none text-neutral-50`}>
                    {ratings?.overall_rating || 'N/A'}
                  </p>
                )}
                <p className={`${MONO} mt-4 text-[11px] text-neutral-600`}>from latest attempt</p>
              </div>

              {/* max streak */}
              <div className="bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>max_streak</span>
                  <Flame size={16} className={maxStreak > 0 ? "text-orange-400" : "text-neutral-700"} />
                </div>
                {!showCharts ? (
                  <Skeleton className="mt-5 h-14 w-20" />
                ) : (
                  <p className="mt-5 flex items-baseline gap-2">
                    <span className={`${SERIF} text-6xl leading-none text-neutral-50`}>{maxStreak}</span>
                    <span className="text-sm text-neutral-500">{maxStreak === 1 ? "day" : "days"}</span>
                  </p>
                )}
                <p className={`${MONO} mt-4 text-[11px] text-neutral-600`}>personal best</p>
              </div>

              {/* total interviews */}
              <div className="bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>total_interviews</span>
                  <Mic size={16} className="text-neutral-600" />
                </div>
                <p className={`${SERIF} mt-5 text-6xl leading-none text-neutral-50`}>{totalInterviews}</p>
                <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${techShare}%` }} />
                  <div
                    className="h-full bg-neutral-400 transition-all duration-700"
                    style={{ width: totalInterviews ? `${100 - techShare}%` : "0%" }}
                  />
                </div>
                <div className={`${MONO} mt-2 flex justify-between text-[10px] text-neutral-600`}>
                  <span><span className="text-emerald-400">■</span> tech {technicalCount}</span>
                  <span><span className="text-neutral-400">■</span> hr {behaviouralCount}</span>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} className="mt-16">
            <SectionLabel index="02">Activity</SectionLabel>
            <div className="mt-6">
              <ActivityHeatmap />
            </div>
          </motion.section>

          {/* ======================= 02 LEVEL ======================= */}
          <motion.section variants={fadeUp} className="mt-16">
            <SectionLabel index="03">Level & XP</SectionLabel>

            <div className="mt-6 grid gap-6 rounded-lg border border-white/[0.08] bg-white/[0.02] p-6 md:grid-cols-12 md:items-center md:p-8">
              <div className="md:col-span-4">
                <p className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>current level</p>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className={`${SERIF} text-7xl leading-none text-neutral-50`}>{level}</span>
                  <span className={`${MONO} text-sm text-emerald-400`}>{xp.toLocaleString()} xp</span>
                </p>
              </div>

              <div className="md:col-span-8">
                <div className={`${MONO} mb-3 flex justify-between text-[11px] text-neutral-500`}>
                  <span>lv {level}</span>
                  <span className="text-neutral-300">
                    {xpIntoLevel} / {XP_RULES.perLevel} xp
                  </span>
                  <span>lv {level + 1}</span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.2, ease, delay: 0.3 }}
                  />
                  {/* tick marks */}
                  <div className="pointer-events-none absolute inset-0 flex justify-between px-[10%]">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span key={i} className="h-full w-px bg-black/40" />
                    ))}
                  </div>
                </div>
                <p className={`${MONO} mt-4 text-[11px] leading-5 text-neutral-600`}>
                  +{XP_RULES.technical} technical · +{XP_RULES.behavioural} behavioural · +{XP_RULES.streakDay} per streak day
                  &nbsp;—&nbsp;
                  <span className="text-neutral-400">{XP_RULES.perLevel - xpIntoLevel} xp to next level</span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* ======================= 03 ACHIEVEMENTS ======================= */}
          <motion.section variants={fadeUp} className="mt-16">
            <SectionLabel
              index="04"
              right={
                <span className="text-neutral-400">
                  {unlockedCount}/{badges.length}
                </span>
              }
            >
              Achievements
            </SectionLabel>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
              {badges.map(({ label, desc, icon: Icon, cur, goal, unlocked, hideCount }) => (
                <div
                  key={label}
                  className={`group relative bg-[#0a0a0a] p-5 transition-colors ${unlocked ? "hover:bg-emerald-400/[0.03]" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                        unlocked
                          ? "border-emerald-400/40 bg-emerald-400/[0.08] text-emerald-400 shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)]"
                          : "border-white/[0.08] text-neutral-700"
                      }`}
                    >
                      {unlocked ? <Icon size={18} /> : <Lock size={15} />}
                    </span>
                    {!hideCount && (
                      <span className={`${MONO} text-[10px] ${unlocked ? "text-emerald-400" : "text-neutral-600"}`}>
                        {Math.min(cur, goal)}/{goal}
                      </span>
                    )}
                  </div>
                  <p className={`mt-5 text-sm font-medium ${unlocked ? "text-neutral-100" : "text-neutral-500"}`}>{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">{desc}</p>
                  {!unlocked && !hideCount && (
                    <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full bg-neutral-500" style={{ width: `${Math.min(100, (cur / goal) * 100)}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* ======================= 04 ANALYTICS ======================= */}
          <motion.section variants={fadeUp} className="mt-16">
            <SectionLabel index="05">Performance analytics</SectionLabel>

            {!showCharts ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-[340px]" />
                <Skeleton className="h-[340px]" />
              </div>
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* progress over time */}
                <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
                  <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-3 text-[11px] text-neutral-500`}>
                    <span>progress.over_time</span>
                    <Trophy size={13} className="text-neutral-600" />
                  </div>
                  <div className="p-5">
                    <Suspense fallback={<Skeleton className="h-[280px]" />}>
                      <ProgressChart />
                    </Suspense>
                  </div>
                </div>

                {/* skill radar */}
                <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
                  <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-3 text-[11px] text-neutral-500`}>
                    <span>skills.radar</span>
                    <Award size={13} className="text-neutral-600" />
                  </div>
                  <div className="p-5">
                    {ratings ? (
                      <div style={{ minHeight: '350px' }}>
                        <Suspense fallback={<Skeleton className="h-[320px]" />}>
                          <RadarP ratings={ratings} />
                        </Suspense>
                      </div>
                    ) : (
                      <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                        <p className={`${SERIF} text-3xl text-neutral-300`}>
                          No ratings <em className="text-neutral-600">yet.</em>
                        </p>
                        <p className="mt-2 max-w-xs text-sm text-neutral-500">
                          Please complete an interview to see your ratings.
                        </p>
                        <button
                          onClick={() => navigate('/dashboard')}
                          className="print:hidden mt-6 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
                        >
                          Start a session
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* latest attempt breakdown */}
            {showCharts && ratingEntries.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
                <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-3 text-[11px] text-neutral-500`}>
                  <span>latest_attempt.rubric</span>
                  <span>scale / {ratingScale}</span>
                </div>
                <div className="grid gap-x-10 gap-y-4 p-5 sm:grid-cols-2">
                  {ratingEntries.map(([k, v], i) => (
                    <div key={k}>
                      <div className={`${MONO} mb-1.5 flex justify-between text-[11px]`}>
                        <span className="capitalize text-neutral-400">{prettyKey(k)}</span>
                        <span className="text-neutral-100">{v}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (v / ratingScale) * 100)}%` }}
                          transition={{ duration: 0.9, ease, delay: i * 0.06 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {/* ======================= 05 FEEDBACK ======================= */}
          {showCharts && (
            <motion.section variants={fadeUp} initial="hidden" animate="show" className="mt-16">
              <SectionLabel index="06">Interview feedback</SectionLabel>

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <h2 className={`${SERIF} text-4xl leading-tight text-neutral-50 md:text-5xl lg:col-span-4`}>
                  What went well, <em className="text-neutral-500">and what's next.</em>
                </h2>

                <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d] lg:col-span-8">
                  <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
                    <span>feedback.diff</span>
                    <span>
                      <span className="text-emerald-400">+ positives</span> &nbsp;
                      <span className="text-rose-400">− improve</span>
                    </span>
                  </div>

                  <div className="border-b border-white/[0.06] bg-emerald-500/[0.04] px-5 py-5">
                    <p className={`${MONO} mb-2 text-[11px] uppercase tracking-[0.15em] text-emerald-400`}>+ Positives</p>
                    <p className="leading-relaxed text-neutral-300">
                      Your speech was well-paced and easy to follow, showcasing good fluency throughout. The structure of your response showed clear organization. Great vocabulary usage and accuracy too.
                    </p>
                  </div>
                  <div className="bg-rose-500/[0.04] px-5 py-5">
                    <p className={`${MONO} mb-2 text-[11px] uppercase tracking-[0.15em] text-rose-400`}>− Areas for improvement</p>
                    <p className="leading-relaxed text-neutral-300">
                      Try to reduce filler words and incorporate more precise vocabulary. Also, strengthen your answers with concrete examples.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>

      {editP && <EditProfile setShowEditP={setEditP} />}
    </div>
  );
}

export default Profile;