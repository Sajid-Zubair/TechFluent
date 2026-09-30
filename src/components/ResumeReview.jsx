


import React, { useEffect, useRef, useState } from 'react';
import Sidenav from './Sidenav';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import { remarkPlugins, mdComponents } from './markdown';
import {
  Menu,
  X,
  UploadCloud,
  FileText,
  Trash2,
  ScanLine,
  Lightbulb,
  Layers,
  Zap,
  LayoutTemplate,
  Cpu,
  ChevronDown,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const ease = [0.22, 1, 0.36, 1];

const MD =
  'max-w-none text-[15px] leading-relaxed text-neutral-300 ' +
  '[&_a]:text-emerald-400 [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1 [&_code]:text-emerald-300 ' +
  '[&_li]:my-1 [&_li::marker]:text-neutral-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2 ' +
  '[&_strong]:font-semibold [&_strong]:text-neutral-100';

const SCAN_STEPS = [
  'extracting text from document',
  'parsing sections & experience',
  'evaluating skills and projects',
  'checking action verbs & impact',
  'scanning ATS keywords',
  'computing readiness score',
];

const CATEGORIES = [
  { key: 'content_skills', title: 'Content & Skills', icon: Layers },
  { key: 'clarity_impact', title: 'Clarity & Impact', icon: Zap },
  { key: 'formatting_readability', title: 'Formatting & Readability', icon: LayoutTemplate },
  { key: 'ats_compatibility', title: 'ATS Compatibility', icon: Cpu },
];

const formatSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

function ResumeReview() {
  const [file, setFile] = useState(null);
  const [answer, setAnswer] = useState(null); // Can be string or object
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // UI-only state
  const [dragging, setDragging] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please upload your resume first.');
      return;
    }
    setLoading(true);
    setAnswer(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${BASE_URL}/api/resume_analyzer/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Data from backend:", data);

      // Store as-is; could be JSON object or markdown string
      setAnswer(data.analysis || data || 'No feedback received.');
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setAnswer('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isStructured = answer && typeof answer === "object" && !Array.isArray(answer);

  // UI-only: cycle scan log while loading
  useEffect(() => {
    if (!loading) return;
    setScanStep(0);
    const id = setInterval(() => setScanStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)), 1600);
    return () => clearInterval(id);
  }, [loading]);

  /* ---------------- display-only derived values ---------------- */
  const isError = isStructured && answer.error;
  const score = isStructured && typeof answer.final_score === 'number' ? Math.max(0, Math.min(10, answer.final_score)) : null;
  const verdict =
    score === null ? null
      : score >= 8 ? { label: 'Interview-ready', tone: 'text-emerald-400', ring: '#34d399', note: 'Strong resume. Polish the details below and start applying.' }
      : score >= 6 ? { label: 'Almost there', tone: 'text-amber-300', ring: '#fcd34d', note: 'Solid base. A few targeted fixes will make it stand out.' }
      : { label: 'Needs work', tone: 'text-rose-400', ring: '#fb7185', note: 'Address the priority fixes below before applying widely.' };

  const R = 52;
  const C = 2 * Math.PI * R;

  const copyReport = async () => {
    if (!isStructured) return;
    const text = [
      `Final score: ${answer.final_score}/10`,
      `\nOverall impression:\n${answer.overall_impression || ''}`,
      ...CATEGORIES.map((c) => `\n${c.title}:\n${answer[c.key] || ''}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30">
      {/* Sidenav for Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidenav />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0a0a0a]/85 px-4 backdrop-blur-xl">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <span className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
          <span className="text-emerald-400">●</span>&nbsp; resume
        </span>
        <span className="w-9" />
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed left-0 top-0 z-[60] h-full w-64 border-r border-white/[0.08] bg-[#0d0d0d] shadow-2xl shadow-black/60">
          <Sidenav />
          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="absolute right-3 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className={`relative flex-1 overflow-hidden transition-opacity duration-300 ${mobileNavOpen ? 'pointer-events-none opacity-30' : ''}`}>
        {/* ambient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 right-10 h-[380px] w-[620px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-24 sm:px-8 md:pt-12">
          {/* ======================= HEADER ======================= */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="border-b border-white/[0.08] pb-10"
          >
            <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">~/</span>resume &nbsp;·&nbsp; ai review
            </p>
            <h1 className={`${SERIF} mt-5 text-5xl leading-[1] tracking-[-0.02em] text-neutral-50 md:text-6xl`}>
              Make your resume <em className="text-emerald-400">recruiter-ready.</em>
            </h1>
            <p className="mt-3 max-w-xl text-neutral-400">
              Get a readiness score plus specific feedback on content, impact, formatting and ATS compatibility.
            </p>
          </motion.header>

          {/* ======================= UPLOAD ======================= */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="mt-10"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]">
              <label
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`relative m-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center transition-colors ${
                  dragging
                    ? 'border-emerald-400/60 bg-emerald-400/[0.05]'
                    : 'border-white/[0.12] hover:border-white/25 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="sr-only"
                />
                <span className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${
                  dragging ? 'border-emerald-400/50 text-emerald-400' : 'border-white/10 text-neutral-400'
                }`}>
                  <UploadCloud size={24} />
                </span>
                <p className="mt-4 text-neutral-200">
                  <span className="font-medium text-white underline decoration-white/20 underline-offset-4">Choose a file</span> or drag it here
                </p>
                <p className={`${MONO} mt-1.5 text-[11px] text-neutral-600`}>pdf · docx &nbsp;—&nbsp; one resume at a time</p>
              </label>

              {/* selected file + action */}
              <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-emerald-400">
                        <FileText size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-neutral-100">{file.name}</p>
                        <p className={`${MONO} text-[10px] text-neutral-500`}>
                          {formatSize(file.size)} · {(file.name.split('.').pop() || '').toLowerCase()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ''; }}
                        aria-label="Remove file"
                        className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded text-neutral-600 transition-colors hover:bg-white/[0.05] hover:text-rose-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${MONO} text-[11px] text-neutral-600`}>
                      no file selected
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-neutral-500"
                >
                  <ScanLine size={15} />
                  {loading ? 'Analyzing…' : 'Analyze resume'}
                </button>
              </div>
            </div>
          </motion.section>

          {/* ======================= LOADING ======================= */}
          <AnimatePresence>
            {loading && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 grid gap-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-6 md:grid-cols-[180px_1fr]"
              >
                {/* scanning document */}
                <div className="relative mx-auto h-[220px] w-[160px] overflow-hidden rounded-md border border-white/10 bg-white/[0.02] p-4">
                  {[70, 45, 90, 80, 60, 85, 40, 75, 65, 88, 50, 72].map((w, i) => (
                    <div key={i} className={`mb-2.5 h-1.5 rounded-full ${i === 0 ? 'bg-white/20' : 'bg-white/[0.07]'}`} style={{ width: `${w}%` }} />
                  ))}
                  <motion.div
                    className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent"
                    animate={{ top: ['-15%', '100%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                </div>

                {/* scan log */}
                <div className={`${MONO} flex flex-col justify-center text-[12px] leading-7`}>
                  <p className="mb-2 text-neutral-500">
                    <span className="text-emerald-400">~/resume</span> $ <span className="text-neutral-200">careerforge review {file?.name}</span>
                  </p>
                  {SCAN_STEPS.map((s, i) => (
                    <p
                      key={s}
                      className={`transition-colors duration-300 ${
                        i < scanStep ? 'text-neutral-500' : i === scanStep ? 'text-neutral-100' : 'text-neutral-800'
                      }`}
                    >
                      {i < scanStep ? <span className="text-emerald-400">✓</span> : i === scanStep ? <span className="text-amber-300">›</span> : '·'} {s}
                      {i === scanStep && <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-neutral-300" />}
                    </p>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ======================= RESULTS ======================= */}
          {!loading && answer && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className={`${MONO} flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
                <span className="text-emerald-400">01</span>
                <span>—</span>
                <span>Resume analysis</span>
                <span className="h-px flex-1 bg-white/[0.08]" />
                {isStructured && !isError && (
                  <div className="flex gap-2 normal-case tracking-normal">
                    <button
                      onClick={copyReport}
                      className="flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
                    >
                      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      {copied ? 'copied' : 'copy report'}
                    </button>
                    <button
                      onClick={() => { setAnswer(null); setFile(null); if (inputRef.current) inputRef.current.value = ''; }}
                      className="flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
                    >
                      <RotateCcw size={11} /> new review
                    </button>
                  </div>
                )}
              </div>

              {isError ? (
                <div className="mt-6 flex items-start gap-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-6">
                  <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-400" />
                  <div>
                    <p className="font-medium text-rose-300">{answer.error}</p>
                    {answer.details && <p className={`${MONO} mt-2 text-[11px] text-rose-300/60`}>{answer.details}</p>}
                  </div>
                </div>
              ) : isStructured ? (
                <div className="mt-6 space-y-6">
                  {/* score + overall */}
                  <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-[260px_1fr]">
                    {answer.final_score !== undefined && score !== null && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center justify-center bg-[#0d0d0d] p-8"
                      >
                        <div className="relative h-[140px] w-[140px]">
                          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                            <circle cx="60" cy="60" r={R} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                            <motion.circle
                              cx="60" cy="60" r={R}
                              stroke={verdict.ring}
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={C}
                              initial={{ strokeDashoffset: C }}
                              animate={{ strokeDashoffset: C * (1 - score / 10) }}
                              transition={{ duration: 1.4, ease, delay: 0.2 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`${SERIF} text-5xl leading-none text-neutral-50`}>{answer.final_score}</span>
                            <span className={`${MONO} mt-1 text-[10px] text-neutral-500`}>/ 10</span>
                          </div>
                        </div>
                        <p className={`${MONO} mt-5 text-[11px] uppercase tracking-[0.2em] ${verdict.tone}`}>{verdict.label}</p>
                        <p className="mt-2 max-w-[200px] text-center text-xs leading-relaxed text-neutral-500">{verdict.note}</p>
                      </motion.div>
                    )}

                    {answer.overall_impression && (
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-[#0d0d0d] p-6 md:p-8"
                      >
                        <p className={`${MONO} flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>
                          <Lightbulb size={12} className="text-emerald-400" /> overall impression
                        </p>
                        <div className={`${MD} mt-3 text-base md:text-[17px] [&_p]:text-neutral-200`}>
                          <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{answer.overall_impression}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* categories */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {CATEGORIES.map((c, i) =>
                      answer[c.key] ? (
                        <Section
                          key={c.key}
                          index={i + 1}
                          icon={c.icon}
                          title={c.title}
                          content={answer[c.key]}
                          delay={0.2 + i * 0.08}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-6">
                  <div className={MD}>
                    <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{String(answer)}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ index, icon: Icon, title, content, delay }) {
  const [open, setOpen] = useState(false);
  const long = String(content).length > 420;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d] transition-colors hover:border-white/15"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors group-hover:border-emerald-400/40 group-hover:text-emerald-400">
            <Icon size={15} />
          </span>
          <span className="font-medium text-neutral-100">{title}</span>
        </span>
        <span className={`${MONO} text-[10px] text-neutral-600`}>{String(index).padStart(2, '0')}</span>
      </div>

      <div className="relative flex-1 px-5 py-4">
        <div className={`${MD} ${long && !open ? 'max-h-[180px] overflow-hidden' : ''}`}>
          <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{content}</ReactMarkdown>
        </div>
        {long && !open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        )}
      </div>

      {long && (
        <button
          onClick={() => setOpen((o) => !o)}
          className={`${MONO} flex items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-[11px] text-neutral-500 transition-colors hover:text-neutral-200`}
        >
          {open ? 'show less' : 'read more'}
          <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    </motion.article>
  );
}

export default ResumeReview;