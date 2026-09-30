

import React, { useEffect, useRef, useState } from 'react';
import Sidenav from './Sidenav';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sparkles,
  ArrowUp,
  CornerDownLeft,
  Copy,
  Check,
  Mic,
  FileText,
  Compass,
  Cpu,
  History,
  RotateCcw,
} from 'lucide-react';
import { remarkPlugins, mdComponents } from './markdown';

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const ease = [0.22, 1, 0.36, 1];

const STARTERS = [
  { icon: Mic, tag: 'interview prep', prompt: 'How should I answer "Tell me about yourself" as a final-year CSE student?' },
  { icon: Cpu, tag: 'technical', prompt: 'Compare SQL and NoSQL databases in a table.' },
  { icon: FileText, tag: 'resume', prompt: 'How do I write strong, measurable bullet points for my projects?' },
  { icon: Compass, tag: 'career', prompt: 'Create a 30-day placement preparation plan for SDE roles.' },
];

const MD =
  'max-w-none text-[15px] leading-[1.75] text-neutral-300 ' +
  '[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-neutral-50 ' +
  '[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:border-b [&_h2]:border-white/[0.06] [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-neutral-50 ' +
  '[&_h3]:mb-1.5 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-neutral-100 ' +
  '[&_p]:my-3 [&_strong]:font-semibold [&_strong]:text-neutral-100 [&_em]:text-neutral-200 ' +
  '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1.5 [&_li::marker]:text-emerald-400/70 ' +
  '[&_a]:text-emerald-400 [&_a]:underline [&_a]:decoration-emerald-400/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-emerald-400 ' +
  '[&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-emerald-300 ' +
  '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/[0.08] [&_pre]:bg-black/50 [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed ' +
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-neutral-200 ' +
  '[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-400/40 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-400 ' +
  '[&_hr]:my-6 [&_hr]:border-white/[0.08] ' +
  '[&_del]:text-neutral-500 [&_input]:mr-2 [&_input]:accent-emerald-400 [&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0';

