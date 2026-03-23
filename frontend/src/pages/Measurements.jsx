import { useEffect, useState } from 'react';
import { api } from '../api';
import MeasurementForm from '../components/MeasurementForm';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FIELDS = [
  { key: 'weight_lbs', label: 'Weight (lbs)' },
  { key: 'body_fat_pct', label: 'Body Fat %' },
  { key: 'chest_in', label: 'Chest (in)' },
  { key: 'waist_in', label: 'Waist (in)' },
  { key: 'hips_in', label: 'Hips (in)' },
  { key: 'bicep_in', label: 'Bicep (in)' },
  { key: 'thigh_in', label: 'Thigh (in)' },
];

export default function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [chartKey, setChartKey] = useState('weight_lbs');

  const load = () => api.getMeasurements().then(setMeasurements).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this measurement?')) return;
    await api.deleteMeasurement(id);
    load();
  };

  const chartData = [...measurements].reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Measurements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Measurement
        </button>
      </div>

      {showForm && (
        <MeasurementForm
          onSave={async (data) => { await api.createMeasurement(data); setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {measurements.length >= 2 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progress Chart</h2>
            <select
              value={chartKey}
              onChange={(e) => setChartKey(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
            >
              {FIELDS.map((f) => (
                <option key={f.key} value={f.key}>{f.label}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }} />
              <Line type="monotone" dataKey={chartKey} stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {measurements.length === 0 && !showForm ? (
        <p className="text-gray-500">No measurements logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-2 pr-4">Date</th>
                {FIELDS.map((f) => <th key={f.key} className="text-right py-2 px-2">{f.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                  <td className="py-3 pr-4 font-medium">{m.date}</td>
                  {FIELDS.map((f) => (
                    <td key={f.key} className="py-3 px-2 text-right text-gray-300">
                      {m[f.key] ?? '—'}
                    </td>
                  ))}
                  <td className="py-3 pl-4">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
