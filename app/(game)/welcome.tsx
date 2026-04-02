import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useUserStore } from '../../store/userStore';

const COLORS = {
  bg: '#0F172A',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#6366F1',
  logBg: '#334155',
};

function LOGBubble() {
  return (
    <View style={styles.logRow}>
      <View style={styles.logAvatar}>
        <Text style={styles.logAvatarText}>LOG</Text>
      </View>
      <View style={styles.logBubble}>
        <Text style={styles.logText}>
          La ville de CodeCity a besoin d&apos;un Code Architect. Es-tu prêt
          ?
        </Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const placementLevel = useUserStore((s) => s.placementLevel);

  const hasCompletedPlacement = placementLevel !== null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Text style={styles.brand} accessibilityRole="header">
          CodeCity
        </Text>

        <LOGBubble />

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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    color: COLORS.text,
    fontSize: 44,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: 36,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  logAvatar: {
    width: 44,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logAvatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logBubble: {
    flex: 1,
    backgroundColor: COLORS.logBg,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  cta: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 20,
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
