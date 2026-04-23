import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

import { COLORS } from '../../constants/colors';
import { districts } from '../../data/districts';
import { useProgressStore } from '../../store/progressStore';
import { useStreakStore } from '../../store/streakStore';
import { useUserStore } from '../../store/userStore';
import type { District } from '../../types/game';

/** Police monospace cohérente avec le reste de l’app. */
const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const VIEWBOX_W = 360;
const VIEWBOX_H = 520;

/** Positions des nœuds (indices = tableau districts). */
const NODE_POSITIONS: { x: number; y: number }[] = [
  { x: 56, y: 88 },
  { x: 200, y: 88 },
  { x: 304, y: 88 },
  { x: 304, y: 200 },
  { x: 200, y: 200 },
  { x: 56, y: 200 },
  { x: 56, y: 320 },
  { x: 200, y: 420 },
];

function buildOrthogonalSegments(
  from: { x: number; y: number },
  to: { x: number; y: number }
): { x: number; y: number }[][] {
  if (from.x === to.x || from.y === to.y) {
    return [[from, to]];
  }
  const mid1 = { x: to.x, y: from.y };
  return [
    [from, mid1],
    [mid1, to],
  ];
}

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

const DISTRICT_SHORT_LABEL: Record<string, string> = {
  q1: 'VAR',
  q2: 'IF',
  q3: 'FOR',
  q4: 'FN',
  q5: '[]',
  q6: 'TRI',
  q7: 'REC',
  boss: '⬡',
};

function isSegmentActive(destDistrict: District): boolean {
  return !destDistrict.isLocked;
}

type Point = { x: number; y: number };

function flattenSegmentsToPoints(
  segmentsList: Point[][]
): { points: Point[]; segmentLengths: number[]; totalLength: number } {
  const points: Point[] = [];
  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (const seg of segmentsList) {
    if (seg.length < 2) continue;
    for (let i = 0; i < seg.length - 1; i++) {
      const a = seg[i];
      const b = seg[i + 1];
      if (points.length === 0) points.push(a);
      const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
      segmentLengths.push(len);
      totalLength += len;
      points.push(b);
    }
  }

  return { points, segmentLengths, totalLength };
}

function pointAlongPolyline(
  t: number,
  points: Point[],
  segmentLengths: number[],
  totalLength: number
): Point {
  if (points.length === 0 || totalLength <= 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];
  let dist = t * totalLength;
  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i];
    if (dist <= segLen) {
      const a = points[i];
      const b = points[i + 1];
      const ratio = segLen > 0 ? dist / segLen : 0;
      return {
        x: a.x + (b.x - a.x) * ratio,
        y: a.y + (b.y - a.y) * ratio,
      };
    }
    dist -= segLen;
  }
  return points[points.length - 1];
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Anneau pulsant pour l’état « en cours » (native driver désactivé pour compatibilité SVG). */
function PulseHalo({
  cx,
  cy,
  r,
  color,
  active,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  active: boolean;
}) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    if (!active) {
      opacity.setValue(0);
      return;
    }
    opacity.setValue(0.45);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.95,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity]);

  if (!active) return null;

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={r + 9}
      fill="none"
      stroke={color}
      strokeWidth={2}
      opacity={opacity}
    />
  );
}

