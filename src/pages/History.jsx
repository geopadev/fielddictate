import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function NoteCard({ note }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(note.formatted_note)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silent fail
    }
  }

  const formattedDate = new Date(note.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Pull first line as the "title" preview
  const preview = note.formatted_note?.split('\n').find(l => l.trim()) || 'Untitled note'

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      onClick={() => setExpanded(e => !e)}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-bold text-sm truncate">{preview}</p>
          <p className="text-slate-400 text-xs font-medium mt-0.5">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95
              ${copied
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <span className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>
      </div>

      {/* Expanded note body */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
          <pre className="text-slate-700 font-sans text-sm whitespace-pre-wrap leading-relaxed">
            {note.formatted_note}
          </pre>
        </div>
      )}
    </div>
  )
}

export function History() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNotes(data || [])
      } catch (err) {
        setError('Failed to load notes. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchNotes()
  }, [user])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto w-full px-6">
      {/* Header */}
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Note History</h1>
        </div>
        {notes.length > 0 && (
          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 pb-8">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-4">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-slate-500 font-semibold text-lg">No notes yet</p>
            <p className="text-slate-400 text-sm">Head to the dashboard to record your first job note.</p>
            <Link
              to="/dashboard"
              className="mt-2 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors active:scale-95"
            >
              Record a Note
            </Link>
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="flex flex-col gap-3">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
