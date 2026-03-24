import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import WorkoutForm from '../components/WorkoutForm';

export default function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [editing, setEditing] = useState(false);

  const load = () => api.getWorkout(id).then(setWorkout).catch(console.error);

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this workout?')) return;
    await api.deleteWorkout(id);
    navigate('/workouts');
  };

  if (!workout) return <p className="text-gray-500">Loading…</p>;

  if (editing) {
    return (
      <WorkoutForm
        initial={workout}
        onSave={async (data) => { await api.updateWorkout(id, data); setEditing(false); load(); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-sm mb-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">{workout.name}</h1>
          <p className="text-gray-400">{workout.date}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-900/30 hover:bg-red-900/60 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-gray-400 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
          {workout.notes}
        </p>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Exercises</h2>
        {workout.exercises?.length ? (
          <div className="space-y-3">
            {workout.exercises.map((ex) => (
              <div key={ex.id} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
                <p className="font-medium mb-2">{ex.name}</p>

                {/* Per-set table */}
                {ex.sets_data?.length > 0 && (
                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-1">
                      <span>Set</span>
                      <span>Reps</span>
                      <span>Weight</span>
                    </div>
                    {ex.sets_data.map((s, j) => (
                      <div key={j} className="grid grid-cols-3 gap-2 text-sm text-gray-300 py-0.5">
                        <span className="text-gray-500">{j + 1}</span>
                        <span>{s.reps ?? '—'}</span>
                        <span>{s.weight != null ? `${s.weight} lbs` : '—'}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                  {ex.duration_minutes && <span>{ex.duration_minutes} min</span>}
                  {ex.notes && <span className="italic">{ex.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No exercises recorded.</p>
        )}
      </div>
    </div>
  );
}
