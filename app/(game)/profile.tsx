import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import type { ThemePalette } from '../../constants/palette';
import { conceptColor } from '../../constants/theme';
import { districts } from '../../data/districts';
import {
  getEarnedBadges,
  isDistrictCompleted,
  xpToNextLevel,
} from '../../data/progression';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import { useStreakStore } from '../../store/streakStore';
import { useUserStore } from '../../store/userStore';
import type { DifficultyLevel } from '../../types/game';

const PLACEMENT_LABEL: Record<DifficultyLevel, string> = {
  'absolute-beginner': 'Recrue',
  beginner: 'Initié·e',
  intermediate: 'Confirmé·e',
  advanced: 'Avancé·e',
};

export default function ProfileScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();

  const username = useUserStore((s) => s.username);
  const xp = useUserStore((s) => s.xp);
  const level = useUserStore((s) => s.level);
  const placementLevel = useUserStore((s) => s.placementLevel);
  const byDistrict = useProgressStore((s) => s.byDistrict);
  const getDistrictStars = useProgressStore((s) => s.actions.getDistrictStars);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const longestStreak = useStreakStore((s) => s.longestStreak);
  const authUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.actions.logout);

  const completedCountOf = (id: string) =>
    byDistrict[id]?.completedLevels.length ?? 0;

  const badges = getEarnedBadges(completedCountOf);
  const totalStars = districts.reduce(
    (sum, d) => sum + getDistrictStars(d.id),
    0
  );
  const levelsDone = districts.reduce(
    (sum, d) => sum + completedCountOf(d.id),
    0
  );

  const remaining = xpToNextLevel(xp);
  const withinLevel = 100 - remaining; // 0..100
  const rank = placementLevel ? PLACEMENT_LABEL[placementLevel] : 'Recrue';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          onPress={() => router.push('/(game)/map')}
          accessibilityLabel="Retour à la carte"
          accessibilityRole="button"
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backLabel}>‹ Carte</Text>
        </Pressable>

        <Text style={styles.title}>Profil</Text>

        {/* Identité + progression XP */}
        <View style={styles.card}>
          <View style={styles.identityRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(username ?? 'CA').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.identityBody}>
              <Text style={styles.name} numberOfLines={1}>
                {username ?? 'Code Architect'}
              </Text>
              <Text style={styles.rank}>
                Niv. {level} · {rank}
              </Text>
            </View>
          </View>

          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${withinLevel}%` }]} />
          </View>
          <Text style={styles.xpMeta}>
            {xp} XP · encore {remaining} avant le niveau {level + 1}
          </Text>
        </View>

        {/* Compte : connexion optionnelle (synchro de la progression) */}
        <View style={styles.card}>
          {token && authUser ? (
            <>
              <Text style={styles.accountLabel}>Connecté</Text>
              <Text style={styles.accountValue} numberOfLines={1}>
                {authUser.email ?? authUser.username}
                {authUser.role === 'admin' ? '  ·  admin' : ''}
              </Text>
              <Pressable
                onPress={logout}
                accessibilityLabel="Se déconnecter"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.accountBtn,
                  styles.logoutBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.accountLabel}>Compte</Text>
              <Text style={styles.accountHint}>
                Connecte-toi pour sauvegarder ta progression et la retrouver sur
                un autre appareil.
              </Text>
              <Pressable
                onPress={() => router.push('/(game)/auth')}
                accessibilityLabel="Se connecter ou créer un compte"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.accountBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.accountBtnText}>
                  Se connecter / Créer un compte
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Stats rapides */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statBig}>🏅 {badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statBig}>⭐ {totalStars}</Text>
            <Text style={styles.statLabel}>Étoiles</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statBig}>✓ {levelsDone}</Text>
            <Text style={styles.statLabel}>Niveaux</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statBig}>🔥 {currentStreak}</Text>
            <Text style={styles.statLabel}>Série (max {longestStreak})</Text>
          </View>
        </View>

        {/* Collection de badges */}
        <Text style={styles.sectionTitle}>
          Badges — {badges.length} / {districts.length}
        </Text>

        <View style={styles.badgeList}>
          {districts.map((d) => {
            const done = completedCountOf(d.id);
            const earned = isDistrictCompleted(d.id, done);
            const stars = getDistrictStars(d.id);
            const maxStars = d.totalLevels * 3;
            const accent = conceptColor[d.id] ?? c.neonPurple;

            return (
              <View
                key={d.id}
                accessibilityLabel={
                  earned
                    ? `Badge obtenu : ${d.name}, ${stars} étoiles sur ${maxStars}`
                    : `Badge à débloquer : ${d.name}, ${done} sur ${d.totalLevels} niveaux`
                }
                style={[
                  styles.badgeCard,
                  earned
                    ? { borderColor: accent }
                    : styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeMedal,
                    earned
                      ? { borderColor: accent }
                      : { borderColor: c.trackOff },
                  ]}
                >
                  <Text style={styles.badgeMedalIcon}>
                    {earned ? '🏅' : '🔒'}
                  </Text>
                </View>
                <View style={styles.badgeBody}>
                  <Text
                    style={[styles.badgeName, !earned && styles.textMuted]}
                    numberOfLines={1}
                  >
                    {d.name}
                  </Text>
                  <Text
                    style={[styles.badgeConcept, !earned && styles.textMuted]}
                    numberOfLines={1}
                  >
                    {d.concept}
                  </Text>
                </View>
                {earned ? (
                  <Text style={[styles.badgeStars, { color: c.neonAmber }]}>
                    ⭐ {stars}/{maxStars}
                  </Text>
                ) : (
                  <Text style={styles.badgeProgress}>
                    {done}/{d.totalLevels}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    scroll: { paddingHorizontal: 20, paddingBottom: 40 },
    backBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12 },
    backLabel: { color: c.neonPurple, fontSize: 16, fontWeight: '600' },
    pressed: { opacity: 0.75 },
    title: {
      color: c.textPrimary,
      fontSize: 26,
      fontWeight: '800',
      marginBottom: 16,
    },
    card: {
      backgroundColor: c.bgCard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.trackOn,
      padding: 18,
      marginBottom: 16,
    },
    identityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: c.neonPurple,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    avatarText: { color: '#0B0A1E', fontSize: 20, fontWeight: '800' },
    identityBody: { flex: 1 },
    name: { color: c.textPrimary, fontSize: 20, fontWeight: '800' },
    rank: { color: c.textSecondary, fontSize: 14, marginTop: 2 },
    xpTrack: {
      height: 12,
      borderRadius: 999,
      backgroundColor: c.bgTrack,
      borderWidth: 1,
      borderColor: c.trackOn,
      overflow: 'hidden',
    },
    xpFill: { height: '100%', backgroundColor: c.neonGreen, borderRadius: 999 },
    xpMeta: { color: c.textMuted, fontSize: 13, marginTop: 8 },
    statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    statPill: {
      flexGrow: 1,
      flexBasis: '45%',
      backgroundColor: c.bgCard,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.trackOn,
      paddingVertical: 12,
      paddingHorizontal: 14,
      alignItems: 'center',
    },
    statBig: { color: c.textPrimary, fontSize: 18, fontWeight: '800' },
    statLabel: { color: c.textMuted, fontSize: 12, marginTop: 4 },
    sectionTitle: {
      color: c.textPrimary,
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 12,
    },
    badgeList: { gap: 10 },
    badgeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.bgCard,
      borderRadius: 14,
      borderWidth: 1,
      padding: 12,
    },
    badgeCardLocked: { borderColor: c.trackOff, opacity: 0.7 },
    badgeMedal: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    badgeMedalIcon: { fontSize: 20 },
    badgeBody: { flex: 1, marginRight: 8 },
    badgeName: { color: c.textPrimary, fontSize: 15, fontWeight: '700' },
    badgeConcept: { color: c.textSecondary, fontSize: 13, marginTop: 2 },
    textMuted: { color: c.textMuted },
    badgeStars: { fontSize: 14, fontWeight: '800' },
    badgeProgress: {
      color: c.textMuted,
      fontSize: 13,
      fontWeight: '700',
    },
    accountLabel: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    accountValue: {
      color: c.textPrimary,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 14,
    },
    accountHint: {
      color: c.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 14,
    },
    accountBtn: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: c.neonPurple,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    accountBtnText: { color: '#0B0A1E', fontSize: 15, fontWeight: '800' },
    logoutBtn: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.trackOn,
    },
    logoutText: { color: c.textSecondary, fontSize: 15, fontWeight: '700' },
  });
