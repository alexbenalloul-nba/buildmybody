import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { WORKOUTS_PER_LEVEL, levelNumber, levelProgress, workoutsToNextLevel, levelName, levelIcon } from '../utils/levels';

export default function Progress() {
  const [workouts, setWorkouts] = useState(null);

  useEffect(() => {
    api.getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  if (!workouts) return <p className="text-gray-500">Loading…</p>;

  const total  = workouts.length;
  const level  = levelNumber(total);
  const done   = levelProgress(total);
  const pct    = (done / WORKOUTS_PER_LEVEL) * 100;

  return (
    <div className="space-y-8">
      {/* Current level banner */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">{levelName(total)}</p>
            <h1 className="text-4xl font-black text-brand-400">Level {level}</h1>
            <p className="text-gray-500 text-sm mt-1">{total} workout{total !== 1 ? 's' : ''} completed</p>
          </div>
          <div className="text-6xl select-none">{levelIcon(total)}</div>
        </div>

        {/* XP bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{done} / {WORKOUTS_PER_LEVEL} workouts to Level {level + 1}</span>
            <span>{workoutsToNextLevel(total)} to go</span>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Workout history ladder */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Workout History</h2>
        {workouts.length === 0 ? (
          <p className="text-gray-500">
            No workouts yet.{' '}
            <Link to="/workouts" className="text-brand-500 hover:underline">Log your first one!</Link>
          </p>
        ) : (
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-800" />

            <div className="space-y-4">
              {workouts.map((w, i) => {
                const sessionNumber = total - i;
                // Mark the session that pushed the user to a new level
                const isLevelUp = sessionNumber > 1 && (sessionNumber - 1) % WORKOUTS_PER_LEVEL === 0;
                const sessionLevel = levelNumber(sessionNumber - 1) + 1;

                return (
                  <div key={w.id}>
                    {isLevelUp && (
                      <div className="flex items-center gap-3 pl-1 mb-4 mt-2">
                        <div className="w-14 flex justify-center">
                          <span className="text-xs font-bold text-brand-400 bg-brand-900/30 border border-brand-700 rounded-full px-2 py-0.5">
                            LVL {sessionLevel}
                          </span>
                        </div>
                        <div className="flex-1 h-px bg-brand-800/50" />
                      </div>
                    )}

                    <Link to={`/workouts/${w.id}`} className="flex items-center gap-4 group">
                      <div className="relative z-10 w-14 flex justify-center flex-shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-brand-600 bg-gray-950 group-hover:border-brand-400 transition-colors" />
                      </div>
                      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 hover:border-brand-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-medium group-hover:text-brand-400 transition-colors">{w.name}</p>
                          <span className="text-gray-500 text-xs">{w.date}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {w.exercise_count} exercise{w.exercise_count !== 1 ? 's' : ''} · Session #{sessionNumber}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
