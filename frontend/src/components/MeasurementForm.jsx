import { useState } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const FIELDS = [
  { key: 'weight_lbs', label: 'Weight (lbs)', step: '0.1' },
  { key: 'body_fat_pct', label: 'Body Fat %', step: '0.1' },
  { key: 'chest_in', label: 'Chest (in)', step: '0.25' },
  { key: 'waist_in', label: 'Waist (in)', step: '0.25' },
  { key: 'hips_in', label: 'Hips (in)', step: '0.25' },
  { key: 'bicep_in', label: 'Bicep (in)', step: '0.25' },
  { key: 'thigh_in', label: 'Thigh (in)', step: '0.25' },
];

export default function MeasurementForm({ onSave, onCancel }) {
  const [date, setDate] = useState(today());
  const [values, setValues] = useState({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { date, notes: notes || null };
      for (const f of FIELDS) {
        data[f.key] = values[f.key] ? Number(values[f.key]) : null;
      }
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-brand-500';

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
      <h2 className="text-xl font-semibold">Add Measurement</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Date *</label>
        <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
            <input
              type="number"
              step={f.step}
              min="0"
              className={inputCls}
              placeholder="—"
              value={values[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Notes</label>
        <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
