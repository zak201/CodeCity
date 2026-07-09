import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LOGBubble } from '../../components/log/LOGBubble';
import type { ThemePalette } from '../../constants/palette';
import { useThemeColors } from '../../hooks/useThemeColors';
import {
  computePlacementLevel,
  getStartingDistrict,
  placementQuestions,
} from '../../data/placementTest';
import { districts } from '../../data/districts';
import { creditSkippedDistricts } from '../../lib/placementRewards';
import { useUserStore } from '../../store/userStore';
import type { Answer, DifficultyLevel } from '../../types/game';

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const INCORRECT_RED = '#FF6B6B';

// ---------------------------------------------------------------------------
// Répliques LOG pré-écrites
// ---------------------------------------------------------------------------

const LOG_PER_QUESTION: Record<string, string> = {
  'placement-q1': 'Voyons si tu sais raisonner par étapes.',
  'placement-q2': 'Les machines décident selon des règles. Et toi ?',
  'placement-q3': "Répéter une action, c'est la base de tout automate.",
  'placement-q4': 'Tu as déjà croisé du code ?',
  'placement-q5': 'Certains mots ont un sens précis pour une machine.',
  'placement-q6':
    'Lis attentivement. La machine ne pardonne pas les approximations.',
  'placement-q7': 'Intéressant. Tu vas plus loin que prévu.',
  'placement-q8': 'Dernière question. La plus abstraite.',
};

const LOG_CORRECT = 'Exactement. Tu penses comme une machine.';
const LOG_INCORRECT = 'Pas tout à fait. Retiens ça.';

const LOG_RESULT: Record<DifficultyLevel, string> = {
  'absolute-beginner': "Tu pars de zéro. C'est le meilleur point de départ.",
  beginner: "Tu as l'intuition. Il reste à structurer.",
  intermediate: 'Bases solides. CodeCity a besoin de toi.',
  advanced: "Impressionnant. Je ne t'attendais pas à ce niveau.",
};

// ---------------------------------------------------------------------------
// Types locaux
// ---------------------------------------------------------------------------

interface FeedbackState {
  selectedId: string;
  isCorrect: boolean;
}

type Phase = 'quiz' | 'result';

// ---------------------------------------------------------------------------
// Sous-composants (internes, même fichier)
// ---------------------------------------------------------------------------

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <View style={styles.progressWrapper}>
      <Text style={styles.progressLabel}>
        {current} / {total}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

interface AnswerGridProps {
  answers: Answer[];
  feedback: FeedbackState | null;
  disabled: boolean;
  onSelect: (answer: Answer) => void;
}

