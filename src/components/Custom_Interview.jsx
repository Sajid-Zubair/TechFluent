

import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  MapPin,
  Briefcase,
  Clock,
  ArrowUpRight,
  ChevronDown,
  Loader2,
  Building2,
} from "lucide-react";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"
  : "https://final-techfluent.onrender.com";

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";
const ease = [0.22, 1, 0.36, 1];

const ROLE_SUGGESTIONS = ["SDE Intern", "Frontend Developer", "Data Analyst", "ML Engineer", "Backend Developer"];
const JOB_TYPE_LABELS = { fulltime: "Full-time", parttime: "Part-time", contract: "Contract", internship: "Internship" };

function Custom_Interview() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searched, setSearched] = useState(false); // UI-only

  // disable scroll when nav open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "auto";
  }, [mobileNavOpen]);

  const validate = () => {
    const newErrors = {};
    if (!jobRole.trim()) newErrors.jobRole = "Job role is required.";
    if (!experience.trim()) newErrors.experience = "Experience is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!jobType.trim()) newErrors.jobType = "Job type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/jobs/`, {
        params: { job_role: jobRole, location, limit: 10 },
      });

      const jobsData = res.data.jobs || [];

      // Filter unique jobs by URL
      const uniqueJobsMap = new Map();

      jobsData.forEach((job) => {
        // Use job.jobUrl or job.url as unique key
        const urlKey = job.jobUrl || job.url || job.title; // fallback if url missing
        if (!uniqueJobsMap.has(urlKey)) {
          uniqueJobsMap.set(urlKey, job);
        }
      });

      const uniqueJobs = Array.from(uniqueJobsMap.values());

      setJobs(uniqueJobs);

    } catch (error) {
      if (error.response && error.response.data) {
        alert("Error from server: " + error.response.data.error);
        if (error.response.data.traceback) {
          console.error("Backend traceback:", error.response.data.traceback);
        }
      } else {
        alert("Error fetching jobs: " + (error.message || "Unknown error"));
        console.error(error);
      }
    }
    setLoading(false);
};

  // UI-only wrapper: remembers that a valid search was made
  const onSubmit = async (e) => {
    await handleSubmit(e);
    if (jobRole.trim() && experience.trim() && location.trim() && jobType.trim()) setSearched(true);
  };

  const fieldShell = (hasError) =>
    `group relative flex flex-col justify-center px-4 py-3 transition-colors focus-within:bg-white/[0.03] ${
      hasError ? "bg-rose-500/[0.04]" : ""
    }`;
  const labelCls = `${MONO} flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-neutral-500 group-focus-within:text-emerald-400`;
  const inputCls =
    "mt-1 w-full bg-transparent text-[15px] text-neutral-100 placeholder:text-neutral-600 outline-none";

  const cleanDesc = (d) =>
    d
      .slice(10) // skip first 10 characters
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased selection:bg-emerald-400/30">
      {/* Desktop Sidenav */}
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
          <span className="text-emerald-400">●</span>&nbsp; jobs
        </span>
        <span className="w-9" />
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed left-0 top-0 z-[60] h-full w-64 overflow-y-auto border-r border-white/[0.08] bg-[#0d0d0d] shadow-2xl shadow-black/60">
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
      <main
        className={`relative flex-1 overflow-hidden transition-opacity duration-300 ${
          mobileNavOpen ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* ambient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/3 h-[380px] w-[620px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-8 md:pt-12">
          {/* ======================= HEADER ======================= */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="border-b border-white/[0.08] pb-10"
          >
            <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">~/</span>jobs &nbsp;·&nbsp; source: indeed
            </p>
            <h1 className={`${SERIF} mt-5 text-5xl leading-[1] tracking-[-0.02em] text-neutral-50 md:text-6xl`}>
              Find your next <em className="text-emerald-400">role.</em>
            </h1>
            <p className="mt-3 max-w-xl text-neutral-400">
              Fill out the details below and find matching jobs instantly: live internships and openings pulled straight into CareerForge.
            </p>
          </motion.header>

          {/* ======================= SEARCH ======================= */}
          <motion.form
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.08 }}
            className="mt-10"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d] shadow-2xl shadow-black/40">
              <div className="grid divide-y divide-white/[0.08] lg:grid-cols-[1.6fr_1fr_1.3fr_1fr_auto] lg:divide-x lg:divide-y-0">
                {/* Job Role */}
                <label className={fieldShell(errors.jobRole)}>
                  <span className={labelCls}>
                    <Search size={11} /> job role <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className={inputCls}
                  />
                </label>

                {/* Experience */}
                <label className={fieldShell(errors.experience)}>
                  <span className={labelCls}>
                    <Clock size={11} /> experience <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 2 years"
                    className={inputCls}
                  />
                </label>

                {/* Location */}
                <label className={fieldShell(errors.location)}>
                  <span className={labelCls}>
                    <MapPin size={11} /> location <span className="text-rose-400">*</span>
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className={inputCls}
                  />
                </label>

                {/* Job Type */}
                <label className={fieldShell(errors.jobType)}>
                  <span className={labelCls}>
                    <Briefcase size={11} /> job type <span className="text-rose-400">*</span>
                  </span>
                  <div className="relative">
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className={`${inputCls} cursor-pointer appearance-none pr-6 [color-scheme:dark] [&>option]:bg-[#111] ${
                        jobType ? "" : "text-neutral-600"
                      }`}
                    >
                      <option value="">Select Job Type</option>
                      <option value="fulltime">Full-time</option>
                      <option value="parttime">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500" />
                  </div>
                </label>

                {/* Submit */}
                <div className="p-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex h-full min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/[0.08] disabled:text-neutral-500"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Searching…
                      </>
                    ) : (
                      <>
                        Search jobs
                        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* command preview */}
              <div className={`${MONO} flex items-center gap-2 overflow-x-auto whitespace-nowrap border-t border-white/[0.08] bg-[#0a0a0a] px-4 py-2.5 text-[11px]`}>
                <span className="text-emerald-400">~/jobs</span>
                <span className="text-neutral-600">$</span>
                <span className="text-neutral-300">careerforge search</span>
                <span className={jobRole ? "text-neutral-300" : "text-neutral-700"}>--role "{jobRole || "…"}"</span>
                <span className={location ? "text-neutral-300" : "text-neutral-700"}>--in "{location || "…"}"</span>
                <span className={jobType ? "text-neutral-300" : "text-neutral-700"}>--type {jobType || "…"}</span>
                <span className="text-neutral-700">--limit 10</span>
              </div>
            </div>

            {/* errors */}
            <AnimatePresence>
              {Object.keys(errors).length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`${MONO} mt-3 flex flex-wrap gap-x-5 gap-y-1 overflow-hidden text-[11px] text-rose-400`}
                >
                  {Object.values(errors).map((msg) => (
                    <li key={msg}>✕ {msg}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* quick roles */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`${MONO} mr-1 text-[10px] uppercase tracking-[0.18em] text-neutral-600`}>try</span>
              {ROLE_SUGGESTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setJobRole(r)}
                  className={`${MONO} rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                    jobRole === r
                      ? "border-emerald-400/50 bg-emerald-400/[0.08] text-emerald-300"
                      : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-neutral-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </motion.form>

          {/* ======================= RESULTS ======================= */}
          <section className="mt-14">
            <div className={`${MONO} flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">01</span>
              <span>—</span>
              <span>Results</span>
              <span className="h-px flex-1 bg-white/[0.08]" />
              {jobs.length > 0 && !loading && (
                <span className="normal-case tracking-normal text-neutral-400">
                  {jobs.length} role{jobs.length === 1 ? "" : "s"}
                  {jobType && <> · {JOB_TYPE_LABELS[jobType]}</>}
                </span>
              )}
            </div>

            {/* loading skeletons */}
            {loading && (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-md bg-white/[0.05]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-white/[0.04]" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* job cards */}
            {jobs.length > 0 && !loading && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                className="mt-6 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {jobs.map((job, index) => {
                  const href = job.jobUrl || job.url;
                  const company = job.employer?.name;
                  return (
                    <motion.article
                      key={index}
                      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0d] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#101010]"
                    >
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-colors duration-500 group-hover:via-emerald-400/50" />

                      <div>
                        <div className="flex items-start gap-3">
                          <span
                            className={`${SERIF} flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-xl text-neutral-200`}
                          >
                            {company ? company.charAt(0).toUpperCase() : <Building2 size={16} className="text-neutral-500" />}
                          </span>
                          <div className="min-w-0">
                            <h3 className="break-words font-medium leading-snug text-neutral-50">{job.title}</h3>
                            {company && <p className="mt-0.5 truncate text-sm text-neutral-400">{company}</p>}
                          </div>
                        </div>

                        <div className={`${MONO} mt-4 flex flex-wrap gap-2 text-[10px]`}>
                          <span className="flex items-center gap-1 rounded border border-white/[0.08] px-2 py-0.5 text-neutral-400">
                            <MapPin size={10} />
                            {job.location?.city
                              ? `${job.location.city}, ${job.location.countryName}`
                              : "Location not available"}
                          </span>
                        </div>

                        {job.description && (
                          <p className="mt-4 line-clamp-4 break-words text-sm leading-relaxed text-neutral-500">
                            {job.description ? cleanDesc(job.description) : "No description available"}
                          </p>
                        )}
                      </div>

                      {/* Apply Link */}
                      {href && (
                        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                          <span className={`${MONO} text-[10px] text-neutral-600`}>
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
                          >
                            Apply now
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </motion.div>
            )}

            {/* empty states */}
            {jobs.length === 0 && !loading && (
              <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-white/[0.08] px-6 py-16 text-center">
                {searched ? (
                  <>
                    <p className={`${SERIF} text-3xl text-neutral-300`}>
                      No roles <em className="text-neutral-600">found.</em>
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-neutral-500">
                      No jobs found. Try changing your search criteria: a broader title or a nearby city usually helps.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-neutral-500">
                      <Briefcase size={20} />
                    </span>
                    <p className={`${SERIF} mt-4 text-3xl text-neutral-300`}>
                      Your results <em className="text-neutral-600">will appear here.</em>
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-neutral-500">
                      Enter a role, experience, location and job type, then hit search.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Custom_Interview;