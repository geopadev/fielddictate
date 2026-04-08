import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase will automatically parse the hash in the URL and set the session.
    // Listen for the hashchange or check if session exists.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        setError('Invalid or expired reset link. Please try requesting a new one.')
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password has been successfully updated.')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="py-6 flex justify-center">
        <Link to="/" className="font-extrabold text-xl text-slate-900">
          Field<span className="text-red-500">Dictate</span>
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Set New Password</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            {message && <p className="text-emerald-600 text-sm font-medium">{message}</p>}

            <button
              type="submit"
              disabled={loading || !!message}
              className="w-full py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-lg rounded-xl shadow-lg transition-all disabled:opacity-60 mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            
            {error && (
               <Link
               to="/"
               className="block text-center mt-4 text-sm font-bold text-slate-500 hover:text-slate-700 underline"
             >
               Return to Login
             </Link>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
