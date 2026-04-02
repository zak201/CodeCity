import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { districts } from '../../../../data/districts';
import { getLevelsForDistrict } from '../../../../data/levels/q1-variables';

const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#6366F1',
};

function normalizeParam(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  return Array.isArray(p) ? p[0] : p;
}

export default function DistrictScreen() {
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = normalizeParam(rawId);

  const district = districts.find((d) => d.id === id);
  const levels = getLevelsForDistrict(id);
  const isEmpty = levels.length === 0;

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
            {levels.map((level) => (
              <Pressable
                key={level.id}
                onPress={() =>
                  router.push(`/(game)/district/${id}/level/${level.id}`)
                }
                accessibilityLabel={`Niveau : ${level.title}`}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.levelRow,
                  pressed && styles.levelRowPressed,
                ]}
              >
                <Text style={styles.levelOrder}>{level.order}</Text>
                <View style={styles.levelBody}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelHint} numberOfLines={1}>
                    {level.question}
                  </Text>
                </View>
                <Text style={styles.chev}>›</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  levelRowPressed: {
    opacity: 0.92,
  },
  levelOrder: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '800',
    width: 28,
  },
  levelBody: {
    flex: 1,
    marginRight: 8,
  },
  levelTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  levelHint: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  chev: {
    color: COLORS.muted,
    fontSize: 22,
    fontWeight: '300',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
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
