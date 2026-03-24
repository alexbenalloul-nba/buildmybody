import { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [coach, setCoach] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  // For coach: they access this page per-client from ClientProfile.
  // This page is the client's inbox — always threads with the coach.
  useEffect(() => {
    api.getCoach()
      .then((c) => {
        setCoach(c);
        return api.getMessages(c.id);
      })
      .then(setMessages)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !coach) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(coach.id, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">No coach is configured yet.</p>
          <p className="text-gray-500 text-sm mt-1">Ask your coach to set up their account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        {coach && <p className="text-gray-400 mt-1">Your thread with {coach.name || coach.email}</p>}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '500px' }}>
          {!coach ? (
            <p className="text-gray-500 text-sm text-center py-8">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No messages yet. Send your coach a message!
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                    isMe ? 'bg-brand-600 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-gray-600 text-xs mt-1 px-1">
                    {isMe ? 'You' : (msg.sender_name || msg.sender_email)} · {msg.created_at?.slice(0, 16).replace('T', ' ')}
                  </p>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-800 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message…"
              disabled={!coach}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim() || !coach}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
