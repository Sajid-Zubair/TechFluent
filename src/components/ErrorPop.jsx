

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Mic, ArrowRight } from 'lucide-react'

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

function ErrorPop({ setshowError }) {
  const okRef = useRef(null)

  // Esc to dismiss + focus the primary action
  useEffect(() => {
    okRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setshowError(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setshowError])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={() => setshowError(false)}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="errorpop-title"
        aria-describedby="errorpop-desc"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] text-neutral-200 shadow-2xl shadow-black/70"
      >
        {/* top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />

        {/* window chrome */}
        <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            </div>
            <span>session.config</span>
          </div>
          <span className="text-rose-400">exit 1</span>
        </div>

        <div className="px-6 pb-6 pt-5">
          <p className={`${MONO} text-[12px] text-rose-400`}>
            ✕ error: missing required option <span className="text-rose-300">--type</span>
          </p>

          <h2 id="errorpop-title" className={`${SERIF} mt-4 text-4xl leading-tight text-neutral-50`}>
            Pick an interview <em className="text-neutral-500">first.</em>
          </h2>
          <p id="errorpop-desc" className="mt-2 text-sm leading-relaxed text-neutral-400">
            Please select an interview type before starting your session.
          </p>

          {/* options hint */}
          <div className={`${MONO} mt-5 space-y-2 rounded-md border border-white/[0.06] bg-white/[0.02] p-3 text-[11px]`}>
            <p className="flex items-center gap-2.5 text-neutral-400">
              <Cpu size={13} className="text-neutral-500" />
              <span className="text-neutral-200">--type technical</span>
              <span className="text-neutral-600">· pick a core subject</span>
            </p>
            <p className="flex items-center gap-2.5 text-neutral-400">
              <Mic size={13} className="text-neutral-500" />
              <span className="text-neutral-200">--type behavioural</span>
              <span className="text-neutral-600">· hr & communication</span>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <span className={`${MONO} hidden text-[10px] text-neutral-600 sm:inline`}>
              press <kbd className="rounded border border-white/10 px-1 py-0.5 text-neutral-400">esc</kbd> to close
            </span>
            <button
              ref={okRef}
              type="button"
              onClick={() => setshowError(false)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black outline-none transition-colors hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] sm:w-auto"
            >
              Got it, choose type
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ErrorPop