function AnswerGrid({ answers, feedback, disabled, onSelect }: AnswerGridProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  return (
    <View style={styles.grid}>
      {answers.map((answer) => {
        let borderColor: string = c.neonPurple;
        let textColor: string = c.textSecondary;

        if (feedback) {
          if (answer.isCorrect) {
            borderColor = c.neonGreen;
            textColor = c.neonGreen;
          } else if (
            answer.id === feedback.selectedId &&
            !feedback.isCorrect
          ) {
            borderColor = INCORRECT_RED;
            textColor = INCORRECT_RED;
          }
        }

        return (
          <Pressable
            key={answer.id}
            onPress={() => onSelect(answer)}
            disabled={disabled}
            accessibilityLabel={`Réponse : ${answer.label}`}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.answerBtn,
              { borderColor },
              pressed && !disabled && styles.answerPressed,
            ]}
          >
            <Text style={[styles.answerText, { color: textColor }]}>
              {answer.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface ResultScreenProps {
  level: DifficultyLevel;
  onStart: () => void;
}

function ResultScreen({ level, onStart }: ResultScreenProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const districtId = getStartingDistrict(level);
  const district = districts.find((d) => d.id === districtId);

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>Mission accomplie.</Text>

      <LOGBubble
        message={LOG_RESULT[level]}
        mood="neutral"
        style={styles.logBubbleWrap}
      />

      {district && (
        <View style={[styles.districtCard, { borderColor: district.color }]}>
          <Text style={styles.districtName}>{district.name}</Text>
          <Text style={styles.districtConcept}>{district.concept}</Text>
        </View>
      )}

      <Pressable
        onPress={onStart}
        accessibilityLabel="Commencer l'aventure"
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.startBtn,
          pressed && styles.startBtnPressed,
        ]}
      >
        <Text style={styles.startBtnText}>Commencer</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Écran principal
// ---------------------------------------------------------------------------

export default function PlacementTestScreen() {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();
  const setPlacementLevel = useUserStore((s) => s.actions.setPlacementLevel);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [logMessage, setLogMessage] = useState(
    LOG_PER_QUESTION[placementQuestions[0].id]
  );
  const [phase, setPhase] = useState<Phase>('quiz');
  const [computedLevel, setComputedLevel] = useState<DifficultyLevel>(
    'absolute-beginner'
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nombre effectif de questions (6 ou 8 selon les résultats du bloc 1-2)
  const allQuestions = placementQuestions;

  const advanceToNext = useCallback(
    (newScore: number, nextIdx: number) => {
      // Bloc 3 conditionnel : si Q1-Q6 pas toutes correctes → skip Q7-Q8
      const shouldSkipBloc3 = nextIdx === 6 && newScore < 6;
      const isFinished =
        shouldSkipBloc3 || nextIdx >= allQuestions.length;

      if (isFinished) {
        const total = shouldSkipBloc3 ? 6 : allQuestions.length;
        const level = computePlacementLevel(newScore, total);
        setComputedLevel(level);
        setPhase('result');
        return;
      }

      // Fade out → change question → fade in
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(nextIdx);
        setFeedback(null);
        setLogMessage(LOG_PER_QUESTION[allQuestions[nextIdx].id]);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [allQuestions, fadeAnim]
  );

  const handleSelect = useCallback(
    (answer: Answer) => {
      if (feedback) return;

      const isCorrect = answer.isCorrect;
      setFeedback({ selectedId: answer.id, isCorrect });
      setLogMessage(isCorrect ? LOG_CORRECT : LOG_INCORRECT);

      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore(newScore);

      if (isCorrect) {
        // Bonne réponse → avance automatiquement après 1 seconde
        autoAdvanceTimer.current = setTimeout(() => {
          advanceToNext(newScore, currentIndex + 1);
        }, 1000);
      }
      // Mauvaise réponse → le joueur appuie sur "Suivant"
    },
    [feedback, score, currentIndex, advanceToNext]
  );

  const handleNext = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    advanceToNext(score, currentIndex + 1);
  }, [score, currentIndex, advanceToNext]);

  const handleStart = useCallback(() => {
    setPlacementLevel(computedLevel);
    // Crédite les quartiers sautés (badges + étoiles + XP) puis emmène le
    // joueur directement dans son quartier de départ assigné.
    creditSkippedDistricts(computedLevel);
    const startDistrict = getStartingDistrict(computedLevel);
    router.replace(`/(game)/district/${startDistrict}`);
  }, [computedLevel, setPlacementLevel, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Phase résultat
  if (phase === 'result') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={handleBack}
            accessibilityLabel="Retour"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.backBtnPressed,
            ]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ResultScreen level={computedLevel} onStart={handleStart} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Phase quiz
  const question = allQuestions[currentIndex];
  const totalDisplay = allQuestions.length;
  const showNextButton = feedback !== null && !feedback.isCorrect;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          accessibilityLabel="Retour"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
        >
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar current={currentIndex + 1} total={totalDisplay} />

        <Animated.View style={{ opacity: fadeAnim }}>
          <LOGBubble
            message={logMessage}
            mood={
              logMessage === LOG_CORRECT
                ? 'positive'
                : logMessage === LOG_INCORRECT
                  ? 'negative'
                  : 'neutral'
            }
            style={styles.logBubbleWrap}
          />

          <Text style={styles.questionText}>{question.text}</Text>

          <AnswerGrid
            answers={question.answers}
            feedback={feedback}
            disabled={feedback !== null}
            onSelect={handleSelect}
          />

          {showNextButton && (
            <Pressable
              onPress={handleNext}
              accessibilityLabel="Question suivante"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && styles.nextBtnPressed,
              ]}
            >
              <Text style={styles.nextBtnText}>Suivant</Text>
            </Pressable>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.bg,
  },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  backBtnPressed: {
    opacity: 0.75,
  },
  backBtnText: {
    color: c.neonPurple,
    fontSize: 28,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Barre de progression
  progressWrapper: {
    marginBottom: 20,
  },
  progressLabel: {
    color: c.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: mono as string,
  },
  progressTrack: {
    height: 6,
    backgroundColor: c.trackOff,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  progressFill: {
    height: 6,
    backgroundColor: c.neonPurple,
    borderRadius: 3,
  },

  logBubbleWrap: {
    marginBottom: 24,
  },

  // Question
  questionText: {
    color: c.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 24,
    fontFamily: mono as string,
  },

  // Grille réponses 2×2
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerBtn: {
    width: '48%' as unknown as number,
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 48,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  answerPressed: {
    opacity: 0.85,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: mono as string,
  },

  // Bouton Suivant (mauvaise réponse)
  nextBtn: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: c.neonPurple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
  },
  nextBtnPressed: {
    opacity: 0.85,
  },
  nextBtnText: {
    color: c.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: mono as string,
  },

  // Écran résultat
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  resultTitle: {
    color: c.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: mono as string,
  },
  districtCard: {
    backgroundColor: c.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.trackOn,
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 36,
  },
  districtName: {
    color: c.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: mono as string,
  },
  districtConcept: {
    color: c.textSecondary,
    fontSize: 14,
    fontFamily: mono as string,
  },
  startBtn: {
    backgroundColor: c.neonGreen,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  startBtnPressed: {
    opacity: 0.85,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
