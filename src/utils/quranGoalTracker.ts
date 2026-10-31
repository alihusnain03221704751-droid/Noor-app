export interface DailyReadingState {
  date: string;
  targetAyahs: number;
  readAyahs: number;
  streakDays: number;
  lastCompletedDate: string | null;
  history: Record<string, number>;
}

export const QURAN_READING_UPDATED_EVENT = 'hasan_quran_reading_updated';
const STORAGE_KEY = 'hasan_quran_daily_goal_v1';

export const getTodayDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const loadDailyReadingState = (): DailyReadingState => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const defaultState: DailyReadingState = {
    date: today,
    targetAyahs: 20,
    readAyahs: 0,
    streakDays: 0,
    lastCompletedDate: null,
    history: {}
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const data: DailyReadingState = JSON.parse(raw);

    // If new day, roll over cleanly
    if (data.date !== today) {
      const wasYesterdayCompleted =
        data.lastCompletedDate === yesterday ||
        (data.date === yesterday && data.readAyahs >= data.targetAyahs);

      const streak = wasYesterdayCompleted ? Math.max(1, data.streakDays || 1) : 0;

      const updated: DailyReadingState = {
        ...data,
        date: today,
        readAyahs: 0,
        streakDays: streak,
        history: {
          ...data.history,
          [data.date]: data.readAyahs
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }

    return data;
  } catch {
    return defaultState;
  }
};

export const saveDailyReadingState = (state: DailyReadingState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(QURAN_READING_UPDATED_EVENT, { detail: state }));
  } catch (e) {
    console.error('Error saving reading state:', e);
  }
};

export const recordReadingAyahs = (count: number = 1): DailyReadingState => {
  const state = loadDailyReadingState();
  const today = state.date;
  const newRead = Math.max(0, state.readAyahs + count);
  const wasCompletedBefore = state.readAyahs >= state.targetAyahs;
  const isNowCompleted = newRead >= state.targetAyahs;

  let newStreak = state.streakDays;
  let newLastCompleted = state.lastCompletedDate;

  if (isNowCompleted && !wasCompletedBefore) {
    newStreak = Math.max(1, (state.streakDays || 0) + 1);
    newLastCompleted = today;
  }

  const newState: DailyReadingState = {
    ...state,
    readAyahs: newRead,
    streakDays: newStreak,
    lastCompletedDate: newLastCompleted,
    history: {
      ...state.history,
      [today]: newRead
    }
  };

  saveDailyReadingState(newState);
  return newState;
};

export const updateDailyTarget = (newTarget: number): DailyReadingState => {
  const state = loadDailyReadingState();
  const clampedTarget = Math.max(1, Math.min(1000, newTarget));
  const isNowCompleted = state.readAyahs >= clampedTarget;
  let newStreak = state.streakDays;
  let newLastCompleted = state.lastCompletedDate;

  if (isNowCompleted && !state.lastCompletedDate) {
    newStreak = Math.max(1, (state.streakDays || 0) + 1);
    newLastCompleted = state.date;
  }

  const newState: DailyReadingState = {
    ...state,
    targetAyahs: clampedTarget,
    streakDays: newStreak,
    lastCompletedDate: newLastCompleted
  };
  saveDailyReadingState(newState);
  return newState;
};

export const resetTodayReading = (): DailyReadingState => {
  const state = loadDailyReadingState();
  const newState: DailyReadingState = {
    ...state,
    readAyahs: 0,
    history: {
      ...state.history,
      [state.date]: 0
    }
  };
  saveDailyReadingState(newState);
  return newState;
};
