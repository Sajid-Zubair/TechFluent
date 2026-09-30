

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Type tokens                                                         */
/* ------------------------------------------------------------------ */

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const subjects = [
  "data_structures",
  "operating_systems",
  "computer_networks",
  "dbms",
  "oop",
  "hr_behavioural",
  "resume_review",
  "job_discovery",
];

const rubric = [
  { label: "correctness", v: 92 },
  { label: "completeness", v: 86 },
  { label: "depth", v: 88 },
  { label: "clarity", v: 94 },
];

const bar = (v, width = 20) => {
  const filled = Math.round((v / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
};

const LOG = [
  { t: "cmd", text: "careerforge practice --subject operating-systems" },
  { t: "dim", text: "› loading domain model · syllabus-aligned" },
  { t: "q", text: "Q. What is a deadlock? State its four necessary conditions." },
  { t: "rec", text: "● recording answer            00:42" },
  { t: "dim", text: "› transcribing speech → text" },
  { t: "dim", text: "› evaluating against rubric" },
  ...rubric.map((r) => ({ t: "score", ...r })),
  { t: "hint", text: "hint  add a real-world example (dining philosophers)" },
  { t: "ok", text: "✓ concept mastered    +50 xp    streak 12d" },
];

const methodSteps = [
  { title: "Pick a subject", text: "DSA, OS, CN, DBMS or OOP, aligned to your syllabus." },
  { title: "One question", text: "A domain-trained model generates a single focused question." },
  { title: "Answer by voice", text: "Speak naturally. Speech recognition captures everything." },
  { title: "Rubric scoring", text: "Correctness, completeness, technical depth and clarity." },
  { title: "Refine → master", text: "Iterate on feedback until the concept is locked in." },
];

const workflow = [
  { title: "Join your college", text: "Create an account and land on your college leaderboard." },
  { title: "Choose a track", text: "Technical mastery across core subjects, or HR communication." },
  { title: "Master, one by one", text: "Answer, get feedback, refine. Advance only when it's right." },
  { title: "Track & climb", text: "Earn XP, keep your streak, unlock badges, rise in rank." },
];

const leaderboard = [
  { rank: "01", name: "student_a", xp: 4820, streak: 31 },
  { rank: "02", name: "student_b", xp: 4515, streak: 18 },
  { rank: "03", name: "you", xp: 4390, streak: 12, me: true },
  { rank: "04", name: "student_c", xp: 4105, streak: 9 },
  { rank: "05", name: "student_d", xp: 3870, streak: 6 },
];

const faqs = [
  {
    q: "How is this different from mock interview platforms?",
    a: "Mock interview platforms simulate a whole interview and return one score. CareerForge isolates a single concept, evaluates your answer against a rubric, and has you refine it until it's genuinely mastered. The foundation comes first, and the interview performance follows.",
  },
  {
    q: "Which subjects does the Technical module cover?",
    a: "Data Structures, Operating Systems, Computer Networks, Database Management Systems and Object-Oriented Programming. Questions are grounded in university syllabi, textbooks and real interview datasets.",
  },
  {
    q: "Do I need to answer with my voice?",
    a: "Voice is recommended because it mirrors a real interview and lets us assess communication, confidence and clarity. Your speech is transcribed to text for evaluation.",
  },
  {
    q: "What's included beyond interview practice?",
    a: "An AI Resume Analyzer (ATS, keywords, formatting, projects), a Job Discovery feed of live internships and roles, an AI Career Assistant, and progress tracking with XP, streaks, badges and leaderboards.",
  },
];

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.15 } };

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function SectionLabel({ index, children }) {
  return (
    <motion.div variants={fadeUp} className={`${MONO} flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
      <span className="text-emerald-400">{index}</span>
      <span>—</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/10" />
    </motion.div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
    >
      {children}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon = ArrowDown }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
    >
      {children}
      <Icon size={16} className="text-neutral-500 transition-colors group-hover:text-white" />
    </button>
  );
}

function Waveform({ bars = 40 }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-10 items-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 0.2 + ((i * 7) % 11) / 13;
        return (
          <motion.span
            key={i}
            className={`w-[2px] rounded-full ${i % 9 === 0 ? "bg-emerald-400" : "bg-neutral-600"}`}
            style={{ height: "100%", originY: 0.5 }}
            animate={reduce ? { scaleY: h * 0.6 } : { scaleY: [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.035, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero terminal                                                       */
/* ------------------------------------------------------------------ */

function Terminal() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? LOG.length : 1);
  const done = count >= LOG.length;

  useEffect(() => {
    if (reduce) return;
    const delay = done ? 3400 : count === 3 ? 1100 : 380;
    const t = setTimeout(() => setCount(done ? 1 : count + 1), delay);
    return () => clearTimeout(t);
  }, [count, done, reduce]);

  const render = (line) => {
    switch (line.t) {
      case "cmd":
        return (
          <>
            <span className="text-emerald-400">~/prep</span> <span className="text-neutral-500">$</span>{" "}
            <span className="text-neutral-100">{line.text}</span>
          </>
        );
      case "q":
        return <span className="text-neutral-100">{line.text}</span>;
      case "rec":
        return <span className="text-rose-400">{line.text}</span>;
      case "score":
        return (
          <span className="text-neutral-400">
            {"  "}
            {line.label.padEnd(13)}
            <span className="text-emerald-400">{bar(line.v)}</span> <span className="text-neutral-100">{line.v}</span>
          </span>
        );
      case "hint":
        return <span className="text-amber-300/90">{"  "}{line.text}</span>;
      case "ok":
        return <span className="font-semibold text-emerald-400">{line.text}</span>;
      default:
        return <span className="text-neutral-500">{line.text}</span>;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/15 to-white/0" />
      <div className="relative overflow-hidden rounded-xl bg-[#0d0d0d] shadow-2xl shadow-black/60">
        {/* chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          </div>
          <span className={`${MONO} text-[11px] text-neutral-500`}>session.log — careerforge</span>
          <span className={`${MONO} flex items-center gap-1.5 text-[11px] text-emerald-400`}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> live
          </span>
        </div>

        {/* body */}
        <div className={`${MONO} min-h-[380px] overflow-x-auto p-5 text-[12px] leading-6 md:text-[13px]`}>
          {LOG.slice(0, count).map((line, i) => (
            <motion.div
              key={`${i}-${count > i}`}
              initial={reduce ? false : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`whitespace-pre ${line.t === "q" ? "my-2 whitespace-normal" : ""}`}
            >
              {render(line)}
              {i === count - 1 && !done && (
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-neutral-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Module cells                                                        */
/* ------------------------------------------------------------------ */

function Module({ id, title, text, children, className = "" }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`group relative border-b border-r border-white/[0.08] p-7 transition-colors hover:bg-white/[0.02] md:p-8 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className={`${MONO} text-[11px] uppercase tracking-[0.18em] text-neutral-500`}>{id}</span>
        <ArrowUpRight size={16} className="text-neutral-700 transition-colors group-hover:text-emerald-400" />
      </div>
      <h3 className="mt-6 text-lg font-medium text-neutral-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

function JobFeed() {
  const reduce = useReducedMotion();
  const jobs = [
    ["sde_intern", "remote", "6mo"],
    ["frontend_intern", "hybrid", "3mo"],
    ["data_analyst_intern", "onsite", "6mo"],
    ["backend_developer", "onsite", "full-time"],
    ["ml_engineer_intern", "remote", "4mo"],
  ];
  const list = [...jobs, ...jobs];
  return (
    <div className="relative h-[108px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
      <motion.div
        animate={reduce ? {} : { y: ["0%", "-50%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className={`${MONO} space-y-1.5 text-[11px]`}
      >
        {list.map(([role, mode, dur], i) => (
          <div key={i} className="flex justify-between border-b border-dashed border-white/[0.06] pb-1.5">
            <span className="text-neutral-300">{role}</span>
            <span className="text-neutral-500">
              {mode} · {dur}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Heatmap                                                             */
/* ------------------------------------------------------------------ */

function Heatmap() {
  const cols = 30;
  const rows = 7;
  const shades = ["bg-white/[0.04]", "bg-emerald-950", "bg-emerald-800", "bg-emerald-600", "bg-emerald-400"];
  return (
    <div className="grid w-max grid-flow-col gap-[3px]" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const col = Math.floor(i / rows);
        const level = col >= cols - 2 ? 3 + (i % 2) : (i * 37 + col * 13) % 5;
        return (
          <motion.span
            key={i}
            className={`h-[11px] w-[11px] rounded-[2px] ${shades[level]}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: col * 0.025, duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function FaqRow({ q, a, open, onToggle, index }) {
  return (
    <motion.div variants={fadeUp} className="border-b border-white/[0.08]">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-6 py-6 text-left">
        <span className={`${MONO} pt-1 text-[11px] text-neutral-600`}>{String(index + 1).padStart(2, "0")}</span>
        <span className="flex-1 text-lg text-neutral-100">{q}</span>
        <span className={`${MONO} pt-0.5 text-lg text-neutral-500`}>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 pl-[42px] leading-relaxed text-neutral-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function LandingPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="overflow-x-hidden bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30 selection:text-white">
      {/* ============================== HERO ============================== */}
      <section id="home" className="relative border-b border-white/[0.08]">
        {/* grid lines */}
        <div
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />

        <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20">
          {/* meta row */}
          <motion.div
            variants={fadeUp}
            className={`${MONO} flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-5 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}
          >
            <span>
              <span className="text-emerald-400">●</span>&nbsp; CareerForge / Mastery-based placement prep
            </span>
            <span className="hidden md:inline">Campus → Career</span>
          </motion.div>

          {/* headline */}
          <motion.h1
            variants={fadeUp}
            className={`${SERIF} mt-12 text-[3.25rem] leading-[0.95] tracking-[-0.02em] text-neutral-50 sm:text-7xl lg:text-[7.5rem]`}
          >
            Master the concept.
            <br />
            <em className="text-neutral-500">Then</em> the interview.
          </motion.h1>

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <p className="max-w-md text-lg leading-relaxed text-neutral-400">
                CareerForge trains you <span className="text-neutral-100">one technical question at a time</span>. A
                domain-trained model generates a syllabus-aligned question, evaluates your spoken answer on
                correctness, completeness, depth and clarity, and moves you forward only when you've mastered it.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton onClick={() => navigate("/signup")}>Start practicing</PrimaryButton>
                <GhostButton onClick={() => scrollTo("aboutSection")}>Read the method</GhostButton>
              </div>

              <dl className={`${MONO} mt-12 grid grid-cols-3 border-t border-white/[0.08] pt-6 text-[11px] uppercase tracking-[0.15em]`}>
                {[
                  ["5", "core subjects"],
                  ["4", "rubric axes"],
                  ["1", "question at a time"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className={`${SERIF} text-4xl normal-case tracking-normal text-neutral-100`}>{n}</dt>
                    <dd className="mt-1 text-neutral-500">{l}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="lg:col-span-7"
            >
              <Terminal />
            </motion.div>
          </div>
        </motion.div>

        {/* subject marquee */}
        <div className="relative overflow-hidden border-t border-white/[0.08] py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className={`${MONO} flex w-max gap-10 text-xs text-neutral-500`}
            animate={reduce ? {} : { x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...subjects, ...subjects].map((s, i) => (
              <span key={i} className="flex items-center gap-10">
                {s}
                <span className="text-neutral-700">/</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ 01 METHOD ============================ */}
      <motion.section id="aboutSection" {...inView} variants={stagger} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionLabel index="01">The Method</SectionLabel>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <motion.h2 variants={fadeUp} className={`${SERIF} text-5xl leading-[1.02] tracking-[-0.01em] text-neutral-50 md:text-6xl lg:col-span-5`}>
            Mock interviews measure you. <em className="text-emerald-400">We make you better</em> before they do.
          </motion.h2>

          <motion.div variants={fadeUp} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-relaxed text-neutral-400">
              Existing platforms simulate a full interview and hand back a single number. Weak concepts get
              skipped, and progress stalls. CareerForge inverts the model:{" "}
              <span className="text-neutral-100">isolate one concept, evaluate it rigorously, refine until it's right.</span>{" "}
              Strong fundamentals compound into strong interviews.
            </p>

            {/* diff */}
            <div className="mt-10 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
              <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
                <span>mock-interview.md → careerforge.md</span>
                <span>
                  <span className="text-rose-400">−3</span> <span className="text-emerald-400">+3</span>
                </span>
              </div>
              <div className={`${MONO} text-[12.5px] leading-7`}>
                {[
                  ["-", "10 random questions in one sitting"],
                  ["-", "a single score at the end"],
                  ["-", "weak concepts quietly skipped"],
                  ["+", "one curriculum-aligned question per concept"],
                  ["+", "rubric feedback: correctness · completeness · depth · clarity"],
                  ["+", "refine until mastered, then move on"],
                ].map(([sign, text], i) => (
                  <div
                    key={i}
                    className={`flex gap-4 px-4 ${
                      sign === "-" ? "bg-rose-500/[0.06] text-rose-300/80" : "bg-emerald-500/[0.06] text-emerald-300"
                    }`}
                  >
                    <span className="w-4 select-none text-neutral-600">{i + 1}</span>
                    <span className="select-none">{sign}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* loop */}
        <div className="mt-24 grid border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-5">
          {methodSteps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="relative border-b border-white/[0.08] py-8 pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className={`${MONO} text-[11px] text-emerald-400`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-medium text-neutral-100">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{s.text}</p>
              {i < methodSteps.length - 1 && (
                <span className={`${MONO} absolute -right-[7px] top-8 hidden bg-[#0a0a0a] text-xs text-neutral-600 lg:block`}>→</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* =========================== 02 PLATFORM =========================== */}
      <section className="border-y border-white/[0.08] bg-[#0c0c0c]">
        <motion.div {...inView} variants={stagger} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <SectionLabel index="02">The Platform</SectionLabel>

          <div className="mt-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <motion.h2 variants={fadeUp} className={`${SERIF} max-w-2xl text-5xl leading-[1.02] text-neutral-50 md:text-6xl`}>
              Six modules. <em className="text-neutral-500">One</em> placement journey.
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-sm text-neutral-400">
              From your first concept to your first offer: practice, feedback, resume, roles and a mentor, all in one
              place.
            </motion.p>
          </div>

          <div className="mt-16 grid border-l border-t border-white/[0.08] md:grid-cols-2 lg:grid-cols-3">
            <Module id="mod_01 / technical" title="Technical Interview Mastery" text="A domain model trained on syllabi, textbooks and interview datasets asks one question and grades it like a senior engineer.">
              <pre className={`${MONO} text-[11px] leading-5 text-neutral-500`}>
                {rubric.map((r) => (
                  <div key={r.label}>
                    {r.label.padEnd(13)}
                    <span className="text-emerald-400">{bar(r.v, 12)}</span> <span className="text-neutral-300">{r.v}</span>
                  </div>
                ))}
              </pre>
            </Module>

            <Module id="mod_02 / hr" title="HR Interview Coach" text="Behavioural and situational questions, answered by voice and scored on confidence, clarity, grammar and professionalism.">
              <Waveform />
              <p className={`${MONO} mt-3 text-[11px] text-neutral-500`}>
                confidence <span className="text-neutral-300">0.84</span> · clarity <span className="text-neutral-300">0.91</span> · pace{" "}
                <span className="text-emerald-400">ok</span>
              </p>
            </Module>

            <Module id="mod_03 / resume" title="AI Resume Analyzer" text="ATS compatibility, keyword optimisation, formatting and project presentation, with line-level suggestions.">
              <div className={`${MONO} text-[11px]`}>
                <div className="flex justify-between text-neutral-500">
                  <span>ats_score</span>
                  <span className="text-neutral-200">78 / 100</span>
                </div>
                <div className="mt-2 h-[3px] bg-white/[0.06]">
                  <motion.div
                    className="h-full bg-emerald-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="text-emerald-400">+ react</span>
                  <span className="text-emerald-400">+ sql</span>
                  <span className="text-rose-400">− docker</span>
                  <span className="text-rose-400">− metrics</span>
                </div>
              </div>
            </Module>

            <Module id="mod_04 / jobs" title="Job Discovery" text="Live internships and roles from leading recruitment platforms, surfaced right inside the app.">
              <JobFeed />
            </Module>

            <Module id="mod_05 / assistant" title="AI Career Assistant" text="An always-on mentor for concepts, prep strategy, resume building and career planning.">
              <div className={`${MONO} space-y-2 text-[11px] leading-5`}>
                <p className="text-neutral-300">
                  <span className="text-emerald-400">›</span> how should I prep OS in 2 weeks?
                </p>
                <p className="text-neutral-500">
                  ← start with processes &amp; scheduling, then deadlocks and memory. I'll draft a daily plan.
                </p>
              </div>
            </Module>

            <Module id="mod_06 / progress" title="Gamified Progress" text="XP, streaks, badges, leaderboards and analytics that keep your preparation consistent.">
              <div className={`${MONO} grid grid-cols-3 gap-3 text-[11px]`}>
                {[
                  ["xp", "4,390"],
                  ["streak", "12d"],
                  ["badges", "7/24"],
                ].map(([k, v]) => (
                  <div key={k} className="border-l border-white/10 pl-3">
                    <p className="text-neutral-500">{k}</p>
                    <p className="mt-1 text-sm text-neutral-100">{v}</p>
                  </div>
                ))}
              </div>
            </Module>
          </div>
        </motion.div>
      </section>

      {/* =========================== 03 WORKFLOW =========================== */}
      <motion.section {...inView} variants={stagger} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div id="resourcesSection" />
        <SectionLabel index="03">Workflow</SectionLabel>

        <motion.h2 variants={fadeUp} className={`${SERIF} mt-14 max-w-3xl text-5xl leading-[1.02] text-neutral-50 md:text-6xl`}>
          From sign-up to <em className="text-emerald-400">placement-ready</em>, in four steps.
        </motion.h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] md:grid-cols-4">
          {workflow.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="bg-[#0a0a0a] p-8">
              <span className={`${SERIF} text-7xl leading-none text-neutral-700`}>{i + 1}</span>
              <h3 className="mt-8 font-medium text-neutral-100">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* =========================== 04 PROGRESS =========================== */}
      <section className="border-y border-white/[0.08] bg-[#0c0c0c]">
        <motion.div {...inView} variants={stagger} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <SectionLabel index="04">Progress</SectionLabel>

          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <h2 className={`${SERIF} text-5xl leading-[1.02] text-neutral-50 md:text-6xl`}>
                Consistency, <em className="text-neutral-500">made visible.</em>
              </h2>
              <p className="mt-6 leading-relaxed text-neutral-400">
                Every mastered concept earns XP. Daily practice builds your streak. Milestones unlock badges. Your
                college leaderboard keeps the momentum honest.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6 lg:col-span-8">
              {/* heatmap */}
              <div className="rounded-lg border border-white/[0.08] bg-[#0a0a0a] p-6">
                <div className={`${MONO} mb-5 flex items-center justify-between text-[11px] text-neutral-500`}>
                  <span>activity · last 30 weeks</span>
                  <span className="text-emerald-400">streak 12d</span>
                </div>
                <div className="overflow-x-auto pb-1">
                  <Heatmap />
                </div>
                <div className={`${MONO} mt-4 flex items-center justify-end gap-1.5 text-[10px] text-neutral-600`}>
                  less
                  {["bg-white/[0.04]", "bg-emerald-950", "bg-emerald-800", "bg-emerald-600", "bg-emerald-400"].map((c) => (
                    <span key={c} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
                  ))}
                  more
                </div>
              </div>

              {/* leaderboard */}
              <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0a]">
                <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-6 py-3 text-[11px] text-neutral-500`}>
                  <span>leaderboard · your_college</span>
                  <span>preview</span>
                </div>
                <table className={`${MONO} w-full text-left text-[12px]`}>
                  <thead className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">
                    <tr>
                      <th className="px-6 py-3 font-normal">rank</th>
                      <th className="px-6 py-3 font-normal">user</th>
                      <th className="px-6 py-3 text-right font-normal">xp</th>
                      <th className="hidden px-6 py-3 text-right font-normal sm:table-cell">streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((p) => (
                      <tr
                        key={p.rank}
                        className={`border-t border-white/[0.05] ${p.me ? "bg-emerald-400/[0.06] text-emerald-300" : "text-neutral-400"}`}
                      >
                        <td className="px-6 py-3">{p.rank}</td>
                        <td className="px-6 py-3">
                          {p.name}
                          {p.me && <span className="ml-2 text-[10px] text-emerald-500">← you</span>}
                        </td>
                        <td className="px-6 py-3 text-right">{p.xp.toLocaleString()}</td>
                        <td className="hidden px-6 py-3 text-right sm:table-cell">{p.streak}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============================== 05 FAQ ============================== */}
      <motion.section {...inView} variants={stagger} className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionLabel index="05">Questions</SectionLabel>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <motion.h2 variants={fadeUp} className={`${SERIF} text-5xl leading-[1.02] text-neutral-50 md:text-6xl lg:col-span-4`}>
            Frequently <em className="text-neutral-500">asked.</em>
          </motion.h2>
          <div className="border-t border-white/[0.08] lg:col-span-8">
            {faqs.map((f, i) => (
              <FaqRow key={f.q} {...f} index={i} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="relative overflow-hidden border-t border-white/[0.08]">
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[360px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36"
        >
          <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
            <span className="text-emerald-400">$</span> careerforge start
            <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-neutral-400" />
          </p>
          <h2 className={`${SERIF} mt-8 text-5xl leading-[0.98] tracking-[-0.02em] text-neutral-50 md:text-8xl`}>
            One question. <em className="text-emerald-400">Mastered.</em>
            <br />
            Then the next.
          </h2>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton onClick={() => navigate("/signup")}>Create free account</PrimaryButton>
            <GhostButton onClick={() => navigate("/login")} icon={ArrowUpRight}>
              Sign in
            </GhostButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage;