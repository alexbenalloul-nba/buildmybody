import { useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const emptyExercise = () => ({ name: '', sets: '', reps: '', weight: '', duration_minutes: '', notes: '' });

export default function WorkoutForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial?.date ?? today());
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [exercises, setExercises] = useState(
    initial?.exercises?.length ? initial.exercises.map((e) => ({ ...e })) : [emptyExercise()]
  );
  const [saving, setSaving] = useState(false);

  const updateEx = (i, field, value) => {
    setExercises((prev) => prev.map((ex, idx) => idx === i ? { ...ex, [field]: value } : ex));
  };

  const addEx = () => setExercises((prev) => [...prev, emptyExercise()]);
  const removeEx = (i) => setExercises((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name, date, notes,
        exercises: exercises
          .filter((ex) => ex.name.trim())
          .map((ex) => ({
            name: ex.name,
            sets: ex.sets ? Number(ex.sets) : null,
            reps: ex.reps ? Number(ex.reps) : null,
            weight: ex.weight ? Number(ex.weight) : null,
            duration_minutes: ex.duration_minutes ? Number(ex.duration_minutes) : null,
            notes: ex.notes || null,
          })),
      });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <h2 className="text-xl font-semibold">{initial ? 'Edit Workout' : 'Log Workout'}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Workout Name *</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Push Day" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date *</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notes</label>
        <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Exercises</h3>
          <button type="button" onClick={addEx} className="text-brand-500 hover:text-brand-400 text-sm transition-colors">+ Add Exercise</button>
        </div>
        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <input className={inputCls} placeholder="Exercise name *" value={ex.name} onChange={(e) => updateEx(i, 'name', e.target.value)} />
                {exercises.length > 1 && (
                  <button type="button" onClick={() => removeEx(i)} className="text-gray-500 hover:text-red-400 transition-colors px-2">✕</button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sets</label>
                  <input type="number" className={inputCls} placeholder="—" value={ex.sets} onChange={(e) => updateEx(i, 'sets', e.target.value)} min="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reps</label>
                  <input type="number" className={inputCls} placeholder="—" value={ex.reps} onChange={(e) => updateEx(i, 'reps', e.target.value)} min="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Weight (lbs)</label>
                  <input type="number" className={inputCls} placeholder="—" value={ex.weight} onChange={(e) => updateEx(i, 'weight', e.target.value)} min="0" step="0.5" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
                  <input type="number" className={inputCls} placeholder="—" value={ex.duration_minutes} onChange={(e) => updateEx(i, 'duration_minutes', e.target.value)} min="0" />
                </div>
              </div>
              <input className={inputCls} placeholder="Notes (optional)" value={ex.notes} onChange={(e) => updateEx(i, 'notes', e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
