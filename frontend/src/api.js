const BASE = 'https://buildmybody-production.up.railway.app/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Workouts
  getWorkouts: () => request('/workouts'),
  getWorkout: (id) => request(`/workouts/${id}`),
  createWorkout: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkout: (id, data) => request(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkout: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),

  // Measurements
  getMeasurements: () => request('/measurements'),
  createMeasurement: (data) => request('/measurements', { method: 'POST', body: JSON.stringify(data) }),
  updateMeasurement: (id, data) => request(`/measurements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMeasurement: (id) => request(`/measurements/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request('/stats'),
};
