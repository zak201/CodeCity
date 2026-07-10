import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  /** Passe à true quand la persistance a fini de recharger l'état. */
  _hasHydrated: boolean;
}

interface StreakStoreActions {
  recordPlay: () => void;
  setHasHydrated: (value: boolean) => void;
  /** Réinitialise la série (recommencer depuis le début). */
  reset: () => void;
}

type StreakStore = StreakStoreState & { actions: StreakStoreActions };

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,
      _hasHydrated: false,
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
        setHasHydrated: (value) => set({ _hasHydrated: value }),
        reset: () =>
          set({ currentStreak: 0, longestStreak: 0, lastPlayedDate: null }),
      },
    }),
    {
      name: 'codecity-streak',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastPlayedDate: state.lastPlayedDate,
      }),
      // Marque l'hydratation terminée quoi qu'il arrive : `recordPlay` ne doit
      // s'exécuter qu'après, sinon la série peut être écrasée au démarrage.
      onRehydrateStorage: () => () => {
        useStreakStore.getState().actions.setHasHydrated(true);
      },
    }
  )
);
