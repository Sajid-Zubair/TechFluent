

import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Loader2, ChevronDown } from 'lucide-react';

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

const inputClass =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors duration-200 hover:border-white/20 focus:border-emerald-400/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-400/30";

const selectClass =
  `${inputClass} appearance-none cursor-pointer pr-10 [&>option]:bg-[#111] [&>option]:text-neutral-200`;

const labelClass = `${MONO} mb-2 block text-[11px] uppercase tracking-[0.15em] text-neutral-500`;

function GroupLabel({ index, children }) {
  return (
    <div className={`${MONO} flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
      <span className="text-emerald-400">{index}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  );
}

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    college_name: '',
    year_of_joining: '',
    password: '',
    re_password: '',
  })

  const[isLoading, setIsLoading] = useState(false)
  const[success, setSuccess] = useState(false)
  const [error,setError] = useState('')
  const [showPassword, setShowPassword] = useState(false) // UI-only
  const navigate = useNavigate()


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(isLoading){
      return 
    }
    setIsLoading(true)

    try{
      const payload = {
        ...formData,
        year_of_joining: parseInt(formData.year_of_joining)
      };
      const response = await axios.post(`${BASE_URL}/api/register/`, payload,{
        withCredentials: true,
      })
      console.log("success",response.data)
      setSuccess("Registration successful")
      navigate('/login')
    }catch (error) {
      console.log("Error response:", error.response?.data);
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((key) => {
           const errorMessages = error.response.data[key];
           if(errorMessages && errorMessages.length > 0){
            setError(errorMessages[0])
           }
        })
        //alert("Error: " + JSON.stringify(err.response.data, null, 2));

      }
    }
    finally{
      setIsLoading(false)
    }
  }

  // display-only hint, does not affect submission
  const pwTouched = formData.re_password.length > 0
  const pwMatch = formData.password === formData.re_password

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased [color-scheme:dark] lg:grid lg:grid-cols-[1fr_1.15fr]">

      {/* ---------------- Left: editorial panel (desktop) ---------------- */}
      <aside className="relative hidden overflow-hidden border-r border-white/[0.08] p-12 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[520px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />

        {/* logo */}
        <Link to="/" className="relative flex w-fit items-center gap-2.5">
          <span className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400`}>
            cf
          </span>
          <span className="text-[17px] font-medium tracking-tight text-neutral-100">
            Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
          </span>
        </Link>

        {/* statement */}
        <div className="relative max-w-lg">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
            <span className="text-emerald-400">●</span>&nbsp; Create your account
          </p>
          <h2 className={`${SERIF} mt-6 text-6xl leading-[0.98] tracking-[-0.02em] text-neutral-50 xl:text-7xl`}>
            Start with <br />
            <em className="text-emerald-400">one question.</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-neutral-400">
            Join your college leaderboard and build placement readiness one mastered concept at a time.
          </p>

          {/* what you get */}
          <div className="mt-10 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
            <div className={`${MONO} border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
              included.md
            </div>
            <div className={`${MONO} text-[12px] leading-7`}>
              {[
                "technical mastery · dsa, os, cn, dbms, oop",
                "hr interview coach with voice feedback",
                "ai resume analyzer & job discovery",
                "xp, streaks, badges & college leaderboard",
              ].map((t, i) => (
                <div key={t} className="flex gap-4 bg-emerald-500/[0.05] px-4 text-emerald-300">
                  <span className="w-3 select-none text-neutral-600">{i + 1}</span>
                  <span className="select-none">+</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className={`${MONO} relative text-[11px] uppercase tracking-[0.2em] text-neutral-600`}>
          Campus → Career
        </p>
      </aside>

      {/* ---------------- Right: form ---------------- */}
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">

          {/* mobile logo */}
          <Link to="/" className="mb-12 flex w-fit items-center gap-2.5 lg:hidden">
            <span className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400`}>
              cf
            </span>
            <span className="text-[17px] font-medium tracking-tight text-neutral-100">
              Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
            </span>
          </Link>

          <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
            <span className="text-emerald-400">00</span> — Sign up
          </p>
          <h1 className={`${SERIF} mt-4 text-5xl leading-none tracking-[-0.01em] text-neutral-50`}>
            Create an <em className="text-neutral-500">account</em>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Create an account to join your college leaderboard.
          </p>

          {error && (
            <div
              role="alert"
              className={`${MONO} mt-8 flex items-start gap-3 rounded-md border border-rose-500/30 bg-rose-500/[0.06] px-4 py-3 text-[12px] leading-5 text-rose-300`}
            >
              <span className="select-none text-rose-400">✕</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div
              role="status"
              className={`${MONO} mt-8 flex items-start gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-4 py-3 text-[12px] leading-5 text-emerald-300`}
            >
              <span className="select-none text-emerald-400">✓</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-10">

            {/* 01 — Account */}
            <fieldset className="space-y-5">
              <GroupLabel index="01">Account</GroupLabel>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="username" className={labelClass}>Username</label>
                  <input
                    required
                    id="username"
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    required
                    id="email"
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    autoComplete="email"
                    placeholder="you@college.edu"
                    className={inputClass}
                  />
                </div>
              </div>
            </fieldset>

            {/* 02 — College */}
            <fieldset className="space-y-5">
              <GroupLabel index="02">College</GroupLabel>

              <div>
                <label htmlFor="college_name" className={labelClass}>College</label>
                <div className="relative">
                  <select
                    id="college_name"
                    name='college_name'
                    value={formData.college_name}
                    onChange={handleChange}
                    className={`${selectClass} ${formData.college_name ? "" : "text-neutral-600"}`}
                  >
                    <option value="">Select College</option>
                    <option value="Anurag University">Anurag University</option>
                    <option value="Chaitanya Bharathi Institute of Technology">Chaitanya Bharathi Institute of Technology</option>
                    <option value="Gokaraju Rangaraju Institute of Technology">Gokaraju Rangaraju Institute of Technology</option>
                    <option value="Keshav Memorial Institute of Technology">Keshav Memorial Institute of Technology</option>
                    <option value="Muffakham Jah College of Engineering & Technology">Muffakham Jah College of Engineering & Technology</option>
                    <option value="Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology">Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering & Technology</option>
                    <option value="Vasavi College of Engineering">Vasavi College of Engineering</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              <div>
                <label htmlFor="year_of_joining" className={labelClass}>Year of joining</label>
                <div className="relative">
                  <select
                    id="year_of_joining"
                    name='year_of_joining'
                    value={formData.year_of_joining}
                    onChange={handleChange}
                    className={`${selectClass} ${formData.year_of_joining ? "" : "text-neutral-600"}`}
                  >
                    <option value="">Select Year</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                <p className={`${MONO} mt-2 text-[11px] text-neutral-600`}>
                  Used to show subjects relevant to your year.
                </p>
              </div>
            </fieldset>

            {/* 03 — Security */}
            <fieldset className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <GroupLabel index="03">Security</GroupLabel>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className={`${MONO} flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-neutral-200`}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPassword ? "hide" : "show"}
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <input
                    required
                    id="password"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter password"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="re_password" className={labelClass}>Confirm password</label>
                  <input
                    required
                    id="re_password"
                    name='re_password'
                    value={formData.re_password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    className={`${inputClass} ${
                      pwTouched && !pwMatch ? "border-rose-500/40 focus:border-rose-400/60 focus:ring-rose-400/20" : ""
                    }`}
                  />
                </div>
              </div>

              {pwTouched && (
                <p className={`${MONO} text-[11px] ${pwMatch ? "text-emerald-400" : "text-rose-400"}`}>
                  {pwMatch ? "✓ passwords match" : "✕ passwords don't match yet"}
                </p>
              )}
            </fieldset>

            <div>
              <button
                disabled={isLoading}
                type='submit'
                className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <div className="my-8 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>have an account?</span>
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <p className="text-center text-sm text-neutral-400">
                Already registered?{" "}
                <a
                  href="/login"
                  className="font-medium text-neutral-100 underline decoration-white/20 underline-offset-4 transition-colors hover:text-emerald-400 hover:decoration-emerald-400/60"
                >
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}


export default Signup