import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { levelLabel } from '../utils/levels';

function SkeletonCard() {
  return (
    <div className="bg-[#080808] border border-[#161616] rounded-xl px-5 py-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-[#1a1a1a] rounded-full" />
          <div className="h-2 w-44 bg-[#111] rounded-full" />
        </div>
        <div className="flex gap-8">
          <div className="h-3 w-10 bg-[#1a1a1a] rounded-full" />
          <div className="h-3 w-10 bg-[#1a1a1a] rounded-full" />
          <div className="h-3 w-16 bg-[#1a1a1a] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function CoachDashboard() {
  const [clients, setClients] = useState(null);

  useEffect(() => {
    api.getClients().then(setClients).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Clients</h1>
        <p className="text-[#555] mt-1 text-sm">Overview of all your clients</p>
      </div>

      {/* States */}
      {clients === null ? (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : clients.length === 0 ? (
        <div className="border border-dashed border-[#1e1e1e] rounded-2xl p-14 text-center">
          <div className="w-10 h-10 rounded-full border border-[#1e1e1e] flex items-center justify-center mx-auto mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <p className="text-[#666] font-medium text-sm">No clients yet</p>
          <p className="text-[#333] text-xs mt-1 max-w-xs mx-auto">
            Share the app link so clients can create an account.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                to={`/coach/clients/${client.id}`}
                className="flex items-center justify-between bg-[#080808] border border-[#161616] rounded-xl px-5 py-4 hover:bg-[#0e0e0e] hover:border-[#242424] transition-all duration-200 group"
              >
                {/* Client info */}
                <div>
                  <p className="font-medium text-white text-sm">
                    {client.name || client.email}
                  </p>
                  {client.name && (
                    <p className="text-[#444] text-xs mt-0.5">{client.email}</p>
                  )}
                </div>

                {/* Stats + chevron */}
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <p className="text-[#444] text-xs mb-0.5">Workouts</p>
                    <p className="text-white font-semibold text-sm">{client.total_workouts}</p>
                  </div>
                  <div>
                    <p className="text-[#444] text-xs mb-0.5">Level</p>
                    <p className="text-white font-semibold text-sm">{levelLabel(client.total_workouts)}</p>
                  </div>
                  <div>
                    <p className="text-[#444] text-xs mb-0.5">Last workout</p>
                    <p className="text-white font-semibold text-sm">
                      {client.last_workout_date || '—'}
                    </p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-[#555] transition-colors duration-200 flex-shrink-0"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
