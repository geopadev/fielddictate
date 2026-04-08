import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto w-full px-6">
      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <span className="font-extrabold text-xl text-slate-900">Field<span className="text-red-500">Dictate</span></span>
        <div className="flex items-center gap-4">
          <Link to="/history" className="text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">History</Link>
          <button onClick={handleSignOut} className="text-slate-500 font-semibold text-sm hover:text-red-500 transition-colors">Sign Out</button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <p className="text-slate-500 font-medium mb-10 text-lg">Tap the button and speak your job notes</p>

        {/* Record Button */}
        <button
          id="record-btn"
          className="w-56 h-56 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-2xl flex flex-col items-center justify-center transform active:scale-95 transition-all mb-10 select-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          <span className="text-xl font-extrabold">Tap to Record</span>
        </button>

        {/* Result area placeholder */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-slate-400 text-center font-medium">Your formatted note will appear here...</p>
        </div>
      </main>
    </div>
  )
}
