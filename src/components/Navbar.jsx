

import { Link as ScrollLink } from "react-scroll";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

const sections = [
  { to: "aboutSection", index: "01", label: "Method" },
  { to: "resourcesSection", index: "03", label: "Workflow" },
];

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled || isOpen
          ? "border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl"
          : "border-transparent bg-[#0a0a0a]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link to="/" onClick={() => setIsOpen(false)} className="group flex items-center gap-2.5">
          <span
            className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400 transition-colors group-hover:border-emerald-400/50`}
          >
            cf
          </span>
          <span className="text-[17px] font-medium tracking-tight text-neutral-100">
            Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          <li>
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-white"
            >
              Home
            </Link>
          </li>
          {sections.map((s) => (
            <li key={s.to}>
              <ScrollLink
                to={s.to}
                smooth
                spy
                duration={500}
                offset={-64}
                activeClass="!text-white"
                className="group flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm text-neutral-400 transition-colors hover:text-white"
              >
                <span className={`${MONO} text-[10px] text-neutral-600 transition-colors group-hover:text-emerald-400`}>
                  {s.index}
                </span>
                {s.label}
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => go("/login")}
            className="rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => go("/signup")}
            className="group inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Get started
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-neutral-300 transition-colors hover:border-white/25 hover:text-white md:hidden"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.08] md:hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between border-b border-white/[0.06] py-4 text-neutral-200"
              >
                Home
                <span className={`${MONO} text-[10px] text-neutral-600`}>00</span>
              </Link>

              {sections.map((s) => (
                <ScrollLink
                  key={s.to}
                  to={s.to}
                  smooth
                  duration={500}
                  offset={-64}
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center justify-between border-b border-white/[0.06] py-4 text-neutral-200"
                >
                  {s.label}
                  <span className={`${MONO} text-[10px] text-neutral-600`}>{s.index}</span>
                </ScrollLink>
              ))}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => go("/login")}
                  className="rounded-md border border-white/15 py-2.5 text-sm text-neutral-300 transition-colors hover:border-white/30 hover:text-white"
                >
                  Sign in
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="rounded-md bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;