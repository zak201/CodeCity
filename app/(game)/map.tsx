import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { districts } from '../../data/districts';
import { useUserStore } from '../../store/userStore';
import { useProgressStore } from '../../store/progressStore';
import { useStreakStore } from '../../store/streakStore';
import type { District } from '../../types/game';

// ---------------------------------------------------------------------------
// Couleurs
// ---------------------------------------------------------------------------

const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#6366F1',
  streak: '#F59E0B',
  xp: '#22C55E',
  banner: '#422006',
  bannerBorder: '#CA8A04',
};

// ---------------------------------------------------------------------------
// Icônes textuelles (remplaçables par SVG / Lottie plus tard)
// ---------------------------------------------------------------------------

const DISTRICT_ICONS: Record<string, string> = {
  variables: '{}',
  conditions: '?!',
  loops: '↻',
  functions: 'fn',
  lists: '[]',
  sort: '⇅',
  recursion: '∞',
  tower: '⚑',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DistrictStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed';

function getDistrictStatus(
  district: District,
  completedCount: number
): DistrictStatus {
  if (district.isLocked) return 'locked';
  if (completedCount >= district.totalLevels) return 'completed';
  if (completedCount > 0) return 'in-progress';
  return 'unlocked';
}

const STATUS_LABELS: Record<DistrictStatus, string> = {
  locked: 'Verrouillé',
  unlocked: 'Débloqué',
  'in-progress': 'En cours',
  completed: 'Complété',
};

const STATUS_COLORS: Record<DistrictStatus, string> = {
  locked: '#475569',
  unlocked: COLORS.accent,
  'in-progress': COLORS.streak,
  completed: COLORS.xp,
};

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

interface HeaderProps {
  xp: number;
  level: number;
  streak: number;
}

function Header({ xp, level, streak }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerLevel}>Niv. {level}</Text>
        <Text style={styles.headerXp}>{xp} XP</Text>
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={styles.streakText}>{streak}</Text>
      </View>
    </View>
  );
}

interface RecruitmentBannerProps {
  onGoTest: () => void;
}

/** Visible tant que le test de placement n’est pas terminé (pas de redirection forcée). */
function RecruitmentBanner({ onGoTest }: RecruitmentBannerProps) {
  return (
    <View
      style={styles.banner}
      accessibilityRole="alert"
      importantForAccessibility="yes"
    >
      <Text style={styles.bannerText}>
        Complète le test de recrutement pour débloquer la ville
      </Text>
      <Pressable
        onPress={onGoTest}
        accessibilityLabel="Aller au test de recrutement"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.bannerBtn,
          pressed && styles.bannerBtnPressed,
        ]}
      >
        <Text style={styles.bannerBtnText}>Passer le test</Text>
      </Pressable>
    </View>
  );
}

interface DistrictCardProps {
  district: District;
  completedCount: number;
  onPress: () => void;
}

function DistrictCard({ district, completedCount, onPress }: DistrictCardProps) {
  const status = getDistrictStatus(district, completedCount);
  const isLocked = status === 'locked';
  const pct =
    district.totalLevels > 0
      ? Math.round((completedCount / district.totalLevels) * 100)
      : 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLocked}
      accessibilityLabel={`Quartier ${district.name}, ${STATUS_LABELS[status]}, ${pct}% complété`}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.districtCard,
        { borderColor: district.color, opacity: isLocked ? 0.4 : 1 },
        pressed && !isLocked && styles.districtCardPressed,
      ]}
    >
      <View style={styles.districtRow}>
        <View style={[styles.districtIcon, { backgroundColor: district.color }]}>
          <Text style={styles.districtIconText}>
            {DISTRICT_ICONS[district.icon] ?? '?'}
          </Text>
        </View>

        <View style={styles.districtInfo}>
          <Text style={styles.districtName}>{district.name}</Text>
          <Text style={styles.districtConcept}>{district.concept}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[status] },
          ]}
        >
          <Text style={styles.statusText}>{STATUS_LABELS[status]}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${pct}%`,
              backgroundColor: district.color,
            },
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>
        {completedCount} / {district.totalLevels} niveaux
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Écran principal (carte)
// ---------------------------------------------------------------------------

export default function CityMapScreen() {
  const router = useRouter();

  const xp = useUserStore((s) => s.xp);
  const level = useUserStore((s) => s.level);
  const placementLevel = useUserStore((s) => s.placementLevel);

  const currentStreak = useStreakStore((s) => s.currentStreak);
  const recordPlay = useStreakStore((s) => s.actions.recordPlay);

  const getCompletedCount = useProgressStore(
    (s) => s.actions.getCompletedCount
  );

  useEffect(() => {
    if (placementLevel !== null) {
      recordPlay();
    }
  }, [placementLevel, recordPlay]);

  const needsPlacement = placementLevel === null;

  return (
    <SafeAreaView style={styles.container}>
      <Header xp={xp} level={level} streak={currentStreak} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {needsPlacement ? (
          <RecruitmentBanner
            onGoTest={() => router.push('/(game)/placement-test')}
          />
        ) : null}

        <Text style={styles.title}>CodeCity</Text>
        <Text style={styles.subtitle}>Choisis ton quartier</Text>

        {districts.map((district) => (
          <DistrictCard
            key={district.id}
            district={district}
            completedCount={getCompletedCount(district.id)}
            onPress={() =>
              router.push(`/(game)/district/${district.id}` as const)
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  banner: {
    backgroundColor: COLORS.banner,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.bannerBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  bannerText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  bannerBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  bannerBtnPressed: {
    opacity: 0.88,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerLevel: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  headerXp: {
    color: COLORS.xp,
    fontSize: 14,
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#292524',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    color: COLORS.streak,
    fontSize: 15,
    fontWeight: '700',
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Titres
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  // District card
  districtCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  districtCardPressed: {
    opacity: 0.85,
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  districtIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  districtIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  districtInfo: {
    flex: 1,
  },
  districtName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  districtConcept: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2,
  },

  // Status badge
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Progress
  progressTrack: {
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressLabel: {
    color: COLORS.muted,
    fontSize: 12,
  },
});
