


import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidenav from './Sidenav'
import Popup from './Popup'
import ErrorPop from './ErrorPop'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  Menu,
  X,
  LogOut,
  Flame,
  Cpu,
  Mic,
  ArrowRight,
  CornerDownLeft,
  CheckCircle2,
  Circle,
} from 'lucide-react'

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"
  : "https://final-techfluent.onrender.com";

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

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

function Dashboard() {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [isTechnicalSelected, setIsTechnicalSelected] = useState(false)
  const [technicalSubject, setTechnicalSubject] = useState('')
  const [interviewType, setInterviewType] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showError, setshowError] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [technicalCount, setTechnicalCount] = useState(0)
  const [behaviouralCount, setBehaviouralCount] = useState(0)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
      navigate('/'); // Not logged in, redirect to home/login
      return;
    }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const userRes = await axios.get(`${BASE_URL}/api/user/`, config);
      console.log('User API response:', userRes.data);
      setIsLoggedIn(true);
      setUsername(userRes.data.username);
      setTechnicalCount(userRes.data.technical_count || 0);
      setBehaviouralCount(userRes.data.behavioural_count || 0);

      const streakRes = await axios.get(`${BASE_URL}/api/current_streak/`, config);
      console.log('Streak API response:', streakRes.data);
      setCurrentStreak(streakRes.data.current_streak || 0);

    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  fetchUserData();
}, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken && refreshToken !== "undefined" && refreshToken !== "null") {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value
        await axios.post(`${BASE_URL}/api/logout/`, { refresh: refreshToken }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "X-CSRFToken": csrfToken,
          }
        })
      }
    } catch (error) {
      console.error("Failed to logout:", error.response?.data || error.message)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setIsLoggedIn(false)
      setUsername("")
      navigate('/')
    }
  }

  const handleStart = () => {
    if (!interviewType) {
      setshowError(true)
      return
    }
    if (interviewType === 'Technical' && !technicalSubject) {
      alert('Please select a technical subject first!')
      return
    }
    navigate('/interview', {
      state: {
        type: interviewType,
        subject: interviewType === 'Technical' ? technicalSubject : undefined
      }
    })
  }

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.button-container') &&
        !e.target.closest('.dropdown-menu') &&
        !e.target.closest('.start-btn')) {
      setShowDropdown(false)
      setInterviewType(null)
      setShowPopup(false)
    }
  }

  const handleTech = () => {
    setShowPopup(true)
    setInterviewType('Technical')
    setIsTechnicalSelected(!isTechnicalSelected)
  }

  const onclose = () => setShowPopup(false)

  const handleDoneClick = (selectedInterviewType) => {
    setShowPopup(false)
    setTechnicalSubject(selectedInterviewType)
    setIsTechnicalSelected(true)
  }

  /* ---------------- display-only derived values ---------------- */
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const totalSessions = technicalCount + behaviouralCount
  const techShare = totalSessions ? Math.round((technicalCount / totalSessions) * 100) : 50
  const weekDots = Array.from({ length: 7 }, (_, i) => i < Math.min(currentStreak, 7))
  const isReady = interviewType && (interviewType !== 'Technical' || technicalSubject)
  const cmdType = interviewType ? interviewType.toLowerCase() : '<type>'

  return (
    <div
      className="flex min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30"
      onClick={handleOutsideClick}
    >
      {/* --- Desktop Sidenav --- */}
      <div className="hidden md:block md:w-64 md:shrink-0 border-r border-white/[0.08] bg-[#0a0a0a]">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidenav />
        </div>
      </div>

      {/* --- Mobile Top Bar --- */}
      <div className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0a0a0a]/85 px-4 backdrop-blur-xl">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <span className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
          <span className="text-emerald-400">●</span>&nbsp; dashboard
        </span>
        <span className="w-9" />
      </div>

      {/* --- Mobile Drawer --- */}
      {mobileNavOpen && (
        <div className="fixed left-0 top-0 z-[60] h-full w-64 border-r border-white/[0.08] bg-[#0d0d0d] p-4 shadow-2xl shadow-black/60">
          <Sidenav />
          <button
            name="close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* --- Main Content --- */}
      <div
        className={`relative flex-1 overflow-hidden transition-opacity duration-300 ${
          mobileNavOpen ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        {/* ambient background */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/3 h-[380px] w-[620px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 md:pt-12"
        >
          {/* ======================= HEADER ======================= */}
          <motion.header variants={fadeUp} className="flex flex-col gap-6 border-b border-white/[0.08] pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
                <span className="text-emerald-400">~/</span>dashboard &nbsp;·&nbsp; {today}
              </p>
              <h1 className={`${SERIF} mt-5 text-5xl leading-[1] tracking-[-0.02em] text-neutral-50 md:text-6xl`}>
                {greeting},{' '}
                <em className="text-emerald-400">{username || '…'}</em>
              </h1>
              <p className="mt-3 text-neutral-400">
                {currentStreak > 0
                  ? `You're on a ${currentStreak}-day streak. One question keeps it alive.`
                  : 'Start a session today to begin your streak.'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="group inline-flex w-fit items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-rose-400/40 hover:text-rose-300"
            >
              <LogOut size={15} className="text-neutral-500 transition-colors group-hover:text-rose-300" />
              Log out
            </button>
          </motion.header>

          {/* ======================= STATS ======================= */}
          <motion.section variants={fadeUp} className="mt-10">
            <SectionLabel index="01">Overview</SectionLabel>

            <div className="mt-6 grid overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] gap-px sm:grid-cols-2 lg:grid-cols-4">
              {/* streak */}
              <div className="relative bg-[#0a0a0a] p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>current_streak</span>
                  <Flame size={16} className={currentStreak > 0 ? 'text-orange-400' : 'text-neutral-700'} />
                </div>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className={`${SERIF} text-6xl leading-none text-neutral-50`}>{currentStreak}</span>
                  <span className="text-sm text-neutral-500">{currentStreak === 1 ? 'day' : 'days'}</span>
                </p>
                <div className="mt-5 flex gap-1.5">
                  {weekDots.map((on, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${on ? 'bg-orange-400' : 'bg-white/[0.06]'}`}
                    />
                  ))}
                </div>
              </div>

              {/* technical */}
              <div className="bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>technical</span>
                  <Cpu size={16} className="text-neutral-600" />
                </div>
                <p className={`${SERIF} mt-5 text-6xl leading-none text-neutral-50`}>{technicalCount}</p>
                <p className={`${MONO} mt-5 text-[11px] text-neutral-600`}>interviews completed</p>
              </div>

              {/* behavioural */}
              <div className="bg-[#0a0a0a] p-6">
                <div className="flex items-center justify-between">
                  <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>behavioural</span>
                  <Mic size={16} className="text-neutral-600" />
                </div>
                <p className={`${SERIF} mt-5 text-6xl leading-none text-neutral-50`}>{behaviouralCount}</p>
                <p className={`${MONO} mt-5 text-[11px] text-neutral-600`}>interviews completed</p>
              </div>

              {/* split */}
              <div className="bg-[#0a0a0a] p-6">
                <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>practice_split</span>
                <p className={`${SERIF} mt-5 text-6xl leading-none text-neutral-50`}>{totalSessions}</p>
                <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full bg-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: totalSessions ? `${techShare}%` : '0%' }}
                    transition={{ duration: 1, ease, delay: 0.4 }}
                  />
                  <motion.div
                    className="h-full bg-neutral-400"
                    initial={{ width: 0 }}
                    animate={{ width: totalSessions ? `${100 - techShare}%` : '0%' }}
                    transition={{ duration: 1, ease, delay: 0.5 }}
                  />
                </div>
                <div className={`${MONO} mt-2 flex justify-between text-[10px] text-neutral-600`}>
                  <span><span className="text-emerald-400">■</span> tech</span>
                  <span><span className="text-neutral-400">■</span> hr</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ======================= NEW SESSION ======================= */}
          <motion.section variants={fadeUp} className="mt-16">
            <SectionLabel index="02">New session</SectionLabel>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              {/* type selector */}
              <div className="lg:col-span-7">
                <h2 className={`${SERIF} text-4xl leading-tight text-neutral-50 md:text-5xl`}>
                  Choose your <em className="text-neutral-500">interview.</em>
                </h2>

                <div className="button-container mt-8 grid gap-4 sm:grid-cols-2">
                  {/* Technical */}
                  <button
                    onClick={handleTech}
                    className={`group relative overflow-hidden rounded-lg border p-6 text-left transition-all duration-300 ${
                      interviewType === 'Technical'
                        ? 'border-emerald-400/50 bg-emerald-400/[0.05] shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_20px_60px_-20px_rgba(52,211,153,0.25)]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-md border ${
                          interviewType === 'Technical'
                            ? 'border-emerald-400/40 text-emerald-400'
                            : 'border-white/10 text-neutral-400 group-hover:text-neutral-200'
                        }`}
                      >
                        <Cpu size={20} />
                      </span>
                      {interviewType === 'Technical' ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} className="text-neutral-700" />
                      )}
                    </div>
                    <p className={`${MONO} mt-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>mod_01</p>
                    <h3 className="mt-1.5 text-lg font-medium text-neutral-100">Technical Interview</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                      One concept at a time across DSA, OS, CN, DBMS and OOP.
                    </p>
                    <div className={`${MONO} mt-5 border-t border-white/[0.06] pt-4 text-[11px]`}>
                      {interviewType === 'Technical' && technicalSubject ? (
                        <span className="text-emerald-300">subject → {technicalSubject}</span>
                      ) : (
                        <span className="text-neutral-600">click to choose a subject →</span>
                      )}
                    </div>
                  </button>

                  {/* Behavioural */}
                  <button
                    onClick={() => {
                      setInterviewType('Behavioural')
                      setTechnicalSubject('')
                      setIsTechnicalSelected(false)
                    }}
                    className={`group relative overflow-hidden rounded-lg border p-6 text-left transition-all duration-300 ${
                      interviewType === 'Behavioural'
                        ? 'border-emerald-400/50 bg-emerald-400/[0.05] shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_20px_60px_-20px_rgba(52,211,153,0.25)]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-md border ${
                          interviewType === 'Behavioural'
                            ? 'border-emerald-400/40 text-emerald-400'
                            : 'border-white/10 text-neutral-400 group-hover:text-neutral-200'
                        }`}
                      >
                        <Mic size={20} />
                      </span>
                      {interviewType === 'Behavioural' ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} className="text-neutral-700" />
                      )}
                    </div>
                    <p className={`${MONO} mt-8 text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>mod_02</p>
                    <h3 className="mt-1.5 text-lg font-medium text-neutral-100">Behavioural Interview</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                      HR and situational questions, scored on clarity and confidence.
                    </p>
                    <div className={`${MONO} mt-5 border-t border-white/[0.06] pt-4 text-[11px] text-neutral-600`}>
                      voice · communication · confidence
                    </div>
                  </button>
                </div>
              </div>

              {/* session config + start */}
              <div className="lg:col-span-5">
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
                  <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-3 text-[11px] text-neutral-500`}>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                      </div>
                      <span>session.config</span>
                    </div>
                    <span className={`flex items-center gap-1.5 ${isReady ? 'text-emerald-400' : 'text-neutral-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'animate-pulse bg-emerald-400' : 'bg-neutral-700'}`} />
                      {isReady ? 'ready' : 'idle'}
                    </span>
                  </div>

                  <div className={`${MONO} flex-1 space-y-1 p-5 text-[12px] leading-6`}>
                    <p className="break-all">
                      <span className="text-emerald-400">~/prep</span> <span className="text-neutral-500">$</span>{' '}
                      <span className="text-neutral-100">careerforge practice</span>{' '}
                      <span className={interviewType ? 'text-neutral-300' : 'text-neutral-600'}>--type {cmdType}</span>
                      {interviewType === 'Technical' && (
                        <span className={technicalSubject ? 'text-neutral-300' : 'text-amber-300/80'}>
                          {' '}--subject {technicalSubject ? `"${technicalSubject}"` : '<required>'}
                        </span>
                      )}
                    </p>
                    <p className="pt-2 text-neutral-600">
                      type{'    '}
                      <span className={interviewType ? 'text-neutral-200' : 'text-neutral-600'}>
                        {interviewType || 'not selected'}
                      </span>
                    </p>
                    {interviewType === 'Technical' && (
                      <p className="text-neutral-600">
                        subject{' '}
                        <span className={technicalSubject ? 'text-neutral-200' : 'text-amber-300/80'}>
                          {technicalSubject || 'pending'}
                        </span>
                      </p>
                    )}
                    <p className="text-neutral-600">
                      mode{'    '}<span className="text-neutral-400">voice · one question</span>
                    </p>
                    <p className={`pt-2 ${isReady ? 'text-emerald-400' : 'text-neutral-600'}`}>
                      {isReady ? '✓ ready to begin' : '› select an interview type to continue'}
                    </p>
                  </div>

                  <div className="border-t border-white/[0.08] p-4">
                    <button
                      onClick={handleStart}
                      className={`group inline-flex w-full items-center justify-between gap-2 rounded-md px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
                        isReady
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-white/[0.06] text-neutral-400 hover:bg-white/[0.09] hover:text-neutral-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        Start interview
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span
                        className={`${MONO} flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${
                          isReady ? 'border-black/15 text-black/50' : 'border-white/10 text-neutral-600'
                        }`}
                      >
                        <CornerDownLeft size={10} /> run
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ======================= TIP ======================= */}
          <motion.section variants={fadeUp} className="mt-16">
            <div className="flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className={`${MONO} mt-0.5 text-[11px] text-emerald-400`}>tip</span>
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
                  <span className="text-neutral-200">Master before you move.</span> Revisit a concept until every rubric
                  axis (correctness, completeness, depth and clarity) is strong. That's what carries into real
                  interviews.
                </p>
              </div>
              <span className={`${SERIF} shrink-0 text-2xl italic text-neutral-600`}>one at a time.</span>
            </div>
          </motion.section>

          {showPopup && <Popup setShowPopup={setShowPopup} onclose={onclose} handleDoneClick={handleDoneClick} />}
          {showError && <ErrorPop setshowError={setshowError} />}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard