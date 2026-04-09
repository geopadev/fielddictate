import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

// Lemon Squeezy checkout overlay - loads their script once
function useLemonSqueezy() {
  useEffect(() => {
    // Check if already loaded
    if (window.createLemonSqueezy) return

    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    script.onload = () => {
      if (window.createLemonSqueezy) window.createLemonSqueezy()
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])
}

// Your Lemon Squeezy checkout URL — set this as VITE_LEMONSQUEEZY_CHECKOUT_URL in .env.local
const CHECKOUT_URL = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_URL || '#'

export function Pricing() {
  const { user } = useAuth()
  useLemonSqueezy()

  // Build checkout URL with prefilled email if user is logged in
  const checkoutUrl = user
    ? `${CHECKOUT_URL}?checkout[email]=${encodeURIComponent(user.email)}&checkout[custom][user_id]=${user.id}`
    : CHECKOUT_URL

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col max-w-2xl mx-auto w-full px-6">
      {/* Header */}
      <header className="flex flex-col-reverse sm:flex-row items-center justify-between py-6 gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ThemeToggle />
          <Link to="/" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Home
          </Link>
          <Link to="/contact" className="text-slate-500 dark:text-slate-400 font-semibold text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
            Contact
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:ml-2 transition-colors w-full text-center sm:w-auto sm:text-left">Pricing</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-8 gap-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors">Simple, honest pricing</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 transition-colors">Built for field technicians who need it to just work.</p>
        </div>

        {/* Free tier */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 shadow-sm transition-colors">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Free</h3>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">$0</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 transition-colors">Get started at no cost.</p>
          <ul className="space-y-3 mb-8 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> 10 transcriptions / month</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> AI Note Formatting</li>
            <li className="flex items-center gap-2"><span className="text-slate-300 dark:text-slate-600 font-extrabold">✗</span> <span className="text-slate-400 dark:text-slate-500">Note History</span></li>
          </ul>
          {user ? (
            <Link to="/dashboard" className="block w-full py-3.5 text-center bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-all active:scale-95">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/" className="block w-full py-3.5 text-center bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-all active:scale-95">
              Get Started Free
            </Link>
          )}
        </div>

        {/* Pro tier */}
        <div className="w-full max-w-sm bg-slate-900 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-2xl p-7 shadow-xl relative overflow-hidden transition-colors">
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="inline-block bg-red-500 text-white text-xs font-extrabold px-3 py-1 rounded-full mb-4">
            PRO
          </div>
          <h3 className="text-xl font-extrabold text-white mb-1">Pro Plan</h3>
          <p className="text-4xl font-extrabold text-white mb-1">
            $10<span className="text-lg text-slate-400 font-semibold"> /month</span>
          </p>
          <p className="text-slate-400 font-medium mb-6">Everything you need in the field.</p>
          <ul className="space-y-3 mb-8 text-slate-300 font-semibold text-sm">
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-extrabold">✓</span> Unlimited Transcriptions</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-extrabold">✓</span> AI Note Formatting</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-extrabold">✓</span> Full Note History</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-extrabold">✓</span> Priority Support</li>
          </ul>

          {/* Lemon Squeezy Overlay Checkout Button */}
          <a
            href={checkoutUrl}
            className="lemonsqueezy-button block w-full py-4 text-center bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-lg rounded-xl shadow-lg transition-all active:scale-95"
          >
            Subscribe Now →
          </a>
          <p className="text-slate-500 text-xs text-center mt-3 font-medium">
            Cancel anytime · Secure checkout by Lemon Squeezy
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs font-medium transition-colors">
        All payments securely processed by{' '}
        <a href="https://lemonsqueezy.com" target="_blank" rel="noreferrer" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          Lemon Squeezy
        </a>
      </footer>
    </div>
  )
}
