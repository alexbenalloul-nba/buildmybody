// In production the frontend is served by the same Express server, so /api is same-origin.
// In local dev, Vite proxies /api → http://localhost:3001 (see vite.config.js).
const BASE = '/api';

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

  // Coach
  getCoach: () => request('/coach'),
  getClients: () => request('/coach/clients'),
  getClient: (id) => request(`/coach/clients/${id}`),
  getClientWorkout: (clientId, workoutId) => request(`/coach/clients/${clientId}/workouts/${workoutId}`),

  // Messages
  getMessages: (userId) => request(`/messages/${userId}`),
  sendMessage: (userId, content) => request(`/messages/${userId}`, { method: 'POST', body: JSON.stringify({ content }) }),
  getUnreadCount: () => request('/messages/unread-count'),
};
