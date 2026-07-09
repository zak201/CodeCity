import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { computeLevel } from '../data/progression';
import type { DifficultyLevel } from '../types/game';

interface UserStoreState {
  /** Identité serveur (remplie au 1er lancement via lib/sync). */
  userId: string | null;
  username: string | null;
  xp: number;
  /** Niveau de joueur, toujours dérivé de l'XP (voir computeLevel). */
  level: number;
  placementLevel: DifficultyLevel | null;
  /** Passe à true quand la persistance a fini de recharger l'état. */
  _hasHydrated: boolean;
}

interface UserStoreActions {
  addXP: (amount: number) => void;
  setPlacementLevel: (level: DifficultyLevel) => void;
  setIdentity: (userId: string, username: string) => void;
  setHasHydrated: (value: boolean) => void;
}

type UserStore = UserStoreState & { actions: UserStoreActions };

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      xp: 0,
      level: 1,
      placementLevel: null,
      _hasHydrated: false,
      actions: {
        addXP: (amount) =>
          set((state) => {
            const xp = state.xp + amount;
            return { xp, level: computeLevel(xp) };
          }),
        setPlacementLevel: (placementLevel) => set({ placementLevel }),
        setIdentity: (userId, username) => set({ userId, username }),
        setHasHydrated: (value) => set({ _hasHydrated: value }),
      },
    }),
    {
      name: 'codecity-user',
      storage: createJSONStorage(() => AsyncStorage),
      // On ne persiste que les données, jamais les actions (fonctions).
      partialize: (state) => ({
        userId: state.userId,
        username: state.username,
        xp: state.xp,
        level: state.level,
        placementLevel: state.placementLevel,
      }),
      onRehydrateStorage: () => (state) => {
        state?.actions.setHasHydrated(true);
      },
    }
  )
);