function HeaderBar({ xp, streak }: { xp: number; streak: number }) {
  return (
    <View style={styles.headerBar} pointerEvents="box-none">
      <Text style={styles.headerBrand} accessibilityRole="header">
        CODECITY
      </Text>
      <View style={styles.headerStats}>
        <Text style={styles.headerXp}>{xp} XP</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}

function RecruitmentBanner({ onGoTest }: { onGoTest: () => void }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
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

export default function CityMapScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const xp = useUserStore((s) => s.xp);
  const placementLevel = useUserStore((s) => s.placementLevel);
  const getCompletedCount = useProgressStore(
    (s) => s.actions.getCompletedCount
  );
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const recordPlay = useStreakStore((s) => s.actions.recordPlay);

  useEffect(() => {
    if (placementLevel !== null) {
      recordPlay();
    }
  }, [placementLevel, recordPlay]);

  const needsPlacement = placementLevel === null;

  const { lines, activeSegmentsForParticle } = useMemo(() => {
    const linesAcc: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      active: boolean;
    }[] = [];
    const particleSegs: Point[][] = [];

    for (let i = 0; i < NODE_POSITIONS.length - 1; i++) {
      const from = NODE_POSITIONS[i];
      const to = NODE_POSITIONS[i + 1];
      const dest = districts[i + 1];
      const active = isSegmentActive(dest);
      const ortho = buildOrthogonalSegments(from, to);
      for (const seg of ortho) {
        const [a, b] = seg;
        linesAcc.push({
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          active,
        });
      }
      if (active) {
        for (const seg of ortho) {
          particleSegs.push(seg);
        }
      } else {
        break;
      }
    }

    return { lines: linesAcc, activeSegmentsForParticle: particleSegs };
  }, []);

  const particlePath = useMemo(
    () => flattenSegmentsToPoints(activeSegmentsForParticle),
    [activeSegmentsForParticle]
  );

  const particleCx = useRef(new Animated.Value(0)).current;
  const particleCy = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const { points, segmentLengths, totalLength } = particlePath;
    if (totalLength <= 0 || points.length < 2) {
      return undefined;
    }
    const start = pointAlongPolyline(0, points, segmentLengths, totalLength);
    particleCx.setValue(start.x);
    particleCy.setValue(start.y);
    progress.setValue(0);

    const sub = progress.addListener(({ value }) => {
      const p = pointAlongPolyline(value, points, segmentLengths, totalLength);
      particleCx.setValue(p.x);
      particleCy.setValue(p.y);
    });

    const anim = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    anim.start();

    return () => {
      progress.removeListener(sub);
      progress.stopAnimation(() => {});
      anim.stop();
    };
  }, [particlePath, particleCx, particleCy, progress]);

  const selectedDistrict = selectedId
    ? districts.find((d) => d.id === selectedId)
    : null;
  const selectedCompleted = selectedId
    ? getCompletedCount(selectedId)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.root}>
        <HeaderBar xp={xp} streak={currentStreak} />

        {needsPlacement ? (
          <RecruitmentBanner
            onGoTest={() => router.push('/(game)/placement-test')}
          />
        ) : null}

        <View style={styles.mapArea}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {lines.map((ln, idx) => (
              <Line
                key={`ln-${idx}`}
                x1={ln.x1}
                y1={ln.y1}
                x2={ln.x2}
                y2={ln.y2}
                stroke={ln.active ? COLORS.trackOn : COLORS.trackOff}
                strokeWidth={ln.active ? 3 : 2}
                strokeLinecap="square"
              />
            ))}

            {districts.map((district, index) => {
              const pos = NODE_POSITIONS[index];
              if (!pos) return null;

              const completed = getCompletedCount(district.id);
              const status = getDistrictStatus(district, completed);
              const isLocked = status === 'locked';
              const shortLabel =
                DISTRICT_SHORT_LABEL[district.id] ?? district.id.toUpperCase();
              const isBoss = district.id === 'boss';

              let fill: string = COLORS.bgTrack;
              let stroke: string = COLORS.trackOn;
              let labelColor: string = COLORS.textSecondary;

              if (isBoss && !isLocked) {
                stroke = COLORS.neonAmber;
              }
              if (isLocked) {
                fill = COLORS.trackOff;
                stroke = COLORS.trackOff;
                labelColor = COLORS.textMuted;
              } else if (status === 'completed') {
                fill = COLORS.neonGreen;
                stroke = COLORS.neonGreen;
                labelColor = COLORS.bg;
              } else if (status === 'in-progress') {
                fill = COLORS.neonPurple;
                stroke = COLORS.neonPurple;
                labelColor = COLORS.textPrimary;
              } else {
                fill = COLORS.neonBlue;
                stroke = COLORS.neonBlue;
                labelColor = COLORS.textPrimary;
              }

              if (isBoss && isLocked) {
                stroke = COLORS.neonAmber;
              }

              const r = isBoss ? 24 : 22;
              const displayLabel = isLocked ? '🔒' : shortLabel;
              const fontSize = displayLabel === '🔒' ? 14 : 13;
              const groupOpacity = isLocked ? 0.3 : 1;

              return (
                <G
                  key={district.id}
                  opacity={groupOpacity}
                  onPress={
                    isLocked
                      ? undefined
                      : () => setSelectedId(district.id)
                  }
                  pointerEvents={isLocked ? 'none' : 'auto'}
                >
                  <PulseHalo
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    color={COLORS.neonPurple}
                    active={status === 'in-progress'}
                  />
                  <Circle
                    cx={pos.x}
                    cy={pos.y}
                    r={r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isBoss ? 3 : 2}
                  />
                  <SvgText
                    x={pos.x}
                    y={pos.y + 4}
                    fill={labelColor}
                    fontSize={fontSize}
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily={monoFamily}
                  >
                    {displayLabel}
                  </SvgText>
                </G>
              );
            })}

            {particlePath.totalLength > 0 ? (
              <AnimatedCircle
                cx={particleCx}
                cy={particleCy}
                r={5}
                fill={COLORS.neonAmber}
                opacity={0.95}
              />
            ) : null}
          </Svg>
        </View>

        {selectedDistrict && !selectedDistrict.isLocked ? (
          <View style={styles.bottomPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>{selectedDistrict.name}</Text>
              <Pressable
                onPress={() => setSelectedId(null)}
                accessibilityLabel="Fermer le panneau"
                accessibilityRole="button"
                hitSlop={12}
              >
                <Text style={styles.panelClose}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.panelConcept}>{selectedDistrict.concept}</Text>
            <View style={styles.panelTrack}>
              <View
                style={[
                  styles.panelFill,
                  {
                    width: `${Math.min(
                      100,
                      Math.round(
                        (selectedCompleted / selectedDistrict.totalLevels) *
                          100
                      )
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.panelMeta}>
              {selectedCompleted} / {selectedDistrict.totalLevels} niveaux
            </Text>
            <Pressable
              onPress={() =>
                router.push(`/(game)/district/${selectedDistrict.id}` as const)
              }
              accessibilityLabel="Jouer ce quartier"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.playBtn,
                pressed && styles.playBtnPressed,
              ]}
            >
              <Text style={styles.playBtnText}>Jouer</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 10,
    zIndex: 2,
  },
  headerBrand: {
    fontFamily: monoFamily as string,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.neonPurple,
    letterSpacing: 1.2,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerXp: {
    fontFamily: monoFamily as string,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.neonGreen,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.trackOn,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakNum: {
    fontFamily: monoFamily as string,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.neonAmber,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.trackOn,
    paddingHorizontal: 14,
    paddingVertical: 12,
    zIndex: 2,
  },
  bannerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  bannerBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neonPurple,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  bannerBtnPressed: {
    opacity: 0.88,
  },
  bannerBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: monoFamily as string,
  },
  mapArea: {
    flex: 1,
    minHeight: 200,
  },
  bottomPanel: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.trackOn,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  panelTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: monoFamily as string,
    marginRight: 8,
  },
  panelClose: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  panelConcept: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  panelTrack: {
    height: 6,
    backgroundColor: COLORS.trackOff,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 14,
  },
  panelFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neonGreen,
  },
  panelMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontFamily: monoFamily as string,
  },
  playBtn: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: COLORS.neonPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnPressed: {
    opacity: 0.88,
  },
  playBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: monoFamily as string,
  },
});
