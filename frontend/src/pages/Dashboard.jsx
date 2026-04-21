import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { WORKOUTS_PER_LEVEL, levelNumber, workoutsToNextLevel } from '../utils/levels';

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value ?? '—'}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  const level = stats ? levelNumber(stats.totalWorkouts) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user?.name && <p className="text-gray-400 mt-1">Welcome back, {user.name}!</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Workouts" value={stats?.totalWorkouts} />
        <StatCard label="Current Level" value={level ? `Level ${level}` : null} />
        <StatCard
          label="To Next Level"
          value={stats ? `${workoutsToNextLevel(stats.totalWorkouts)} workouts` : null}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Workouts</h2>
        {stats?.recentWorkouts?.length ? (
          <ul className="space-y-2">
            {stats.recentWorkouts.map((w) => (
              <li key={w.id}>
                <Link
                  to={`/workouts/${w.id}`}
                  className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-brand-600 transition-colors"
                >
                  <span className="font-medium">{w.name}</span>
                  <span className="text-gray-400 text-sm">{w.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No workouts yet.{' '}
            <Link to="/workouts" className="text-brand-500 hover:underline">
              Log your first one!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
