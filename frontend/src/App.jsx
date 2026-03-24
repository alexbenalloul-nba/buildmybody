import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';
import { api } from './api';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';
import CoachDashboard from './pages/CoachDashboard';
import ClientProfile from './pages/ClientProfile';
import Messages from './pages/Messages';

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg font-medium transition-colors ${
    isActive ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`;

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5">
      {count > 9 ? '9+' : count}
    </span>
  );
}

function ProtectedLayout() {
  const { user, logout } = useAuth();
  const isCoach = user?.role === 'coach';
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isCoach) {
      api.getUnreadCount().then((d) => setUnread(d.count)).catch(() => {});
      const interval = setInterval(() => {
        api.getUnreadCount().then((d) => setUnread(d.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isCoach]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black text-brand-500 tracking-tight">BuildMyBody</span>
          <nav className="flex gap-2">
            {isCoach ? (
              <>
                <NavLink to="/coach" end className={navClass}>Clients</NavLink>
                <NavLink to="/" end className={navClass}>My Workouts</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" end className={navClass}>Dashboard</NavLink>
                <NavLink to="/workouts" className={navClass}>Workouts</NavLink>
                <NavLink to="/progress" className={navClass}>Progress</NavLink>
                <NavLink to="/messages" className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    isActive ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }>
                  Messages<UnreadBadge count={unread} />
                </NavLink>
              </>
            )}
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
          {isCoach ? (
            <>
              <Route path="/coach" element={<CoachDashboard />} />
              <Route path="/coach/clients/:id" element={<ClientProfile />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="*" element={<Navigate to="/coach" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workouts/:id" element={<WorkoutDetail />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/coach/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
      </Routes>
    );
  }

  return <ProtectedLayout />;
}
