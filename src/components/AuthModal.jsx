import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot_password'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'forgot_password') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Password reset link sent! Please check your email.')
      }
    } else if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created! Please check your email to confirm your account.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Tab toggle - Hide if in forgot password mode */}
        {mode !== 'forgot_password' ? (
          <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-8">
            <button
              className={`flex-1 py-3 font-bold text-base transition-colors ${mode === 'login' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => { setMode('login'); setError(null); setMessage(null) }}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-3 font-bold text-base transition-colors ${mode === 'signup' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
              onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Reset Password</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send you a link.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          {mode !== 'forgot_password' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); setError(null); setMessage(null); }}
                    className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          {message && <p className="text-emerald-600 text-sm font-medium">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-lg rounded-xl shadow-lg transition-all disabled:opacity-60 mt-2"
          >
            {loading 
              ? 'Please wait...' 
              : mode === 'forgot_password' 
                ? 'Send Link' 
                : mode === 'login' 
                  ? 'Log In' 
                  : 'Create Account'
            }
          </button>
          
          {mode === 'forgot_password' && (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors mt-2"
            >
              Back to Log In
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
