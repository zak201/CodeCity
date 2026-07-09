import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { FillBlanks } from '../../../../../components/game/FillBlanks';
import { OrderLines } from '../../../../../components/game/OrderLines';
import { Prediction } from '../../../../../components/game/Prediction';
import { QCM } from '../../../../../components/game/QCM';
import { LOGBubble } from '../../../../../components/log/LOGBubble';
import { LOGModal } from '../../../../../components/log/LOGModal';
import { COLORS } from '../../../../../constants/colors';
import { districts } from '../../../../../data/districts';
import { getChapterTitle } from '../../../../../data/levels/chapterTitles';
import {
  getLevelForDistrict,
  getLevelIdsInOrderForDistrict,
  isDistrictWithLevels,
} from '../../../../../data/levels/registry';
import {
  isDistrictCompleted,
  isDistrictUnlocked,
} from '../../../../../data/progression';
import { syncProgress, syncUser } from '../../../../../lib/sync';
import { useProgressStore } from '../../../../../store/progressStore';
import { useUserStore } from '../../../../../store/userStore';

function normalizeParam(p: string | string[] | undefined): string {
  if (p === undefined) return '';
  return Array.isArray(p) ? p[0] : p;
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
  const [logModalVisible, setLogModalVisible] = useState(false);

  useEffect(() => {
    setHintUsed(false);
  }, [levelId]);

  const completeLevel = useProgressStore((s) => s.actions.completeLevel);
  const byDistrict = useProgressStore((s) => s.byDistrict);
  const addXP = useUserStore((s) => s.actions.addXP);
  const placementLevel = useUserStore((s) => s.placementLevel);

  const level = getLevelForDistrict(districtId, levelId);

  const district = districts.find((d) => d.id === districtId);
  const invalidDistrict = !isDistrictWithLevels(districtId);
  const notFound = !level;
  const districtUnlocked = isDistrictUnlocked(
    districtId,
    placementLevel,
    (id) => byDistrict[id]?.completedLevels.length ?? 0
  );

  const goNextOrDistrict = useCallback(() => {
    if (!level) return;
    const ordered = getLevelIdsInOrderForDistrict(districtId);
    const idx = ordered.indexOf(level.id);
    const nextId = idx >= 0 ? ordered[idx + 1] : undefined;
    if (nextId) {
      router.replace(`/(game)/district/${districtId}/level/${nextId}`);
      return;
    }
    // Dernier niveau : écran de fin si le quartier est complété.
    const completedCount =
      useProgressStore.getState().byDistrict[districtId]?.completedLevels
        .length ?? 0;
    if (isDistrictCompleted(districtId, completedCount)) {
      router.replace(`/(game)/district/${districtId}/complete`);
    } else {
      router.replace(`/(game)/district/${districtId}`);
    }
  }, [districtId, level, router]);

  const handleCorrect = useCallback(() => {
    if (!level) return;
    const stars = (hintUsed ? 2 : 3) as 1 | 2 | 3;
    completeLevel(districtId, level.id, stars);
    addXP(level.xpReward);
    // Synchronisation best-effort avec le backend.
    void syncProgress(districtId, level.id, stars);
    void syncUser();
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

  if (!districtUnlocked) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Quartier verrouillé</Text>
          <Text style={styles.errorBody}>
            Termine le quartier précédent pour débloquer ce contenu.
          </Text>
          <Pressable
            onPress={() => router.replace('/(game)/map')}
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
      <LOGModal
        visible={logModalVisible}
        concept={district?.concept ?? 'ce sujet'}
        onClose={() => setLogModalVisible(false)}
      />
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
          <Pressable
            onPress={() => setLogModalVisible(true)}
            accessibilityLabel="Ouvrir Demande à LOG"
            accessibilityRole="button"
            style={({ pressed }) => [styles.helpBtn, pressed && styles.helpPressed]}
          >
            <Text style={styles.helpLabel}>?</Text>
          </Pressable>
        </View>

        <Text style={styles.screenTitle}>{level.title}</Text>
        <Text style={styles.chapterLine}>
          Chapitre {level.chapter} —{' '}
          {getChapterTitle(districtId, level.chapter)}
        </Text>
        {district ? (
          <Text style={styles.districtMeta}>{district.name}</Text>
        ) : null}

        {level.story ? (
          <LOGBubble
            message={level.story}
            mood="neutral"
            animated
            style={styles.logBubbleWrap}
          />
        ) : null}

        <View style={styles.qcmWrap}>
          {level.mechanic === 'qcm' && level.answers ? (
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
          ) : level.mechanic === 'prediction' && level.code && level.answers ? (
            <Prediction
              key={level.id}
              code={level.code}
              question={level.question}
              answers={level.answers}
              explanation={level.explanation}
              hint={level.hint}
              onCorrect={handleCorrect}
              onComplete={goNextOrDistrict}
              onHintUsed={handleHintUsed}
            />
          ) : level.mechanic === 'construction' && level.orderedLines ? (
            <OrderLines
              key={level.id}
              lines={level.orderedLines}
              question={level.question}
              explanation={level.explanation}
              hint={level.hint}
              onCorrect={handleCorrect}
              onComplete={goNextOrDistrict}
              onHintUsed={handleHintUsed}
            />
          ) : level.mechanic === 'drag-drop' &&
            level.fillTemplate &&
            level.fillTokens &&
            level.fillSolution ? (
            <FillBlanks
              key={level.id}
              template={level.fillTemplate}
              tokens={level.fillTokens}
              solution={level.fillSolution}
              question={level.question}
              explanation={level.explanation}
              hint={level.hint}
              onCorrect={handleCorrect}
              onComplete={goNextOrDistrict}
              onHintUsed={handleHintUsed}
            />
          ) : (
            <Text style={styles.fallback}>
              Mécanique non prise en charge pour ce niveau.
            </Text>
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backPressed: {
    opacity: 0.75,
  },
  backLabel: {
    color: COLORS.neonPurple,
    fontSize: 16,
    fontWeight: '600',
  },
  helpBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.trackOn,
  },
  helpPressed: {
    opacity: 0.85,
  },
  helpLabel: {
    color: COLORS.neonPurple,
    fontSize: 20,
    fontWeight: '800',
  },
  screenTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  chapterLine: {
    color: COLORS.neonPurple,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  districtMeta: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  logBubbleWrap: {
    marginBottom: 20,
  },
  qcmWrap: {
    marginTop: 0,
  },
  fallback: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorBody: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: COLORS.neonPurple,
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
