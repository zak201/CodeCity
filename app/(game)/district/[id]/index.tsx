import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LOGBubble } from '../../../../components/log/LOGBubble';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import type { ThemePalette } from '../../../../constants/palette';
import { districts } from '../../../../data/districts';
import { getLevelsForDistrict } from '../../../../data/levels/registry';
import { isDistrictUnlocked } from '../../../../data/progression';
import { useProgressStore } from '../../../../store/progressStore';
import { useUserStore } from '../../../../store/userStore';

function normalizeParam(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  return Array.isArray(p) ? p[0] : p;
}

export default function DistrictScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = normalizeParam(rawId);

  const placementLevel = useUserStore((s) => s.placementLevel);
  const byDistrict = useProgressStore((s) => s.byDistrict);

  const district = districts.find((d) => d.id === id);
  const levels = getLevelsForDistrict(id);
  const isEmpty = levels.length === 0;
  const unlocked = isDistrictUnlocked(
    id,
    placementLevel,
    (districtId) => byDistrict[districtId]?.completedLevels.length ?? 0
  );

  const districtProgress = byDistrict[id];
  const completedIds = districtProgress?.completedLevels ?? [];
  const starsById = districtProgress?.stars ?? {};

  // Verrouillage séquentiel : seul le premier niveau non terminé est jouable.
  const orderedLevels = useMemo(
    () => [...levels].sort((a, b) => a.order - b.order),
    [levels]
  );
  const firstIncompleteIndex = orderedLevels.findIndex(
    (l) => !completedIds.includes(l.id)
  );

  if (district && !unlocked) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Quartier verrouillé. Termine le quartier précédent pour y accéder.
          </Text>
          <Pressable
            onPress={() => router.push('/(game)/map')}
            accessibilityLabel="Retour à la carte"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Retour à la carte</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.push('/(game)/map')}
            accessibilityLabel="Retour à la carte"
            accessibilityRole="button"
            style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
          >
            <Text style={styles.backLabel}>‹ Carte</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>
          {district?.name ?? 'Quartier'}
        </Text>
        {district ? (
          <Text style={styles.subtitle}>{district.concept}</Text>
        ) : null}

        {district?.story ? (
          <LOGBubble
            message={district.story}
            mood="mysterious"
            animated
            style={styles.storyBubble}
          />
        ) : null}

        {isEmpty ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Bientôt disponible</Text>
            <Pressable
              onPress={() => router.push('/(game)/map')}
              accessibilityLabel="Retour à la carte"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.primaryPressed,
              ]}
            >
              <Text style={styles.primaryBtnText}>Retour à la carte</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {orderedLevels.map((level, i) => {
              const done = completedIds.includes(level.id);
              const isCurrent = i === firstIncompleteIndex;
              const locked = !done && !isCurrent;
              const stars = starsById[level.id] ?? 0;

              // Niveau verrouillé : non cliquable, cadenas affiché.
              if (locked) {
                return (
                  <View
                    key={level.id}
                    accessibilityLabel={`Niveau verrouillé : ${level.title}. Termine le niveau précédent pour le débloquer.`}
                    style={[styles.levelRow, styles.levelRowLocked]}
                  >
                    <Text style={styles.levelOrderLocked}>🔒</Text>
                    <View style={styles.levelBody}>
                      <Text style={[styles.levelTitle, styles.textDone]}>
                        {level.title}
                      </Text>
                      <Text style={[styles.levelHint, styles.textDone]} numberOfLines={1}>
                        Termine le niveau précédent pour débloquer
                      </Text>
                    </View>
                  </View>
                );
              }

              return (
                <Pressable
                  key={level.id}
                  onPress={() =>
                    router.push(`/(game)/district/${id}/level/${level.id}`)
                  }
                  accessibilityLabel={
                    done
                      ? `Niveau : ${level.title}, complété, ${stars} étoiles. Rejouable.`
                      : `Niveau à jouer : ${level.title}`
                  }
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.levelRow,
                    done && styles.levelRowDone,
                    isCurrent && styles.levelRowCurrent,
                    pressed && styles.levelRowPressed,
                  ]}
                >
                  <Text
                    style={[styles.levelOrder, done && styles.levelOrderDone]}
                  >
                    {done ? '✓' : level.order}
                  </Text>
                  <View style={styles.levelBody}>
                    <Text
                      style={[styles.levelTitle, done && styles.textDone]}
                    >
                      {level.title}
                    </Text>
                    <Text
                      style={[styles.levelHint, done && styles.textDone]}
                      numberOfLines={1}
                    >
                      {level.question}
                    </Text>
                  </View>
                  {done ? (
                    <Text style={styles.stars}>
                      {'★'.repeat(stars)}
                      <Text style={styles.starsEmpty}>
                        {'★'.repeat(Math.max(0, 3 - stars))}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.chev}>›</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: c.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerRow: {
    marginBottom: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backPressed: {
    opacity: 0.75,
  },
  backLabel: {
    color: c.neonPurple,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: c.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: c.textSecondary,
    fontSize: 15,
    marginBottom: 16,
  },
  storyBubble: {
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  levelRowPressed: {
    opacity: 0.92,
  },
  /** Niveau déjà réussi : grisé, mais toujours rejouable. */
  levelRowDone: {
    backgroundColor: c.bg,
    borderColor: c.trackOff,
  },
  /** Niveau courant (le prochain à jouer) : mis en évidence. */
  levelRowCurrent: {
    borderColor: c.neonPurple,
    borderWidth: 2,
  },
  /** Niveau verrouillé : atténué, non cliquable. */
  levelRowLocked: {
    backgroundColor: 'transparent',
    borderColor: c.trackOff,
    opacity: 0.55,
  },
  levelOrder: {
    color: c.neonPurple,
    fontSize: 18,
    fontWeight: '800',
    width: 28,
  },
  levelOrderDone: {
    color: c.neonGreen,
  },
  levelOrderLocked: {
    fontSize: 16,
    width: 28,
    textAlign: 'center',
  },
  textDone: {
    color: c.textMuted,
  },
  stars: {
    color: c.neonAmber,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  starsEmpty: {
    color: c.trackOff,
  },
  levelBody: {
    flex: 1,
    marginRight: 8,
  },
  levelTitle: {
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  levelHint: {
    color: c.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  chev: {
    color: c.textMuted,
    fontSize: 22,
    fontWeight: '300',
  },
  emptyCard: {
    backgroundColor: c.bgCard,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  emptyText: {
    color: c.textSecondary,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: c.neonPurple,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
