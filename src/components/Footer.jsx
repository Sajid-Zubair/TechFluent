import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll'
import { ArrowUp, ArrowRight } from 'lucide-react'

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

const linkCls = 'text-sm text-neutral-400 transition-colors hover:text-white cursor-pointer';

function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Explore',
      items: [
        { label: 'Method', scroll: 'aboutSection' },
        { label: 'Workflow', scroll: 'resourcesSection' },
        { label: 'Home', to: '/' },
      ],
    },
    {
      title: 'Platform',
      items: [
        { label: 'Technical mastery' },
        { label: 'HR interview coach' },
        { label: 'Resume analyzer' },
        { label: 'Job discovery' },
        { label: 'AI career assistant' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Sign up', to: '/signup' },
        { label: 'Log in', to: '/login' },
        { label: 'Dashboard', to: '/dashboard' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#0a0a0a] text-neutral-200 antialiased">
      {/* ambient */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ---------- CTA strip ---------- */}
        <div className="flex flex-col gap-6 border-b border-white/[0.08] py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">$</span> careerforge start
            </p>
            <h3 className={`${SERIF} mt-3 text-4xl leading-tight text-neutral-50 md:text-5xl`}>
              Ready for your <em className="text-emerald-400">next question?</em>
            </h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/signup')}
              className="group inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Get started
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-md border border-white/15 text-neutral-400 transition-colors hover:border-white/30 hover:text-white"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* ---------- columns ---------- */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex w-fit items-center gap-2.5">
              <span className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400`}>
                cf
              </span>
              <span className="text-[17px] font-medium tracking-tight text-neutral-100">
                Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">
              A mastery-based placement platform. Learn one concept at a time, get AI feedback on every answer,
              and walk into interviews ready.
            </p>
          </div>

          {columns.map((col, ci) => (
            <div key={col.title} className="lg:col-span-2 lg:first-of-type:col-start-7">
              <p className={`${MONO} flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>
                <span className="text-emerald-400/70">{String(ci + 1).padStart(2, '0')}</span> {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.scroll ? (
                      <ScrollLink to={item.scroll} smooth duration={500} offset={-64} className={linkCls}>
                        {item.label}
                      </ScrollLink>
                    ) : item.to ? (
                      <Link to={item.to} className={linkCls}>
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-sm text-neutral-500">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---------- bottom bar ---------- */}
        <div className={`${MONO} flex flex-col gap-2 border-t border-white/[0.08] py-6 text-[11px] text-neutral-600 sm:flex-row sm:items-center sm:justify-between`}>
          <span>© {year} CareerForge. All rights reserved.</span>
          <span className="uppercase tracking-[0.2em]">Campus → Career</span>
        </div>
      </div>

      {/* ---------- oversized wordmark ---------- */}
      <div aria-hidden="true" className="pointer-events-none relative -mb-[0.22em] select-none overflow-hidden">
        <p
          className={`${SERIF} whitespace-nowrap text-center text-[22vw] leading-[0.8] tracking-[-0.04em] text-transparent`}
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          Career<em>Forge</em>
        </p>
      </div>
    </footer>
  )
}

export default Footer