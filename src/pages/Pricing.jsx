import { Link } from 'react-router-dom'

export function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto w-full px-6">
      <header className="flex items-center gap-4 py-6">
        <Link to="/" className="text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">← Home</Link>
        <h1 className="text-xl font-extrabold text-slate-900">Pricing</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4">MOST POPULAR</div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Pro Plan</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-1">$10<span className="text-lg text-slate-500 font-semibold"> /month</span></p>
          <p className="text-slate-500 font-medium mb-8">Everything you need in the field.</p>
          <ul className="space-y-3 mb-10 text-slate-700 font-semibold">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Unlimited Transcriptions</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> AI Note Formatting</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-extrabold">✓</span> Full Note History</li>
          </ul>
          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-xl shadow-lg transition-all active:scale-95">
            Subscribe Now
          </button>
        </div>
      </main>
    </div>
  )
}
