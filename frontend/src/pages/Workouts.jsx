import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import WorkoutForm from '../components/WorkoutForm';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.getWorkouts().then(setWorkouts).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm('Delete this workout?')) return;
    await api.deleteWorkout(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workouts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Log Workout
        </button>
      </div>

      {showForm && (
        <WorkoutForm
          onSave={async (data) => { await api.createWorkout(data); setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {workouts.length === 0 && !showForm ? (
        <p className="text-gray-500">No workouts logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {workouts.map((w) => (
            <li key={w.id}>
              <Link
                to={`/workouts/${w.id}`}
                className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-brand-600 transition-colors group"
              >
                <div>
                  <p className="font-medium">{w.name}</p>
                  <p className="text-gray-400 text-sm">{w.exercise_count} exercise{w.exercise_count !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">{w.date}</span>
                  <button
                    onClick={(e) => handleDelete(w.id, e)}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
