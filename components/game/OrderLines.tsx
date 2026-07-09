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

export interface OrderLinesProps {
  lines: string[];
  question: string;
  explanation: string;
  hint?: string;
  onCorrect: () => void;
  onComplete: () => void;
  onHintUsed?: () => void;
}

type Phase = 'idle' | 'correct' | 'wrong';

/** Scramble déterministe (pas de hasard) : trie les index par une clé stable. */
function scrambleIndices(lines: string[]): number[] {
  const keyOf = (s: string) =>
    s.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const idx = lines.map((_, i) => i);
  idx.sort((a, b) => keyOf(lines[a]) - keyOf(lines[b]) || a - b);
  // Garantit un ordre différent de l'original quand c'est possible.
  const isIdentity = idx.every((v, i) => v === i);
  if (isIdentity && idx.length > 1) idx.reverse();
  return idx;
}

export function OrderLines({
  lines,
  question,
  explanation,
  hint,
  onCorrect,
  onComplete,
  onHintUsed,
}: OrderLinesProps) {
  const scrambled = useMemo(() => scrambleIndices(lines), [lines]);

  const [placed, setPlaced] = useState<number[]>([]);
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

  const remaining = scrambled.filter((i) => !placed.includes(i));
  const allPlaced = placed.length === lines.length;

  const revealExplanation = useCallback(() => {
    explainOpacity.setValue(0);
    Animated.timing(explainOpacity, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [explainOpacity]);

  const handlePick = useCallback(
    (i: number) => {
      if (phase !== 'idle') return;
      setPlaced((prev) => [...prev, i]);
    },
    [phase]
  );

  const handleUnplace = useCallback(
    (i: number) => {
      if (phase !== 'idle') return;
      setPlaced((prev) => prev.filter((x) => x !== i));
    },
    [phase]
  );

  const handleValidate = useCallback(() => {
    if (!allPlaced || phase !== 'idle') return;
    const correct = placed.every((idx, k) => lines[idx] === lines[k]);
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
  }, [allPlaced, phase, placed, lines, onCorrect, onComplete, revealExplanation]);

  const handleRetry = useCallback(() => {
    setPlaced([]);
    setPhase('idle');
    explainOpacity.setValue(0);
  }, [explainOpacity]);

  const handleHint = useCallback(() => {
    if (hintConsumed || phase !== 'idle' || !hint) return;
    setHintVisible(true);
    setHintConsumed(true);
    onHintUsed?.();
  }, [hint, hintConsumed, phase, onHintUsed]);

  const slotBorder =
    phase === 'correct'
      ? COLORS.neonGreen
      : phase === 'wrong'
        ? INCORRECT_RED
        : COLORS.trackOn;

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

      {/* Zone solution : lignes placées, dans l'ordre. */}
      <Text style={styles.zoneLabel}>Ton programme</Text>
      <View style={[styles.solution, { borderColor: slotBorder }]}>
        {placed.length === 0 ? (
          <Text style={styles.placeholder}>
            Touche les lignes ci-dessous pour les ranger ici.
          </Text>
        ) : (
          placed.map((i, position) => (
            <Pressable
              key={`placed-${i}`}
              onPress={() => handleUnplace(i)}
              disabled={phase !== 'idle'}
              accessibilityLabel={`Ligne ${position + 1} : ${lines[i]}. Toucher pour retirer.`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.lineRow,
                styles.placedRow,
                pressed && phase === 'idle' && styles.pressed,
              ]}
            >
              <Text style={styles.lineNum}>{position + 1}</Text>
              <Text style={styles.lineCode}>{lines[i]}</Text>
            </Pressable>
          ))
        )}
      </View>

      {/* Réserve : lignes encore à placer. */}
      {remaining.length > 0 ? (
        <View style={styles.pool}>
          {remaining.map((i) => (
            <Pressable
              key={`pool-${i}`}
              onPress={() => handlePick(i)}
              disabled={phase !== 'idle'}
              accessibilityLabel={`Ajouter la ligne : ${lines[i]}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.lineRow,
                styles.poolRow,
                pressed && phase === 'idle' && styles.pressed,
              ]}
            >
              <Text style={styles.poolPlus}>+</Text>
              <Text style={styles.lineCode}>{lines[i]}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {phase !== 'idle' ? (
        <Animated.View style={[styles.explainWrap, { opacity: explainOpacity }]}>
          <Text
            style={[
              styles.explainText,
              phase === 'wrong' && { color: INCORRECT_RED },
            ]}
          >
            {phase === 'wrong' ? "Ce n'est pas le bon ordre. " : ''}
            {explanation}
          </Text>
        </Animated.View>
      ) : null}

      {phase === 'idle' ? (
        <Pressable
          onPress={handleValidate}
          disabled={!allPlaced}
          accessibilityLabel="Valider l'ordre"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.actionBtn,
            !allPlaced && styles.disabled,
            pressed && allPlaced && styles.pressed,
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
  zoneLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: mono as string,
  },
  solution: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: 8,
    gap: 8,
    marginBottom: 16,
  },
  placeholder: {
    color: COLORS.textMuted,
    fontSize: 13,
    padding: 8,
    fontFamily: mono as string,
  },
  pool: {
    gap: 8,
    marginBottom: 16,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    minHeight: 44,
  },
  placedRow: {
    backgroundColor: '#05050f',
    borderWidth: 1,
    borderColor: COLORS.trackOn,
  },
  poolRow: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.neonPurple,
  },
  lineNum: {
    color: COLORS.neonAmber,
    fontSize: 13,
    fontWeight: '800',
    width: 18,
    textAlign: 'center',
    fontFamily: mono as string,
  },
  poolPlus: {
    color: COLORS.neonPurple,
    fontSize: 18,
    fontWeight: '800',
    width: 18,
    textAlign: 'center',
    fontFamily: mono as string,
  },
  lineCode: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: mono as string,
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
