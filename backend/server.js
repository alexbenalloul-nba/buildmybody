import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// ── Workouts ──────────────────────────────────────────────────────────────────

app.get('/api/workouts', (req, res) => {
  const workouts = db.prepare(`
    SELECT w.*, COUNT(e.id) as exercise_count
    FROM workouts w
    LEFT JOIN exercises e ON e.workout_id = w.id
    GROUP BY w.id
    ORDER BY w.date DESC
  `).all();
  res.json(workouts);
});

app.get('/api/workouts/:id', (req, res) => {
  const workout = db.prepare('SELECT * FROM workouts WHERE id = ?').get(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Not found' });
  const exercises = db.prepare('SELECT * FROM exercises WHERE workout_id = ?').all(req.params.id);
  res.json({ ...workout, exercises });
});

app.post('/api/workouts', (req, res) => {
  const { name, date, notes, exercises = [] } = req.body;
  const result = db.prepare('INSERT INTO workouts (name, date, notes) VALUES (?, ?, ?)').run(name, date, notes);
  const workoutId = result.lastInsertRowid;
  const insertExercise = db.prepare(
    'INSERT INTO exercises (workout_id, name, sets, reps, weight, duration_minutes, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (const ex of exercises) {
    insertExercise.run(workoutId, ex.name, ex.sets, ex.reps, ex.weight, ex.duration_minutes, ex.notes);
  }
  res.status(201).json({ id: workoutId });
});

app.put('/api/workouts/:id', (req, res) => {
  const { name, date, notes, exercises = [] } = req.body;
  db.prepare('UPDATE workouts SET name = ?, date = ?, notes = ? WHERE id = ?').run(name, date, notes, req.params.id);
  db.prepare('DELETE FROM exercises WHERE workout_id = ?').run(req.params.id);
  const insertExercise = db.prepare(
    'INSERT INTO exercises (workout_id, name, sets, reps, weight, duration_minutes, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  for (const ex of exercises) {
    insertExercise.run(req.params.id, ex.name, ex.sets, ex.reps, ex.weight, ex.duration_minutes, ex.notes);
  }
  res.json({ success: true });
});

app.delete('/api/workouts/:id', (req, res) => {
  db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Measurements ──────────────────────────────────────────────────────────────

app.get('/api/measurements', (req, res) => {
  const rows = db.prepare('SELECT * FROM measurements ORDER BY date DESC').all();
  res.json(rows);
});

app.post('/api/measurements', (req, res) => {
  const { date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, bicep_in, thigh_in, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO measurements (date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, bicep_in, thigh_in, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, bicep_in, thigh_in, notes);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.put('/api/measurements/:id', (req, res) => {
  const { date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, bicep_in, thigh_in, notes } = req.body;
  db.prepare(`
    UPDATE measurements SET date=?, weight_lbs=?, body_fat_pct=?, chest_in=?, waist_in=?, hips_in=?, bicep_in=?, thigh_in=?, notes=?
    WHERE id=?
  `).run(date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, bicep_in, thigh_in, notes, req.params.id);
  res.json({ success: true });
});

app.delete('/api/measurements/:id', (req, res) => {
  db.prepare('DELETE FROM measurements WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Stats ─────────────────────────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
  const totalWorkouts = db.prepare('SELECT COUNT(*) as count FROM workouts').get().count;
  const latestMeasurement = db.prepare('SELECT * FROM measurements ORDER BY date DESC LIMIT 1').get();
  const recentWorkouts = db.prepare('SELECT * FROM workouts ORDER BY date DESC LIMIT 5').all();
  res.json({ totalWorkouts, latestMeasurement, recentWorkouts });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
