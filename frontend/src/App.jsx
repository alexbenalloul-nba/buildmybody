import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Measurements from './pages/Measurements';

const navClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg font-medium transition-colors ${
    isActive ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
  }`;

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-6">
        <span className="text-2xl font-black text-brand-500 tracking-tight">BuildMyBody</span>
        <nav className="flex gap-2">
          <NavLink to="/" end className={navClass}>Dashboard</NavLink>
          <NavLink to="/workouts" className={navClass}>Workouts</NavLink>
          <NavLink to="/measurements" className={navClass}>Measurements</NavLink>
        </nav>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/measurements" element={<Measurements />} />
        </Routes>
      </main>
    </div>
  );
}
