import { useMemo } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LOGBubble } from '../../components/log/LOGBubble';
import type { ThemePalette } from '../../constants/palette';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useUserStore } from '../../store/userStore';

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/** Fines lignes horizontales type CRT / scanlines (opacité faible, non interactif). */
function ScanLineOverlay() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const indices = useMemo(() => {
    const h = Dimensions.get('window').height;
    const count = Math.min(240, Math.max(80, Math.ceil(h / 6) + 32));
    return Array.from({ length: count }, (_, i) => i);
  }, []);

  return (
    <View
      style={styles.scanlines}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {indices.map((i) => (
        <View key={i} style={styles.scanRow}>
          <View style={styles.scanHairline} />
        </View>
      ))}
    </View>
  );
}

export default function WelcomeScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const placementLevel = useUserStore((s) => s.placementLevel);

  const hasCompletedPlacement = placementLevel !== null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScanLineOverlay />
      <View style={styles.body}>
        <Text style={styles.brand} accessibilityRole="header">
          CODECITY
        </Text>

        <LOGBubble
          message="La ville de CodeCity a besoin d'un Code Architect. Es-tu prêt ?"
          mood="mysterious"
          animated
          style={styles.logBubbleWrap}
        />

        <Pressable
          onPress={() =>
            hasCompletedPlacement
              ? router.push('/(game)/map')
              : router.push('/(game)/placement-test')
          }
          accessibilityLabel={
            hasCompletedPlacement
              ? 'Reprendre l’aventure vers la carte'
              : 'Commencer le recrutement'
          }
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaText}>
            {hasCompletedPlacement ? 'Reprendre' : 'Commencer le recrutement'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: c.bg,
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanRow: {
    height: 7,
    justifyContent: 'flex-start',
  },
  /** Ligne ~1 px ; opacité ~2 % pour un effet CRT discret. */
  scanHairline: {
    height: 1,
    backgroundColor: c.textPrimary,
    opacity: 0.02,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    zIndex: 1,
  },
  brand: {
    color: c.neonPurple,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 36,
    fontFamily: mono as string,
  },
  logBubbleWrap: {
    marginBottom: 40,
  },
  cta: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: c.neonPurple,
    borderRadius: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaText: {
    color: c.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    fontFamily: mono as string,
  },
});
