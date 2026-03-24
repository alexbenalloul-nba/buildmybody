import { useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const emptySet = () => ({ reps: '', weight: '' });
const emptyExercise = () => ({ name: '', sets: [emptySet()], duration_minutes: '', notes: '' });

function initExercise(ex) {
  // Handle both new format (sets_data) and legacy format (sets/reps/weight scalars)
  let sets;
  if (Array.isArray(ex.sets_data) && ex.sets_data.length > 0) {
    sets = ex.sets_data.map((s) => ({ reps: s.reps ?? '', weight: s.weight ?? '' }));
  } else if (ex.sets && ex.reps) {
    // Legacy: expand scalar into N identical sets
    sets = Array.from({ length: ex.sets }, () => ({ reps: ex.reps ?? '', weight: ex.weight ?? '' }));
  } else {
    sets = [emptySet()];
  }
  return { name: ex.name ?? '', sets, duration_minutes: ex.duration_minutes ?? '', notes: ex.notes ?? '' };
}

export default function WorkoutForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial?.date ?? today());
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [exercises, setExercises] = useState(
    initial?.exercises?.length ? initial.exercises.map(initExercise) : [emptyExercise()]
  );
  const [saving, setSaving] = useState(false);

  // Exercise-level helpers
  const updateEx = (i, field, value) =>
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));
  const addEx = () => setExercises((prev) => [...prev, emptyExercise()]);
  const removeEx = (i) => setExercises((prev) => prev.filter((_, idx) => idx !== i));

  // Set-level helpers
  const updateSet = (exIdx, setIdx, field, value) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s)) }
      )
    );
  const addSet = (exIdx) =>
    setExercises((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, sets: [...ex.sets, emptySet()] } : ex))
    );
  const removeSet = (exIdx, setIdx) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx ? ex : { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) }
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name,
        date,
        notes,
        exercises: exercises
          .filter((ex) => ex.name.trim())
          .map((ex) => ({
            name: ex.name,
            sets_data: ex.sets
              .filter((s) => s.reps !== '' || s.weight !== '')
              .map((s) => ({
                reps: s.reps !== '' ? Number(s.reps) : null,
                weight: s.weight !== '' ? Number(s.weight) : null,
              })),
            duration_minutes: ex.duration_minutes ? Number(ex.duration_minutes) : null,
            notes: ex.notes || null,
          })),
      });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-brand-500';
  const numCls =
    'bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <h2 className="text-xl font-semibold">{initial ? 'Edit Workout' : 'Log Workout'}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Workout Name *</label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Push Day"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date *</label>
          <input
            type="date"
            className={inputCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notes</label>
        <textarea
          className={inputCls}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes…"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Exercises</h3>
          <button
            type="button"
            onClick={addEx}
            className="text-brand-500 hover:text-brand-400 text-sm transition-colors"
          >
            + Add Exercise
          </button>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              {/* Exercise name row */}
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="Exercise name *"
                  value={ex.name}
                  onChange={(e) => updateEx(i, 'name', e.target.value)}
                />
                {exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEx(i)}
                    className="text-gray-500 hover:text-red-400 transition-colors px-2 flex-shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sets table */}
              <div>
                <div className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 mb-1.5 px-1">
                  <span className="text-xs text-gray-500 text-center">Set</span>
                  <span className="text-xs text-gray-500 text-center">Reps</span>
                  <span className="text-xs text-gray-500 text-center">Weight (lbs)</span>
                  <span />
                </div>
                <div className="space-y-1.5">
                  {ex.sets.map((s, j) => (
                    <div key={j} className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 items-center">
                      <span className="text-xs text-gray-500 text-center">{j + 1}</span>
                      <input
                        type="number"
                        className={numCls}
                        placeholder="—"
                        value={s.reps}
                        onChange={(e) => updateSet(i, j, 'reps', e.target.value)}
                        min="0"
                      />
                      <input
                        type="number"
                        className={numCls}
                        placeholder="—"
                        value={s.weight}
                        onChange={(e) => updateSet(i, j, 'weight', e.target.value)}
                        min="0"
                        step="0.5"
                      />
                      {ex.sets.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeSet(i, j)}
                          className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addSet(i)}
                  className="mt-2 text-xs text-gray-500 hover:text-brand-400 transition-colors"
                >
                  + Add Set
                </button>
              </div>

              {/* Duration + notes */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="—"
                    value={ex.duration_minutes}
                    onChange={(e) => updateEx(i, 'duration_minutes', e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <input
                    className={inputCls}
                    placeholder="Optional"
                    value={ex.notes}
                    onChange={(e) => updateEx(i, 'notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Workout'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
