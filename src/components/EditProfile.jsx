

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Eye, EyeOff, ChevronDown, Check } from 'lucide-react'

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

const inputCls =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors duration-200 hover:border-white/20 focus:border-emerald-400/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-400/30";
const labelCls = `${MONO} mb-2 block text-[11px] uppercase tracking-[0.15em] text-neutral-500`;

function GroupLabel({ index, children }) {
  return (
    <div className={`${MONO} flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
      <span className="text-emerald-400">{index}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  );
}

function EditProfile({setShowEditP}) {
    function handleEditClose(){
        setShowEditP(false);
    }

  // UI-only
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleEditClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-sm [color-scheme:dark]'
      onClick={handleEditClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] text-neutral-200 shadow-2xl shadow-black/70"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

        {/* window chrome */}
        <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-5 py-2.5 text-[11px] text-neutral-500`}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
            </div>
            <span>profile.edit</span>
          </div>
          <button
            onClick={handleEditClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-neutral-500 transition-colors hover:border-white/25 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-6 pb-6 pt-6 md:px-8">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
            <span className="text-emerald-400">~/</span>profile / edit
          </p>
          <h1 id="edit-profile-title" className={`${SERIF} mt-3 text-5xl leading-none tracking-[-0.01em] text-neutral-50`}>
            Edit <em className="text-neutral-500">profile</em>
          </h1>

          <div className="mt-8 space-y-8">
            {/* 01 — Account */}
            <fieldset className="space-y-5">
              <GroupLabel index="01">Account</GroupLabel>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="ep-username" className={labelCls}>Username</label>
                  <input id="ep-username" type="text" placeholder="Enter your username" autoComplete="username" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ep-email" className={labelCls}>Email</label>
                  <input id="ep-email" type="email" placeholder="Enter your email" autoComplete="email" className={inputCls} />
                </div>
              </div>
            </fieldset>

            {/* 02 — College */}
            <fieldset className="space-y-5">
              <GroupLabel index="02">College</GroupLabel>
              <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
                <div>
                  <label htmlFor="ep-college" className={labelCls}>College</label>
                  <input id="ep-college" type="text" placeholder="Enter college name" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ep-year" className={labelCls}>Year of joining</label>
                  <div className="relative">
                    <select
                      id="ep-year"
                      className={`${inputCls} cursor-pointer appearance-none pr-10 [&>option]:bg-[#111]`}
                    >
                      <option value="">Select year</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* 03 — Security */}
            <fieldset className="space-y-5">
              <GroupLabel index="03">Security</GroupLabel>
              <div>
                <label htmlFor="ep-password" className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    id="ep-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className={`${inputCls} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] bg-[#0a0a0a] px-6 py-4 md:px-8">
          <span className={`${MONO} hidden text-[10px] text-neutral-600 sm:inline`}>
            <kbd className="rounded border border-white/10 px-1 text-neutral-400">esc</kbd> to close
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleEditClose}
              className="rounded-md border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleEditClose}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              <Check size={15} />
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EditProfile