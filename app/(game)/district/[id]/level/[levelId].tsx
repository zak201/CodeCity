import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { QCM } from '../../../../../components/game/QCM';
import { districts } from '../../../../../data/districts';
import {
  getQ1Level,
  getQ1LevelIdsInOrder,
} from '../../../../../data/levels/q1-variables';
import { useProgressStore } from '../../../../../store/progressStore';
import { useUserStore } from '../../../../../store/userStore';

const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#6366F1',
  logBg: '#334155',
};

function normalizeParam(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  return Array.isArray(p) ? p[0] : p;
}

interface LOGBubbleProps {
  text: string;
}

/** Bulle LOG : même idée visuelle que le test de placement (unité pédagogique). */
function LOGBubble({ text }: LOGBubbleProps) {
  return (
    <View style={styles.logRow}>
      <View style={styles.logAvatar}>
        <Text style={styles.logAvatarText}>LOG</Text>
      </View>
      <View style={styles.logBubble}>
        <Text style={styles.logText}>{text}</Text>
      </View>
    </View>
  );
}

export default function LevelScreen() {
  const router = useRouter();
  const { id: rawDistrictId, levelId: rawLevelId } = useLocalSearchParams<{
    id: string;
    levelId: string;
  }>();

  const districtId = normalizeParam(rawDistrictId);
  const levelId = normalizeParam(rawLevelId);

  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    setHintUsed(false);
  }, [levelId]);

  const completeLevel = useProgressStore((s) => s.actions.completeLevel);
  const addXP = useUserStore((s) => s.actions.addXP);

  const level =
    districtId === 'q1' ? getQ1Level(levelId) : undefined;

  const district = districts.find((d) => d.id === districtId);
  const invalidDistrict = districtId !== 'q1';
  const notFound = !level;

  const goNextOrDistrict = useCallback(() => {
    if (!level) return;
    const ordered = getQ1LevelIdsInOrder();
    const idx = ordered.indexOf(level.id);
    const nextId = idx >= 0 ? ordered[idx + 1] : undefined;
    if (nextId) {
      router.replace(`/(game)/district/${districtId}/level/${nextId}`);
    } else {
      router.replace(`/(game)/district/${districtId}`);
    }
  }, [districtId, level, router]);

  const handleCorrect = useCallback(() => {
    if (!level) return;
    const stars = (hintUsed ? 2 : 3) as 1 | 2 | 3;
    completeLevel(districtId, level.id, stars);
    addXP(level.xpReward);
  }, [addXP, completeLevel, districtId, hintUsed, level]);

  const handleHintUsed = useCallback(() => {
    setHintUsed(true);
  }, []);

  if (invalidDistrict || notFound) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Niveau introuvable</Text>
          <Text style={styles.errorBody}>
            Ce contenu n’existe pas encore ou l’URL est incorrecte.
          </Text>
          <Pressable
            onPress={() =>
              router.replace(`/(game)/district/${districtId || 'q1'}`)
            }
            accessibilityLabel="Retour au quartier"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>Retour au quartier</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.replace(`/(game)/district/${districtId}`)}
            accessibilityLabel="Retour au quartier"
            accessibilityRole="button"
            style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
          >
            <Text style={styles.backLabel}>‹ Quartier</Text>
          </Pressable>
        </View>

        <Text style={styles.screenTitle}>{level.title}</Text>
        {district ? (
          <Text style={styles.districtMeta}>{district.name}</Text>
        ) : null}

        {level.story ? <LOGBubble text={level.story} /> : null}

        {level.mechanic === 'qcm' && level.answers ? (
          <View style={styles.qcmCard}>
            <QCM
              key={level.id}
              question={level.question}
              answers={level.answers}
              explanation={level.explanation}
              hint={level.hint}
              onCorrect={handleCorrect}
              onComplete={goNextOrDistrict}
              onHintUsed={handleHintUsed}
            />
          </View>
        ) : (
          <Text style={styles.fallback}>
            Mécanique non prise en charge pour ce niveau.
          </Text>
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
    paddingBottom: 40,
  },
  topBar: {
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
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  districtMeta: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 20,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingVertical: 12,
  },
  logText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
  qcmCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fallback: {
    color: COLORS.muted,
    fontSize: 15,
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorBody: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
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
