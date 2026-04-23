import { create } from 'zustand';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

interface StreakStoreState {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

interface StreakStoreActions {
  recordPlay: () => void;
}

type StreakStore = StreakStoreState & { actions: StreakStoreActions };

export const useStreakStore = create<StreakStore>((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,
  actions: {
    recordPlay: () => {
      const now = new Date();
      const { lastPlayedDate, currentStreak, longestStreak } = get();

      if (lastPlayedDate && isSameDay(new Date(lastPlayedDate), now)) {
        return;
      }

      let newStreak: number;
      if (lastPlayedDate && isYesterday(new Date(lastPlayedDate), now)) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1;
      }

      set({
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        lastPlayedDate: now.toISOString(),
      });
    },
  },
}));
