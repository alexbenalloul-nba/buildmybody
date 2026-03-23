import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value ?? '—'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  const m = stats?.latestMeasurement;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Workouts" value={stats?.totalWorkouts} />
        <StatCard label="Weight (lbs)" value={m?.weight_lbs} />
        <StatCard label="Body Fat %" value={m?.body_fat_pct ? `${m.body_fat_pct}%` : null} />
        <StatCard label="Last Measurement" value={m?.date} />
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
          <p className="text-gray-500">No workouts yet. <Link to="/workouts" className="text-brand-500 hover:underline">Log your first one!</Link></p>
        )}
      </div>
    </div>
  );
}
