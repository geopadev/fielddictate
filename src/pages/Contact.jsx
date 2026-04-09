import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

export function Contact() {
  const { user } = useAuth()
  const [status, setStatus] = useState('IDLE') // IDLE, SUBMITTING, SUCCESS, ERROR
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('SUBMITTING')
    setErrorMessage('')

    const formData = new FormData(e.target)
    
    // Add Web3Forms access key
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    formData.append('access_key', accessKey)

    // Optional: Add subject & redirect bypass
    formData.append('subject', 'New FieldDictate Support Request')
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus('SUCCESS')
        e.target.reset()
      } else {
        throw new Error(data.message || 'Something went wrong.')
      }
    } catch (error) {
      setStatus('ERROR')
      setErrorMessage(error.message || 'Failed to submit form.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col max-w-2xl mx-auto w-full px-6">
      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <Link to="/" className="font-extrabold text-xl text-slate-900 dark:text-white transition-colors">
          Field<span className="text-red-500">Dictate</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link to="/history" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            History
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col py-6 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors">Contact Us</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Have an issue or a feature request? Let us know!</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm transition-colors">
          {status === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors">Message Sent!</h2>
              <p className="text-slate-500 dark:text-slate-400 transition-colors">We've received your message and will get back to you soon.</p>
              <button 
                onClick={() => setStatus('IDLE')}
                className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  defaultValue={user?.email || ''}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Message</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows="5"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                ></textarea>
              </div>

              {/* Error Message */}
              {status === 'ERROR' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50 transition-colors">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold transition-colors">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'SUBMITTING'}
                className="mt-2 w-full py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold text-lg rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {status === 'SUBMITTING' ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
