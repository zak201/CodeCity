import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import type { ThemePalette } from '../../constants/palette';
import { districts } from '../../data/districts';
import { computeLockState, getEarnedBadges } from '../../data/progression';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ensureUser, syncStreak } from '../../lib/sync';
import { useProgressStore } from '../../store/progressStore';
import { useStreakStore } from '../../store/streakStore';
import { useThemeStore } from '../../store/themeStore';
import { useUserStore } from '../../store/userStore';
import type { District } from '../../types/game';

/** Encre sombre pour un label posé sur un néon plein (lisible en jour ET nuit). */
const ON_NEON = '#0B0A1E';

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
  completedCount: number,
  locked: boolean
): DistrictStatus {
  if (locked) return 'locked';
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

function HeaderBar({
  xp,
  streak,
  badges,
  onOpenProfile,
}: {
  xp: number;
  streak: number;
  badges: number;
  onOpenProfile: () => void;
}) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.actions.toggle);
  return (
    <View style={styles.headerBar} pointerEvents="box-none">
      <Text style={styles.headerBrand} accessibilityRole="header">
        CODECITY
      </Text>
      <View style={styles.headerStats}>
        <Pressable
          onPress={onOpenProfile}
          accessibilityLabel="Voir mon profil et mes badges"
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [styles.profileBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </Pressable>
        <Text style={styles.headerXp}>{xp} XP</Text>
        {badges > 0 ? (
          <View style={styles.badgePill} accessibilityLabel={`${badges} badges`}>
            <Text style={styles.streakIcon}>🏅</Text>
            <Text style={styles.badgeNum}>{badges}</Text>
          </View>
        ) : null}
        <View style={styles.streakPill}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNum}>{streak}</Text>
        </View>
        <Pressable
          onPress={toggleTheme}
          accessibilityLabel="Basculer le thème jour ou nuit"
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [styles.themeBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.themeIcon}>{mode === 'day' ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RecruitmentBanner({ onGoTest }: { onGoTest: () => void }) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
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

  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  const xp = useUserStore((s) => s.xp);
  const placementLevel = useUserStore((s) => s.placementLevel);
  const byDistrict = useProgressStore((s) => s.byDistrict);
  const currentStreak = useStreakStore((s) => s.currentStreak);
  const recordPlay = useStreakStore((s) => s.actions.recordPlay);

  const completedCountOf = useCallback(
    (districtId: string) =>
      byDistrict[districtId]?.completedLevels.length ?? 0,
    [byDistrict]
  );

  const lockState = useMemo(
    () => computeLockState(placementLevel, completedCountOf),
    [placementLevel, completedCountOf]
  );

  const earnedBadges = useMemo(
    () => getEarnedBadges(completedCountOf),
    [completedCountOf]
  );

  useEffect(() => {
    if (placementLevel === null) return;
    recordPlay();
    // Synchronisation best-effort : crée le compte serveur si besoin, puis
    // pousse le streak. N'interrompt jamais le jeu en cas d'échec réseau.
    void (async () => {
      await ensureUser();
      void syncStreak();
    })();
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
      const active = lockState[dest.id] === false;
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
  }, [lockState]);

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
  const selectedCompleted = selectedId ? completedCountOf(selectedId) : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.root}>
        <HeaderBar
          xp={xp}
          streak={currentStreak}
          badges={earnedBadges.length}
          onOpenProfile={() => router.push('/(game)/profile')}
        />

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
                stroke={ln.active ? c.trackOn : c.trackOff}
                strokeWidth={ln.active ? 3 : 2}
                strokeLinecap="square"
              />
            ))}

            {districts.map((district, index) => {
              const pos = NODE_POSITIONS[index];
              if (!pos) return null;

              const completed = completedCountOf(district.id);
              const status = getDistrictStatus(
                district,
                completed,
                lockState[district.id] !== false
              );
              const isLocked = status === 'locked';
              const shortLabel =
                DISTRICT_SHORT_LABEL[district.id] ?? district.id.toUpperCase();
              const isBoss = district.id === 'boss';

              let fill: string = c.bgTrack;
              let stroke: string = c.trackOn;
              let labelColor: string = c.textSecondary;

              if (isBoss && !isLocked) {
                stroke = c.neonAmber;
              }
              if (isLocked) {
                fill = c.trackOff;
                stroke = c.trackOff;
                labelColor = c.textMuted;
              } else if (status === 'completed') {
                fill = c.neonGreen;
                stroke = c.neonGreen;
                labelColor = ON_NEON;
              } else if (status === 'in-progress') {
                fill = c.neonPurple;
                stroke = c.neonPurple;
                labelColor = c.textPrimary;
              } else {
                fill = c.neonBlue;
                stroke = c.neonBlue;
                labelColor = c.textPrimary;
              }

              if (isBoss && isLocked) {
                stroke = c.neonAmber;
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
                    color={c.neonPurple}
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
                fill={c.neonAmber}
                opacity={0.95}
              />
            ) : null}
          </Svg>
        </View>

        {selectedDistrict && lockState[selectedDistrict.id] === false ? (
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

const makeStyles = (c: ThemePalette) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: c.bg,
  },
  root: {
    flex: 1,
    backgroundColor: c.bg,
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
    color: c.neonPurple,
    letterSpacing: 1.2,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: 10,
  },
  headerXp: {
    fontFamily: monoFamily as string,
    fontSize: 14,
    fontWeight: '700',
    color: c.neonGreen,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: c.bgCard,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: c.bgCard,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: c.neonAmber,
  },
  badgeNum: {
    fontFamily: monoFamily as string,
    fontSize: 14,
    fontWeight: '800',
    color: c.neonGreen,
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.bgCard,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  themeIcon: {
    fontSize: 15,
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.bgCard,
    borderWidth: 1,
    borderColor: c.trackOn,
  },
  profileIcon: {
    fontSize: 15,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakNum: {
    fontFamily: monoFamily as string,
    fontSize: 14,
    fontWeight: '800',
    color: c.neonAmber,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: c.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.trackOn,
    paddingHorizontal: 14,
    paddingVertical: 12,
    zIndex: 2,
  },
  bannerText: {
    color: c.textSecondary,
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
    backgroundColor: c.neonPurple,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  bannerBtnPressed: {
    opacity: 0.88,
  },
  bannerBtnText: {
    color: c.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: monoFamily as string,
  },
  mapArea: {
    flex: 1,
    minHeight: 200,
  },
  bottomPanel: {
    backgroundColor: c.bgCard,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: c.trackOn,
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
    color: c.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: monoFamily as string,
    marginRight: 8,
  },
  panelClose: {
    color: c.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  panelConcept: {
    color: c.textSecondary,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  panelTrack: {
    height: 6,
    backgroundColor: c.trackOff,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 14,
  },
  panelFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: c.neonGreen,
  },
  panelMeta: {
    color: c.textMuted,
    fontSize: 12,
    marginTop: 6,
    fontFamily: monoFamily as string,
  },
  playBtn: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: c.neonPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnPressed: {
    opacity: 0.88,
  },
  playBtnText: {
    color: c.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: monoFamily as string,
  },
});
