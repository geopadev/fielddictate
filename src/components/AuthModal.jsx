import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ─── Password Rules ───────────────────────────────────────────────────────────
const RULES = [
  { id: 'length',    label: 'At least 8 characters',       test: p => p.length >= 8 },
  { id: 'upper',     label: 'One uppercase letter (A–Z)',   test: p => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'One lowercase letter (a–z)',   test: p => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',             test: p => /[0-9]/.test(p) },
  { id: 'special',   label: 'One special character (!@#$…)',test: p => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password) {
  const passed = RULES.filter(r => r.test(password)).length
  if (passed === 0) return { score: 0, label: '',          color: '' }
  if (passed === 1) return { score: 1, label: 'Very Weak', color: 'bg-red-500' }
  if (passed === 2) return { score: 2, label: 'Weak',      color: 'bg-orange-400' }
  if (passed === 3) return { score: 3, label: 'Fair',      color: 'bg-yellow-400' }
  if (passed === 4) return { score: 4, label: 'Strong',    color: 'bg-emerald-400' }
  return              { score: 5, label: 'Very Strong', color: 'bg-emerald-600' }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AuthModal({ onClose }) {
  const [mode, setMode]       = useState('login') // 'login' | 'signup' | 'forgot_password'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [touched, setTouched] = useState(false)   // only show rules after first keystroke
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const strength = useMemo(() => getStrength(password), [password])
  const allRulesPassed = RULES.every(r => r.test(password))

  const switchMode = (m) => { setMode(m); setError(null); setMessage(null); setPassword(''); setTouched(false) }

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    // Client-side password guard for signup
    if (mode === 'signup' && !allRulesPassed) {
      setError('Please choose a password that meets all the requirements below.')
      return
    }

    setLoading(true)

    if (mode === 'forgot_password') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) setError(error.message)
      else setMessage('Password reset link sent! Please check your email.')
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Incorrect email or password. Please try again.')
      else navigate('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Account created! Please check your email to confirm your account.')
    }

    setLoading(false)
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-8 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Logo mark ── */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>

        {/* ── Mode header ── */}
        {mode !== 'forgot_password' ? (
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8 transition-colors">
            <button
              className={`flex-1 py-3 font-bold text-base transition-colors ${mode === 'login' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              onClick={() => switchMode('login')}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-3 font-bold text-base transition-colors ${mode === 'signup' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              onClick={() => switchMode('signup')}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">Reset Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Enter your email and we'll send you a link.</p>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 transition-colors">
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Password */}
          {mode !== 'forgot_password' && (
            <div>
              <label htmlFor="auth-password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setTouched(true) }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* ── Strength meter (signup only) ── */}
              {mode === 'signup' && touched && password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {/* Bar */}
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`}
                      />
                    ))}
                  </div>
                  {/* Label */}
                  <p className={`text-xs font-bold transition-colors ${
                    strength.score <= 2 ? 'text-red-500' :
                    strength.score === 3 ? 'text-yellow-500' :
                    'text-emerald-500'
                  }`}>
                    {strength.label}
                  </p>

                  {/* Rules checklist */}
                  <ul className="space-y-1 mt-1">
                    {RULES.map(rule => {
                      const ok = rule.test(password)
                      return (
                        <li key={rule.id} className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${ok ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {ok && (
                              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          {rule.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Forgot password link (login mode) */}
              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot_password')}
                    className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          {error   && <p className="text-red-500 text-sm font-medium">{error}</p>}
          {message && <p className="text-emerald-600 text-sm font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-lg rounded-xl shadow-lg transition-all disabled:opacity-60 mt-2"
          >
            {loading
              ? 'Please wait…'
              : mode === 'forgot_password'
                ? 'Send Link'
                : mode === 'login'
                  ? 'Log In'
                  : 'Create Account'}
          </button>

          {mode === 'forgot_password' && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors mt-2"
            >
              Back to Log In
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
