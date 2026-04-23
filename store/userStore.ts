import { create } from 'zustand';
import type { DifficultyLevel } from '../types/game';

interface UserStoreState {
  xp: number;
  level: number;
  placementLevel: DifficultyLevel | null;
}

interface UserStoreActions {
  addXP: (amount: number) => void;
  setPlacementLevel: (level: DifficultyLevel) => void;
}

type UserStore = UserStoreState & { actions: UserStoreActions };

export const useUserStore = create<UserStore>((set) => ({
  xp: 0,
  level: 1,
  placementLevel: null,
  actions: {
    addXP: (amount) =>
      set((state) => ({ xp: state.xp + amount })),
    setPlacementLevel: (placementLevel) =>
      set({ placementLevel }),
  },
}));
