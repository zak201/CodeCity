import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemeMode } from '../constants/palette';

interface ThemeStoreState {
  /** 'night' par défaut : le mode nuit reproduit le rendu historique. */
  mode: ThemeMode;
}

interface ThemeStoreActions {
  setMode: (mode: ThemeMode) => void;
  /** Bascule simple nuit <-> jour (pour le bouton dans l'en-tête). */
  toggle: () => void;
}

type ThemeStore = ThemeStoreState & { actions: ThemeStoreActions };

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'night',
      actions: {
        setMode: (mode) => set({ mode }),
        toggle: () => set({ mode: get().mode === 'day' ? 'night' : 'day' }),
      },
    }),
    {
      name: 'codecity-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
