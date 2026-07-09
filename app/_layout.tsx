import { Text, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

/**
 * Police arrondie « Nunito » par défaut pour toute l'UI (lisible pour enfants
 * et adultes). Le code (blocs monospace) définit sa police explicitement dans
 * ses propres styles et n'est donc pas affecté.
 */
type Defaultable = { defaultProps?: { style?: unknown } };
const ROUNDED = { fontFamily: 'Nunito_600SemiBold' };
(Text as unknown as Defaultable).defaultProps = {
  ...(Text as unknown as Defaultable).defaultProps,
  style: ROUNDED,
};
(TextInput as unknown as Defaultable).defaultProps = {
  ...(TextInput as unknown as Defaultable).defaultProps,
  style: ROUNDED,
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // On attend le chargement des polices avant le premier rendu (le splash
  // reste affiché) pour éviter tout saut de police.
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
