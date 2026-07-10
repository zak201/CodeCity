import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemeColors } from '../../hooks/useThemeColors';
import type { ThemePalette } from '../../constants/palette';
import type { Answer } from '../../types/game';

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const INCORRECT_RED = '#FF6B6B';

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

export function QCM({
  question,
  answers,
  explanation,
  hint,
  onCorrect,
  onComplete,
  onHintUsed,
}: QCMProps) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  const [phase, setPhase] = useState<Phase>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintConsumed, setHintConsumed] = useState(false);
  const [flashForId, setFlashForId] = useState<string | null>(null);

  const explainOpacity = useRef(new Animated.Value(0)).current;
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashOpacity = useRef(new Animated.Value(0)).current;

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

  const runSelectionFlash = useCallback(
    (answerId: string) => {
      setFlashForId(answerId);
      flashOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setFlashForId(null);
      });
    },
    [flashOpacity]
  );

  const handleAnswerPress = useCallback(
    (answer: Answer) => {
      if (phase !== 'idle') return;

      runSelectionFlash(answer.id);
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
    [phase, onCorrect, onComplete, showExplanation, runSelectionFlash]
  );

  const handleContinue = useCallback(() => {
    clearTimer();
    onComplete();
  }, [clearTimer, onComplete]);

  const handleRetry = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setSelectedId(null);
    explainOpacity.setValue(0);
  }, [clearTimer, explainOpacity]);

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
              pressed &&
                !hintConsumed &&
                !answersDisabled &&
                styles.hintBtnPressed,
            ]}
          >
            <Text style={styles.hintBtnText}>?</Text>
          </Pressable>
          {hintVisible ? <Text style={styles.hintText}>{hint}</Text> : null}
        </View>
      ) : null}

      <View style={styles.grid}>
        {answers.map((answer) => {
          let borderColor: string = c.trackOn;
          let textColor: string = c.textSecondary;
          let backgroundColor: string = 'transparent';

          if (phase === 'answered') {
            if (answer.isCorrect) {
              borderColor = c.neonGreen;
              textColor = c.neonGreen;
            }
            if (answer.id === selectedId && !answer.isCorrect) {
              borderColor = INCORRECT_RED;
              textColor = INCORRECT_RED;
            }
          }

          const showFlash = flashForId === answer.id;

          return (
            <View key={answer.id} style={styles.answerCell}>
              <Pressable
                onPress={() => handleAnswerPress(answer)}
                disabled={answersDisabled}
                accessibilityLabel={`Réponse : ${answer.label}`}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.answerBtn,
                  {
                    borderColor,
                    backgroundColor,
                  },
                  pressed && !answersDisabled && styles.answerPressed,
                ]}
              >
                {showFlash ? (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.flashOverlay,
                      {
                        opacity: flashOpacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0.55],
                        }),
                      },
                    ]}
                  />
                ) : null}
                <Text style={[styles.answerText, { color: textColor }]}>
                  {answer.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {phase === 'answered' ? (
        <Animated.View style={[styles.explainWrap, { opacity: explainOpacity }]}>
          <Text style={styles.explainText}>{explanation}</Text>
        </Animated.View>
      ) : null}

      {isWrong ? (
        <View style={styles.wrongActions}>
          <Pressable
            onPress={handleRetry}
            accessibilityLabel="Réessayer"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.continueBtn,
              styles.retryBtn,
              pressed && styles.continueBtnPressed,
            ]}
          >
            <Text style={styles.continueBtnText}>Réessayer</Text>
          </Pressable>
          <Pressable
            onPress={handleContinue}
            accessibilityLabel="Continuer"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.continueBtn,
              styles.continueBtnFlex,
              pressed && styles.continueBtnPressed,
            ]}
          >
            <Text style={styles.continueBtnText}>Continuer</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: c.bgCard,
    borderWidth: 1,
    borderColor: c.trackOn,
    borderRadius: 14,
    padding: 18,
  },
  question: {
    color: c.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 16,
    fontFamily: mono as string,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: c.trackOn,
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
    color: c.neonPurple,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: mono as string,
  },
  hintText: {
    flex: 1,
    minWidth: 120,
    color: c.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: mono as string,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerCell: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: '40%',
  },
  answerBtn: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: c.neonPurple,
  },
  answerPressed: {
    opacity: 0.92,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: mono as string,
  },
  explainWrap: {
    marginTop: 20,
  },
  explainText: {
    color: c.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: mono as string,
  },
  continueBtn: {
    marginTop: 20,
    minHeight: 48,
    backgroundColor: c.trackOn,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.neonPurple,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  continueBtnPressed: {
    opacity: 0.88,
  },
  continueBtnText: {
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: mono as string,
  },
  wrongActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  retryBtn: {
    flex: 1,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  continueBtnFlex: {
    flex: 1,
    marginTop: 0,
  },
});
