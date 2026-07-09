import { Redirect } from 'expo-router';

import { useUserStore } from '../store/userStore';

/**
 * Point d'entrée. On attend la fin de l'hydratation (AsyncStorage) avant de
 * rediriger, sinon `placementLevel` vaut null une fraction de seconde et
 * renverrait à tort vers l'accueil. Redirection déclarative (pas de
 * router.replace au montage → évite « navigate before mounting »).
 */
export default function Index() {
  const hasHydrated = useUserStore((s) => s._hasHydrated);
  const placementLevel = useUserStore((s) => s.placementLevel);

  // Persistance pas encore rechargée : on laisse le splash affiché.
  if (!hasHydrated) {
    return null;
  }

  if (placementLevel !== null) {
    return <Redirect href="/(game)/map" />;
  }

  return <Redirect href="/(game)/welcome" />;
}
