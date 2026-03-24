import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg font-medium transition-colors ${
    isActive ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`;

function ProtectedLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black text-brand-500 tracking-tight">BuildMyBody</span>
          <nav className="flex gap-2">
            <NavLink to="/" end className={navClass}>Dashboard</NavLink>
            <NavLink to="/workouts" className={navClass}>Workouts</NavLink>
            <NavLink to="/progress" className={navClass}>Progress</NavLink>
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  // Still checking auth
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  // Not logged in → landing page
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  // Logged in → app
  return <ProtectedLayout />;
}
