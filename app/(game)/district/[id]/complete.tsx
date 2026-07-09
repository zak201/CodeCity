import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LOGBubble } from '../../../../components/log/LOGBubble';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import type { ThemePalette } from '../../../../constants/palette';
import { districts } from '../../../../data/districts';
import {
  getNextDistrictId,
  isDistrictUnlocked,
  isGameComplete,
} from '../../../../data/progression';
import { useProgressStore } from '../../../../store/progressStore';
import { useUserStore } from '../../../../store/userStore';

function normalizeParam(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  return Array.isArray(p) ? p[0] : p;
}

export default function DistrictCompleteScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = normalizeParam(rawId);

  const placementLevel = useUserStore((s) => s.placementLevel);
  const xp = useUserStore((s) => s.xp);
  const playerLevel = useUserStore((s) => s.level);
  const byDistrict = useProgressStore((s) => s.byDistrict);
  const getDistrictStars = useProgressStore((s) => s.actions.getDistrictStars);

  const completedCountOf = (districtId: string) =>
    byDistrict[districtId]?.completedLevels.length ?? 0;

  const district = districts.find((d) => d.id === id);
  const stars = getDistrictStars(id);
  const maxStars = (district?.totalLevels ?? 0) * 3;

  const isBoss = id === 'boss';
  const gameComplete = isGameComplete(completedCountOf);

  const nextId = getNextDistrictId(id);
  const nextDistrict = nextId
    ? districts.find((d) => d.id === nextId)
    : undefined;
  const nextUnlocked =
    nextId !== null &&
    isDistrictUnlocked(nextId, placementLevel, completedCountOf);

  // Animation d'apparition de la médaille.
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeRotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(badgeScale, {
        toValue: 1.15,
        duration: 420,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.spring(badgeScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(badgeRotate, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [badgeScale, badgeRotate]);

  const spin = badgeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-25deg', '0deg'],
  });

  const title = gameComplete
    ? 'VILLE SAUVÉE'
    : isBoss
      ? 'TOUR DOMPTÉE'
      : 'QUARTIER RÉPARÉ';

  const logMessage = gameComplete
    ? 'Le bug a disparu. CodeCity revit grâce à toi, Code Architect. Tu sais désormais penser comme une machine — et mieux qu’elle.'
    : 'Le quartier respire à nouveau. Tu penses de plus en plus comme une machine.';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.body}>
        <Animated.View
          style={[
            styles.medal,
            gameComplete && styles.medalGold,
            { transform: [{ scale: badgeScale }, { rotate: spin }] },
          ]}
        >
          <Text style={styles.medalIcon}>{gameComplete ? '👑' : '🏅'}</Text>
        </Animated.View>

        <Text style={[styles.eyebrow, gameComplete && styles.eyebrowGold]}>
          {title}
        </Text>
        <Text style={styles.title}>{district?.name ?? 'Quartier'}</Text>

        <LOGBubble
          message={logMessage}
          mood="positive"
          animated
          style={styles.bubble}
        />

        {district ? (
          <View style={styles.badgeChip}>
            <Text style={styles.badgeChipText}>
              🏅 Badge débloqué — {district.concept}
            </Text>
          </View>
        ) : null}

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Étoiles</Text>
            <Text style={styles.statValue}>
              ⭐ {stars} / {maxStars}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Niveaux</Text>
            <Text style={styles.statValue}>
              {district?.totalLevels ?? 0} terminés
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP totale</Text>
            <Text style={[styles.statValue, { color: c.neonGreen }]}>
              {xp} XP
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Niveau joueur</Text>
            <Text style={styles.statValue}>Niv. {playerLevel}</Text>
          </View>
        </View>

        {nextDistrict && nextUnlocked ? (
          <Pressable
            onPress={() => router.replace(`/(game)/district/${nextDistrict.id}`)}
            accessibilityLabel={`Continuer vers ${nextDistrict.name}`}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>
              Débloqué : {nextDistrict.name} →
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => router.replace('/(game)/map')}
          accessibilityLabel="Retour à la carte"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.secondaryBtnText}>Retour à la carte</Text>
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
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  medal: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: c.bgCard,
    borderWidth: 2,
    borderColor: c.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  medalGold: {
    borderColor: c.neonAmber,
  },
  medalIcon: {
    fontSize: 40,
  },
  eyebrow: {
    color: c.neonGreen,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  eyebrowGold: {
    color: c.neonAmber,
  },
  title: {
    color: c.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },
  bubble: {
    marginBottom: 20,
  },
  badgeChip: {
    alignSelf: 'center',
    backgroundColor: c.bgCard,
    borderWidth: 1,
    borderColor: c.neonAmber,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 24,
  },
  badgeChipText: {
    color: c.neonAmber,
    fontSize: 13,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: c.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.trackOn,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statLabel: {
    color: c.textSecondary,
    fontSize: 15,
  },
  statValue: {
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: c.neonGreen,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.neonPurple,
  },
  secondaryBtnText: {
    color: c.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.88,
  },
});
