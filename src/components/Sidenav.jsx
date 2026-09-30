


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  BookOpen,
  User,
  ArrowUpRight,
} from 'lucide-react';

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

function Sidenav() {
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard },
    { to: "/custom_interview", label: "Job Search", icon: Briefcase },
    { to: "/resume", label: "Resume Review", icon: FileCheck2 },
    { to: "/resources", label: "Resource Corner", icon: BookOpen },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="fixed z-40 flex h-full w-64 flex-col overflow-hidden border-r border-white/[0.08] bg-[#0a0a0a] text-neutral-200 antialiased">
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/[0.07] blur-[80px]" />

      {/* Logo */}
      <div className="relative flex h-16 items-center border-b border-white/[0.08] px-6">
        <Link to="/dashboard" className="group flex items-center gap-2.5">
          <span
            className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400 transition-colors group-hover:border-emerald-400/50`}
          >
            cf
          </span>
          <span className="select-none text-[17px] font-medium tracking-tight text-neutral-100">
            Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="relative flex-1 overflow-y-auto px-3 py-6">
        <p className={`${MONO} mb-3 flex items-center gap-3 px-3 text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>
          Navigate
          <span className="h-px flex-1 bg-white/[0.06]" />
        </p>

        <nav className="flex flex-col gap-0.5">
          {navLinks.map(({ to, label, icon: Icon }, i) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100"
                }`}
              >
                {/* active rail */}
                <span
                  className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-emerald-400 transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <Icon
                  size={17}
                  strokeWidth={1.75}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-emerald-400" : "text-neutral-500 group-hover:text-neutral-300"
                  }`}
                />
                <span className={isActive ? "font-medium" : ""}>{label}</span>

                <span
                  className={`${MONO} ml-auto text-[10px] transition-colors ${
                    isActive ? "text-emerald-400/80" : "text-neutral-700 group-hover:text-neutral-500"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="relative border-t border-white/[0.08] p-4">
        <div className="rounded-md border border-white/[0.08] bg-[#0d0d0d] p-4">
          <p className={`${MONO} flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500`}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Mastery mode
          </p>
          <p className={`${SERIF} mt-3 text-xl leading-snug text-neutral-200`}>
            One question. <em className="text-neutral-500">Then the next.</em>
          </p>
          <Link
            to="/dashboard"
            className={`${MONO} group mt-4 inline-flex items-center gap-1 text-[11px] text-neutral-500 transition-colors hover:text-emerald-400`}
          >
            new session
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className={`${MONO} mt-4 px-1 text-[10px] uppercase tracking-[0.2em] text-neutral-700`}>
          Campus → Career
        </p>
      </div>
    </aside>
  );
}

export default Sidenav;