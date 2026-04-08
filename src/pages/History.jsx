import { Link } from 'react-router-dom'

export function History() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto w-full px-6">
      <header className="flex items-center gap-4 py-6">
        <Link to="/dashboard" className="text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">← Dashboard</Link>
        <h1 className="text-xl font-extrabold text-slate-900">Note History</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <p className="text-slate-400 font-medium text-lg">No notes recorded yet.</p>
      </main>
    </div>
  )
}
