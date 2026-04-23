import { Stack } from 'expo-router';

/**
 * Stack du groupe jeu : accueil, carte, placement, quartiers (fichiers imbriqués).
 */
export default function GameLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="map" />
      <Stack.Screen name="placement-test" />
    </Stack>
  );
}
