

import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import {useState} from 'react'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://final-techfluent.onrender.com";  // deployed backend

const SERIF = "font-['Instrument_Serif',Georgia,serif] font-normal";
const MONO = "font-['JetBrains_Mono',ui-monospace,SFMono-Regular,monospace]";

function Login() {
  const navigate = useNavigate()


  const[formData, setFormData] = useState({
    username: '',
    password: '',
  })

    const[isLoading, setIsLoading] = useState(false)
    const[success, setSuccess] = useState(false)
    const [error,setError] = useState('')
    const [showPassword, setShowPassword] = useState(false) // UI-only

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
      const response = await axios.post(`${BASE_URL}/api/login/`, payload,{
        withCredentials: true,
      })
      console.log("success",response.data)
      setSuccess("Login successful")
      localStorage.setItem('access_token',response.data.access_token)
      localStorage.setItem('refresh_token',response.data.refresh_token)
      navigate('/dashboard')
    }catch (error) {
      console.log("Full error:", error.response?.data);
      if(error.response && error.response.data){
        setError(error.response.data.message)
        //alert("Error: " + JSON.stringify(err.response.data, null, 2));
      }
  }
    finally{
      setIsLoading(false)
    }
}

  const inputClass =
    "w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-neutral-100 placeholder:text-neutral-600 outline-none transition-colors duration-200 hover:border-white/20 focus:border-emerald-400/60 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-400/30"

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased lg:grid lg:grid-cols-2">

      {/* ---------------- Left: editorial panel (desktop) ---------------- */}
      <aside className="relative hidden overflow-hidden border-r border-white/[0.08] lg:flex lg:flex-col lg:justify-between p-12">
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
            <span className="text-emerald-400">●</span>&nbsp; Welcome back
          </p>
          <h2 className={`${SERIF} mt-6 text-6xl leading-[0.98] tracking-[-0.02em] text-neutral-50 xl:text-7xl`}>
            Pick up where <br />
            you <em className="text-emerald-400">left off.</em>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-neutral-400">
            Your concepts, streak and leaderboard rank are waiting. One more question gets you closer to
            placement-ready.
          </p>

          {/* session preview */}
          <div className="mt-10 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d0d]">
            <div className={`${MONO} flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 text-[11px] text-neutral-500`}>
              <span>session.restore</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> ready
              </span>
            </div>
            <div className={`${MONO} space-y-1 p-4 text-[12px] leading-6`}>
              <p><span className="text-emerald-400">~/prep</span> <span className="text-neutral-500">$</span> <span className="text-neutral-100">careerforge resume</span></p>
              <p className="text-neutral-500">› restoring progress · leaderboard · streak</p>
              <p className="text-neutral-500">› next up: your next unmastered concept</p>
              <p className="text-emerald-400">✓ authenticate to continue</p>
            </div>
          </div>
        </div>

        {/* footer meta */}
        <p className={`${MONO} relative text-[11px] uppercase tracking-[0.2em] text-neutral-600`}>
          Campus → Career
        </p>
      </aside>

      {/* ---------------- Right: form ---------------- */}
      <main className="flex min-h-screen items-center justify-center px-6 py-16 lg:min-h-0">
        <div className="w-full max-w-sm">

          {/* mobile logo */}
          <Link to="/" className="mb-12 flex w-fit items-center gap-2.5 lg:hidden">
            <span className={`${MONO} flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-[11px] font-semibold text-emerald-400`}>
              cf
            </span>
            <span className="text-[17px] font-medium tracking-tight text-neutral-100">
              Career<em className={`${SERIF} text-[20px] text-neutral-400`}>Forge</em>
            </span>
          </Link>

          <form onSubmit={handleSubmit} noValidate>
            <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-neutral-500`}>
              <span className="text-emerald-400">01</span> — Sign in
            </p>
            <h1 className={`${SERIF} mt-4 text-5xl leading-none tracking-[-0.01em] text-neutral-50`}>
              Log <em className="text-neutral-500">in</em>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Log in to view your interview progress and leaderboard rank.
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

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="username" className={`${MONO} mb-2 block text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>
                  Username
                </label>
                <input
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
                <label htmlFor="password" className={`${MONO} mb-2 block text-[11px] uppercase tracking-[0.15em] text-neutral-500`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-white/[0.08]" />
              <span className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-neutral-600`}>new here?</span>
              <span className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <p className="text-center text-sm text-neutral-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-neutral-100 underline decoration-white/20 underline-offset-4 transition-colors hover:text-emerald-400 hover:decoration-emerald-400/60"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Login