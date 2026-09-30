import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { remarkPlugins, mdComponents } from './markdown';
import {
  Sparkles,
  ThumbsUp,
  Wrench,
  BookOpenCheck,
  MessageSquareQuote,
  Copy,
  Check,
  Volume2,
  Square,
  Columns2,
  Target,
} from 'lucide-react';

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const ease = [0.22, 1, 0.36, 1];

const MD =
  'max-w-none text-[15px] leading-relaxed text-neutral-300 ' +
  '[&_a]:text-emerald-400 [&_a]:underline [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-emerald-300 ' +
  '[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:bg-black/40 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 ' +
  '[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-neutral-50 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-neutral-50 [&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:font-medium [&_h3]:text-neutral-100 ' +
  '[&_li]:my-1 [&_li::marker]:text-neutral-600 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2 ' +
  '[&_strong]:font-semibold [&_strong]:text-neutral-100 [&_table]:my-3 [&_table]:w-full [&_td]:border [&_td]:border-white/[0.08] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-white/[0.08] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left';

/* ------------------------------------------------------------------ */
/* Parsing the coach's response into sections                          */
/* ------------------------------------------------------------------ */

const SECTION_DEFS = [
  { id: 'correct', re: /^(the\s+)?correct(\s+and\s+complete)?\s+answer/i },
  { id: 'positives', re: /^(positive\s+(points|aspects)|strengths|what\s+went\s+well)/i },
  { id: 'negatives', re: /^(negative\s+(points|aspects)|weakness(es)?|areas?\s+(for|of)\s+improvement|what\s+to\s+improve)/i },
  { id: 'improved', re: /^(improved|refined|better)\s+(answer|version|response)/i },
];

function parseFeedback(raw) {
  const sections = {};
  let current = null;

  raw.split(/\r?\n/).forEach((line) => {
    const isBullet = /^\s*([-*•]|\d+[.)])\s+/.test(line) && !/^\s*\d+[.)]\s+\**\s*(correct|positive|negative|improved|refined)/i.test(line);
    const stripped = line
      .replace(/^\s*#{1,6}\s*/, '')
      .replace(/^\s*\d+[.)]\s+/, '')
      .replace(/\*\*|__/g, '')
      .trim();
    const head = stripped.split(':')[0].trim();
    const def = !isBullet && head.length < 45 ? SECTION_DEFS.find((d) => d.re.test(head)) : null;

    if (def) {
      current = def.id;
      sections[current] = sections[current] || [];
      const colon = stripped.indexOf(':');
      const rest = colon >= 0 ? stripped.slice(colon + 1).trim() : '';
      if (rest) sections[current].push(rest);
      return;
    }
    if (current) sections[current].push(line);
  });

  const out = {};
  Object.entries(sections).forEach(([k, lines]) => (out[k] = lines.join('\n').trim()));
  return out;
}

