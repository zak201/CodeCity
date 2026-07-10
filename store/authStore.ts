import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Utilisateur authentifié (jamais le mot de passe). */
export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  role: string;
}

interface AuthState {
  /** Jeton JWT courant (null si déconnecté). */
  token: string | null;
  user: AuthUser | null;
  _hasHydrated: boolean;
}

interface AuthActions {
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

type AuthStore = AuthState & { actions: AuthActions };

/**
 * Session d'authentification (optionnelle). Le jeu reste jouable sans compte ;
 * se connecter sert à synchroniser la progression avec le backend.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      _hasHydrated: false,
      actions: {
        setAuth: (token, user) => set({ token, user }),
        logout: () => set({ token: null, user: null }),
        setHasHydrated: (value) => set({ _hasHydrated: value }),
      },
    }),
    {
      name: 'codecity-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => () => {
        useAuthStore.getState().actions.setHasHydrated(true);
      },
    }
  )
);
