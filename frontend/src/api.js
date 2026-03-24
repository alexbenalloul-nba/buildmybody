const BASE = import.meta.env.VITE_API_URL || 'https://buildmybody-production.up.railway.app/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  // Workouts
  getWorkouts: () => request('/workouts'),
  getWorkout: (id) => request(`/workouts/${id}`),
  createWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkout: (id, data) => request(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request('/stats'),
};
