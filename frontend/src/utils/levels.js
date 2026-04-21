// Shared level/XP utilities used across Dashboard, Progress, CoachDashboard, ClientProfile.
// A new level is earned every WORKOUTS_PER_LEVEL completed sessions.
export const WORKOUTS_PER_LEVEL = 5;

// The numeric level for a given total workout count (starts at 1).
export function levelNumber(totalWorkouts) {
  return Math.floor(totalWorkouts / WORKOUTS_PER_LEVEL) + 1;
}

// How many workouts the user has done inside the current level band.
export function levelProgress(totalWorkouts) {
  return totalWorkouts % WORKOUTS_PER_LEVEL;
}

// How many more workouts until the next level.
export function workoutsToNextLevel(totalWorkouts) {
  return WORKOUTS_PER_LEVEL - levelProgress(totalWorkouts);
}

// Short tier name shown on the Progress page (no level number).
export function levelName(totalWorkouts) {
  const level = levelNumber(totalWorkouts);
  if (level >= 50) return '🏆 Legend';
  if (level >= 30) return '💀 Elite';
  if (level >= 20) return '🔥 Advanced';
  if (level >= 10) return '⚡ Intermediate';
  if (level >= 5)  return '💪 Rising';
  return '🌱 Beginner';
}

// Full label shown in coach views (includes the level number).
export function levelLabel(totalWorkouts) {
  const level = levelNumber(totalWorkouts);
  if (level >= 50) return `🏆 Level ${level}`;
  if (level >= 30) return `💀 Level ${level}`;
  if (level >= 20) return `🔥 Level ${level}`;
  if (level >= 10) return `⚡ Level ${level}`;
  if (level >= 5)  return `💪 Level ${level}`;
  return `🌱 Level ${level}`;
}

// The emoji icon for a given total (used in the big icon slot on Progress).
export function levelIcon(totalWorkouts) {
  const level = levelNumber(totalWorkouts);
  if (level >= 50) return '🏆';
  if (level >= 30) return '💀';
  if (level >= 20) return '🔥';
  if (level >= 10) return '⚡';
  if (level >= 5)  return '💪';
  return '🌱';
}