function Resources() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // UI-only state
  const [asked, setAsked] = useState('');
  const [recent, setRecent] = useState([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/get_answer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error('Error fetching from Groq API:', err);
      setAnswer('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // UI-only wrapper: remember what was asked, then run the original search
  const ask = () => {
    if (!query) return;
    setAsked(query);
    setRecent((r) => [query, ...r.filter((q) => q !== query)].slice(0, 5));
    handleSearch();
  };

  // "/" focuses the search bar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fillPrompt = (p) => {
    setQuery(p);
    inputRef.current?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(answer || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  const showStarters = !answer && !loading;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30">
      {/* Sidenav for Desktop */}
      <div className="hidden md:block md:w-64 md:shrink-0">
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
          <span className="text-emerald-400">●</span>&nbsp; assistant
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
      <div
        className={`relative min-w-0 flex-1 overflow-hidden transition-opacity duration-300 ${
          mobileNavOpen ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        {/* ambient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-10 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]"
          animate={loading ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.7 }}
          transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
        />

        <div className="relative mx-auto w-full max-w-3xl px-5 pb-24 pt-24 sm:px-8 md:pt-16">
          {/* ======================= HEADER ======================= */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <span className={`${MONO} inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-neutral-400`}>
              <Sparkles size={12} className="text-emerald-400" /> AI career assistant
            </span>
            <h1 className={`${SERIF} mt-6 text-5xl leading-[1] tracking-[-0.02em] text-neutral-50 md:text-6xl`}>
              Ask anything. <em className="text-emerald-400">Learn faster.</em>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-neutral-400">
              Get your questions answered in seconds: concepts, interview prep, resumes and career planning.
            </p>
          </motion.header>

          {/* ======================= COMMAND BAR ======================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="relative mt-10"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/15 to-white/[0.02]" />
            <div className="relative flex items-center gap-3 rounded-2xl bg-[#0d0d0d] p-2 pl-5 shadow-2xl shadow-black/50 transition-shadow focus-within:shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_25px_60px_-15px_rgba(0,0,0,0.6)]">
              <Sparkles size={18} className={`shrink-0 ${loading ? 'animate-pulse text-emerald-400' : 'text-neutral-500'}`} />
              <input
                ref={inputRef}
                autoFocus
                className="w-full bg-transparent py-3 text-base text-neutral-100 placeholder:text-neutral-600 outline-none"
                type="text"
                placeholder="What do you want to learn?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    ask();
                  }
                }}
                aria-label="Ask the assistant"
              />
              <kbd className={`${MONO} hidden shrink-0 items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-neutral-500 sm:flex`}>
                <CornerDownLeft size={10} /> enter
              </kbd>
              <button
                onClick={ask}
                disabled={loading}
                aria-label="Ask"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  query && !loading
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-white/[0.06] text-neutral-500'
                }`}
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-emerald-400" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>
            </div>
            <p className={`${MONO} mt-3 text-center text-[10px] text-neutral-600`}>
              press <kbd className="rounded border border-white/10 px-1 text-neutral-400">/</kbd> to focus · answers are ai-generated, verify important details
            </p>
          </motion.div>

          {/* ======================= RECENT ======================= */}
          {recent.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className={`${MONO} flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-600`}>
                <History size={11} /> recent
              </span>
              {recent.map((q) => (
                <button
                  key={q}
                  onClick={() => fillPrompt(q)}
                  className="max-w-[240px] truncate rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-white/25 hover:text-neutral-100"
                  title={q}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ======================= STARTERS ======================= */}
          <AnimatePresence>
            {showStarters && (
              <motion.div
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                className="mt-12"
              >
                <div className={`${MONO} mb-4 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
                  <span className="text-emerald-400">01</span>
                  <span>—</span>
                  <span>Try asking</span>
                  <span className="h-px flex-1 bg-white/[0.08]" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {STARTERS.map(({ icon: Icon, tag, prompt }) => (
                    <motion.button
                      key={tag}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                      onClick={() => fillPrompt(prompt)}
                      className="group flex flex-col items-start rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101010]"
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neutral-400 transition-colors group-hover:border-emerald-400/40 group-hover:text-emerald-400">
                          <Icon size={16} />
                        </span>
                        <span className={`${MONO} text-[10px] uppercase tracking-[0.15em] text-neutral-600`}>{tag}</span>
                      </span>
                      <span className="mt-4 text-sm leading-relaxed text-neutral-300 group-hover:text-neutral-100">{prompt}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======================= LOADING ======================= */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]"
            >
              <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-3 text-[11px] text-neutral-500`}>
                <span className="flex items-center gap-2">
                  <Sparkles size={12} className="animate-pulse text-emerald-400" /> thinking
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1 w-1 rounded-full bg-emerald-400"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </span>
                </span>
              </div>
              <div className="space-y-3 p-6">
                {[92, 78, 85, 60, 88, 45].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 animate-pulse rounded bg-white/[0.05]"
                    style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================= ANSWER ======================= */}
          {!loading && answer && (
            <motion.article
              key={answer}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mt-12 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]"
            >
              <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-3 text-[11px] text-neutral-500`}>
                <span className="flex items-center gap-2">
                  <Sparkles size={12} className="text-emerald-400" /> answer.md
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied ? 'copied' : 'copy'}
                  </button>
                  <button
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    className="flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
                  >
                    <RotateCcw size={11} /> ask another
                  </button>
                </div>
              </div>

              {asked && (
                <div className="border-b border-white/[0.06] px-6 py-5">
                  <p className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>you asked</p>
                  <h2 className={`${SERIF} mt-2 text-3xl leading-tight text-neutral-50`}>{asked}</h2>
                </div>
              )}

              <div className={`${MD} px-6 py-6`}>
                <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>
                  {answer}
                </ReactMarkdown>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </div>
  );
}

export default Resources;