function toBullets(text = '') {
  const items = [];
  text.split(/\r?\n/).forEach((l) => {
    if (!l.trim() || /^\s*-{3,}\s*$/.test(l)) return;
    const m = l.match(/^(\s*)(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m && m[1].length < 2) items.push(m[2].trim());
    else if (m && items.length) items[items.length - 1] += ` — ${m[2].trim()}`;
    else if (items.length) items[items.length - 1] += ` ${l.trim()}`;
    else items.push(l.trim());
  });
  return items;
}

const isNotApplicable = (t = '') =>
  !t.trim() ||
  /^(n\/?a\b|not\s+applicable|none\b|no\s+correction|the\s+candidate'?s\s+answer\s+is\s+(correct|accurate|complete))/i.test(
    t.replace(/[*_]/g, '').trim()
  );

// Bold STAR labels in the improved answer
const emphasiseStar = (t = '') =>
  t.replace(/^(\s*[-*]?\s*)(Situation|Task|Action|Result)\s*[:\-–]/gim, '$1**$2:**');

const plain = (t = '') => t.replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();

const Inline = ({ children }) => (
  <ReactMarkdown components={{ p: ({ children: c }) => <>{c}</> }}>{children}</ReactMarkdown>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

function CoachFeedback({ feedback, transcription }) {
  const parsed = useMemo(() => parseFeedback(feedback || ''), [feedback]);
  const positives = useMemo(() => toBullets(parsed.positives), [parsed]);
  const negatives = useMemo(() => toBullets(parsed.negatives), [parsed]);
  const correct = parsed.correct || '';
  const improved = emphasiseStar(parsed.improved || '');
  const correctNA = 'correct' in parsed && isNotApplicable(correct);

  const structured = Object.keys(parsed).length >= 2;

  const tabs = [
    { id: 'breakdown', label: 'Breakdown', icon: Target, show: positives.length || negatives.length,
      meta: <><span className="text-emerald-400">+{positives.length}</span> <span className="text-rose-400">−{negatives.length}</span></> },
    { id: 'correct', label: 'Correct answer', icon: BookOpenCheck, show: 'correct' in parsed,
      meta: correctNA ? <span className="text-emerald-400">✓</span> : null },
    { id: 'improved', label: 'Say it better', icon: MessageSquareQuote, show: !!improved },
  ].filter((t) => t.show);

  const [tab, setTab] = useState(tabs[0]?.id);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    setTab(tabs[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(plain(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(plain(text));
    u.rate = 0.98;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  const Header = (
    <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-2.5 text-[11px] text-neutral-500`}>
      <span className="flex items-center gap-2">
        <Sparkles size={12} className="text-emerald-400" /> coach.md
      </span>
      <span className="text-neutral-600">ai feedback</span>
    </div>
  );

  /* ---------- fallback: unstructured response ---------- */
  if (!structured) {
    return (
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]">
        {Header}
        <div className={`${MD} px-6 py-6`}>
          <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{feedback}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d]">
      {Header}

      {/* ---------- tabs ---------- */}
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-white/[0.08] px-3 pt-3">
        {tabs.map(({ id, label, icon: Icon, meta }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-t-md px-3.5 pb-3 pt-2 text-sm transition-colors ${
                active ? 'text-neutral-50' : 'text-neutral-500 hover:text-neutral-200'
              }`}
            >
              <Icon size={14} className={active ? 'text-emerald-400' : ''} />
              {label}
              {meta && <span className={`${MONO} text-[10px]`}>{meta}</span>}
              {active && (
                <motion.span layoutId="coach-tab" className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease }}
          className="p-5 md:p-6"
        >
          {/* ================= BREAKDOWN ================= */}
          {tab === 'breakdown' && (
            <div className="space-y-5">
              {negatives[0] && (
                <div className="relative overflow-hidden rounded-lg border border-amber-300/25 bg-amber-300/[0.04] p-4">
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-amber-300/70" />
                  <p className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-amber-300`}>fix this first</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-100">
                    <Inline>{negatives[0]}</Inline>
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {/* strengths */}
                <div className="overflow-hidden rounded-lg border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-emerald-500/[0.05] px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                      <ThumbsUp size={14} /> Strengths
                    </span>
                    <span className={`${MONO} text-[10px] text-emerald-400/80`}>{positives.length}</span>
                  </div>
                  <ul className="divide-y divide-white/[0.05]">
                    {positives.length ? (
                      positives.map((p, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="flex gap-3 px-4 py-3 text-sm leading-relaxed text-neutral-300"
                        >
                          <span className={`${MONO} mt-0.5 shrink-0 text-[10px] text-emerald-400`}>+{String(i + 1).padStart(2, '0')}</span>
                          <span><Inline>{p}</Inline></span>
                        </motion.li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-neutral-600">No strengths listed.</li>
                    )}
                  </ul>
                </div>

                {/* improvements */}
                <div className="overflow-hidden rounded-lg border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-rose-500/[0.05] px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm font-medium text-rose-300">
                      <Wrench size={14} /> To improve
                    </span>
                    <span className={`${MONO} text-[10px] text-rose-400/80`}>{negatives.length}</span>
                  </div>
                  <ul className="divide-y divide-white/[0.05]">
                    {negatives.length ? (
                      negatives.map((n, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="flex gap-3 px-4 py-3 text-sm leading-relaxed text-neutral-300"
                        >
                          <span className={`${MONO} mt-0.5 shrink-0 text-[10px] text-rose-400`}>−{String(i + 1).padStart(2, '0')}</span>
                          <span><Inline>{n}</Inline></span>
                        </motion.li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-neutral-600">Nothing major to fix.</li>
                    )}
                  </ul>
                </div>
              </div>

              {tabs.some((t) => t.id === 'improved') && (
                <button
                  onClick={() => setTab('improved')}
                  className={`${MONO} text-[11px] text-neutral-500 transition-colors hover:text-emerald-400`}
                >
                  → see how to say it better
                </button>
              )}
            </div>
          )}

          {/* ================= CORRECT ANSWER ================= */}
          {tab === 'correct' && (
            correctNA ? (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/[0.08] text-emerald-400">
                  <Check size={20} />
                </span>
                <p className={`${SERIF} mt-4 text-3xl text-neutral-50`}>
                  Your answer was <em className="text-emerald-400">on point.</em>
                </p>
                <p className="mt-2 max-w-sm text-sm text-neutral-500">
                  No correction needed. Focus on delivery in the breakdown.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>reference answer</p>
                  <button
                    onClick={() => copy(correct)}
                    className={`${MONO} flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-[10px] text-neutral-400 transition-colors hover:border-white/25 hover:text-white`}
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied ? 'copied' : 'copy'}
                  </button>
                </div>
                <div className="border-l-2 border-sky-400/40 pl-5">
                  <div className={MD}>
                    <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{correct}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ================= IMPROVED ANSWER ================= */}
          {tab === 'improved' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>
                  interview-ready version
                </p>
                <div className={`${MONO} flex gap-1.5 text-[10px]`}>
                  {transcription && (
                    <button
                      onClick={() => setCompare((c) => !c)}
                      className={`flex items-center gap-1.5 rounded border px-2 py-1 transition-colors ${
                        compare ? 'border-emerald-400/40 text-emerald-300' : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <Columns2 size={11} /> compare
                    </button>
                  )}
                  {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                    <button
                      onClick={() => speak(parsed.improved)}
                      className={`flex items-center gap-1.5 rounded border px-2 py-1 transition-colors ${
                        speaking ? 'border-emerald-400/40 text-emerald-300' : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {speaking ? <Square size={10} fill="currentColor" /> : <Volume2 size={11} />}
                      {speaking ? 'stop' : 'listen'}
                    </button>
                  )}
                  <button
                    onClick={() => copy(parsed.improved)}
                    className="flex items-center gap-1.5 rounded border border-white/10 px-2 py-1 text-neutral-400 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    {copied ? 'copied' : 'copy'}
                  </button>
                </div>
              </div>

              <div className={compare ? 'grid gap-4 md:grid-cols-2' : ''}>
                {compare && (
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className={`${MONO} mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>yours</p>
                    <p className="text-[15px] leading-relaxed text-neutral-500">{transcription}</p>
                  </div>
                )}
                <div className={`relative rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] p-5 ${compare ? '' : 'md:p-6'}`}>
                  {compare && (
                    <p className={`${MONO} mb-2 text-[10px] uppercase tracking-[0.2em] text-emerald-400`}>refined</p>
                  )}
                  <span className={`${SERIF} pointer-events-none absolute right-4 top-1 text-6xl leading-none text-emerald-400/15`}>”</span>
                  <div className={`${MD} relative [&_p]:text-neutral-200`}>
                    <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>{improved}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <p className={`${MONO} mt-4 text-[11px] text-neutral-600`}>
                tip: read it aloud once, then hit retry and answer in your own words.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default CoachFeedback;