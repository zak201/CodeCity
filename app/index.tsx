import { Redirect } from 'expo-router';

import { useUserStore } from '../store/userStore';

/**
 * Point d’entrée : évite router.replace au montage (erreur « navigate before mounting »).
 * Redirection déclarative vers la carte ou l’écran d’accueil selon le placement.
 */
export default function Index() {
  const placementLevel = useUserStore((s) => s.placementLevel);

  if (placementLevel !== null) {
    return <Redirect href="/(game)/map" />;
  }

  return <Redirect href="/(game)/welcome" />;
}
