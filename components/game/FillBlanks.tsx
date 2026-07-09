import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const INCORRECT_RED = '#FF6B6B';

export interface FillBlanksProps {
  template: string;
  tokens: string[];
  solution: string[];
  question: string;
  explanation: string;
  hint?: string;
  onCorrect: () => void;
  onComplete: () => void;
  onHintUsed?: () => void;
}

type Phase = 'idle' | 'correct' | 'wrong';

export function FillBlanks({
  template,
  tokens,
  solution,
  question,
  explanation,
  hint,
  onCorrect,
  onComplete,
  onHintUsed,
}: FillBlanksProps) {
  const segments = useMemo(() => template.split('___'), [template]);
  const blankCount = Math.max(0, segments.length - 1);

  const [slots, setSlots] = useState<(number | null)[]>(() =>
    Array(blankCount).fill(null)
  );
  const [phase, setPhase] = useState<Phase>('idle');
  const [hintVisible, setHintVisible] = useState(false);
  const [hintConsumed, setHintConsumed] = useState(false);

  const explainOpacity = useRef(new Animated.Value(0)).current;
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    },
    []
  );

  const usedTokens = useMemo(
    () => new Set(slots.filter((s): s is number => s !== null)),
    [slots]
  );
  const allFilled = slots.every((s) => s !== null);

  const revealExplanation = useCallback(() => {
    explainOpacity.setValue(0);
    Animated.timing(explainOpacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [explainOpacity]);

  const handleToken = useCallback(
    (ti: number) => {
      if (phase !== 'idle' || usedTokens.has(ti)) return;
      setSlots((prev) => {
        const firstEmpty = prev.findIndex((s) => s === null);
        if (firstEmpty === -1) return prev;
        const next = [...prev];
        next[firstEmpty] = ti;
        return next;
      });
    },
    [phase, usedTokens]
  );

  const handleSlot = useCallback(
    (k: number) => {
      if (phase !== 'idle') return;
      setSlots((prev) => {
        if (prev[k] === null) return prev;
        const next = [...prev];
        next[k] = null;
        return next;
      });
    },
    [phase]
  );

  const handleValidate = useCallback(() => {
    if (!allFilled || phase !== 'idle') return;
    const correct = slots.every(
      (s, k) => s !== null && tokens[s] === solution[k]
    );
    revealExplanation();
    if (correct) {
      setPhase('correct');
      onCorrect();
      completeTimerRef.current = setTimeout(() => {
        completeTimerRef.current = null;
        onComplete();
      }, 1400);
    } else {
      setPhase('wrong');
    }
  }, [
    allFilled,
    phase,
    slots,
    tokens,
    solution,
    onCorrect,
    onComplete,
    revealExplanation,
  ]);

  const handleRetry = useCallback(() => {
    setSlots(Array(blankCount).fill(null));
    setPhase('idle');
    explainOpacity.setValue(0);
  }, [blankCount, explainOpacity]);

  const handleHint = useCallback(() => {
    if (hintConsumed || phase !== 'idle' || !hint) return;
    setHintVisible(true);
    setHintConsumed(true);
    onHintUsed?.();
  }, [hint, hintConsumed, phase, onHintUsed]);

  const blankBorder =
    phase === 'correct'
      ? COLORS.neonGreen
      : phase === 'wrong'
        ? INCORRECT_RED
        : COLORS.neonPurple;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.question}>{question}</Text>

      {hint ? (
        <View style={styles.hintRow}>
          <Pressable
            onPress={handleHint}
            disabled={hintConsumed || phase !== 'idle'}
            accessibilityLabel="Afficher un indice"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.hintBtn,
              (hintConsumed || phase !== 'idle') && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.hintBtnText}>?</Text>
          </Pressable>
          {hintVisible ? <Text style={styles.hintText}>{hint}</Text> : null}
        </View>
      ) : null}

      {/* Gabarit de code avec trous à compléter. */}
      <View style={styles.codeFlow}>
        {segments.map((seg, i) => (
          <View key={`seg-${i}`} style={styles.inlineRow}>
            {seg.length > 0 ? <Text style={styles.codeText}>{seg}</Text> : null}
            {i < blankCount ? (
              <Pressable
                onPress={() => handleSlot(i)}
                disabled={phase !== 'idle'}
                accessibilityLabel={
                  slots[i] !== null
                    ? `Trou ${i + 1} rempli avec ${tokens[slots[i] as number]}. Toucher pour vider.`
                    : `Trou ${i + 1} vide`
                }
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.blank,
                  { borderColor: blankBorder },
                  pressed && phase === 'idle' && styles.pressed,
                ]}
              >
                <Text style={styles.blankText}>
                  {slots[i] !== null ? tokens[slots[i] as number] : '___'}
                </Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>

      {/* Jetons disponibles. */}
      <View style={styles.tokenPool}>
        {tokens.map((tok, ti) => {
          const used = usedTokens.has(ti);
          return (
            <Pressable
              key={`tok-${ti}`}
              onPress={() => handleToken(ti)}
              disabled={used || phase !== 'idle'}
              accessibilityLabel={`Jeton : ${tok}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.token,
                used && styles.tokenUsed,
                pressed && !used && phase === 'idle' && styles.pressed,
              ]}
            >
              <Text style={[styles.tokenText, used && styles.tokenTextUsed]}>
                {tok}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {phase !== 'idle' ? (
        <Animated.View style={[styles.explainWrap, { opacity: explainOpacity }]}>
          <Text
            style={[
              styles.explainText,
              phase === 'wrong' && { color: INCORRECT_RED },
            ]}
          >
            {phase === 'wrong' ? 'Pas encore. ' : ''}
            {explanation}
          </Text>
        </Animated.View>
      ) : null}

      {phase === 'idle' ? (
        <Pressable
          onPress={handleValidate}
          disabled={!allFilled}
          accessibilityLabel="Valider le code"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.actionBtn,
            !allFilled && styles.disabled,
            pressed && allFilled && styles.pressed,
          ]}
        >
          <Text style={styles.actionBtnText}>Valider</Text>
        </Pressable>
      ) : null}

      {phase === 'wrong' ? (
        <View style={styles.wrongActions}>
          <Pressable
            onPress={handleRetry}
            accessibilityLabel="Réessayer"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.actionBtn,
              styles.retryBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.actionBtnText}>Réessayer</Text>
          </Pressable>
          <Pressable
            onPress={onComplete}
            accessibilityLabel="Continuer"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.actionBtn,
              styles.continueBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.actionBtnText}>Continuer</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.trackOn,
    borderRadius: 14,
    padding: 18,
  },
  question: {
    color: COLORS.textPrimary,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.trackOn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBtnText: {
    color: COLORS.neonPurple,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: mono as string,
  },
  hintText: {
    flex: 1,
    minWidth: 120,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: mono as string,
  },
  codeFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#05050f',
    borderWidth: 1,
    borderColor: COLORS.trackOn,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    color: COLORS.neonGreen,
    fontSize: 14,
    lineHeight: 26,
    fontFamily: mono as string,
  },
  blank: {
    minWidth: 44,
    minHeight: 32,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: mono as string,
  },
  tokenPool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  token: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.neonPurple,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenUsed: {
    borderColor: COLORS.trackOff,
    backgroundColor: COLORS.trackOff,
  },
  tokenText: {
    color: COLORS.neonPurple,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: mono as string,
  },
  tokenTextUsed: {
    color: COLORS.textMuted,
  },
  explainWrap: {
    marginBottom: 16,
  },
  explainText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: mono as string,
  },
  actionBtn: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.neonPurple,
  },
  actionBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: mono as string,
  },
  retryBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.neonPurple,
  },
  continueBtn: {
    flex: 1,
    backgroundColor: COLORS.trackOn,
  },
  wrongActions: {
    flexDirection: 'row',
    gap: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
});
