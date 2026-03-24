import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://buildmybody.up.railway.app';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${BACKEND_URL}/api/auth/google/callback`;

const ALLOWED_ORIGINS = [
  'https://buildmybody.up.railway.app',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server (no origin) and listed origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Helpers ───────────────────────────────────────────────────────────────────

const isProd = process.env.NODE_ENV === 'production';

function issueToken(res, userId) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-origin fetch with credentials
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Auth Routes ───────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 12);
  const result = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(email.toLowerCase(), hash, name || null);
  issueToken(res, result.lastInsertRowid);
  res.status(201).json({ id: result.lastInsertRowid, email: email.toLowerCase(), name });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  issueToken(res, user.id);
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ success: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ── Google OAuth ──────────────────────────────────────────────────────────────

app.get('/api/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.status(501).json({ error: 'Google OAuth not configured' });
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error || !code) return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token');

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const gUser = await userRes.json();

    let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(gUser.sub);
    if (!user) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(gUser.email);
      if (user) {
        db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(gUser.sub, user.id);
      } else {
        const r = db.prepare('INSERT INTO users (email, google_id, name) VALUES (?, ?, ?)').run(gUser.email, gUser.sub, gUser.name);
        user = { id: r.lastInsertRowid };
      }
    }
    issueToken(res, user.id);
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// ── Workouts ──────────────────────────────────────────────────────────────────

app.get('/api/workouts', requireAuth, (req, res) => {
  const workouts = db.prepare(`
    SELECT w.*, COUNT(e.id) as exercise_count
    FROM workouts w
    LEFT JOIN exercises e ON e.workout_id = w.id
    WHERE w.user_id = ?
    GROUP BY w.id
    ORDER BY w.date DESC
  `).all(req.userId);
  res.json(workouts);
});

app.get('/api/workouts/:id', requireAuth, (req, res) => {
  const workout = db.prepare('SELECT * FROM workouts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!workout) return res.status(404).json({ error: 'Not found' });
  const exercises = db.prepare('SELECT * FROM exercises WHERE workout_id = ?').all(req.params.id);
  const parsed = exercises.map((ex) => ({
    ...ex,
    sets_data: ex.sets_data ? JSON.parse(ex.sets_data) : [],
  }));
  res.json({ ...workout, exercises: parsed });
});

app.post('/api/workouts', requireAuth, (req, res) => {
  const { name, date, notes, exercises = [] } = req.body;
  const result = db.prepare('INSERT INTO workouts (user_id, name, date, notes) VALUES (?, ?, ?, ?)').run(req.userId, name, date, notes);
  const workoutId = result.lastInsertRowid;
  const insertExercise = db.prepare(
    'INSERT INTO exercises (workout_id, name, sets_data, duration_minutes, notes) VALUES (?, ?, ?, ?, ?)'
  );
  for (const ex of exercises) {
    insertExercise.run(workoutId, ex.name, JSON.stringify(ex.sets_data || []), ex.duration_minutes || null, ex.notes || null);
  }
  res.status(201).json({ id: workoutId });
});

app.put('/api/workouts/:id', requireAuth, (req, res) => {
  const workout = db.prepare('SELECT id FROM workouts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!workout) return res.status(404).json({ error: 'Not found' });
  const { name, date, notes, exercises = [] } = req.body;
  db.prepare('UPDATE workouts SET name = ?, date = ?, notes = ? WHERE id = ?').run(name, date, notes, req.params.id);
  db.prepare('DELETE FROM exercises WHERE workout_id = ?').run(req.params.id);
  const insertExercise = db.prepare(
    'INSERT INTO exercises (workout_id, name, sets_data, duration_minutes, notes) VALUES (?, ?, ?, ?, ?)'
  );
  for (const ex of exercises) {
    insertExercise.run(req.params.id, ex.name, JSON.stringify(ex.sets_data || []), ex.duration_minutes || null, ex.notes || null);
  }
  res.json({ success: true });
});

app.delete('/api/workouts/:id', requireAuth, (req, res) => {
  const workout = db.prepare('SELECT id FROM workouts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!workout) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Stats ─────────────────────────────────────────────────────────────────────

app.get('/api/stats', requireAuth, (req, res) => {
  const totalWorkouts = db.prepare('SELECT COUNT(*) as count FROM workouts WHERE user_id = ?').get(req.userId).count;
  const recentWorkouts = db.prepare('SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 5').all(req.userId);
  res.json({ totalWorkouts, recentWorkouts });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));
server.on('error', (err) => {
  console.error('Failed to bind port:', err);
  process.exit(1);
});
