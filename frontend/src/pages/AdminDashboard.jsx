import { useEffect, useState } from 'react';
import { api } from '../api';

export default function AdminDashboard() {
  const [signups, setSignups] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('signups'); // 'signups' | 'stats'
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/signups')
      .then(setSignups)
      .catch((err) => {
        console.error('Failed to fetch signups:', err);
        setError('Failed to load signups');
      });

    api.get('/admin/stats')
      .then(setStats)
      .catch((err) => {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load stats');
      });
  }, []);

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buildmybody-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export database');
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-[#555] mt-1 text-sm">View signups, database statistics, and manage data</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-4 border-b border-[#1e1e1e]">
        <button
          onClick={() => setActiveTab('signups')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'signups'
              ? 'text-white border-white'
              : 'text-[#555] border-transparent hover:text-white'
          }`}
        >
          User Signups
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'stats'
              ? 'text-white border-white'
              : 'text-[#555] border-transparent hover:text-white'
          }`}
        >
          Database Stats
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Signups tab */}
      {activeTab === 'signups' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors duration-200"
            >
              📥 Export Database
            </button>
          </div>

          {signups === null ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#080808] border border-[#161616] rounded-lg h-12 animate-pulse" />
              ))}
            </div>
          ) : signups.length === 0 ? (
            <div className="border border-dashed border-[#1e1e1e] rounded-2xl p-12 text-center">
              <p className="text-[#666] font-medium text-sm">No signups yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e1e] text-[#555]">
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Location</th>
                    <th className="text-left px-4 py-3 font-medium">IP Address</th>
                    <th className="text-left px-4 py-3 font-medium">Signup Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((user) => (
                    <tr key={user.id} className="border-b border-[#0a0a0a] hover:bg-[#080808] transition-colors duration-100">
                      <td className="px-4 py-3 text-white">{user.email}</td>
                      <td className="px-4 py-3 text-[#888]">{user.name || '—'}</td>
                      <td className="px-4 py-3 text-[#888]">
                        {user.city && user.country ? `${user.city}, ${user.country}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#888] font-mono text-xs">{user.ip_address || '—'}</td>
                      <td className="px-4 py-3 text-[#888]">
                        {new Date(user.created_at).toLocaleDateString()} at {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {stats === null ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#080808] border border-[#161616] rounded-lg h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#080808] border border-[#161616] rounded-lg p-4">
                  <p className="text-[#555] text-xs mb-1">Total Users</p>
                  <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-[#080808] border border-[#161616] rounded-lg p-4">
                  <p className="text-[#555] text-xs mb-1">Total Clients</p>
                  <p className="text-white text-2xl font-bold">{stats.totalClients}</p>
                </div>
                <div className="bg-[#080808] border border-[#161616] rounded-lg p-4">
                  <p className="text-[#555] text-xs mb-1">Total Workouts</p>
                  <p className="text-white text-2xl font-bold">{stats.totalWorkouts}</p>
                </div>
                <div className="bg-[#080808] border border-[#161616] rounded-lg p-4">
                  <p className="text-[#555] text-xs mb-1">Total Exercises</p>
                  <p className="text-white text-2xl font-bold">{stats.totalExercises}</p>
                </div>
              </div>

              {/* Users by country */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Users by Country</h2>
                <div className="space-y-2">
                  {stats.usersByCountry && stats.usersByCountry.length > 0 ? (
                    stats.usersByCountry.map((item) => (
                      <div key={item.country} className="flex items-center justify-between bg-[#080808] border border-[#161616] rounded-lg p-3">
                        <span className="text-white text-sm">{item.country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-[#161616] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white transition-all duration-300"
                              style={{
                                width: `${(item.count / stats.totalUsers) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[#666] text-xs w-8 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#555] text-sm">No data yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
