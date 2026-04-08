import { Routes, Route, Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-4xl font-extrabold mb-4 text-center">FieldDictate</h1>
    <p className="text-lg text-slate-600 mb-8 max-w-md text-center">
      Log detailed job notes from your van using voice-to-text. High contrast, low friction.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
      <Link to="/dashboard" className="flex-1 px-8 py-4 bg-red-500 text-white rounded-xl font-bold text-center text-lg hover:bg-red-600 transition-colors shadow-lg active:scale-95">
        Log In
      </Link>
      <Link to="/pricing" className="flex-1 px-8 py-4 bg-slate-200 text-slate-900 rounded-xl font-bold text-center text-lg hover:bg-slate-300 transition-colors active:scale-95">
        Pricing
      </Link>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="min-h-screen p-6 flex flex-col max-w-3xl mx-auto w-full">
    <header className="flex justify-between items-center mb-12">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Link to="/" className="text-emerald-600 font-bold active:opacity-75">Sign Out</Link>
    </header>
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Massive Record Button */}
      <button className="w-56 h-56 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl flex items-center justify-center transform active:scale-95 transition-all mb-8">
        <span className="text-3xl font-extrabold">Tap to<br/>Record</span>
      </button>
      <p className="text-slate-500 font-medium text-lg">Speak your job notes</p>
    </div>
    <div className="mt-8 mb-4">
      <Link to="/history" className="block w-full py-5 text-center bg-slate-200 text-slate-900 font-bold text-lg rounded-xl active:bg-slate-300">
        View Note History
      </Link>
    </div>
  </div>
);

const History = () => (
  <div className="min-h-screen p-6 flex flex-col max-w-3xl mx-auto w-full">
    <header className="flex items-center mb-8 gap-4">
      <Link to="/dashboard" className="text-slate-500 font-bold text-lg active:opacity-75">← Back</Link>
      <h2 className="text-2xl font-bold">Note History</h2>
    </header>
    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
      <p className="text-lg font-medium">No notes recorded yet</p>
    </div>
  </div>
);

const Pricing = () => (
  <div className="min-h-screen p-6 flex flex-col items-center max-w-3xl mx-auto w-full">
    <header className="w-full mb-12">
      <Link to="/" className="text-slate-500 font-bold text-lg active:opacity-75">← Home</Link>
    </header>
    <h2 className="text-3xl font-bold mb-4">Pricing</h2>
    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-4">
      <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
      <p className="text-slate-500 font-medium mb-6">$10 / month</p>
      <ul className="space-y-4 mb-10 text-slate-700 font-medium">
        <li className="flex items-center gap-2">✓ Unlimited Transcriptions</li>
        <li className="flex items-center gap-2">✓ AI Note Formatting</li>
      </ul>
      <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all active:scale-95">
        Subscribe
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  );
}

export default App;
