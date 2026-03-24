import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

const WORKOUTS_PER_LEVEL = 5;

function levelLabel(total) {
  const level = Math.floor(total / WORKOUTS_PER_LEVEL) + 1;
  if (level >= 50) return `🏆 Level ${level}`;
  if (level >= 30) return `💀 Level ${level}`;
  if (level >= 20) return `🔥 Level ${level}`;
  if (level >= 10) return `⚡ Level ${level}`;
  if (level >= 5)  return `💪 Level ${level}`;
  return `🌱 Level ${level}`;
}

function WorkoutDetailModal({ clientId, workoutId, onClose }) {
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    api.getClientWorkout(clientId, workoutId).then(setWorkout).catch(console.error);
  }, [clientId, workoutId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {!workout ? (
          <p className="text-gray-400">Loading…</p>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{workout.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{workout.date}</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg leading-none">✕</button>
            </div>

            {workout.notes && (
              <p className="text-gray-400 text-sm bg-gray-800 rounded-lg px-4 py-3">{workout.notes}</p>
            )}

            {workout.exercises.length === 0 ? (
              <p className="text-gray-500 text-sm">No exercises logged.</p>
            ) : (
              <div className="space-y-4">
                {workout.exercises.map((ex) => (
                  <div key={ex.id} className="bg-gray-800 rounded-lg p-4">
                    <p className="font-semibold mb-2">{ex.name}</p>
                    {ex.duration_minutes && (
                      <p className="text-gray-400 text-sm mb-2">{ex.duration_minutes} min</p>
                    )}
                    {ex.sets_data && ex.sets_data.length > 0 && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 text-left">
                            <th className="pb-1 font-medium w-12">Set</th>
                            <th className="pb-1 font-medium">Reps</th>
                            <th className="pb-1 font-medium">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ex.sets_data.map((s, i) => (
                            <tr key={i} className="border-t border-gray-700">
                              <td className="py-1 text-gray-500">{i + 1}</td>
                              <td className="py-1">{s.reps ?? '—'}</td>
                              <td className="py-1">{s.weight != null ? `${s.weight} lbs` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {ex.notes && <p className="text-gray-400 text-sm mt-2">{ex.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getClient(id).then(setClient).catch(console.error);
    api.getMessages(id).then(setMessages).catch(console.error);
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(id, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!client) return <div className="text-gray-500">Loading…</div>;

  const level = Math.floor(client.totalWorkouts / WORKOUTS_PER_LEVEL) + 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/coach')} className="text-gray-500 hover:text-gray-300 transition-colors">
          ← Clients
        </button>
        <div>
          <h1 className="text-3xl font-bold">{client.name || client.email}</h1>
          {client.name && <p className="text-gray-400 mt-0.5">{client.email}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Workouts</p>
          <p className="text-3xl font-bold text-white mt-1">{client.totalWorkouts}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Current Level</p>
          <p className="text-3xl font-bold text-white mt-1">{levelLabel(client.totalWorkouts)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Member Since</p>
          <p className="text-xl font-bold text-white mt-1">{client.created_at?.slice(0, 10) || '—'}</p>
        </div>
      </div>

      {/* Workouts */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Workouts</h2>
        {client.workouts.length === 0 ? (
          <p className="text-gray-500">No workouts logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {client.workouts.map((w) => (
              <li key={w.id}>
                <button
                  onClick={() => setSelectedWorkout(w.id)}
                  className="w-full flex justify-between items-center bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-brand-600 transition-colors text-left"
                >
                  <div>
                    <span className="font-medium">{w.name}</span>
                    <span className="text-gray-500 text-sm ml-3">{w.exercise_count} exercise{w.exercise_count !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{w.date}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Messages */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Feedback & Messages</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No messages yet. Send your client some feedback!</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender_id === parseInt(id) ? 'items-start' : 'items-end'}`}
                >
                  <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                    msg.sender_id === parseInt(id)
                      ? 'bg-gray-800 text-white'
                      : 'bg-brand-600 text-white'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-gray-600 text-xs mt-1 px-1">
                    {msg.sender_name || msg.sender_email} · {msg.created_at?.slice(0, 16).replace('T', ' ')}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-800 p-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send feedback…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {selectedWorkout && (
        <WorkoutDetailModal
          clientId={id}
          workoutId={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
}
