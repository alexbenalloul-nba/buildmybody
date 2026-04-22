import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AnatomyFigure from '../components/AnatomyFigure';

// ── App UI Mockup ─────────────────────────────────────────────────────────────

function AppMockup() {
  return (
    <div className="w-full max-w-xs mx-auto select-none pointer-events-none">
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
        {/* Mockup top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#161616]">
          <span className="text-white text-xs font-semibold tracking-tight">BuildMyBody</span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
            <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
            <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
          </div>
        </div>
        {/* Mockup body */}
        <div className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 bg-[#1e1e1e] rounded-full" />
              <div className="h-2 w-14 bg-[#141414] rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#222]" />
          </div>
          {/* Stat cards row */}
          <div className="grid grid-cols-3 gap-2">
            {['', '', ''].map((_, i) => (
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-3">
                <div className="h-4 w-7 bg-[#1e1e1e] rounded mb-2" />
                <div className="h-1.5 w-9 bg-[#141414] rounded-full" />
              </div>
            ))}
          </div>
          {/* Workout list */}
          {[90, 65, 75].map((w, i) => (
            <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2.5 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-[#1e1e1e]" style={{ width: `${w}px` }} />
                <div className="h-1.5 w-10 bg-[#141414] rounded-full" />
              </div>
              <div className="h-1.5 w-4 bg-[#222] rounded-full" />
            </div>
          ))}
          {/* Progress bar */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-3">
            <div className="flex justify-between mb-2">
              <div className="h-2 w-12 bg-[#1e1e1e] rounded-full" />
              <div className="h-2 w-8 bg-[#141414] rounded-full" />
            </div>
            <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full">
              <div className="h-1.5 bg-white rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────

function AuthModal({ initialMode, onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

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

  const inputCls =
    'w-full bg-[#0a0a0a] border border-[#222] hover:border-[#333] focus:border-white rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none transition-colors duration-200';

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-1">
          {mode === 'register' ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-[#555] text-sm mb-6">
          {mode === 'register'
            ? 'Start tracking your progress today.'
            : 'Sign in to your account.'}
        </p>

        {/* Google OAuth */}
        <a
          href={`${BACKEND_URL}/api/auth/google`}
          className="flex items-center justify-center gap-3 w-full bg-white hover:bg-[#efefef] text-black font-medium py-2.5 rounded-xl transition-all duration-200 mb-4 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </a>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <span className="text-[#444] text-xs">or</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            className="w-full bg-white hover:bg-[#e5e5e5] text-black py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 text-sm"
          >
            {loading ? 'Please wait…' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#444] text-sm mt-5">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-white hover:underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-white hover:underline">
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────

export default function Landing() {
  const [modal, setModal] = useState(null); // 'login' | 'register' | null
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-40 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-black/75 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        {/* Wordmark */}
        <span className="text-[15px] font-semibold tracking-tight text-white">BuildMyBody</span>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'For Coaches', 'Pricing', 'Resources'].map((item) => (
            <button
              key={item}
              className="text-[13px] text-[#777] hover:text-white tracking-wide transition-colors duration-200"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setModal('login')}
            className="text-[13px] text-[#777] hover:text-white transition-colors duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => setModal('register')}
            className="text-[13px] bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-[#e5e5e5] transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
          <span className="text-[11px] text-[#888] tracking-widest uppercase font-medium">
            Now available
          </span>
        </div>

        {/* Floating emojis */}
        <div className="flex items-end justify-center gap-14 mb-6 h-16 select-none pointer-events-none">
          <span className="emoji-float-1" style={{ fontSize: '48px', marginBottom: '4px' }}>⚡</span>
          <span className="emoji-float-2" style={{ fontSize: '48px', marginBottom: '0px' }}>🏋️</span>
          <span className="emoji-float-3" style={{ fontSize: '48px', marginBottom: '8px' }}>💪</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(48px,8vw,88px)] font-bold leading-[1.05] tracking-[-0.03em] mb-5 max-w-3xl">
          Track your gains.
        </h1>

        {/* Subtitle */}
        <p className="text-[#666] text-lg sm:text-xl max-w-md mb-10 leading-relaxed font-light">
          Log every workout, watch your progress climb, and build the body you want — one session at a time.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-20">
          <button
            onClick={() => setModal('register')}
            className="px-7 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-[#e5e5e5] transition-all duration-200 min-w-[160px]"
          >
            Get Started Free
          </button>
          <button
            onClick={() => setModal('login')}
            className="px-7 py-3 border border-[#2a2a2a] text-[#aaa] rounded-full font-medium text-sm hover:border-[#444] hover:text-white transition-all duration-200 min-w-[140px]"
          >
            Sign In
          </button>
        </div>

        <AnatomyFigure className="max-w-sm mx-auto" />

        {/* App mockup */}
        <div className="w-full max-w-[280px] mx-auto">
          <AppMockup />
        </div>
      </main>

      {/* ── Features ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Log Workouts',
              desc: 'Track every set, rep, and exercise with a clean, fast interface.',
            },
            {
              title: 'Monitor Progress',
              desc: 'Visualize your gains over time with charts and milestone tracking.',
            },
            {
              title: 'Coach Connect',
              desc: 'Work with your coach in real-time through built-in messaging.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#080808] border border-[#161616] rounded-2xl p-6 hover:border-[#2a2a2a] transition-colors duration-300"
            >
              <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 py-20 text-center border-t border-[#111]">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Ready to start?
        </h2>
        <p className="text-[#555] text-base mb-8 max-w-sm mx-auto">
          Join and start tracking your fitness journey today.
        </p>
        <button
          onClick={() => setModal('register')}
          className="px-8 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-[#e5e5e5] transition-all duration-200"
        >
          Create Free Account
        </button>
      </section>

      {/* ── Auth modal ── */}
      {modal && (
        <AuthModal initialMode={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
