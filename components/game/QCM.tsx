import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Answer } from '../../types/game';

export interface QCMProps {
  question: string;
  answers: Answer[];
  explanation: string;
  hint?: string;
  onCorrect: () => void;
  onComplete: () => void;
  /** Appelé quand l’utilisateur révèle l’indice (pour pénalité étoiles côté parent). */
  onHintUsed?: () => void;
}

type Phase = 'idle' | 'answered';

const COLORS = {
  bgCard: '#1E293B',
  text: '#F8FAFC',
  muted: '#94A3B8',
  correct: '#22C55E',
  incorrect: '#EF4444',
  hint: '#6366F1',
  border: '#334155',
};

export function QCM({
  question,
  answers,
  explanation,
  hint,
  onCorrect,
  onComplete,
  onHintUsed,
}: QCMProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintConsumed, setHintConsumed] = useState(false);

  const explainOpacity = useRef(new Animated.Value(0)).current;
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (completeTimerRef.current !== null) {
      clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const showExplanation = useCallback(() => {
    explainOpacity.setValue(0);
    Animated.timing(explainOpacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [explainOpacity]);

  const handleAnswerPress = useCallback(
    (answer: Answer) => {
      if (phase !== 'idle') return;

      setSelectedId(answer.id);
      setPhase('answered');
      showExplanation();

      if (answer.isCorrect) {
        onCorrect();
        completeTimerRef.current = setTimeout(() => {
          completeTimerRef.current = null;
          onComplete();
        }, 1200);
      }
    },
    [phase, onCorrect, onComplete, showExplanation]
  );

  const handleContinue = useCallback(() => {
    clearTimer();
    onComplete();
  }, [clearTimer, onComplete]);

  const handleHintPress = useCallback(() => {
    if (hintConsumed || phase !== 'idle' || !hint) return;
    setHintVisible(true);
    setHintConsumed(true);
    onHintUsed?.();
  }, [hint, hintConsumed, phase, onHintUsed]);

  const answersDisabled = phase !== 'idle';
  const isWrong =
    phase === 'answered' &&
    selectedId !== null &&
    !answers.find((a) => a.id === selectedId)?.isCorrect;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.question}>{question}</Text>

      {hint ? (
        <View style={styles.hintRow}>
          <Pressable
            onPress={handleHintPress}
            disabled={hintConsumed || answersDisabled}
            accessibilityLabel="Afficher un indice"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.hintBtn,
              (hintConsumed || answersDisabled) && styles.hintBtnDisabled,
              pressed && !hintConsumed && !answersDisabled && styles.hintBtnPressed,
            ]}
          >
            <Text style={styles.hintBtnText}>?</Text>
          </Pressable>
          {hintVisible && (
            <Text style={styles.hintText}>{hint}</Text>
          )}
        </View>
      ) : null}

      <View style={styles.grid}>
        {answers.map((answer) => {
          let boxStyle = styles.answerBtn;
          if (phase === 'answered') {
            if (answer.id === selectedId && !answer.isCorrect) {
              boxStyle = { ...styles.answerBtn, ...styles.answerWrong };
            }
            if (answer.isCorrect) {
              boxStyle = { ...styles.answerBtn, ...styles.answerRight };
            }
          }

          return (
            <Pressable
              key={answer.id}
              onPress={() => handleAnswerPress(answer)}
              disabled={answersDisabled}
              accessibilityLabel={`Réponse : ${answer.label}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                boxStyle,
                pressed && !answersDisabled && styles.answerPressed,
              ]}
            >
              <Text
                style={[
                  styles.answerText,
                  phase === 'answered' &&
                    (answer.isCorrect ||
                      (answer.id === selectedId && !answer.isCorrect)) &&
                    styles.answerTextOnColor,
                ]}
              >
                {answer.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {phase === 'answered' ? (
        <Animated.View style={[styles.explainWrap, { opacity: explainOpacity }]}>
          <Text style={styles.explainText}>{explanation}</Text>
        </Animated.View>
      ) : null}

      {isWrong && (
        <Pressable
          onPress={handleContinue}
          accessibilityLabel="Continuer"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.continueBtn,
            pressed && styles.continueBtnPressed,
          ]}
        >
          <Text style={styles.continueBtnText}>Continuer</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  question: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 16,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  hintBtn: {
    minWidth: 44,
    minHeight: 44,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.hint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBtnDisabled: {
    opacity: 0.45,
  },
  hintBtnPressed: {
    opacity: 0.85,
  },
  hintBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  hintText: {
    flex: 1,
    minWidth: 120,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerBtn: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: '40%',
    minHeight: 48,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerPressed: {
    opacity: 0.88,
  },
  answerRight: {
    backgroundColor: COLORS.correct,
    borderColor: COLORS.correct,
  },
  answerWrong: {
    backgroundColor: COLORS.incorrect,
    borderColor: COLORS.incorrect,
  },
  answerText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  answerTextOnColor: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  explainWrap: {
    marginTop: 20,
  },
  explainText: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  continueBtn: {
    marginTop: 20,
    minHeight: 48,
    backgroundColor: COLORS.hint,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  continueBtnPressed: {
    opacity: 0.88,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
