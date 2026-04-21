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
import AdminDashboard from './pages/AdminDashboard';
import ClientProfile from './pages/ClientProfile';
import Messages from './pages/Messages';

const navClass = ({ isActive }) =>
  `text-[13px] font-medium pb-0.5 border-b transition-all duration-200 ${
    isActive
      ? 'text-white border-white'
      : 'text-[#555] border-transparent hover:text-[#aaa]'
  }`;

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center bg-white text-black text-[10px] font-bold rounded-full w-4 h-4">
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
    <div className="min-h-screen flex flex-col bg-black">
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[15px] font-semibold text-white tracking-tight">BuildMyBody</span>
          <nav className="flex gap-6">
            {isCoach ? (
              <>
                <NavLink to="/coach" end className={navClass}>Clients</NavLink>
                <NavLink to="/admin" className={navClass}>Admin</NavLink>
                <NavLink to="/" end className={navClass}>My Workouts</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" end className={navClass}>Dashboard</NavLink>
                <NavLink to="/workouts" className={navClass}>Workouts</NavLink>
                <NavLink to="/progress" className={navClass}>Progress</NavLink>
                <NavLink
                  to="/messages"
                  className={({ isActive }) =>
                    `text-[13px] font-medium pb-0.5 border-b transition-all duration-200 flex items-center ${
                      isActive
                        ? 'text-white border-white'
                        : 'text-[#555] border-transparent hover:text-[#aaa]'
                    }`
                  }
                >
                  Messages<UnreadBadge count={unread} />
                </NavLink>
              </>
            )}
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-[#444] hover:text-[#aaa] text-[13px] transition-colors duration-200"
        >
          Sign Out
        </button>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <Routes>
          {isCoach ? (
            <>
              <Route path="/coach" element={<CoachDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#333] text-sm">Loading…</div>
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
