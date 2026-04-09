import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { transcribeAndFormat } from '../lib/gemini'
import { ThemeToggle } from '../components/ThemeToggle'

const STATE = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error',
}

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appState, setAppState] = useState(STATE.IDLE)
  const [formattedNote, setFormattedNote] = useState('')
  const [rawTranscript, setRawTranscript] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await processAudio(blob)
      }

      recorder.start()
      setAppState(STATE.RECORDING)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.')
      setAppState(STATE.ERROR)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setAppState(STATE.PROCESSING)
      mediaRecorderRef.current.stop()
    }
  }, [])

  const processAudio = async (blob) => {
    try {
      const formatted = await transcribeAndFormat(blob)
      setFormattedNote(formatted)
      setRawTranscript('')
      setAppState(STATE.DONE)

      // Save to Supabase (Pro feature only)
      if (user?.isPro) {
        await supabase.from('notes').insert({
          user_id: user.id,
          raw_transcript: formatted,
          formatted_note: formatted,
        })
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
      setAppState(STATE.ERROR)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedNote)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setError('Failed to copy to clipboard.')
    }
  }

  const handleReset = () => {
    setAppState(STATE.IDLE)
    setFormattedNote('')
    setError(null)
    setCopied(false)
  }

  const isRecording = appState === STATE.RECORDING
  const isProcessing = appState === STATE.PROCESSING

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col max-w-2xl mx-auto w-full px-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
        <span className="font-extrabold text-xl text-slate-900 dark:text-white">
          Field<span className="text-red-500">Dictate</span>
        </span>
        <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6">
          <ThemeToggle />
          <Link to="/history" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
            History
          </Link>
          <Link to="/contact" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/pricing" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Upgrade
          </Link>
          <button onClick={handleSignOut} className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 gap-8">

        {/* Record Button */}
        {(appState === STATE.IDLE || appState === STATE.RECORDING || appState === STATE.ERROR) && (
          <div className="flex flex-col items-center gap-4">
            <button
              id="record-btn"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-52 h-52 rounded-full text-white shadow-2xl flex flex-col items-center justify-center transform active:scale-95 transition-all select-none
                ${isRecording
                  ? 'bg-red-600 shadow-red-200 shadow-2xl animate-pulse'
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              {isRecording ? (
                <>
                  <span className="w-10 h-10 bg-white rounded-md mb-3 opacity-90" />
                  <span className="text-lg font-extrabold">Tap to Stop</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xl font-extrabold">Tap to Record</span>
                </>
              )}
            </button>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
              {isRecording ? '🔴 Recording... tap to stop' : 'Speak your job notes clearly'}
            </p>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-xl font-extrabold text-slate-900 dark:text-white transition-colors">Processing your note...</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Gemini AI is formatting your note</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {appState === STATE.ERROR && error && (
          <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-5">
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
            <button onClick={handleReset} className="mt-3 text-sm font-bold text-red-500 hover:text-red-700 underline">
              Try again
            </button>
          </div>
        )}

        {/* Result State */}
        {appState === STATE.DONE && formattedNote && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white transition-colors">Your Job Note</h2>
              <button onClick={handleReset} className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                + New Note
              </button>
            </div>

            {/* Note output */}
            <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-colors">
              <pre className="text-slate-800 dark:text-slate-200 font-sans text-sm whitespace-pre-wrap leading-relaxed">
                {formattedNote}
              </pre>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`w-full py-4 font-extrabold text-lg rounded-2xl shadow-md transition-all active:scale-95
                ${copied
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
