


import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CoachFeedback from './CoachFeedback';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mic,
  Square,
  RotateCcw,
  Check,
  ArrowRight,
  X,
  Loader2,
  Cpu,
  MessageSquare,
  Sparkles,
} from 'lucide-react';


const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const ease = [0.22, 1, 0.36, 1];

// Display-only threshold used for the mastery banner
const MASTERY = 8;

function Waveform({ active }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-12 items-center justify-center gap-[3px]">
      {Array.from({ length: 48 }).map((_, i) => {
        const h = 0.18 + ((i * 7) % 11) / 13;
        return (
          <motion.span
            key={i}
            className={`w-[2px] rounded-full ${active ? (i % 8 === 0 ? 'bg-rose-400' : 'bg-neutral-400') : 'bg-neutral-700'}`}
            style={{ height: '100%', originY: 0.5 }}
            animate={
              active && !reduce
                ? { scaleY: [h * 0.25, h, h * 0.45, h * 0.85, h * 0.25] }
                : { scaleY: 0.08 }
            }
            transition={{ duration: 1.1, repeat: active ? Infinity : 0, delay: i * 0.025, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

function Interview() {
  const { state } = useLocation();
  const { type, subject } = state || {};
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [rating, setRating] = useState('');
  const [prevRating, SetPrevRating] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // UI-only state
  const [seconds, setSeconds] = useState(0);
  const [questionNo, setQuestionNo] = useState(1);
  const [attemptNo, setAttemptNo] = useState(1);

  const fetchQuestion = async () => {
    setStatus('Fetching question...');
    setStatusColor('black');
    try {
      let url = `${BASE_URL}/api/get_question?type=${type}`;
      if (type === 'Technical') url += `&subject=${subject}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.question) {
        setQuestion(data.question);
        setStatus('');
      } else {
        setStatus('No question received from server');
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [type, subject]);

  useEffect(() => {
    if (prevRating && rating) {
      const prevAvg = averageRating(prevRating);
      const currAvg = averageRating(rating);
      if (currAvg > prevAvg) {
        setStatus('Great! You improved 👏');
        setStatusColor('green');
      } else if (currAvg < prevAvg) {
        setStatus('You did slightly worse. Try again!');
        setStatusColor('red');
      } else {
        setStatus('Consistent performance! Let’s push for better.');
        setStatusColor('blue');
      }
    }
  }, [rating]);

  // UI-only: recording timer
  useEffect(() => {
    if (!recording) return;
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const averageRating = (ratingObj) => {
    const values = Object.values(ratingObj).map(val => parseFloat(val));
    const validValues = values.filter(val => !isNaN(val));
    return validValues.reduce((a, b) => a + b, 0) / validValues.length;
  };

  const handleRetry = () => {
    SetPrevRating(rating);
    setTranscription('');
    setFeedback('');
    setRating('');
    setStatus('');
    setRecording(false);
    chunksRef.current = [];
  };

  const handleNext = () => {
    SetPrevRating(rating);
    setTranscription('');
    setFeedback('');
    setRating('');
    setStatus('');
    setRecording(false);
    chunksRef.current = [];
    fetchQuestion();
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('interview_type', type);
        formData.append('subject', subject || '');
        setStatus('Transcribing...');
        setStatusColor('black');
        try {
          const res = await fetch(`${BASE_URL}/api/process_audio/`, {
            method: 'POST',
            body: formData
          });
          const text = await res.text();
          if (!res.ok) {
            setStatus(`Error ${res.status}: ${text}`);
            return;
          }
          const data = JSON.parse(text);
          setTranscription(data.transcription || '');
          setFeedback(data.feedback || '');
          setRating(data.rating || '');
          setStatus('Done!');
        } catch (err) {
          setStatus('Error parsing server response.');
        }
      };
      mediaRecorder.start();
      setRecording(true);
      setStatus('Recording...');
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStatus('Stopped.');
    }
  };

  const normalizeRatings = (currentRating, prevRating, alpha = 0.4) => {
    const normalized = {};
    const maxScore = 10;
    ['fluency', 'content_structure', 'accuracy', 'grammar', 'vocabulary', 'coherence'].forEach(metric => {
      const curr = parseFloat(currentRating[metric]) || 0;
      const prev = prevRating ? (parseFloat(prevRating[metric]) || 0) : 0;
      const norm = ((curr + alpha * prev) / (1 + alpha));
      normalized[metric] = Math.round(norm * 100) / 100;
    });
    const overall = Object.values(normalized).reduce((a, b) => a + b, 0) / Object.values(normalized).length;
    return { normalized, overall: Math.round(overall * 100) / 100 };
  };
  
  const handleSaveAndProceed = async (action) => {
    if (rating) {
      const { normalized, overall } = normalizeRatings(rating, prevRating);
      const payload = {
        interview_type: type,
        normalized_ratings: normalized,
        overall_rating: overall,
      };
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setStatus('You must be logged in to save ratings.');
          return;
        }
        const res = await fetch(`${BASE_URL}/api/save_rating/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }
      } catch (err) {
        console.error('Failed to save rating:', err);
      }
    }
    if (action === 'next') handleNext();
    else if (action === 'done') navigate('/dashboard');
  };

  /* ---------------- display-only derived values ---------------- */
  const inReview = Boolean(transcription || feedback);
  const processing = status === 'Transcribing...';
  const loadingQuestion = status === 'Fetching question...';
  const phase = inReview ? 3 : processing ? 2 : recording ? 1 : 0;
  const phases = ['Question', 'Record', 'Evaluate', 'Review'];
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const isError = /^(Error|No question|You must)/.test(status);
  const statusTone = isError
    ? 'text-rose-400'
    : statusColor === 'green'
    ? 'text-emerald-400'
    : statusColor === 'red'
    ? 'text-rose-400'
    : statusColor === 'blue'
    ? 'text-sky-400'
    : 'text-neutral-400';

  const avg = rating ? averageRating(rating) : null;
  const mastered = avg !== null && avg >= MASTERY;
  const TypeIcon = type === 'Technical' ? Cpu : MessageSquare;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30">
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className={`pointer-events-none absolute left-1/2 top-24 h-[380px] w-[680px] -translate-x-1/2 rounded-full blur-[120px] transition-colors duration-700 ${
          recording ? 'bg-rose-500/[0.08]' : mastered ? 'bg-emerald-500/[0.10]' : 'bg-emerald-500/[0.05]'
        }`}
      />

      {/* ======================= TOP BAR ======================= */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`${MONO} flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400`}>
              cf
            </span>
            <p className={`${MONO} truncate text-[11px] text-neutral-500`}>
              session <span className="text-neutral-700">/</span>{' '}
              <span className="text-neutral-300">{(type || '—').toLowerCase()}</span>
              {type === 'Technical' && subject && (
                <>
                  {' '}<span className="text-neutral-700">/</span>{' '}
                  <span className="text-emerald-400">{subject}</span>
                </>
              )}
            </p>
          </div>

          {/* phase stepper */}
          <ol className={`${MONO} hidden items-center gap-1 text-[10px] uppercase tracking-[0.15em] md:flex`}>
            {phases.map((p, i) => (
              <li key={p} className="flex items-center gap-1">
                <span
                  className={`flex items-center gap-1.5 rounded px-2 py-1 transition-colors ${
                    i === phase
                      ? 'bg-white/[0.06] text-neutral-100'
                      : i < phase
                      ? 'text-emerald-400/80'
                      : 'text-neutral-600'
                  }`}
                >
                  {i < phase ? <Check size={10} /> : <span>{String(i + 1).padStart(2, '0')}</span>}
                  {p}
                </span>
                {i < phases.length - 1 && <span className="text-neutral-800">—</span>}
              </li>
            ))}
          </ol>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
          >
            <X size={13} /> Exit
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-5 pb-40 pt-12 md:pt-16">
        {/* ======================= QUESTION ======================= */}
        <div className={`${MONO} flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
          <span className="text-emerald-400">Q.{String(questionNo).padStart(2, '0')}</span>
          <span className="flex items-center gap-1.5">
            <TypeIcon size={12} /> {type || 'Interview'}
          </span>
          <span className="h-px flex-1 bg-white/[0.08]" />
          <span className="normal-case tracking-normal text-neutral-600">attempt {attemptNo}</span>
        </div>

        <div className="mt-6 min-h-[120px]">
          <AnimatePresence mode="wait">
            {question ? (
              <motion.h1
                key={question}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease }}
                className={`${SERIF} text-[2.1rem] leading-[1.12] tracking-[-0.01em] text-neutral-50 md:text-5xl`}
              >
                {question}
              </motion.h1>
            ) : (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="h-9 w-full animate-pulse rounded bg-white/[0.05]" />
                <div className="h-9 w-4/5 animate-pulse rounded bg-white/[0.05]" />
                {!loadingQuestion && status && (
                  <p className={`${MONO} pt-2 text-[12px] text-rose-400`}>✕ {status}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================= RECORDER ======================= */}
        {!transcription && !feedback && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="mt-14 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]"
          >
            <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
              <span>recorder</span>
              <span className={`flex items-center gap-1.5 ${recording ? 'text-rose-400' : processing ? 'text-amber-300' : 'text-neutral-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${recording ? 'animate-pulse bg-rose-400' : processing ? 'animate-pulse bg-amber-300' : 'bg-neutral-700'}`} />
                {recording ? 'rec' : processing ? 'processing' : 'idle'}
              </span>
            </div>

            <div className="flex flex-col items-center px-6 py-10">
              {/* mic button */}
              <div className="relative">
                {recording && (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/20" />
                    <span className="absolute -inset-3 rounded-full border border-rose-500/20" />
                  </>
                )}
                <motion.button
                  onClick={handleRecord}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-label={recording ? 'Stop recording' : 'Start recording'}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full border transition-colors duration-300 ${
                    recording
                      ? 'border-rose-400/50 bg-rose-500 text-white shadow-[0_0_60px_-10px_rgba(244,63,94,0.6)]'
                      : processing
                      ? 'border-amber-300/30 bg-white/[0.04] text-amber-300'
                      : 'border-white/15 bg-white text-black shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:bg-neutral-200'
                  }`}
                >
                  {recording ? (
                    <Square size={26} fill="currentColor" />
                  ) : processing ? (
                    <Loader2 size={28} className="animate-spin" />
                  ) : (
                    <Mic size={30} />
                  )}
                </motion.button>
              </div>

              <p className={`${MONO} mt-6 text-2xl tabular-nums ${recording ? 'text-neutral-50' : 'text-neutral-700'}`}>
                {timer}
              </p>

              <div className="mt-4 w-full max-w-md">
                <Waveform active={recording} />
              </div>

              <p className="mt-5 text-center text-sm text-neutral-500">
                {recording
                  ? 'Speak naturally. Tap the button again when you’re done.'
                  : processing
                  ? 'Transcribing and evaluating your answer…'
                  : 'Tap the mic and answer out loud, like a real interview.'}
              </p>
            </div>
          </motion.section>
        )}

        {/* ======================= STATUS ======================= */}
        <AnimatePresence mode="wait">
          {status && !(!question && !loadingQuestion) && (
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`${MONO} mt-5 flex items-center justify-center gap-2 text-center text-[12px] ${statusTone}`}
            >
              <span className="text-neutral-600">›</span> {status}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ======================= REVIEW ======================= */}
        {rating && avg !== null && !isNaN(avg) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className={`mt-12 overflow-hidden rounded-xl border p-6 md:p-8 ${
              mastered
                ? 'border-emerald-400/30 bg-emerald-400/[0.04]'
                : 'border-white/[0.08] bg-white/[0.02]'
            }`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] ${mastered ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {mastered ? '✓ concept mastered' : 'keep refining'}
                </p>
                <h2 className={`${SERIF} mt-3 text-4xl leading-tight text-neutral-50 md:text-5xl`}>
                  {mastered ? (
                    <>Nailed it. <em className="text-emerald-400">Move on.</em></>
                  ) : (
                    <>Almost there. <em className="text-neutral-500">Refine it.</em></>
                  )}
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  {mastered
                    ? 'You’ve cleared the mastery line on this question. Save and take the next one.'
                    : `${(MASTERY - avg).toFixed(1)} points to mastery. Retry using the coach’s feedback below.`}
                </p>
              </div>
              <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
                <span className={`${SERIF} text-7xl leading-none ${mastered ? 'text-emerald-400' : 'text-neutral-50'}`}>
                  {avg.toFixed(1)}
                </span>
                <span className={`${MONO} text-[11px] text-neutral-500`}>avg / 10</span>
              </div>
            </div>
          </motion.section>
        )}

        {transcription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]"
          >
            <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-2.5 text-[11px] text-neutral-500`}>
              <span>transcript.txt</span>
              <span className="text-neutral-600">what you said</span>
            </div>
            <blockquote className="relative px-6 py-6">
              <span className={`${SERIF} absolute left-4 top-2 text-5xl leading-none text-neutral-800`}>“</span>
              <p className="relative pl-5 text-lg leading-relaxed text-neutral-300">{transcription}</p>
            </blockquote>
          </motion.section>
        )}

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="mt-6"
          >
            <CoachFeedback feedback={feedback} transcription={transcription} />
          </motion.div>
        )}

        {rating && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]"
          >
            <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-2.5 text-[11px] text-neutral-500`}>
              <span>rubric.scores</span>
              <span className="text-neutral-600">{prevRating ? 'Δ vs previous' : 'scale / 10'}</span>
            </div>
            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
              {Object.entries(rating).map(([key, value], i) => {
                const score = parseFloat(value);
                const tone =
                  score >= 8
                    ? { bar: 'bg-emerald-400', text: 'text-emerald-400', mark: '✓' }
                    : score >= 5
                    ? { bar: 'bg-amber-300', text: 'text-amber-300', mark: '~' }
                    : { bar: 'bg-rose-400', text: 'text-rose-400', mark: '!' };
                const prev = prevRating ? parseFloat(prevRating[key]) : NaN;
                const delta = !isNaN(prev) && !isNaN(score) ? score - prev : null;
                return (
                  <div key={key} className="bg-[#0d0d0d] px-5 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm capitalize text-neutral-300">{key.replace('_', ' ')}</span>
                      <span className={`${MONO} flex items-baseline gap-2 text-[11px]`}>
                        {delta !== null && Math.abs(delta) >= 0.05 && (
                          <span className={delta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}
                          </span>
                        )}
                        <span className={tone.text}>{tone.mark}</span>
                        <span className="text-base tabular-nums text-neutral-50">{value}</span>
                      </span>
                    </div>
                    <div className="relative mt-2.5 h-1 rounded-full bg-white/[0.06]">
                      <motion.div
                        className={`h-full rounded-full ${tone.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (isNaN(score) ? 0 : score) * 10)}%` }}
                        transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.06 }}
                      />
                      <span className="absolute -top-0.5 h-2 w-px bg-emerald-400/50" style={{ left: `${MASTERY * 10}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </main>

      {/* ======================= ACTION BAR ======================= */}
      <AnimatePresence>
        {transcription && feedback && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className={`${MONO} hidden text-[11px] text-neutral-500 sm:block`}>
                {mastered ? 'mastered → save & continue' : 'tip: retry until every bar clears the line'}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:flex">
                <button
                  onClick={() => { setAttemptNo((n) => n + 1); handleRetry(); }}
                  className="group inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  <RotateCcw size={14} className="transition-transform group-hover:-rotate-45" />
                  Retry
                </button>
                <button
                  onClick={() => handleSaveAndProceed('done')}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  <Check size={14} />
                  Done
                </button>
                <button
                  onClick={() => { setQuestionNo((n) => n + 1); setAttemptNo(1); handleSaveAndProceed('next'); }}
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Next
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Interview;