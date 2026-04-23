import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

/** Couleurs de l’avatar LOG selon l’humeur du message. */
const MOOD_AVATAR_TEXT: Record<
  'neutral' | 'positive' | 'negative' | 'mysterious',
  string
> = {
  neutral: '#FFFFFF',
  positive: '#1D9E75',
  negative: '#E24B4A',
  mysterious: '#7F77DD',
};

export interface LOGBubbleProps {
  message: string;
  mood?: 'neutral' | 'positive' | 'negative' | 'mysterious';
  animated?: boolean;
  style?: ViewStyle;
}

/** Police monospace selon la plateforme (lisible et cohérente avec le brief). */
const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/** Petit triangle pointant vers l’avatar, même couleur que la bulle. */
function BubbleArrow() {
  return (
    <View style={arrowStyles.wrapper} accessible={false}>
      <View style={arrowStyles.triangle} />
    </View>
  );
}

const arrowStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: -1,
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#1a1a2e',
  },
});

/**
 * Bulle de dialogue de LOG : avatar + queue + texte (max 3 lignes).
 * Animation optionnelle au montage (Animated natif, compatible `useNativeDriver`).
 */
export function LOGBubble({
  message,
  mood = 'neutral',
  animated = false,
  style,
}: LOGBubbleProps) {
  const opacity = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(animated ? 8 : 0)).current;

  const avatarTextColor = MOOD_AVATAR_TEXT[mood];

  useEffect(() => {
    if (!animated) return;
    opacity.setValue(0);
    translateY.setValue(8);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animated, opacity, translateY]);

  const inner = (
    <View style={styles.row}>
      <View style={styles.avatar} accessibilityLabel="Avatar de LOG">
        <Text
          style={[styles.avatarText, { color: avatarTextColor }]}
          numberOfLines={1}
        >
          LOG
        </Text>
      </View>

      <View style={styles.bubbleRow}>
        <BubbleArrow />
        <View style={styles.bubble}>
          <Text
            style={styles.messageText}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );

  if (!animated) {
    return <View style={style}>{inner}</View>;
  }

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {inner}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  /** Fond sombre pour contraster avec les lettres colorées selon l’humeur. */
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#12121f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: monoFamily,
  },
  bubbleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    minWidth: 0,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: monoFamily,
  },
});
