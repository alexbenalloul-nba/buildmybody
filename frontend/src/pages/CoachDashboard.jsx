import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const WORKOUTS_PER_LEVEL = 5;

function levelLabel(total) {
  const level = Math.floor(total / WORKOUTS_PER_LEVEL) + 1;
  if (level >= 50) return `🏆 Level ${level}`;
  if (level >= 30) return `💀 Level ${level}`;
  if (level >= 20) return `🔥 Level ${level}`;
  if (level >= 10) return `⚡ Level ${level}`;
  if (level >= 5)  return `💪 Level ${level}`;
  return `🌱 Level ${level}`;
}

export default function CoachDashboard() {
  const [clients, setClients] = useState(null);

  useEffect(() => {
    api.getClients().then(setClients).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-gray-400 mt-1">Overview of all your clients</p>
      </div>

      {clients === null ? (
        <p className="text-gray-500">Loading…</p>
      ) : clients.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">No clients have signed up yet.</p>
          <p className="text-gray-500 text-sm mt-1">Share the app link so clients can create an account.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                to={`/coach/clients/${client.id}`}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-brand-600 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{client.name || client.email}</p>
                  {client.name && (
                    <p className="text-gray-500 text-sm">{client.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-right">
                  <div>
                    <p className="text-gray-400">Workouts</p>
                    <p className="text-white font-semibold">{client.total_workouts}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Level</p>
                    <p className="text-white font-semibold">{levelLabel(client.total_workouts)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Last workout</p>
                    <p className="text-white font-semibold">
                      {client.last_workout_date || '—'}
                    </p>
                  </div>
                  <span className="text-gray-600">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
