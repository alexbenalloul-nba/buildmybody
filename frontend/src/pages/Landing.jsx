import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// ── SVG Stick Figures ─────────────────────────────────────────────────────────

function SkinnyStickie() {
  return (
    <svg viewBox="0 0 120 220" width="120" height="220" aria-label="Skinny stick figure doing front double bicep pose">
      {/* Head */}
      <circle cx="60" cy="22" r="14" stroke="#4ade80" strokeWidth="2.5" fill="none" />
      {/* Neck */}
      <line x1="60" y1="36" x2="60" y2="48" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Torso */}
      <line x1="60" y1="48" x2="60" y2="115" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Shoulder bar */}
      <line x1="34" y1="62" x2="86" y2="62" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left upper arm — elbow out */}
      <line x1="34" y1="62" x2="18" y2="88" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left forearm — up */}
      <line x1="18" y1="88" x2="24" y2="58" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left fist */}
      <circle cx="24" cy="54" r="5" stroke="#4ade80" strokeWidth="2" fill="none" />
      {/* Right upper arm */}
      <line x1="86" y1="62" x2="102" y2="88" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right forearm — up */}
      <line x1="102" y1="88" x2="96" y2="58" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right fist */}
      <circle cx="96" cy="54" r="5" stroke="#4ade80" strokeWidth="2" fill="none" />
      {/* Hip bar */}
      <line x1="44" y1="115" x2="76" y2="115" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="44" y1="115" x2="36" y2="178" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left foot */}
      <line x1="36" y1="178" x2="24" y2="182" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="76" y1="115" x2="84" y2="178" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right foot */}
      <line x1="84" y1="178" x2="96" y2="182" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function JackedStickie() {
  return (
    <svg viewBox="0 0 160 220" width="160" height="220" aria-label="Muscular stick figure doing front double bicep pose">
      {/* Head — slightly larger */}
      <circle cx="80" cy="22" r="16" stroke="#4ade80" strokeWidth="3" fill="none" />
      {/* Neck — thick */}
      <rect x="72" y="37" width="16" height="12" rx="4" stroke="#4ade80" strokeWidth="2.5" fill="none" />
      {/* Traps — wide trapezoid shoulders */}
      <path d="M 36,72 L 44,50 L 116,50 L 124,72" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinejoin="round" />
      {/* V-taper torso */}
      <path d="M 36,72 L 54,118 L 106,118 L 124,72" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinejoin="round" />
      {/* Chest line */}
      <line x1="52" y1="82" x2="108" y2="82" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Abs lines */}
      <line x1="72" y1="92" x2="88" y2="92" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="104" x2="90" y2="104" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Left upper arm — thick with bicep bulge */}
      <path d="M 44,50 Q 10,58 12,90" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Left bicep peak ellipse */}
      <ellipse cx="20" cy="68" rx="10" ry="6" transform="rotate(-30 20 68)" stroke="#4ade80" strokeWidth="2" fill="none" />
      {/* Left forearm */}
      <line x1="12" y1="90" x2="22" y2="56" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left fist */}
      <rect x="16" y="46" width="12" height="10" rx="3" stroke="#4ade80" strokeWidth="2.5" fill="none" />

      {/* Right upper arm — thick with bicep bulge */}
      <path d="M 116,50 Q 150,58 148,90" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Right bicep peak ellipse */}
      <ellipse cx="140" cy="68" rx="10" ry="6" transform="rotate(30 140 68)" stroke="#4ade80" strokeWidth="2" fill="none" />
      {/* Right forearm */}
      <line x1="148" y1="90" x2="138" y2="56" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right fist */}
      <rect x="132" y="46" width="12" height="10" rx="3" stroke="#4ade80" strokeWidth="2.5" fill="none" />

      {/* Hip bar */}
      <line x1="54" y1="118" x2="106" y2="118" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
      {/* Left quad — wide */}
      <path d="M 54,118 Q 44,150 46,178" stroke="#4ade80" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Left calf */}
      <path d="M 46,178 Q 42,192 44,200" stroke="#4ade80" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Left foot */}
      <line x1="44" y1="200" x2="30" y2="205" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
      {/* Right quad — wide */}
      <path d="M 106,118 Q 116,150 114,178" stroke="#4ade80" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Right calf */}
      <path d="M 114,178 Q 118,192 116,200" stroke="#4ade80" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Right foot */}
      <line x1="116" y1="200" x2="130" y2="205" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────

function AuthModal({ mode, onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://buildmybody-production.up.railway.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ email, password, name });
      } else {
        await login({ email, password });
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">{mode === 'register' ? 'Create Account' : 'Sign In'}</h2>

        {/* Google OAuth */}
        <a
          href={`${BACKEND_URL}/api/auth/google`}
          className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-2.5 rounded-lg transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </a>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              className={inputCls}
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className={inputCls}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputCls}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait…' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          {mode === 'register' ? (
            <>Already have an account?{' '}<button onClick={() => onClose('login')} className="text-brand-500 hover:underline">Sign in</button></>
          ) : (
            <>Don't have an account?{' '}<button onClick={() => onClose('register')} className="text-brand-500 hover:underline">Sign up</button></>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────

export default function Landing() {
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-900">
        <span className="text-2xl font-black text-brand-500 tracking-tight">BuildMyBody</span>
        <div className="flex gap-3">
          <button
            onClick={() => setModal('login')}
            className="px-5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => setModal('register')}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
          Track your gains.<br />
          <span className="text-brand-500">Level up.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mb-12">
          Log every workout, watch your level climb, and build the body you want — one session at a time.
        </p>

        {/* Stick figure illustration */}
        <div className="flex items-end justify-center gap-10 sm:gap-16 mb-12">
          <div className="flex flex-col items-center gap-3">
            <SkinnyStickie />
            <span className="text-gray-500 text-sm">Day 1</span>
          </div>
          <div className="text-gray-600 text-3xl font-bold mb-8">→</div>
          <div className="flex flex-col items-center gap-3">
            <JackedStickie />
            <span className="text-brand-400 text-sm font-medium">Level 50</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setModal('register')}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Get Started Free
          </button>
          <button
            onClick={() => setModal('login')}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold text-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </main>

      {/* Auth modal */}
      {modal && (
        <AuthModal
          mode={modal}
          onClose={(switchTo) => {
            if (switchTo === 'login' || switchTo === 'register') setModal(switchTo);
            else setModal(null);
          }}
        />
      )}
    </div>
  );
}
