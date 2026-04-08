import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthModal } from '../components/AuthModal'
import { useAuth } from '../context/AuthContext'

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo mark */}
        <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Field<span className="text-red-500">Dictate</span>
        </h1>
        <p className="text-xl text-slate-600 mb-2 font-medium max-w-sm">
          Voice-to-text job notes built for the field.
        </p>
        <p className="text-base text-slate-400 mb-12 max-w-xs">
          Speak your notes from the van. AI formats them. One tap to copy.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['⚡ Instant Transcription', '🤖 AI Formatted Notes', '📋 One-Tap Copy'].map(f => (
            <span key={f} className="bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-sm">{f}</span>
          ))}
        </div>

        {/* CTAs */}
        {user ? (
          <Link
            to="/dashboard"
            className="w-full max-w-xs py-5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-all active:scale-95 text-center block"
          >
            Go to Dashboard →
          </Link>
        ) : (
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={() => setShowAuth(true)}
              className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-all active:scale-95"
            >
              Get Started — Free
            </button>
            <Link
              to="/pricing"
              className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all active:scale-95 text-center"
            >
              View Pricing
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-sm font-medium">
        Built for plumbers, electricians & HVAC techs.
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
